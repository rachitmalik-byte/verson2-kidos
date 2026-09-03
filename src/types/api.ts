export interface HealthCheckResponse {
  status: 'ok' | 'error';
  environment: 'development' | 'production';
  timestamp: string;
  version: string;
  hasApiKey: boolean;
}

export interface ChatApiRequest {
  prompt: string;
  context?: Record<string, any>;
  mode?: 'live-pip' | 'mystery-object' | 'what-if' | 'inquiry' | 'general';
}

export interface ChatApiResponse {
  success: boolean;
  message: string;
  error?: string;
  source: 'server' | 'client-fallback' | 'cache';
}

export interface VideoApiRequest {
  topic?: string;
  routePath?: string;
}

export interface VideoApiResponse {
  success: boolean;
  video: any; // Using any for ScienceVideo to avoid circular deps if needed, or define here
  error?: string;
}

export interface DictionaryApiRequest {
  word: string;
}

export interface DictionaryApiResponse {
  success: boolean;
  result?: {
    word: string;
    definition: string;
    example?: string;
    category: string;
    pronunciation?: string;
    source: string;
  };
  error?: string;
}
