/**
 * Google Gemini AI Service for PolyQuest Science Academy
 * Real-time open-ended AI extraction with gemini-2.5-flash
 * Provides direct 3-4 sentence explanations in simple words for Class 5 students.
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
  hasApiKey(): boolean {
    return Boolean(GEMINI_API_KEY && GEMINI_API_KEY.length > 10);
  },

  /**
   * 🎙️ Live Open-Ended AI Science Mentor (Real-Time Extraction)
   * Answers any science question in 3 to 4 short, simple sentences with everyday words.
   */
  async askSocraticPip(question: string, contextTopic?: string): Promise<string> {
    const systemPrompt = `You are Pip, a friendly cartoon science mentor for a CBSE Class 5 student (age 9-11).
Rules:
1. Answer the student's question directly in exactly 3 to 4 short, simple sentences.
2. Use very simple, easy-to-understand everyday words that a 9-10 year old can easily read.
3. No filler greetings like "Hello there!" or robot sounds. Start directly with the clear explanation.
4. Include 1-2 fun emojis.
5. Context: ${contextTopic || 'CBSE Class 5 EVS & Science'}.`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nQuestion: "${question}"` }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.2,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API Error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!reply) throw new Error('No reply from Gemini AI');
    return reply;
  },

  /**
   * 🔍 Real-World Camera "Material Detective" (Multimodal Vision)
   */
  async detectMaterialFromImage(base64Image: string, customMimeType?: string): Promise<MaterialAnalysisResult> {
    let mimeType = customMimeType || 'image/jpeg';
    const mimeMatch = base64Image.match(/^data:([a-zA-Z0-9/+-]+);base64,/);
    if (mimeMatch) {
      mimeType = mimeMatch[1];
    }

    const cleanBase64 = base64Image.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '').trim();

    const prompt = `You are an expert materials scientist analyzing a photo for a CBSE Class 5 Science student (age 9-11).
Identify the main physical material of the object shown in the photo (e.g. Molded Plastic/Polycarbonate/ABS, Silicone, Stone/Rock/Granite, Metal/Steel/Copper/Aluminum, Wood, Cotton, Wool, Silk, Glass, Ceramic, Rubber).
Return ONLY a valid JSON object matching this schema with NO extra text:
{
  "materialName": "Exact material name (e.g. Molded Polycarbonate Plastic, Natural Stone, Stainless Steel)",
  "family": "Material family (e.g. Synthetic Polymer, Igneous Rock, Metallic Alloy, Natural Cellulose)",
  "category": "Natural" or "Synthetic",
  "microscopicStructure": "1 simple sentence explaining its molecular structure in easy words for a 5th grader",
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
    
    // Robust regex extraction of JSON object
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse valid JSON from AI Vision response');
    }
    return JSON.parse(jsonMatch[0]) as MaterialAnalysisResult;
  },

  /**
   * 🧪 "What If?" Science Sandbox Simulation Generator
   */
  async simulateWhatIfExperiment(materialA: string, materialB: string, action: string): Promise<WhatIfResult> {
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
  "pipCommentary": "Friendly encouraging reaction from Pip in 1-2 short sentences",
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
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid JSON from simulation');
    return JSON.parse(jsonMatch[0]) as WhatIfResult;
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
    const prompt = `Define "${word}" simply in 1 short sentence for a 5th grader. Give 1 everyday example.
Return ONLY valid JSON matching this schema:
{
  "word": "${word}",
  "definition": "1 clear simple sentence in easy words",
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
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid JSON from dictionary');
    return JSON.parse(jsonMatch[0]);
  },
};
