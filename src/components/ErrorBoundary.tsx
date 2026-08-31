import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, Home, Sparkles } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorCount: 0,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorCount: 1 };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleReturnHub = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/subjects';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen w-full bg-gradient-to-b from-sky-100 via-amber-50 to-indigo-100 flex flex-col items-center justify-center p-6 text-center select-none font-sans">
          <div className="bg-white p-8 rounded-3xl border-4 border-amber-400 shadow-2xl max-w-md w-full flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl mb-4 shadow-inner">
              🔬✨
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Oops! Little Experiment Glitch
            </h2>
            <p className="text-xs sm:text-sm font-bold text-slate-600 mb-6 leading-relaxed">
              Don't worry, Young Scientist! Let's refresh the experiment lab or return to All Subjects.
            </p>

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
