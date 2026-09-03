import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, Home, AlertTriangle, Bug } from 'lucide-react';

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
        <div className="min-h-screen w-full bg-gradient-to-b from-sky-100 via-amber-50 to-indigo-100 flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none font-sans">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-4 border-amber-400 shadow-2xl max-w-lg w-full flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl mb-4 shadow-inner">
              🔬✨
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Oops! Little Experiment Glitch
            </h2>
            <p className="text-xs sm:text-sm font-bold text-slate-600 mb-4 leading-relaxed">
              Don't worry, Young Scientist! Let's refresh the experiment lab or return to All Subjects.
            </p>

            {this.state.error && (
              <div className="w-full text-left p-3.5 bg-rose-50 rounded-2xl border border-rose-200 text-[11px] font-mono text-rose-900 mb-4 overflow-x-auto max-h-40">
                <div className="font-bold flex items-center gap-1.5 text-rose-700 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{this.state.error.name}: {this.state.error.message}</span>
                </div>
                {this.state.error.stack && (
                  <pre className="text-[10px] text-slate-500 whitespace-pre-wrap">
                    {this.state.error.stack.split('\n').slice(0, 4).join('\n')}
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2.5 w-full">
              <button
                onClick={this.handleRetry}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-black text-xs rounded-2xl shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Experiment Lab 🔬</span>
              </button>

              <button
                onClick={this.handleReturnHub}
                className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-2xl cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Home className="w-4 h-4 text-indigo-600" />
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
