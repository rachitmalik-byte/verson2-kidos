/**
 * Google Gemini AI Service for PolyQuest Science Academy
 * Features structured Socratic responses, real-world analogies,
 * at-home safe experiments, interactive challenges, and reliable local fallback.
 */

const GEMINI_API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY || 'AQ.Ab8RN6IxHjl_Nd_Ui87NtEhD5CXeMTCgeCxTxuWrelxDAlTVtg';

const MODEL_NAME = 'gemini-2.5-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

export interface PipStructuredResponse {
  simpleExplanation: string;
  everydayAnalogy: string;
  kitchenExperiment?: string;
  quickChallenge?: {
    question: string;
    options: { text: string; isCorrect: boolean }[];
    explanation: string;
  };
  relatedMission?: {
    id: string;
    name: string;
    actionText: string;
  };
}

export interface MaterialAnalysisResult {
  materialName: string;
  family: string;
  category: 'Natural' | 'Synthetic';
  microscopicStructure: string;
  confidence: number;
  funFact: string;
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

// ── Smart Local Science Encyclopedia for Instant / Offline Learning ──
const LOCAL_SCIENCE_ENCYCLOPEDIA: {
  keywords: string[];
  response: PipStructuredResponse;
}[] = [
  {
    keywords: ['cotton', 'sweat', 'summer', 'absorb', 't-shirt', 'shirt', 'plant'],
    response: {
      simpleExplanation:
        'Cotton is a natural fiber from fluffy cotton plant bolls. 🌱 Its fibers have millions of microscopic hollow tubes that drink up sweat quickly to cool down your body!',
      everydayAnalogy:
        'Think of cotton fibers like millions of tiny thirsty sponges drinking up water drops!',
      kitchenExperiment:
        'Drop 1 teaspoon of water onto a cotton towel vs a plastic folder. Notice how the cotton pulls the water right inside within 1 second!',
      quickChallenge: {
        question: 'Why is 100% cotton best for hot summer sports clothes?',
        options: [
          { text: 'It absorbs sweat and lets your skin breathe', isCorrect: true },
          { text: 'It reflects sunlight and never gets wet', isCorrect: false },
        ],
        explanation: 'Cotton fibers are naturally hydrophilic (water-loving) and porous!',
      },
      relatedMission: {
        id: 'mission-1',
        name: 'Mission 1: The Raincoat Mystery',
        actionText: 'Test Cotton in Mission 1 🔬',
      },
    },
  },
  {
    keywords: ['polyester', 'raincoat', 'waterproof', 'rain', 'synthetic', 'umbrella'],
    response: {
      simpleExplanation:
        'Polyester is a synthetic polymer made by scientists! 🧪 Its fibers are smooth, hydrophobic (water-repelling), and woven tightly so raindrops cannot soak through!',
      everydayAnalogy:
        'Polyester is like a slippery water slide — water beads up into round drops and slides right off!',
      kitchenExperiment:
        'Hold a piece of plastic or raincoat fabric under a faucet — watch how water beads roll right off without soaking the backside!',
      quickChallenge: {
        question: 'What happens when rainwater hits a polyester raincoat?',
        options: [
          { text: 'Water beads up and rolls off without soaking through', isCorrect: true },
          { text: 'The coat gets heavy and soaks water like a sponge', isCorrect: false },
        ],
        explanation: 'Polyester fibers do not absorb moisture, keeping you 100% dry!',
      },
      relatedMission: {
        id: 'mission-1',
        name: 'Mission 1: The Raincoat Mystery',
        actionText: 'Compare Raincoat Fabrics in Lab 🔬',
      },
    },
  },
  {
    keywords: ['wire', 'copper', 'electric', 'shock', 'insulat', 'pvc', 'current', 'conductor'],
    response: {
      simpleExplanation:
        'Inside electrical cables, copper metal is a super conductor that lets electrons zoom through! ⚡ Outside, flexible PVC plastic is an electrical insulator that traps the current safely so you never get shocked!',
      everydayAnalogy:
        'Copper is the superhighway for electricity, and PVC plastic is the safety barrier protecting your fingers!',
      kitchenExperiment:
        'Look at your phone charging cable: notice how the inner metal plug conducts power while the rubbery plastic coating keeps your hand completely safe!',
      quickChallenge: {
        question: 'Why are copper wires always wrapped in plastic or rubber?',
        options: [
          { text: 'To protect humans from electric shock (insulation)', isCorrect: true },
          { text: 'To make electricity travel faster', isCorrect: false },
        ],
        explanation: 'Plastic is a non-conductor (insulator) with very high electrical resistance.',
      },
      relatedMission: {
        id: 'mission-8',
        name: 'Mission 8: Circuit Detective',
        actionText: 'Test Wire Safety in Mission 8 ⚡',
      },
    },
  },
  {
    keywords: ['pan', 'handle', 'bakelite', 'heat', 'burn', 'cook', 'hot', 'thermal', 'thermoset'],
    response: {
      simpleExplanation:
        'Cooking pans are made of metals like steel or aluminum to heat up food fast. 🍳 But their handles are made of Bakelite — a thermosetting polymer that blocks heat so your hand never gets burned!',
      everydayAnalogy:
        'The metal pan is a heat sponge, while the Bakelite handle is an unbreakable heat shield!',
      kitchenExperiment:
        'Ask a parent to show you a frying pan handle: notice that even when the pan bottom is scorching hot, the black handle remains cool to touch!',
      quickChallenge: {
        question: 'Why does Bakelite not melt when the pan gets boiling hot?',
        options: [
          { text: 'It has permanently locked molecular cross-links (Thermoset)', isCorrect: true },
          { text: 'It is made of frozen ice crystals', isCorrect: false },
        ],
        explanation: 'Thermosetting plastics form permanent chemical bonds that cannot be remelted!',
      },
      relatedMission: {
        id: 'mission-9',
        name: 'Mission 9: The Scorching Handle',
        actionText: 'Test Pan Handles in Mission 9 🍳',
      },
    },
  },
  {
    keywords: ['nylon', 'rope', 'climb', 'parachute', 'strength', 'strong', 'tensile'],
    response: {
      simpleExplanation:
        'Nylon was the world’s first 100% synthetic fiber! 🪢 It has tremendous tensile strength and slight elasticity, meaning it can hold the weight of heavy mountain climbers or open safely in skydiver parachutes without snapping!',
      everydayAnalogy:
        'Nylon threads are like microscopic steel chains that can stretch slightly without breaking!',
      kitchenExperiment:
        'Try snapping a piece of sewing cotton thread with your hands (it snaps easily). Now try snapping a piece of nylon fishing line or dental floss — it holds super tight!',
      quickChallenge: {
        question: 'Why is nylon used for climbing ropes and parachutes instead of cotton?',
        options: [
          { text: 'It has huge tensile strength and does not rot in damp weather', isCorrect: true },
          { text: 'It is the cheapest and weakest material available', isCorrect: false },
        ],
        explanation: 'Nylon’s long synthetic polymer chains distribute force evenly along the rope.',
      },
      relatedMission: {
        id: 'mission-3',
        name: 'Mission 3: The Strength Test',
        actionText: 'Test Nylon Strength in Mission 3 💪',
      },
    },
  },
  {
    keywords: ['soil', 'decay', 'plastic', '500', 'decompose', 'biodegrad', 'garbage', 'waste'],
    response: {
      simpleExplanation:
        'Natural things like apple cores or cotton are eaten by soil bacteria and earthworms in just 2 to 4 weeks! 🍎 But synthetic plastic has synthetic chemical bonds that soil microbes cannot digest, taking over 450 to 500 years to break down!',
      everydayAnalogy:
        'Bacteria love to feast on natural cellulose like an apple snack, but they have no teeth for synthetic plastic!',
      kitchenExperiment:
        'Look at vegetable peels in a compost bin — in 2 weeks they turn into dark rich soil, while a candy plastic wrapper looks completely unchanged!',
      quickChallenge: {
        question: 'Why should we reduce single-use plastic bags and bottles?',
        options: [
          { text: 'Because they stay in soil and oceans for up to 500 years', isCorrect: true },
          { text: 'Because they dissolve in rain after 2 hours', isCorrect: false },
        ],
        explanation: 'Synthetics are non-biodegradable and persist in the environment for centuries.',
      },
      relatedMission: {
        id: 'mission-11',
        name: 'Mission 11: 500-Year Soil Decay',
        actionText: 'Run Soil Simulator in Mission 11 ⏳',
      },
    },
  },
];

export const geminiService = {
  hasApiKey(): boolean {
    return Boolean(GEMINI_API_KEY && GEMINI_API_KEY.length > 10);
  },

  /**
   * 🎙️ Socratic Pip AI Science Voice Tutor (Structured & Pedagogical)
   */
  async askSocraticPipStructured(question: string, contextTopic?: string): Promise<PipStructuredResponse> {
    const qLower = question.toLowerCase().trim();

    // Check local smart knowledge base first for rapid response
    const localMatch = LOCAL_SCIENCE_ENCYCLOPEDIA.find((item) =>
      item.keywords.some((k) => qLower.includes(k))
    );

    try {
      const prompt = `You are Pip, a friendly cartoon robot science mentor for CBSE Class 5 Science students (age 9-11).
The student asked: "${question}"
Context topic: ${contextTopic || 'Natural vs Synthetic Materials, Conductors, Insulators, Polymers'}.

Respond with ONLY a valid JSON object matching this exact TypeScript schema:
{
  "simpleExplanation": "2-3 crystal clear, engaging sentences explaining the science with emojis. NO robotic noises.",
  "everydayAnalogy": "1 sentence fun analogy (like sponges, tiny straws, shields, or lego bricks)",
  "kitchenExperiment": "1 safe, fun 10-second real-world test they can do at home with everyday items",
  "quickChallenge": {
    "question": "1 multiple choice test question for the student",
    "options": [
      { "text": "Correct Option", "isCorrect": true },
      { "text": "Plausible Wrong Option", "isCorrect": false }
    ],
    "explanation": "1 sentence explanation"
  }
}`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 2000,
            temperature: 0.2,
          },
        }),
      });

      if (!response.ok) throw new Error(`Gemini API Error: ${response.statusText}`);
      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '{}';
      const cleanJson = rawText.replace(/```json/gi, '').replace(/```/gi, '').trim();
      const parsed = JSON.parse(cleanJson) as PipStructuredResponse;
      if (parsed.simpleExplanation) {
        return parsed;
      }
      throw new Error('Incomplete response structure');
    } catch (err) {
      console.warn('Gemini live call fallback to smart encyclopedia:', err);
      if (localMatch) {
        return localMatch.response;
      }

      // Default high-quality structured response
      return {
        simpleExplanation: `That is a fantastic science question about ${question}! In science, every material has unique microscopic properties that determine how it reacts with water, heat, and force. 🔬`,
        everydayAnalogy:
          'Materials are like nature’s Lego bricks — how the molecules snap together decides if it is soft like cotton or tough like plastic!',
        kitchenExperiment:
          'Try testing two different items from your desk (like a metal spoon and a wooden pencil) — feel which one is colder to the touch!',
        quickChallenge: {
          question: 'What determines how a material is used in real life?',
          options: [
            { text: 'Its physical properties like strength, conductivity, and waterproofing', isCorrect: true },
            { text: 'Only its color and price in the market', isCorrect: false },
          ],
          explanation: 'In materials science: Material Property dictates its real-world Use!',
        },
      };
    }
  },

  /**
   * 🔍 Real-World Camera "Material Detective" (Multimodal Vision)
   */
  async detectMaterialFromImage(base64Image: string, customMimeType?: string): Promise<MaterialAnalysisResult> {
    try {
      let mimeType = customMimeType || 'image/jpeg';
      const mimeMatch = base64Image.match(/^data:([a-zA-Z0-9/+-]+);base64,/);
      if (mimeMatch) {
        mimeType = mimeMatch[1];
      }

      const cleanBase64 = base64Image.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '').trim();

      const prompt = `You are an expert materials scientist analyzing a photo for a CBSE Class 5 Science student (age 9-11).
Identify the physical material shown (e.g. Stone/Rock/Granite/Marble, Metal/Steel/Copper/Iron/Brass, Wood, Cotton, Wool, Silk, Glass, Ceramic, PET Plastic, PVC, Bakelite, Nylon, Rubber).
Return ONLY a valid JSON object matching this schema:
{
  "materialName": "Exact material name",
  "family": "Material family",
  "category": "Natural" or "Synthetic",
  "microscopicStructure": "1 simple sentence explaining its molecular/particle structure for a 5th grader",
  "confidence": 0.95,
  "funFact": "1 exciting kid-friendly trivia fact",
  "interactiveChallenge": {
    "question": "1 simple multiple choice question testing its property",
    "options": [
      { "text": "Correct property option", "isCorrect": true },
      { "text": "Wrong property option", "isCorrect": false }
    ],
    "explanation": "1 simple sentence explanation"
  }
}`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: cleanBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 2500,
            temperature: 0.1,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini Vision API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '{}';
      const cleanJson = rawText.replace(/```json/gi, '').replace(/```/gi, '').trim();
      return JSON.parse(cleanJson) as MaterialAnalysisResult;
    } catch (err) {
      console.error('Gemini Vision analysis error:', err);
      throw err;
    }
  },

  /**
   * 🧪 "What If?" Science Sandbox Simulation Generator
   */
  async simulateWhatIfExperiment(materialA: string, materialB: string, action: string): Promise<WhatIfResult> {
    try {
      const prompt = `Simulate a physics/chemistry reaction for a CBSE Class 5 Science student:
Material: ${materialA}
Force/Environment: ${materialB}
Action: ${action}

Return ONLY valid JSON matching this schema:
{
  "title": "Fun experiment title",
  "hypothesis": "What was tested",
  "predictedOutcome": "1-2 clear sentences on what physically happens",
  "physicalReaction": "Molecular explanation in simple 5th-grade terms",
  "pipCommentary": "Friendly encouraging reaction from Pip",
  "safetyRating": "Safe at Home 🏡" or "Lab Adult Supervision ⚠️" or "Dangerous Flame/Chemical 🚫",
  "scienceLaw": "The underlying scientific rule"
}`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 1500, temperature: 0.2 },
        }),
      });

      if (!response.ok) throw new Error(`Gemini Error: ${response.statusText}`);
      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '{}';
      const cleanJson = rawText.replace(/```json/gi, '').replace(/```/gi, '').trim();
      return JSON.parse(cleanJson) as WhatIfResult;
    } catch (err) {
      console.warn('What-If simulation error:', err);
      return {
        title: `${materialA} + ${action}`,
        hypothesis: `Testing what happens when ${materialA} is exposed to ${materialB}.`,
        predictedOutcome: `${materialA} reacts based on its molecular polymer chains!`,
        physicalReaction: `The intermolecular forces determine whether it expands, melts, dissolves, or remains intact.`,
        pipCommentary: `Science in action! Notice how the chemical bonds held up under pressure! 🧪✨`,
        safetyRating: 'Safe at Home 🏡',
        scienceLaw: `🧱 MATERIAL dictates ⚡ PROPERTY, which dictates 🎯 USE!`,
      };
    }
  },

  /**
   * 📖 AI Science Word & Vocabulary Explainer
   */
  async defineWordWithAI(word: string): Promise<{
    word: string;
    definition: string;
    example: string;
    category: string;
    pronunciation?: string;
  }> {
    try {
      const prompt = `Define "${word}" simply for a 5th grader. Give 1 everyday example.
Return ONLY valid JSON matching this schema:
{
  "word": "${word}",
  "definition": "1 clear simple sentence",
  "example": "1 fun everyday science example sentence",
  "category": "Noun / Verb / Adjective / Science Term",
  "pronunciation": "/phonetic/"
}`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 1000, temperature: 0.2 },
        }),
      });

      if (!response.ok) throw new Error(`Gemini Word Def Error: ${response.statusText}`);
      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '{}';
      const cleanJson = rawText.replace(/```json/gi, '').replace(/```/gi, '').trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      return {
        word: word.charAt(0).toUpperCase() + word.slice(1),
        definition: `A scientific term relating to physical materials and properties.`,
        example: `Notice how "${word}" helps us classify matter in the universe!`,
        category: 'Science Term',
      };
    }
  },
};
