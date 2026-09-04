import React from 'react';
import { useNavigate } from 'react-router-dom';
import { InteractiveChapterVideoLab } from '@/features/chapter-hub/InteractiveChapterVideoLab';
import { MaterialsAnimatedLabBackground } from '@/components/effects/MaterialsAnimatedLabBackground';
import { PersistentAppShell } from '@/components/navigation/PersistentAppShell';
import { ArrowLeft, Tv } from 'lucide-react';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';

export function VideoLabPage() {
  const navigate = useNavigate();

  return (
    <PersistentAppShell activeDestination="map">
      <div className="min-h-screen w-full flex flex-col justify-between pt-2 pb-20 px-3 sm:px-6 md:px-8 font-sans relative overflow-x-hidden select-none text-white">
        <MaterialsAnimatedLabBackground />

        <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 relative z-10">
          {/* Top Sub-Navigation Bar */}
          <div className="flex items-center justify-between world-glass-dock p-3 sm:p-4 rounded-2xl">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sounds.pop();
                  voiceAssistant.stop();
                  navigate('/chapter-hub');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Expedition Hub</span>
              </button>

              <span className="text-xs font-mono font-bold text-cyan-300 bg-blue-500/20 border border-cyan-400/30 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-cyan-400" />
                <span>Interactive Science Video Cinema</span>
              </span>
            </div>
          </div>

          {/* Video Lab Engine */}
          <InteractiveChapterVideoLab />
        </div>
      </div>
    </PersistentAppShell>
  );
}
