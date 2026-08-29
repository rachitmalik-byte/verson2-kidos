/**
 * Google Gemini AI Service for PolyQuest Science Academy
 * Uses gemini-2.5-flash with high token capacity for internal reasoning,
 * crystal-clear 5th-grade pedagogical explanations, and accurate vision detection.
 */

const GEMINI_API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY || 'AQ.Ab8RN6IxHjl_Nd_Ui87NtEhD5CXeMTCgeCxTxuWrelxDAlTVtg';

const MODEL_NAME = 'gemini-2.5-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

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

export const geminiService = {
  /**
   * Check if Gemini API is available
   */
  hasApiKey(): boolean {
    return Boolean(GEMINI_API_KEY && GEMINI_API_KEY.length > 10);
  },

  /**
   * 🎙️ Socratic Pip AI Science Voice Tutor
   * Explains science concepts in crystal clear, friendly, simple terms for 5th graders.
   */
  async askSocraticPip(question: string, contextTopic?: string): Promise<string> {
    try {
      const systemPrompt = `You are Pip, an enthusiastic science guide for CBSE Class 5 students (age 9-11).
Your tone: Friendly, warm, encouraging, curious, and clear.
Rules:
1. Explain concepts in simple, everyday 5th-grade terms with concrete analogies (e.g. sponges, straws, shields).
2. Keep your answer to 2 to 3 friendly sentences with relevant emojis.
3. NEVER make robotic sounds (do NOT say "beep", "boop", or robotic jargon). Talk naturally like a friendly teacher.
4. If relevant, mention what happens when testing the material in real life.
5. Current subject context: ${contextTopic || 'CBSE Class 5 EVS & Science: Natural vs Synthetic Materials, Polymers, Conductors, Fire Safety'}.`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nStudent asks: "${question}"` }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 1200,
            temperature: 0.3,
          },
        }),
      });

      if (!response.ok) throw new Error(`Gemini API Error: ${response.statusText}`);
      const data = await response.json();
      return (
        data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "That's a fantastic science question! Think about how that material interacts with heat and water in everyday life! 🔬"
      );
    } catch (err) {
      console.warn('Gemini Socratic Pip error:', err);
      return "That's a wonderful question! Think about whether that material came directly from nature (like a plant or rock) or was engineered in a science laboratory! 🌿🧪";
    }
  },

  /**
   * 🔍 Real-World Camera "Material Detective" (Multimodal Vision)
   * Analyzes an image of ANY physical object (rock, sculpture, metal, cotton, plastic, wood, glass)
   */
  async detectMaterialFromImage(base64Image: string, customMimeType?: string): Promise<MaterialAnalysisResult> {
    try {
      // Determine real mime type
      let mimeType = customMimeType || 'image/jpeg';
      const mimeMatch = base64Image.match(/^data:([a-zA-Z0-9/+-]+);base64,/);
      if (mimeMatch) {
        mimeType = mimeMatch[1];
      }

      // Clean base64 header
      const cleanBase64 = base64Image.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '').trim();

      const prompt = `You are an expert materials scientist analyzing a photo for a CBSE Class 5 Science student (age 9-11).
Carefully look at the photo and identify the primary physical material shown (e.g. Stone/Rock/Granite/Marble, Metal/Steel/Copper/Iron/Brass, Wood, Cotton, Wool, Silk, Glass, Ceramic, PET Plastic, PVC, Bakelite, Nylon, Rubber).
Return ONLY a valid JSON object matching this exact schema with NO markdown ticks or extra text:
{
  "materialName": "Exact material name (e.g. Natural Granite Stone, 100% Cotton Fabric, Stainless Steel, Molded PET Plastic)",
  "family": "Material family (e.g. Igneous Rock, Plant Cellulose, Metallic Alloy, Synthetic Polymer)",
  "category": "Natural" or "Synthetic",
  "microscopicStructure": "1 simple sentence explaining its molecular/particle structure for a 5th grader",
  "confidence": 0.95,
  "funFact": "1 exciting kid-friendly trivia fact about this material",
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
      const prompt = `You are a science physics and chemistry simulator for kids.
Student wants to test:
- Material 1: ${materialA}
- Force / Agent: ${materialB}
- Action: ${action}

Simulate the real physical and chemical outcome based on real materials science for a 5th grader.
Return ONLY valid JSON matching this schema:
{
  "title": "Fun experiment title",
  "hypothesis": "What the student was testing",
  "predictedOutcome": "1-2 clear sentences on what physically happens",
  "physicalReaction": "Molecular explanation in simple 5th-grade terms",
  "pipCommentary": "Friendly encouraging reaction from Pip without robotic noises",
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
   * Explains any highlighted word or science concept for a 5th grader.
   */
  async defineWordWithAI(word: string): Promise<{
    word: string;
    definition: string;
    example: string;
    category: string;
    pronunciation?: string;
  }> {
    try {
      const prompt = `You are a science dictionary for CBSE Class 5 EVS and Science students (age 9-11).
Define the word "${word}" simply in 1 sentence. Give 1 everyday example.
Return ONLY valid JSON matching this schema:
{
  "word": "${word}",
  "definition": "1 clear simple sentence for a 5th grader",
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
      console.warn('Gemini Word Def error:', err);
      return {
        word: word.charAt(0).toUpperCase() + word.slice(1),
        definition: `A term used in science and materials study.`,
        example: `Notice how "${word}" relates to physical matter and natural properties!`,
        category: 'Science Term',
      };
    }
  },
};
