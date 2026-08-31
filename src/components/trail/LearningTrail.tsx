import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { missions } from '@/data/missions';
import { useProgressStore } from '@/stores/progressStore';
import { Check, Lock, Star, Sparkles, Map } from 'lucide-react';
import { sounds } from '@/lib/sounds';

interface LearningTrailProps {
  currentMissionNumber?: number;
}

export const LearningTrail: React.FC<LearningTrailProps> = ({ currentMissionNumber = 1 }) => {
  const navigate = useNavigate();
  const completedMissions = useProgressStore((state) => state.completedMissions);

  return (
    <aside className="w-full h-full flex flex-col bg-gradient-to-b from-amber-50/80 via-white to-slate-50 overflow-hidden border-r-2 border-amber-200 shadow-sm">
      {/* Header */}
      <div className="p-3.5 sm:p-4 border-b-2 border-amber-200 bg-white/90 backdrop-blur-sm flex items-center justify-between shrink-0">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
            Chapter 3 • Level Road
          </span>
          <h2 className="text-base font-black text-slate-900 mt-0.5" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Mission Map 🗺️
          </h2>
        </div>
        <button
          onClick={() => {
            sounds.pop();
            navigate('/chapter-hub');
          }}
          className="text-xs font-black px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-500 transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1"
          title="Return to Chapter Map"
        >
          <Map className="w-3.5 h-3.5" />
          <span>Map</span>
        </button>
      </div>

      {/* Mini Adventure Trail List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {missions.map((mission, index) => {
          const isCompleted = completedMissions.includes(mission.id);
          const isCurrent = mission.number === currentMissionNumber;
          const isLocked = !isCompleted && !isCurrent && index > 0 && !completedMissions.includes(missions[index - 1].id);

          return (
            <motion.button
              key={mission.id}
              whileHover={!isLocked ? { scale: 1.02, x: 2 } : {}}
              whileTap={!isLocked ? { scale: 0.97 } : {}}
              onClick={() => {
                sounds.pop();
                if (!isLocked) {
                  navigate(`/chapter/3/mission/${mission.number}`);
                }
              }}
              disabled={isLocked}
              className={`w-full text-left p-2.5 rounded-2xl border-2 transition-all flex items-center gap-3 relative ${
                isCurrent
                  ? 'bg-amber-100/90 border-amber-400 shadow-md ring-2 ring-amber-300'
                  : isCompleted
                  ? 'bg-emerald-50/80 border-emerald-300 hover:bg-emerald-100/80 cursor-pointer shadow-xs'
                  : isLocked
                  ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                  : 'bg-white border-slate-200 hover:border-amber-300 cursor-pointer shadow-xs'
              }`}
            >
              {/* 3D Stepping Stone Disc Node */}
              <div
                className={`w-10 h-10 rounded-full flex flex-col items-center justify-center text-xs font-black shrink-0 shadow-md border-2 transition-transform ${
                  isCurrent
                    ? 'bg-gradient-to-b from-amber-300 to-orange-500 text-slate-950 border-white ring-2 ring-amber-400 scale-105 animate-pulse'
                    : isCompleted
                    ? 'bg-gradient-to-b from-emerald-400 to-teal-600 text-white border-emerald-200'
                    : 'bg-slate-200 text-slate-400 border-slate-300'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white stroke-[3]" />
                ) : isLocked ? (
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <span>{mission.number}</span>
                )}
              </div>

              {/* Title & Stars */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Level {mission.number}
                  </span>
                  {isCompleted && (
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                    </div>
                  )}
                  {isCurrent && (
                    <span className="text-[9px] uppercase font-black bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-md shadow-xs">
                      Active
                    </span>
                  )}
                </div>
                <h4
                  className={`text-xs font-black truncate mt-0.5 ${
                    isCurrent
                      ? 'text-amber-950 font-black'
                      : isLocked
                      ? 'text-slate-400'
                      : 'text-slate-800'
                  }`}
                >
                  {mission.icon} {mission.title}
                </h4>
              </div>
            </motion.button>
          );
        })}
      </div>
    </aside>
  );
};
