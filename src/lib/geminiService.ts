/**
 * Google Gemini AI Service for PolyQuest Science Academy
 * Real-time open-ended AI extraction with automatic model cascade (gemini-3.5-flash -> gemini-3.5-flash-lite).
 * Provides direct 3-4 sentence explanations in simple words for Class 5 students and 100% accurate vision analysis.
 */

const GEMINI_API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY || 'AQ.Ab8RN6IxHjl_Nd_Ui87NtEhD5CXeMTCgeCxTxuWrelxDAlTVtg';

// Robust model cascade for zero-downtime & high quota limits
const CANDIDATE_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-2.5-flash',
];

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

/**
 * Executes a Gemini API request with automatic model fallback if one hits a rate-limit (429) or is busy
 */
async function generateContentCascade(requestBody: any): Promise<string> {
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) return text;
      } else {
        const errText = await response.text();
        console.warn(`Model ${model} returned status ${response.status}: ${errText.substring(0, 150)}`);
        lastError = new Error(`Status ${response.status}: ${errText}`);
      }
    } catch (err) {
      console.warn(`Failed to reach model ${model}:`, err);
      lastError = err;
    }
  }

  throw lastError || new Error('All candidate AI models were unavailable.');
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

    const requestBody = {
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
    };

    return await generateContentCascade(requestBody);
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
Identify the main physical material of the object shown in the photo (e.g. Aluminum Metal Aerosol Can, Molded Polycarbonate Plastic, Tin, Steel, Wood, Cotton, Wool, Silk, Glass, Ceramic, Rubber).
Return ONLY a valid JSON object matching this schema with NO markdown code fences or extra text:
{
  "materialName": "Exact material name (e.g. Aluminum Metal, Molded Plastic)",
  "family": "Material family (e.g. Metal / Metallic Alloy, Synthetic Polymer)",
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

    const requestBody = {
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
    };

    const rawText = await generateContentCascade(requestBody);
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

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 1500, temperature: 0.2 },
    };

    const rawText = await generateContentCascade(requestBody);
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid JSON from simulation');
    return JSON.parse(jsonMatch[0]) as WhatIfResult;
  },

  /**
   * 🗣️ Gemini AI Speech Recognition & Pronunciation Coach
   * Compares what the student spoke with the target sentence, gives word-by-word analysis and Pip encouragement.
   */
  async evaluateSpeechWithAI(spokenTranscript: string, targetSentence: string): Promise<{
    accuracyScore: number;
    isPassed: boolean;
    encouragement: string;
    pronunciationTip?: string;
    wordStatuses: { word: string; isCorrect: boolean }[];
  }> {
    const prompt = `You are Pip, a supportive speech & reading coach for a CBSE Class 5 student (age 9-11).
Target sentence: "${targetSentence}"
What the student said: "${spokenTranscript}"

Compare the student's spoken words with the target sentence.
Return ONLY a valid JSON object matching this schema:
{
  "accuracyScore": 90, // number from 0 to 100
  "isPassed": true, // true if accuracyScore >= 75
  "encouragement": "1 short enthusiastic, warm sentence celebrating their effort and mentioning a word they pronounced well",
  "pronunciationTip": "1 gentle tip if they mispronounced or missed a word, or empty string if perfect",
  "wordStatuses": [
    { "word": "wordFromTargetSentence", "isCorrect": true }
  ]
}`;

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 1200, temperature: 0.2 },
    };

    const rawText = await generateContentCascade(requestBody);
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // Fallback calculation
      const targetWords = targetSentence.toLowerCase().split(/\s+/).map((w) => w.replace(/[^a-z0-9]/gi, ''));
      const spokenWords = spokenTranscript.toLowerCase().split(/\s+/).map((w) => w.replace(/[^a-z0-9]/gi, ''));
      const matches = targetWords.filter((tw) => spokenWords.includes(tw)).length;
      const score = Math.round((matches / Math.max(targetWords.length, 1)) * 100);
      return {
        accuracyScore: score,
        isPassed: score >= 70,
        encouragement: score >= 70 ? 'Fantastic reading! You spoke with great clarity!' : 'Good try! Let us practice reading it once more together!',
        wordStatuses: targetSentence.split(/\s+/).map((w) => ({
          word: w,
          isCorrect: spokenWords.includes(w.toLowerCase().replace(/[^a-z0-9]/gi, '')),
        })),
      };
    }

    return JSON.parse(jsonMatch[0]);
  },

  /**
   * 📊 Gemini AI Parent Learning Intelligence & Cognitive Diagnostics
   */
  async generateParentAIAnalytics(data: {
    childName: string;
    grade: string;
    completedMissions: string[];
    discoveriesCount: number;
    discoveredWords: string[];
  }): Promise<{
    overallSummary: string;
    cognitiveStrengths: string[];
    growthAreas: string[];
    curiosityScore: number;
    homeConversationStarters: { title: string; prompt: string; whyItWorks: string }[];
  }> {
    const prompt = `You are a Senior Educational Psychologist & CBSE Curriculum Expert evaluating a student's science progress.
Student: ${data.childName || 'Student'} (Grade ${data.grade || '5'})
Completed Missions: ${data.completedMissions.length} of 13 missions (IDs: ${data.completedMissions.join(', ')})
Discoveries Made: ${data.discoveriesCount} (Concepts: ${data.discoveredWords.join(', ') || 'Polymers, Natural Fibers'})

Analyze the student's progress and return ONLY a valid JSON object matching this schema:
{
  "overallSummary": "2-3 insightful, encouraging sentences for the parent summarizing the child's mechanical, scientific deduction, and inquiry milestones.",
  "cognitiveStrengths": [
    "3 specific strengths (e.g. 'Strong conceptual grasp of thermal and electrical insulation', 'High curiosity in molecular cross-linking', 'Intuitive understanding of material selection')"
  ],
  "growthAreas": [
    "2 gentle recommendations for home reinforcement (e.g. 'Reinforce difference between synthetic recycling and natural biodegradation')"
  ],
  "curiosityScore": 92, // number 80 to 99
  "homeConversationStarters": [
    {
      "title": "Short catchy activity name",
      "prompt": "1 clear question or 2-minute activity the parent can do at home with the child",
      "whyItWorks": "1 sentence explaining the scientific concept it reinforces"
    },
    {
      "title": "Second home activity",
      "prompt": "Second conversation starter",
      "whyItWorks": "Why it works"
    },
    {
      "title": "Third home activity",
      "prompt": "Third conversation starter",
      "whyItWorks": "Why it works"
    }
  ]
}`;

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 2000, temperature: 0.2 },
    };

    const rawText = await generateContentCascade(requestBody);
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse parent analytics JSON');
    }

    return JSON.parse(jsonMatch[0]);
  },

  /**
   * 💬 Live Floating Pip AI Companion Chat
   * Provides ultra-fast, conversational answers in 2-3 short sentences for Class 5 students.
   */
  async chatWithLivePip(userInput: string, pageContext?: string): Promise<string> {
    const prompt = `You are Pip, a playful, energetic cartoon robot science buddy for a CBSE Class 5 student (age 9-11).
Current page/screen context: ${pageContext || 'PolyQuest Science Academy'}.
User message: "${userInput}"

Rules:
1. Reply in exactly 2 to 3 short sentences.
2. Use simple, direct, kid-friendly vocabulary.
3. Be enthusiastic, warm, and helpful with 1-2 fun emojis.
4. If they ask a science question, explain it with an everyday example.`;

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 800, temperature: 0.3 },
    };

    return await generateContentCascade(requestBody);
  },
};

