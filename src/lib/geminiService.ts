/**
 * Google Gemini AI Service for PolyQuest Science Academy
 * Uses gemini-2.5-flash with low token consumption, kid-safe guardrails, and offline fallbacks.
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
   * Guides 5th graders Socratically rather than just giving direct answers.
   */
  async askSocraticPip(question: string, contextTopic?: string): Promise<string> {
    try {
      const systemPrompt = `You are Pip, an enthusiastic cartoon robot science mentor for CBSE Class 5 EVS and Science students (age 9-11).
Your tone: Friendly, warm, encouraging, curious, and playful with emojis.
Rules:
1. Keep answers concise (2 to 3 sentences maximum).
2. Do not lecture. Ask a Socratic question or give a fun everyday analogy to make the student think.
3. Current subject context: ${contextTopic || 'Natural vs Synthetic Materials, Polymers, Conductors, Fire Safety'}.
4. Always be 100% safe, educational, and age-appropriate.`;

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
            maxOutputTokens: 200,
            temperature: 0.7,
          },
        }),
      });

      if (!response.ok) throw new Error(`Gemini API Error: ${response.statusText}`);
      const data = await response.json();
      return (
        data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "That's an amazing science question! What do you think happens when we test that material in the lab? 🔬"
      );
    } catch (err) {
      console.warn('Gemini Socratic Pip fallback:', err);
      return "BEEP BOOP! 🤖 What an intriguing question! Think about whether that material came from a living plant/animal or was made by chemists in a lab!";
    }
  },

  /**
   * 🔍 Real-World Camera "Material Detective" (Multimodal Vision)
   * Analyzes an image of an everyday object (shirt tag, bottle, wooden table, wire)
   */
  async detectMaterialFromImage(base64Image: string, mimeType = 'image/jpeg'): Promise<MaterialAnalysisResult> {
    try {
      const prompt = `Analyze this photo of an everyday object for a CBSE Class 5 Science student.
Identify what physical material it is made of (e.g. Cotton, Wool, Silk, Wood, Polyester, Nylon, Acrylic, PET Plastic, PVC, Bakelite, Copper, Iron, Rubber).
Return ONLY a valid JSON object matching this exact TypeScript interface with no markdown formatting:
{
  "materialName": "string",
  "family": "string",
  "category": "Natural" or "Synthetic",
  "microscopicStructure": "1 sentence describing its molecular fibers/polymers",
  "confidence": 0.95,
  "funFact": "1 exciting kid-friendly trivia fact",
  "interactiveChallenge": {
    "question": "1 simple multiple choice question testing its property",
    "options": [
      { "text": "string", "isCorrect": true },
      { "text": "string", "isCorrect": false }
    ],
    "explanation": "1 sentence explanation"
  }
}`;

      // Clean base64 header if present
      const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');

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
            maxOutputTokens: 600,
            temperature: 0.2,
          },
        }),
      });

      if (!response.ok) throw new Error(`Gemini Vision Error: ${response.statusText}`);
      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '{}';
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson) as MaterialAnalysisResult;
    } catch (err) {
      console.warn('Gemini Vision fallback to local analysis:', err);
      // Fallback specimen if camera offline
      return {
        materialName: '100% Natural Cotton Fiber',
        family: 'Plant Cellulose Polymer',
        category: 'Natural',
        microscopicStructure: 'Breathable cellulose hollow fibers with high water absorption capacity.',
        confidence: 0.92,
        funFact: 'Cotton plants have been cultivated in the Indus Valley for over 5,000 years!',
        interactiveChallenge: {
          question: 'If you pour water on this cotton fabric, what will happen?',
          options: [
            { text: 'It will absorb water like a sponge', isCorrect: true },
            { text: 'Water will bead up and roll off without soaking', isCorrect: false },
          ],
          explanation: 'Cotton fibers have tiny natural pores that soak up moisture and sweat!',
        },
      };
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
- Material 2 / Agent: ${materialB}
- Action: ${action}

Simulate the real physical and chemical outcome based on real materials science.
Return ONLY valid JSON matching this schema:
{
  "title": "Fun experiment title",
  "hypothesis": "What the student was testing",
  "predictedOutcome": "1-2 sentences on what physically happens",
  "physicalReaction": "Molecular explanation in simple terms",
  "pipCommentary": "Humorous encouraging reaction from Pip",
  "safetyRating": "Safe at Home 🏡" or "Lab Adult Supervision ⚠️" or "Dangerous Flame/Chemical 🚫",
  "scienceLaw": "The underlying scientific rule"
}`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 400, temperature: 0.4 },
        }),
      });

      if (!response.ok) throw new Error(`Gemini Error: ${response.statusText}`);
      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '{}';
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson) as WhatIfResult;
    } catch (err) {
      console.warn('What-If fallback simulation:', err);
      return {
        title: `${materialA} + ${action}`,
        hypothesis: `Testing what happens when ${materialA} is exposed to ${materialB}.`,
        predictedOutcome: `${materialA} reacts based on its molecular polymer chains!`,
        physicalReaction: `The intermolecular forces determine whether it expands, melts, dissolves, or remains intact.`,
        pipCommentary: `WHEW! Science in action! Notice how the chemical bonds held up under pressure! 🧪✨`,
        safetyRating: 'Safe at Home 🏡',
        scienceLaw: `🧱 MATERIAL dictates ⚡ PROPERTY, which dictates 🎯 USE!`,
      };
    }
  },
};
