import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, Home, AlertTriangle } from 'lucide-react';
import { SparkyMascot } from '@/components/mascot/SparkyMascot';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
    
    // Automatically recover from Vite lazy-loading chunk errors (happens after new Vercel deployments)
    const isChunkLoadError = 
      error?.name === 'ChunkLoadError' || 
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('Importing a module script failed');
      
    if (isChunkLoadError) {
      const hasRetried = window.sessionStorage.getItem('pq-chunk-retry');
      if (!hasRetried) {
        window.sessionStorage.setItem('pq-chunk-retry', 'true');
        window.location.reload();
        return;
      } else {
        // If it failed even after retry, clear the flag and show the error UI
        window.sessionStorage.removeItem('pq-chunk-retry');
      }
    }

    this.setState({ errorInfo });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleReturnHub = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/subjects';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen w-full bg-[#FAF8F5] text-[#262930] flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none font-sans">
          <div className="squircle-card p-6 sm:p-8 shadow-soft-float max-w-lg w-full flex flex-col items-center border border-slate-200/80 bg-white">
            <div className="mb-2">
              <SparkyMascot mood="oops" size={110} animate />
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-[#262930] mb-2 tracking-tight">
              Oops! Little Experiment Glitch
            </h2>
            <p className="text-xs sm:text-sm font-medium text-[#5A6072] mb-5 leading-relaxed max-w-sm">
              Don't worry, Young Scientist! Even famous inventors hit speedbumps. Let's take a deep breath and retry.
            </p>

            {this.state.error && (
              <div className="w-full text-left p-3.5 bg-[#FFF1F2] rounded-2xl border border-[#FECDD3] text-[11px] font-mono text-[#9F1239] mb-5 overflow-x-auto max-h-36">
                <div className="font-bold flex items-center gap-1.5 text-[#BE123C] mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{this.state.error.name}: {this.state.error.message}</span>
                </div>
                {this.state.error.stack && (
                  <pre className="text-[10px] text-[#5A6072] whitespace-pre-wrap">
                    {this.state.error.stack.split('\n').slice(0, 3).join('\n')}
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2.5 w-full">
              <button
                onClick={this.handleRetry}
                className="w-full py-3.5 px-6 pill-btn-primary text-xs font-extrabold flex items-center justify-center gap-2 shadow-soft-pill"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Experiment Lab 🔬</span>
              </button>

              <button
                onClick={this.handleReturnHub}
                className="w-full py-3.5 px-6 pill-btn-secondary text-xs font-bold flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4 text-[#5A6072]" />
                <span>Return to All Subjects 🏠</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
