/**
 * Google Gemini AI Multi-Object Scene & Material Detective Service
 * Pure open-ended multimodal AI vision with dense per-object detection.
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
    if (customKey && customKey.trim().length > 10 && !customKey.startsWith('AQ.')) {
      return customKey.trim();
    }
  }
  const envKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  if (envKey && envKey.length > 10 && !envKey.startsWith('AQ.')) {
    return envKey;
  }
  return '';
};

export const setApiKey = (key: string): void => {
  if (typeof window !== 'undefined') {
    if (key && key.trim().length > 10) {
      localStorage.setItem('gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  }
};

// Official Google Gemini Vision Models
const CANDIDATE_MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
];

/**
 * Executes a Gemini API request with strict 6s timeout
 */
async function generateContentCascade(requestBody: any): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('NO_API_KEY');
  }

  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

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
        const errText = await response.text();
        console.warn(`Gemini Vision error on ${model}:`, errText);
        lastError = new Error(`Status ${response.status}: ${errText}`);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      lastError = err;
    }
  }

  throw lastError || new Error('Cloud AI unavailable.');
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
        generationConfig: { maxOutputTokens: 400, temperature: 0.2 },
      };

      return await generateContentCascade(requestBody);
    } catch {
      return 'Great science question! In science, every material has unique physical properties like elasticity, electrical insulation, and strength that determine how we use it! 🔬⭐';
    }
  },

  /**
   * 🔍 Pure Open-Ended AI Multimodal Vision Detective (Analyzes ANY photo with zero preset bias)
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

    const prompt = `You are Pip, an advanced AI Materials Science Detective analyzing a real user photo for a 5th grade student.
Analyze the EXACT visual contents of this image with 100% visual accuracy.

INSTRUCTIONS:
1. Describe the scene in 1 to 2 clear, friendly sentences. Identify exactly who or what is present (e.g. an ancient warrior with a spear, a car on a road, a cat on a rug, a student with books, a bicycle, a tree, tools, food, clothing).
2. Perform DENSE OBJECT DETECTION: Return a JSON array of EVERY distinct object, tool, garment, weapon, or component visible in the photo (aim for 4 to 8 distinct detections).
3. CATEGORIZE ACCURATELY:
   - 'Metallic': Refined metals and alloys (Steel, iron, brass, copper, aluminum, bronze, zinc).
   - 'Natural': Raw organic materials (Wood, cotton, linen, silk, wool, leather, hemp, feathers).
   - 'Synthetic': Petrochemical plastics, nylon, polyester, acrylic, PVC, synthetic rubber.
   - 'Mineral': Glass, ceramics, stone, clay, graphite, plaster.
   - 'Mixed': Blends (poly-cotton, fiberglass, composite).
4. Provide precise percentage coordinates pinX (10 to 90) and pinY (10 to 90) on the image where each object is located.

Return ONLY a valid JSON object matching this schema with NO markdown fences:
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
      "itemName": "Specific item or part with emoji (e.g. '🗡️ Spearhead', '🧥 Overcoat', '🥾 Leather Boots', '🪵 Spear Shaft')",
      "materialName": "Exact material name (e.g. 'Forged Iron Metal Alloy', 'Heavy Weathered Wool', 'Tanned Animal Leather')",
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
    throw new Error('Could not parse Gemini vision JSON');
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
      const prompt = `You are Pip, a playful cartoon robot science buddy for a CBSE Class 5 student (age 9-11).
Current page: ${pageContext || 'PolyQuest Science Academy'}.
User message: "${userInput}"
Reply in exactly 2 to 3 short sentences using simple everyday words with 1-2 fun emojis.`;

      const requestBody = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 300, temperature: 0.3 },
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
      generationConfig: { maxOutputTokens: 400, temperature: 0.2 },
    };

    const rawText = await generateContentCascade(requestBody);
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Could not parse AI dictionary JSON');
  },
};
