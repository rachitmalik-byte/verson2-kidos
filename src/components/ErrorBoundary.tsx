import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React component tree:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/chapter-hub';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-gradient-to-b from-sky-100 via-amber-50 to-indigo-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-white p-8 rounded-3xl border-4 border-amber-400 shadow-2xl max-w-md w-full flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl mb-4 shadow-inner">
              🔬✨
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Oops! Little Experiment Glitch
            </h2>
            <p className="text-xs sm:text-sm font-bold text-slate-600 mb-6 leading-relaxed">
              Don't worry, Young Scientist! Let's return to the Chapter Hub and keep exploring our materials lab.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Return to Chapter Hub 🏠</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
