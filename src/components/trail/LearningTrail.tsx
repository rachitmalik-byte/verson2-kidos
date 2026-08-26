import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { missions } from '@/data/missions';
import { useProgressStore } from '@/stores/progressStore';
import { Check, Lock } from 'lucide-react';

interface LearningTrailProps {
  currentMissionNumber?: number;
}

export const LearningTrail: React.FC<LearningTrailProps> = ({ currentMissionNumber = 1 }) => {
  const navigate = useNavigate();
  const completedMissions = useProgressStore((state) => state.completedMissions);
  const currentMission = useProgressStore((state) => state.currentMission);

  return (
    <aside className="w-full h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-pq-sky">Chapter 3</span>
          <h2 className="text-lg font-bold text-pq-charcoal" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Mission Trail
          </h2>
        </div>
        <button
          onClick={() => navigate('/chapter-hub')}
          className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 text-pq-slate hover:bg-gray-200 transition-colors"
          title="Return to Chapter Hub"
        >
          Hub 🏠
        </button>
      </div>

      {/* Trail List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {missions.map((mission, index) => {
          const isCompleted = completedMissions.includes(mission.id);
          const isCurrent = mission.number === currentMissionNumber;
          const isLocked = !isCompleted && !isCurrent && index > 0 && !completedMissions.includes(missions[index - 1].id);

          return (
            <motion.button
              key={mission.id}
              whileHover={!isLocked ? { scale: 1.01 } : {}}
              whileTap={!isLocked ? { scale: 0.98 } : {}}
              onClick={() => {
                if (!isLocked) {
                  navigate(`/chapter/3/mission/${mission.number}`);
                }
              }}
              disabled={isLocked}
              className={`w-full text-left p-2.5 rounded-xl border-2 transition-all flex items-center gap-3 relative ${
                isCurrent
                  ? 'bg-pq-sky-light/40 border-pq-sky shadow-sm'
                  : isCompleted
                  ? 'bg-pq-sage-light/30 border-pq-sage/40 hover:bg-pq-sage-light/60 cursor-pointer'
                  : isLocked
                  ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
                  : 'bg-white border-gray-200 hover:border-pq-sky/40 cursor-pointer'
              }`}
            >
              {/* Node Icon */}
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-xl flex-shrink-0 ${
                  isCurrent
                    ? 'bg-pq-sky text-white shadow-sm'
                    : isCompleted
                    ? 'bg-pq-sage text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-white stroke-[3]" />
                ) : isLocked ? (
                  <Lock className="w-4 h-4 text-gray-400" />
                ) : (
                  <span>{mission.icon}</span>
                )}
              </div>

              {/* Title & Subtitle */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-pq-slate">
                    M{mission.number}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] uppercase font-extrabold bg-pq-sky text-white px-1.5 py-0.2 rounded">
                      Now
                    </span>
                  )}
                </div>
                <h3
                  className={`text-sm font-bold truncate ${
                    isCurrent
                      ? 'text-pq-sky-dark'
                      : isLocked
                      ? 'text-gray-400'
                      : 'text-pq-charcoal'
                  }`}
                >
                  {mission.title}
                </h3>
              </div>
            </motion.button>
          );
        })}
      </div>
    </aside>
  );
};
