import type { ChatApiRequest, ChatApiResponse, DictionaryApiRequest, DictionaryApiResponse, HealthCheckResponse } from '@/types/api';

/**
 * Smart HTTP Client that automatically detects if the Vercel backend `/api/` is available.
 * If running locally without a backend or if the backend fails, it signals the caller to use client fallback.
 */
class ApiClient {
  private baseUrl = '';
  private backendReachable: boolean | null = null;

  constructor() {
    this.baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  }

  async checkHealth(): Promise<boolean> {
    if (this.backendReachable !== null) return this.backendReachable;
    
    try {
      const res = await fetch(`${this.baseUrl}/api/health`, { method: 'GET' });
      if (res.ok) {
        const data: HealthCheckResponse = await res.json();
        this.backendReachable = data.status === 'ok' && data.hasApiKey;
        return this.backendReachable;
      }
    } catch {
      // Backend not running (e.g., local Vite dev server without API)
    }
    this.backendReachable = false;
    return false;
  }

  async chat(request: ChatApiRequest): Promise<ChatApiResponse> {
    const isBackendAvailable = await this.checkHealth();
    
    if (isBackendAvailable) {
      try {
        const res = await fetch(`${this.baseUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request)
        });
        
        if (res.ok) {
          const data: ChatApiResponse = await res.json();
          return data;
        }
      } catch (err) {
        console.warn('API /api/chat failed, falling back to client-side', err);
      }
    }
    
    // Return a signal to use client-side fallback
    return { success: false, message: '', error: 'BACKEND_UNAVAILABLE', source: 'client-fallback' };
  }

  async dictionary(request: DictionaryApiRequest): Promise<DictionaryApiResponse> {
    const isBackendAvailable = await this.checkHealth();
    if (isBackendAvailable) {
      try {
        const res = await fetch(`${this.baseUrl}/api/dictionary`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request)
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('API /api/dictionary failed', err);
      }
    }
    return { success: false, error: 'BACKEND_UNAVAILABLE' };
  }
}

export const apiClient = new ApiClient();
