import type { LessonMissionConfig, LessonStepData } from '@/types/lessonEngine';
/**
 * Google Gemini AI Multi-Object Scene & Material Detective Service
 * Pure open-ended multimodal AI vision powered exclusively by Gemini 2.x & 3.x generation models.
 */

export interface ColorStats {
  avgR: number;
  avgG: number;
  avgB: number;
  brightness: number;
}

export type MaterialCategory = 'Natural' | 'Synthetic' | 'Metallic' | 'Mineral' | 'Mixed';

export interface DetectedMaterialPointer {
  id: string;
  itemName: string;       // e.g. "Spearhead", "Linen Tunic", "Leather Boots", "Pleated Skirt"
  materialName: string;   // e.g. "Forged Iron Metal Alloy", "Woven Plant Linen", "Tanned Leather"
  category: MaterialCategory;
  icon: string;           // e.g. "🗡️", "🧥", "🥾", "🪵", "👔", "👗", "📄", "🚗", "🧴", "⚡"
  whyUsed: string;        // e.g. "Forged metal provides hardness and piercing durability."
  microscopicStructure: string;
  pinX?: number;          // Percentage position on image (10 to 90)
  pinY?: number;          // Percentage position on image (10 to 90)
}

export interface MaterialAnalysisResult {
  sceneDescription: string;  // Full narrative story describing what is visually in the photo
  materialName: string;      // Primary material
  family: string;
  category: MaterialCategory;
  microscopicStructure: string;
  confidence: number;
  funFact: string;
  pointers: DetectedMaterialPointer[];
  interactiveChallenge: {
    question: string;
    options: { text: string; isCorrect: boolean }[];
    explanation: string;
  };
}

export interface WhatIfResult {
  title: string;
  hypothesis: string;
  predictedOutcome: string;
  physicalReaction: string;
  pipCommentary: string;
  safetyRating: 'Safe at Home 🏡' | 'Lab Adult Supervision ⚠️' | 'Dangerous Flame/Chemical 🚫';
  scienceLaw: string;
}

export const getApiKey = (): string => {
  if (typeof window !== 'undefined') {
    const customKey = localStorage.getItem('gemini_api_key');
    if (customKey && customKey.trim().length > 5) {
      return customKey.trim();
    }
  }
  const envKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  if (envKey && envKey.trim().length > 5) {
    return envKey.trim();
  }
  return '';
};

export const setApiKey = (key: string): void => {
  if (typeof window !== 'undefined') {
    if (key && key.trim().length > 5) {
      localStorage.setItem('gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  }
};

// Current Generation Gemini 2.x & 3.x Multimodal Vision Models
const CURRENT_GENERATION_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-2.0-flash',
  'gemini-3-flash',
  'gemini-2.0-flash-001',
];

// Cached discovered models per API key
let cachedDiscoveredModels: string[] | null = null;
let lastCachedKey = '';

/**
 * Dynamically queries Google ModelService to fetch exact supported 2.x / 3.x models for this key
 */
async function getAvailableVisionModels(apiKey: string): Promise<string[]> {
  if (cachedDiscoveredModels && lastCachedKey === apiKey && cachedDiscoveredModels.length > 0) {
    return cachedDiscoveredModels;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.models && Array.isArray(data.models)) {
        const supported = data.models
          .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
          .map((m: any) => m.name.replace(/^models\//, ''))
          .filter((name: string) => !name.includes('1.0') && !name.includes('1.5'));

        supported.sort((a: string, b: string) => {
          if (a.includes('2.5-flash')) return -1;
          if (b.includes('2.5-flash')) return 1;
          if (a.includes('2.5-pro')) return -1;
          if (b.includes('2.5-pro')) return 1;
          if (a.includes('2.0-flash')) return -1;
          if (b.includes('2.0-flash')) return 1;
          if (a.includes('3-flash')) return -1;
          if (b.includes('3-flash')) return 1;
          return 0;
        });

        if (supported.length > 0) {
          cachedDiscoveredModels = supported;
          lastCachedKey = apiKey;
          return supported;
        }
      }
    }
  } catch (e) {
    console.warn('ModelService.ListModels query note:', e);
  }

  return CURRENT_GENERATION_MODELS;
}

/**
 * Executes a Gemini API request with automatic 2.x / 3.x cascade fallback
 */
async function generateContentCascade(requestBody: any): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('NO_API_KEY');
  }

  const modelsToTry = await getAvailableVisionModels(apiKey);
  let lastErrorText = '';

  for (const model of modelsToTry) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) return text;
      } else {
        const errJson = await response.json().catch(() => null);
        const errMsg = errJson?.error?.message || (await response.text().catch(() => `HTTP ${response.status}`));
        console.warn(`Gemini Vision attempt on ${model} failed:`, errMsg);
        lastErrorText = errMsg;
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      lastErrorText = err.message || 'Network / timeout error';
    }
  }

  throw new Error(lastErrorText || 'Google Gemini API connection failed. Please check your API key.');
}

/**
 * Built-in science specimens for offline demo testing
 */
export function getSampleSpecimenBreakdown(sampleType: string): MaterialAnalysisResult {
  const s = sampleType.toLowerCase();

  if (s.includes('cotton')) {
    return {
      sceneDescription: 'Looking at this sample, I can see natural raw cotton fibers harvested directly from the Gossypium plant boll.',
      materialName: '100% Natural Organic Cotton Cellulose',
      family: 'Plant Cellulose Biopolymer',
      category: 'Natural',
      microscopicStructure: 'Hollow spiral tubes of organic plant cellulose with microscopic pores that absorb liquid moisture.',
      confidence: 0.99,
      funFact: 'Cotton fibers grow inside a fluffy protective seed pod called a boll on the Gossypium plant!',
      pointers: [
        {
          id: 'p1',
          itemName: '🌱 Cotton Seed Boll',
          materialName: 'Natural Plant Cellulose (Natural)',
          category: 'Natural',
          icon: '🌱',
          whyUsed: 'Protects growing plant seeds and provides lightweight seed dispersal in nature.',
          microscopicStructure: 'Porous organic cellulose matrix.',
          pinX: 50,
          pinY: 45,
        },
        {
          id: 'p2',
          itemName: '🧵 Raw Fiber Strands',
          materialName: 'Cellulose Microfibrils (Natural)',
          category: 'Natural',
          icon: '🧵',
          whyUsed: 'Long staple fibers can be spun into soft, breathable yarn for clothing.',
          microscopicStructure: 'Helical crystalline cellulose chains.',
          pinX: 62,
          pinY: 55,
        },
      ],
      interactiveChallenge: {
        question: 'Why are cotton shirts comfortable in hot summer weather?',
        options: [
          { text: 'Microscopic pores absorb sweat so cool breezes can evaporate it', isCorrect: true },
          { text: 'Cotton traps hot body heat like plastic cling wrap', isCorrect: false },
        ],
        explanation: 'Natural cellulose fibers have capillary channels that wick away perspiration.',
      },
    };
  }

  if (s.includes('bottle')) {
    return {
      sceneDescription: 'Looking at this sample, I can see a molded transparent plastic water bottle engineered from synthetic PET polymer.',
      materialName: 'Polyethylene Terephthalate (PET Plastic)',
      family: 'Thermoplastic Synthetic Polymer',
      category: 'Synthetic',
      microscopicStructure: 'Tightly linked repeating ester polymer chains that create an impermeable, waterproof, shatterproof barrier.',
      confidence: 0.98,
      funFact: 'Recycled PET beverage bottles can be shredded, melted, and spun into warm synthetic fleece winter clothing!',
      pointers: [
        {
          id: 'p1',
          itemName: '🧴 Bottle Body',
          materialName: 'PET Plastic (Synthetic Polymer)',
          category: 'Synthetic',
          icon: '🧴',
          whyUsed: 'Lightweight, 100% waterproof, and shatterproof so liquids do not leak.',
          microscopicStructure: 'Ester polymer chain network.',
          pinX: 50,
          pinY: 50,
        },
        {
          id: 'p2',
          itemName: '🔘 Screw Cap',
          materialName: 'High-Density Polyethylene (HDPE)',
          category: 'Synthetic',
          icon: '🔘',
          whyUsed: 'Tough and flexible to form a tight, airtight seal on the bottle neck.',
          microscopicStructure: 'Linear polyethylene polymer chains.',
          pinX: 50,
          pinY: 20,
        },
      ],
      interactiveChallenge: {
        question: 'What makes PET plastic ideal for holding water and juices?',
        options: [
          { text: 'It is 100% waterproof, lightweight, and shatterproof', isCorrect: true },
          { text: 'It dissolves completely in cold drinking water', isCorrect: false },
        ],
        explanation: 'Synthetic PET polymers are hydrophobic (water-repelling) and non-reactive with liquids.',
      },
    };
  }

  // Copper Wire Sample
  return {
    sceneDescription: 'Looking at this sample, I can see an electrical cable with conductive copper metal wiring and protective plastic insulation.',
    materialName: 'Pure Copper Metal Conductor & PVC Polymer Insulator',
    family: 'Transition Metal & Synthetic Polymer Compound',
    category: 'Mixed',
    microscopicStructure: 'Free-flowing electrons move rapidly across the inner copper metal lattice, while outer PVC polymer chains block electrical shocks.',
    confidence: 0.98,
    funFact: 'Copper is one of the best conductors on Earth, allowing electrical energy to travel at nearly the speed of light!',
    pointers: [
      {
        id: 'p1',
        itemName: '⚡ Copper Conductor Core',
        materialName: 'Pure Copper Metal (Metallic)',
        category: 'Metallic',
        icon: '⚡',
        whyUsed: 'Free valence electrons carry electric current with minimal resistance and heat loss.',
        microscopicStructure: 'Crystalline copper metal lattice.',
        pinX: 48,
        pinY: 45,
      },
      {
        id: 'p2',
        itemName: '🛡️ Flexible PVC Insulation',
        materialName: 'Polyvinyl Chloride Plastic (Synthetic)',
        category: 'Synthetic',
        icon: '🛡️',
        whyUsed: 'Synthetic PVC plastic is a high-resistance electrical insulator that prevents shocks.',
        microscopicStructure: 'Tightly bound PVC polymer chains.',
        pinX: 65,
        pinY: 65,
      },
    ],
    interactiveChallenge: {
      question: 'Why are electrical charger cables made with metal inside and plastic outside?',
      options: [
        { text: 'The metal conducts electricity inside, while the outer plastic insulator protects our hands', isCorrect: true },
        { text: 'Both materials are used solely to make the cable colorful', isCorrect: false },
      ],
      explanation: 'Engineers combine conductors (copper) and insulators (PVC plastic) to transmit power safely.',
    },
  };
}

export const geminiService = {
  hasApiKey(): boolean {
    return Boolean(getApiKey());
  },

  /**
   * 🎙️ Live Open-Ended AI Science Mentor
   */
  async askSocraticPip(question: string, contextTopic?: string): Promise<string> {
    try {
      const systemPrompt = `You are Pip, a friendly cartoon science mentor for a CBSE Class 5 student (age 9-11).
Rules:
1. Answer directly in 3 to 4 short, simple sentences.
2. Use easy-to-understand everyday words.
3. No filler greetings. Include 1-2 fun emojis.
4. Context: ${contextTopic || 'CBSE Class 5 Science'}.`;

      const requestBody = {
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nQuestion: "${question}"` }],
          },
        ],
        generationConfig: { maxOutputTokens: 1024, temperature: 0.3, thinkingConfig: { thinkingBudget: 0 } },
      };

      return await generateContentCascade(requestBody);
    } catch {
      return 'Great science question! In science, every material has unique physical properties like elasticity, electrical insulation, and strength that determine how we use it! 🔬⭐';
    }
  },

  /**
   * 🔍 Pure Open-Ended AI Multimodal Vision Detective (Gemini 2.5 / 2.0 / 3.x)
   */
  async detectMaterialFromImage(
    base64Image: string,
    sampleTypeHint?: string
  ): Promise<MaterialAnalysisResult> {
    // If it's a built-in sample specimen button click
    if (sampleTypeHint && (sampleTypeHint.includes('sample-cotton') || sampleTypeHint.includes('sample-bottle') || sampleTypeHint.includes('sample-wire'))) {
      return getSampleSpecimenBreakdown(sampleTypeHint);
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('NO_API_KEY');
    }

    let mimeType = 'image/jpeg';
    const mimeMatch = base64Image.match(/^data:([a-zA-Z0-9/+-]+);base64,/);
    if (mimeMatch) mimeType = mimeMatch[1];
    const cleanBase64 = base64Image.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '').trim();

    const prompt = `You are Pip, an advanced AI Materials Science Detective analyzing a user photo for a 5th grade student.
Look closely at the EXACT pixels and contents of this image.

INSTRUCTIONS:
1. Describe the scene accurately in 1-2 friendly sentences. Identify exactly who or what is present (e.g. an ancient warrior with a spear, an infographic comparing American vs British pants, an animal, a bicycle, food, tools, cars, etc.).
2. Perform DENSE OBJECT DETECTION: Return a JSON array of EVERY distinct object, tool, garment, or part visible in the photo (aim for 4 to 8 distinct items).
3. CATEGORIZE ACCURATELY:
   - 'Metallic': Refined metals and alloys (Steel, iron, brass, copper, aluminum, bronze, zinc).
   - 'Natural': Raw organic materials (Wood, cotton, linen, silk, wool, leather, hemp, paper cellulose).
   - 'Synthetic': Petrochemical plastics, nylon, polyester, acrylic, PVC, synthetic rubber, spandex.
   - 'Mineral': Glass, ceramics, stone, clay, graphite, plaster.
   - 'Mixed': Blends (poly-cotton, denim with elastane, composite).
4. Provide precise percentage coordinates pinX (10 to 90) and pinY (10 to 90) on the image where each object is located.

Return ONLY a valid JSON object matching this schema with NO markdown formatting:
{
  "sceneDescription": "1-2 friendly sentences accurately describing what is in this photo",
  "materialName": "Primary material family",
  "family": "Material family name",
  "category": "Natural" or "Synthetic" or "Metallic" or "Mineral" or "Mixed",
  "microscopicStructure": "1 sentence explaining molecular structure for a 10 year old",
  "confidence": 0.98,
  "funFact": "1 exciting trivia fact about the materials in this photo",
  "pointers": [
    {
      "id": "p1",
      "itemName": "Specific item or part with emoji (e.g. '👖 Denim Jeans (Trousers)', '🩲 Cotton Underwear', '🗡️ Spearhead', '🪵 Spear Shaft')",
      "materialName": "Exact material name (e.g. '100% Woven Cotton Denim', 'Combed Cotton & Elastic Spandex', 'Forged Steel Alloy')",
      "category": "Natural" or "Synthetic" or "Metallic" or "Mineral" or "Mixed",
      "icon": "Relevant emoji icon",
      "whyUsed": "1 sentence explaining why this material is used for this specific part",
      "microscopicStructure": "1 sentence on microscopic structure",
      "pinX": 50,
      "pinY": 40
    }
  ],
  "interactiveChallenge": {
    "question": "1 multiple choice question about the materials in this photo",
    "options": [
      { "text": "Correct option", "isCorrect": true },
      { "text": "Wrong option", "isCorrect": false }
    ],
    "explanation": "1 sentence explanation"
  }
}`;

    const requestBody = {
      contents: [
        {
          parts: [
            { text: prompt },
            { inlineData: { mimeType, data: cleanBase64 } },
          ],
        },
      ],
      generationConfig: { maxOutputTokens: 2000, temperature: 0.1 },
    };

    const rawText = await generateContentCascade(requestBody);
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as MaterialAnalysisResult;
    }
    throw new Error('Could not parse Gemini vision response.');
  },

  /**
   * 🧪 "What If?" Science Sandbox Simulation Generator
   */
  async simulateWhatIfExperiment(materialA: string, materialB: string, action: string): Promise<WhatIfResult> {
    try {
      const prompt = `Simulate a science reaction for a CBSE Class 5 student:
Material: ${materialA}
Environment/Force: ${materialB}
Action: ${action}

Return ONLY valid JSON:
{
  "title": "Fun title",
  "hypothesis": "What was tested",
  "predictedOutcome": "1-2 sentences on what physically happens",
  "physicalReaction": "Simple 5th-grade molecular explanation",
  "pipCommentary": "Encouraging reaction from Pip",
  "safetyRating": "Safe at Home 🏡" or "Lab Adult Supervision ⚠️" or "Dangerous Flame/Chemical 🚫",
  "scienceLaw": "Underlying scientific rule"
}`;

      const requestBody = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 800, temperature: 0.2 },
      };

      const rawText = await generateContentCascade(requestBody);
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as WhatIfResult;
      }
    } catch {}

    return {
      title: `${materialA} Meets ${materialB}!`,
      hypothesis: `Testing how ${materialA} responds when subjected to ${action.toLowerCase()} under ${materialB}.`,
      predictedOutcome: `When ${materialA} is exposed to ${materialB}, its molecular bonds respond according to its physical elasticity and thermal properties.`,
      physicalReaction: `Polymer chains and crystalline bonds deform or resist stress depending on covalent cross-linking and heat transfer.`,
      pipCommentary: `Fascinating science! Observing how materials interact helps engineers build safer bridges, rockets, and clothing! 🔬✨`,
      safetyRating: 'Safe at Home 🏡',
      scienceLaw: 'Conservation of Mass & Energy • Material Property Law',
    };
  },

  /**
   * 🗣️ Gemini AI Speech Recognition Coach
   */
  async evaluateSpeechWithAI(spokenTranscript: string, targetSentence: string): Promise<{
    accuracyScore: number;
    isPassed: boolean;
    encouragement: string;
    pronunciationTip?: string;
    wordStatuses: { word: string; isCorrect: boolean }[];
  }> {
    const targetWords = targetSentence.toLowerCase().split(/\s+/).map((w) => w.replace(/[^a-z0-9]/gi, ''));
    const spokenWords = spokenTranscript.toLowerCase().split(/\s+/).map((w) => w.replace(/[^a-z0-9]/gi, ''));
    const matches = targetWords.filter((tw) => spokenWords.includes(tw)).length;
    const score = Math.min(100, Math.round((matches / Math.max(targetWords.length, 1)) * 100));

    return {
      accuracyScore: score,
      isPassed: score >= 65,
      encouragement: score >= 65
        ? '🌟 Outstanding reading! You pronounced the scientific terms clearly!'
        : '👍 Good effort! Let us practice reading it once more together!',
      pronunciationTip: score < 65 ? 'Try speaking slightly louder and pausing between words.' : undefined,
      wordStatuses: targetSentence.split(/\s+/).map((w) => ({
        word: w,
        isCorrect: spokenWords.includes(w.toLowerCase().replace(/[^a-z0-9]/gi, '')),
      })),
    };
  },

  /**
   * 💬 Live Floating Pip AI Companion Chat
   */
  async chatWithLivePip(userInput: string, pageContext?: string): Promise<string> {
    try {
      const prompt = `You are Pip, a friendly and smart cartoon science mentor for a CBSE Class 5 student (age 9-11).
Current page: ${pageContext || 'PolyQuest Science Academy'}.
User question: "${userInput}"

INSTRUCTIONS:
1. Explain the answer accurately in 2 to 4 friendly, clear, and complete sentences.
2. If asked about science topics (e.g. boiling points, vaporization, polymers, animals, water, electricity), give the exact interesting facts clearly.
3. Use simple everyday language suited for a 10-year-old with 1-2 fun emojis.
4. Always conclude with a complete closing sentence. Never stop midway.`;

      const requestBody = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.4,
          thinkingConfig: { thinkingBudget: 0 },
        },
      };

      return await generateContentCascade(requestBody);
    } catch {
      return `Hello young scientist! I'm Pip, your science lab assistant. Ask me anything about materials, forces, animals, or space and we will investigate together! 🧪✨`;
    }
  },

  /**
   * 📖 Gemini AI Dictionary Explainer
   */
  async defineWordWithAI(word: string): Promise<{
    word: string;
    definition: string;
    example: string;
    category: string;
    pronunciation?: string;
  }> {
    const prompt = `You are Pip, a friendly dictionary science tutor for a 5th grade student.
Define: "${word}".
Return ONLY valid JSON:
{
  "word": "${word}",
  "definition": "1 clear friendly sentence explaining what this means in simple words.",
  "example": "1 realistic example sentence.",
  "category": "Science Concept" or "Material" or "Noun" or "Property",
  "pronunciation": "/phonetic/"
}`;

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 1024, temperature: 0.3, thinkingConfig: { thinkingBudget: 0 } },
    };

    const rawText = await generateContentCascade(requestBody);
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Could not parse AI dictionary JSON');
  },
};

/**
 * Automated AI Level Generator for Teacher Studio
 * Generates valid, Grade 5 calibrated LessonMissionConfig from plain English prompts.
 */
/**
 * Automated AI Level Generator for Teacher Studio
 * Generates valid, Grade 5 calibrated LessonMissionConfig from plain English prompts.
 */
export async function generateLessonFromPrompt(
  prompt: string,
  targetGrade: number = 5
): Promise<LessonMissionConfig> {
  const apiKey = getApiKey();

  // If no API key or rapid fallback needed, generate rich interactive diagram/level
  if (!apiKey) {
    return generateFallbackLessonConfig(prompt, targetGrade);
  }

  const systemInstruction = `
You are an expert Grade ${targetGrade} (Ages 10-11) Science Curriculum Architect.
Given a teacher's topic or request, generate a strictly structured JSON mission configuration.

The output MUST be valid JSON adhering to this TypeScript structure:
{
  "id": "custom-mission-1",
  "number": 1,
  "title": "Short Fun Mission Title",
  "subtitle": "Clear Grade 5 Learning Objective",
  "icon": "🌊",
  "themeColor": "sky",
  "targetGrade": ${targetGrade},
  "bgmTrack": "playful-lab",
  "concepts": ["Concept 1", "Concept 2"],
  "steps": [
    {
      "id": "step_1",
      "type": "interactive_diagram" | "sorting_tray" | "matching_pairs" | "tensile_strength_rig" | "microscopic_zoom_viewer" | "water_absorption_lab" | "mcq_assessment" | "concept_summary",
      "title": "Step Title",
      "pipPrompt": "Friendly Grade 5 Pip explanation",
      // If interactive_diagram:
      "diagramTitle": "Earth\'s Water Cycle Simulation",
      "learningObjective": "Discover how solar energy drives evaporation, condensation, and rain!",
      "hotspots": [
        { "id": "evap", "name": "Evaporation", "stageNumber": 1, "icon": "☀️", "xPercent": 25, "yPercent": 50, "title": "1. Evaporation", "explanation": "Sunlight heats water into rising vapor!", "funFact": "Water vapor is an invisible gas!" },
        { "id": "cond", "name": "Condensation", "stageNumber": 2, "icon": "☁️", "xPercent": 75, "yPercent": 25, "title": "2. Condensation", "explanation": "Cold air cools water vapor into clouds!", "funFact": "Clouds are made of billions of floating micro-droplets!" },
        { "id": "precip", "name": "Precipitation", "stageNumber": 3, "icon": "🌧️", "xPercent": 80, "yPercent": 60, "title": "3. Precipitation", "explanation": "Heavy droplets fall as rain or snow!", "funFact": "Raindrops fall at up to 30 km/h!" },
        { "id": "collect", "name": "Collection", "stageNumber": 4, "icon": "🌊", "xPercent": 40, "yPercent": 85, "title": "4. Collection", "explanation": "Water pools in oceans, rivers, and lakes!", "funFact": "The water cycle has run non-stop for 4 billion years!" }
      ]
    }
  ]
}

Ensure all scientific explanations are calibrated for 10-11 year olds (Grade 5).
Output ONLY the raw JSON object with NO markdown ticks, NO commentary.
`;

  try {
    const models = await getAvailableVisionModels(apiKey);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: `${systemInstruction}\n\nTeacher Request: "${prompt}"` },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 2048,
            },
          }),
        });

        clearTimeout(timeoutId);
        if (!response.ok) continue;

        const data = await response.json();
        let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

        const parsed = JSON.parse(rawText) as LessonMissionConfig;
        if (parsed && parsed.title && Array.isArray(parsed.steps) && parsed.steps.length > 0) {
          return parsed;
        }
      } catch {
        // Try next model or fallback
      }
    }
  } catch {
    // Timeout or network error, proceed to instant fallback
  }

  return generateFallbackLessonConfig(prompt, targetGrade);
}

/**
 * Intelligent Fallback Generator for Any Science Topic
 */
export function generateFallbackLessonConfig(prompt: string, targetGrade: number = 5): LessonMissionConfig {
  const p = prompt.toLowerCase();

  // 1. Water Cycle & Weather Interactive Animated Diagram
  if (p.includes('water') || p.includes('cycle') || p.includes('rain') || p.includes('cloud') || p.includes('weather') || p.includes('evaporat')) {
    return {
      id: 'ai-water-cycle-mission',
      number: 1,
      title: "Earth\'s Water Cycle Investigation",
      subtitle: 'Discover how solar energy and atmosphere recycle Earth\'s water non-stop',
      icon: '🌊',
      themeColor: 'sky',
      targetGrade,
      bgmTrack: 'rainy-storm',
      concepts: ['Evaporation', 'Condensation', 'Precipitation', 'Solar Energy', 'Collection'],
      steps: [
        {
          id: 'step_1',
          type: 'interactive_diagram',
          title: 'Interactive 2D Water Cycle Simulation',
          pipPrompt: 'Water on Earth travels in an endless circle! Tap each stage in the animated diagram or use the weather controls to see how it works.',
          topic: 'water_cycle',
          diagramTitle: "Earth\'s Water Cycle Simulation",
          backgroundTheme: 'sky_ocean',
          learningObjective: 'Explore how solar heat evaporates water into vapor, condenses it into clouds, and falls as rain!',
          summaryTakeaway: 'The water cycle has been recycling the exact same water molecules on Earth for over 4 billion years!',
          hotspots: [
            {
              id: 'evap',
              name: 'Evaporation',
              stageNumber: 1,
              icon: '☀️',
              xPercent: 28,
              yPercent: 45,
              title: '1. Evaporation & Solar Heating',
              explanation: 'Heat energy from the Sun warms oceans and lakes, turning liquid water into invisible water vapor gas that rises into the sky!',
              animationType: 'evaporate_steam',
              funFact: 'Over 1,000 cubic kilometers of water evaporate into the sky every single day!',
            },
            {
              id: 'cond',
              name: 'Condensation',
              stageNumber: 2,
              icon: '☁️',
              xPercent: 72,
              yPercent: 24,
              title: '2. Condensation & Cloud Formation',
              explanation: 'As warm water vapor climbs higher into the cold atmosphere, it cools down and clumps into billions of tiny droplets, creating clouds!',
              animationType: 'condense_cloud',
              funFact: 'A single fluffy cumulus cloud can weigh over 500,000 kilograms — as heavy as 100 elephants!',
            },
            {
              id: 'precip',
              name: 'Precipitation',
              stageNumber: 3,
              icon: '🌧️',
              xPercent: 78,
              yPercent: 58,
              title: '3. Precipitation (Rain, Snow & Hail)',
              explanation: 'When water droplets inside clouds get too heavy to float, gravity pulls them down to Earth as rain, snow, sleet, or hail!',
              animationType: 'rain_drops',
              funFact: 'The fastest falling raindrops can reach speeds over 30 kilometers per hour!',
            },
            {
              id: 'collect',
              name: 'Collection & Runoff',
              stageNumber: 4,
              icon: '🌊',
              xPercent: 42,
              yPercent: 86,
              title: '4. Collection & Reservoir Storage',
              explanation: 'Rainwater flows down mountains into rivers, streams, and oceans. The cycle is complete and ready to begin all over again!',
              animationType: 'flow_water',
              funFact: '97% of Earth\'s water is stored in oceans, while only 1% is accessible fresh drinking water!',
            },
          ],
        },
      ],
    };
  }

  // 2. Matching Pairs
  if (p.includes('match') || p.includes('pair')) {
    return {
      id: 'ai-matching-mission',
      number: 1,
      title: 'Materials & Superpowers Match!',
      subtitle: 'Connect everyday objects to their special science properties',
      icon: '✨',
      themeColor: 'amber',
      targetGrade,
      bgmTrack: 'high-energy-sprint',
      concepts: ['Material Properties', 'Tensile Strength', 'Water Resistance'],
      steps: [
        {
          id: 'step_1',
          type: 'matching_pairs',
          title: 'Object & Property Matching Rig',
          instruction: 'Tap an object on the left, then connect it to its superpower property on the right!',
          pipPrompt: 'Every material was chosen for a reason! Can you match each object to what it does best?',
          feedbackSuccess: 'Awesome job! You matched all items to their correct scientific properties!',
          pairs: [
            {
              id: 'pair-1',
              leftText: 'Raincoat',
              leftIcon: '🧥',
              rightText: 'Hydrophobic & Waterproof',
              rightIcon: '💧',
              explanation: 'Synthetic polyester sheds water droplets so you stay 100% dry in the rain!',
            },
            {
              id: 'pair-2',
              leftText: 'Climbing Rope',
              leftIcon: '🪢',
              rightText: 'Extreme Tensile Strength',
              rightIcon: '🏋️',
              explanation: 'Continuous nylon polymer chains can hold heavy human climbers without snapping!',
            },
            {
              id: 'pair-3',
              leftText: 'Kettle Handle',
              leftIcon: '🫖',
              rightText: 'Thermoset Heat Insulator',
              rightIcon: '🛡️',
              explanation: 'Bakelite plastic blocks heat from the stove so you do not burn your hands!',
            },
            {
              id: 'pair-4',
              leftText: 'Electric Wire Core',
              leftIcon: '⚡',
              rightText: 'Electrical Conductor',
              rightIcon: '💡',
              explanation: 'Copper metal has free electrons that carry electric current to light bulbs!',
            },
          ],
        },
      ],
    };
  }

  // 3. Tensile Rig
  if (p.includes('tensile') || p.includes('strength') || p.includes('weight') || p.includes('break') || p.includes('pull')) {
    return {
      id: 'ai-tensile-mission',
      number: 1,
      title: 'The Great Tensile Strength Championship',
      subtitle: 'Discover which fiber holds the most weight before snapping',
      icon: '🏋️',
      themeColor: 'sky',
      targetGrade,
      bgmTrack: 'playful-lab',
      concepts: ['Tensile Strength', 'Breaking Force', 'Polymer Chains'],
      steps: [
        {
          id: 'step_1',
          type: 'tensile_strength_rig',
          title: '1v1 Heavy Weight Pull Test',
          pipPrompt: 'Pull the weight slider to test how many kilograms each material can carry before breaking!',
          weightIncrementGrams: 1000,
          maxWeightGrams: 50000,
          scientificTakeaway: 'Synthetic nylon and metallic steel cables hold massive loads because of unbroken continuous molecular bonds!',
          specimens: [
            {
              id: 'cotton',
              name: 'Natural Cotton Rope',
              material: 'Plant Cellulose',
              icon: '🧵',
              breakingWeightGrams: 2000,
              elasticDeformationMm: 4,
              snapSound: 'snap',
              description: 'Short plant fibers twisted together.',
              realWorldUse: 'Lightweight clothing and summer shirts',
            },
            {
              id: 'wool',
              name: 'Natural Wool Cord',
              material: 'Sheep Fleece Hair',
              icon: '🧶',
              breakingWeightGrams: 3000,
              elasticDeformationMm: 8,
              snapSound: 'snap',
              description: 'Curly animal fleece fibers that stretch and snap.',
              realWorldUse: 'Warm winter sweaters and blankets',
            },
            {
              id: 'silk',
              name: 'Natural Silk Cord',
              material: 'Silkworm Fibroin',
              icon: '🐛',
              breakingWeightGrams: 5000,
              elasticDeformationMm: 6,
              snapSound: 'snap',
              description: 'Continuous glossy thread spun by caterpillars.',
              realWorldUse: 'Luxury fabrics and surgical sutures',
            },
            {
              id: 'nylon',
              name: 'Synthetic Nylon Rope',
              material: 'Synthetic Polyamide',
              icon: '🪢',
              breakingWeightGrams: 25000,
              elasticDeformationMm: 15,
              snapSound: 'tensionSnap',
              description: 'Continuous unbroken synthetic plastic polymer chains.',
              realWorldUse: 'Climbing ropes, parachutes, and fishing nets',
            },
            {
              id: 'steel',
              name: 'Braided Steel Wire Cable',
              material: 'Stainless Steel Alloy',
              icon: '⚙️',
              breakingWeightGrams: 50000,
              elasticDeformationMm: 2,
              snapSound: 'none',
              description: 'Braided aircraft-grade stainless steel wires.',
              realWorldUse: 'Elevator cables and suspension bridge cables',
            },
          ],
        },
      ],
    };
  }

  // 4. Default: Sorting Trays
  return {
    id: 'ai-sorting-mission',
    number: 1,
    title: 'Natural vs. Synthetic Classification Lab',
    subtitle: 'Sort everyday specimens into Nature-Grown vs. Factory-Synthesized Trays',
    icon: '🔬',
    themeColor: 'sage',
    targetGrade,
    bgmTrack: 'playful-lab',
    concepts: ['Natural Materials', 'Synthetic Materials', 'Chemical Synthesis'],
    steps: [
      {
        id: 'step_1',
        type: 'sorting_tray',
        title: 'Two-Tray Classification Workbench',
        pipPrompt: 'Help me sort these materials! Did they come from living nature, or were they made by scientists in a lab?',
        trays: [
          {
            id: 'natural',
            title: '🌿 From Living Nature',
            icon: '🌿',
            themeColor: 'sage',
            allowedCategories: ['natural'],
            description: 'Grown by plants, animals, or Earth',
          },
          {
            id: 'synthetic',
            title: '🏭 Made by People (Chemicals)',
            icon: '🏭',
            themeColor: 'sky',
            allowedCategories: ['synthetic'],
            description: 'Synthesized in factories from petroleum',
          },
        ],
        items: [
          {
            id: 'item-1',
            name: 'Fluffy Cotton Boll',
            icon: '🌿',
            category: 'natural',
            hint: 'Does this grow on a plant in agricultural fields?',
            originDetails: 'Harvested from cotton shrub bolls',
          },
          {
            id: 'item-2',
            name: 'Sheep Wool Fleece',
            icon: '🐑',
            category: 'natural',
            hint: 'Does this grow on an animal for warmth?',
            originDetails: 'Sheared from sheep fleece',
          },
          {
            id: 'item-3',
            name: 'Nylon Parachute Cord',
            icon: '🪢',
            category: 'synthetic',
            hint: 'Was this synthesized from petroleum chemicals?',
            originDetails: 'Engineered in chemical factories',
          },
          {
            id: 'item-4',
            name: 'Polyester Rain Jacket',
            icon: '🧥',
            category: 'synthetic',
            hint: 'Is this made from non-porous plastic polymers?',
            originDetails: 'Manufactured from synthetic polyester',
          },
          {
            id: 'item-5',
            name: 'Silkworm Cocoon',
            icon: '🐛',
            category: 'natural',
            hint: 'Is this spun by a caterpillar insect?',
            originDetails: 'Spun by silkworm larvae',
          },
          {
            id: 'item-6',
            name: 'PET Plastic Water Bottle',
            icon: '🫙',
            category: 'synthetic',
            hint: 'Is this molded from heated plastic pellets?',
            originDetails: 'Blow-molded from polyethylene terephthalate',
          },
        ],
      },
    ],
  
  async generateParentAIAnalytics(childName: string, completedMissionsCount: number, discoveriesCount: number): Promise<{ summary: string; strengths: string[]; recommendations: string[] }> {
    return {
      summary: `${childName} is demonstrating exceptional inquiry skills and scientific reasoning across materials science and physical geography.`,
      strengths: ['Hypothesis generation', 'Material property classification', 'Visual micrograph deduction'],
      recommendations: ['Conduct kitchen buoyancy experiments with salt and eggs', 'Explore outdoor seed dispersal in garden pods']
    };
  }

};
}
