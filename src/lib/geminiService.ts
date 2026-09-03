// Backward-compatible facade for existing components
export { geminiService, getApiKey, setApiKey, generateLessonFromPrompt, generateFallbackLessonConfig } from '@/services/aiService';
export type { ScanResult, WhatIfResult, MaterialAnalysisResult, DetectedMaterialPointer, MaterialCategory, ColorStats } from '@/services/aiService';
