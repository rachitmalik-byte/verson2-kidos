import React from 'react';
import { useNavigate } from 'react-router-dom';
import { InteractiveChapterVideoLab } from '@/features/chapter-hub/InteractiveChapterVideoLab';
import { AudioNavBarControls } from '@/components/navigation/AudioNavBarControls';
import { MaterialsAnimatedLabBackground } from '@/components/effects/MaterialsAnimatedLabBackground';
import { ArrowLeft, Tv, Sparkles } from 'lucide-react';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';

export function VideoLabPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col justify-between pt-4 sm:pt-6 pb-24 px-3 sm:px-6 md:px-8 font-sans relative overflow-x-hidden select-none">
      <MaterialsAnimatedLabBackground />

      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 relative z-10">
        {/* Top Navbar */}
        <div className="flex items-center justify-between bg-white/90 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl border-2 border-sky-300 shadow-md">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.pop();
                voiceAssistant.stop();
                navigate('/chapter-hub');
              }}
              className="p-2 sm:p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Chapter Hub</span>
            </button>

            <span className="text-xs font-black text-indigo-950 bg-indigo-100 border border-indigo-300 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
              <Tv className="w-3.5 h-3.5 text-indigo-600" />
              <span>Interactive Science Video Lab</span>
            </span>
          </div>

          <AudioNavBarControls />
        </div>

        {/* Video Lab Engine */}
        <InteractiveChapterVideoLab />
      </div>
    </div>
  );
}
