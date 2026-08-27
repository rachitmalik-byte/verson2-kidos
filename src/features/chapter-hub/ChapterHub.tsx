import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useParentStore } from '@/stores/parentStore';
import { useProgressStore } from '@/stores/progressStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { missions } from '@/data/missions';
import { Pip } from '@/components/pip/Pip';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { AudioNavBarControls } from '@/components/navigation/AudioNavBarControls';
import {
  RaincoatSyntheticIllustration,
  CottonIllustration,
  NylonIllustration,
  PolyesterIllustration,
  PlasticIllustration,
  RubberIllustration,
  WireIllustration,
  KettleIllustration,
  ParachuteIllustration,
} from '@/components/illustrations/MaterialIllustrations';
import {
  BookOpen,
  Settings,
  Sparkles,
  ArrowRight,
  Lock,
  CheckCircle2,
  Star,
  Trophy,
  Play,
  Flame,
  Sun,
  Layers,
  Compass,
} from 'lucide-react';

const renderMissionIllustration = (missionId: string, className = 'w-12 h-12 md:w-14 md:h-14') => {
  switch (missionId) {
    case 'mission-01':
      return <RaincoatSyntheticIllustration className={className} />;
    case 'mission-02':
      return <CottonIllustration className={className} />;
    case 'mission-03':
      return <NylonIllustration className={className} />;
    case 'mission-04':
      return <Flame className={`${className} text-rose-500`} />;
    case 'mission-05':
      return <Sun className={`${className} text-amber-500`} />;
    case 'mission-06':
      return <PolyesterIllustration className={className} />;
    case 'mission-07':
      return <PlasticIllustration className={className} />;
    case 'mission-08':
      return <WireIllustration className={className} />;
    case 'mission-09':
      return <KettleIllustration className={className} />;
    case 'mission-10':
      return <Layers className={`${className} text-sky-500`} />;
    case 'mission-11':
      return <RubberIllustration className={className} />;
    case 'mission-12':
      return <ParachuteIllustration className={className} />;
    case 'mission-13':
      return <Trophy className={`${className} text-amber-500`} />;
    default:
      return <Sparkles className={`${className} text-amber-500`} />;
  }
};

export const ChapterHub = () => {
  const navigate = useNavigate();
  const child = useParentStore((state) => state.child);
  const completedMissions = useProgressStore((state) => state.completedMissions);
  const discoveries = useDiscoveryStore((state) => state.discoveries);

  const completedCount = completedMissions.length;
  const totalMissions = missions.length;
  const starsCount = completedCount * 3 + discoveries.length * 2;

  const handleLogoClick = () => {
    sounds.pop();
    voiceAssistant.stop();
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-200 via-indigo-50 to-emerald-100 pt-6 md:pt-10 pb-20 md:pb-28 px-3 sm:px-6 md:px-8 font-sans relative overflow-x-hidden flex flex-col justify-between">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 md:gap-8">
        {/* ── Top Game Status Bar (Click Logo to Home + Audio Controls) ── */}
        <header className="w-full bg-white/95 backdrop-blur-md rounded-3xl border-3 border-slate-200 p-4 sm:p-5 md:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo / Player Profile (Click to Go Home) */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-3 sm:gap-4 text-left cursor-pointer group w-full sm:w-auto justify-between sm:justify-start"
            title="Click to return to Home"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 text-white flex items-center justify-center text-xl md:text-3xl font-black shadow-lg border-2 border-white group-hover:scale-105 transition-transform flex-shrink-0">
                {child?.name ? child.name.charAt(0).toUpperCase() : 'P'}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] md:text-[11px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                    POLYQUEST 🔬
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">Grade {child?.grade || '5'}</span>
                </div>
                <h1 className="text-lg md:text-2xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  {child?.name || 'Explorer'}
                </h1>
              </div>
            </div>

            <div className="sm:hidden text-xs font-black text-sky-600 bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-200">
              Home 🏠
            </div>
          </button>

          {/* Action Badges & Audio Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-center w-full sm:w-auto">
            {/* Live SFX and Voice Toggles */}
            <AudioNavBarControls showProfile={false} />

            {/* Star Counter */}
            <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 border-2 border-amber-300 rounded-2xl text-amber-900 font-black text-xs sm:text-sm">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>{starsCount} ⭐</span>
            </div>

            {/* Field Journal */}
            <button
              onClick={() => {
                sounds.pop();
                voiceAssistant.stop();
                navigate('/discovery-book');
              }}
              className="flex items-center gap-1 px-3 py-2 rounded-2xl btn-3d-indigo text-white font-black text-xs cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Journal</span> ({discoveries.length})
            </button>

            {/* Parent Area */}
            <button
              onClick={() => {
                sounds.pop();
                voiceAssistant.stop();
                navigate('/parent/pin');
              }}
              className="p-2 sm:p-2.5 rounded-2xl btn-3d-slate text-slate-700 font-bold cursor-pointer"
              title="Parent Controls & Dashboard"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* ── Featured Chapter Hero Stage ── */}
        <div className="w-full bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 rounded-3xl p-5 sm:p-8 md:p-10 text-white shadow-2xl border-4 border-white/80 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-lg z-10 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Active Chapter Quest
              </span>
              <span className="text-sky-100 text-xs font-bold">Chapter 3</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-2 sm:mb-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
              The World of Synthetic Materials
            </h2>

            <p className="text-sky-100 text-xs sm:text-sm md:text-base font-bold leading-relaxed mb-5 sm:mb-6">
              Step into Pip's science lab! Test raincoats, stretch super-nylon, test flame safety, sort polymers, and discover chemistry!
            </p>

            <button
              onClick={() => {
                sounds.fanfare();
                voiceAssistant.stop();
                navigate('/chapter/3');
              }}
              className="btn-3d-amber text-slate-950 font-black text-base sm:text-lg py-3.5 px-6 sm:px-8 rounded-2xl cursor-pointer inline-flex items-center gap-2"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              <span>{completedCount > 0 ? 'Continue Adventure' : 'Start Chapter Quest!'}</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
            </button>
          </div>

          <div className="flex flex-col items-center z-10 flex-shrink-0">
            <Pip mood="celebrating" size="xl" />
          </div>
        </div>

        {/* ── Gamified Adventure Trail (Board Game Stage) ── */}
        <div className="w-full bg-white rounded-3xl border-4 border-slate-200 p-4 sm:p-6 md:p-10 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 pb-4 border-b-2 border-slate-100 gap-3 text-center sm:text-left">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Chapter 3 Adventure Trail
                </h3>
              </div>
              <p className="text-xs md:text-sm font-bold text-slate-500 mt-0.5">
                Tap your active mission stepping-stone to jump right into the experiment!
              </p>
            </div>

            <div className="text-xs md:text-sm font-black bg-emerald-100 text-emerald-800 px-4 py-2 rounded-2xl border-2 border-emerald-300 shadow-xs">
              {completedCount} of {totalMissions} Missions Complete
            </div>
          </div>

          {/* Stepping Stones Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
            {missions.map((mission, index) => {
              const isCompleted = completedMissions.includes(mission.id);
              const isCurrent = index === 0 ? !isCompleted : completedMissions.includes(missions[index - 1].id) && !isCompleted;
              const isLocked = !isCompleted && !isCurrent;

              return (
                <motion.div
                  key={mission.id}
                  whileHover={!isLocked ? { scale: 1.02, y: -3 } : {}}
                  whileTap={!isLocked ? { scale: 0.98 } : {}}
                  onClick={() => {
                    if (!isLocked) {
                      sounds.pop();
                      voiceAssistant.stop();
                      navigate(`/chapter/3/mission/${mission.number}`);
                    } else {
                      sounds.boing();
                    }
                  }}
                  className={`p-4 sm:p-5 rounded-3xl border-3 transition-all flex items-center gap-3.5 sm:gap-4 relative cursor-pointer ${
                    isCurrent
                      ? 'bg-amber-50/95 border-amber-500 shadow-xl ring-4 ring-amber-300/80 scale-101'
                      : isCompleted
                      ? 'bg-emerald-50/80 border-emerald-300 shadow-md hover:bg-emerald-100/80'
                      : 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                  }`}
                >
                  {/* Stepping Stone Illustration */}
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center p-1.5 flex-shrink-0 shadow-md ${
                      isCurrent
                        ? 'bg-amber-400 border-2 border-amber-600 animate-bounce'
                        : isCompleted
                        ? 'bg-emerald-500 border-2 border-emerald-600'
                        : 'bg-slate-200 border-2 border-slate-300'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-white stroke-[2.5]" />
                    ) : isLocked ? (
                      <Lock className="w-5 h-5 text-slate-400" />
                    ) : (
                      renderMissionIllustration(mission.id, 'w-full h-full')
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                        M{mission.number}
                      </span>
                      {isCurrent && (
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded animate-pulse">
                          Play!
                        </span>
                      )}
                    </div>
                    <h4 className="font-black text-slate-900 text-sm sm:text-base truncate" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      {mission.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs font-bold text-slate-500 truncate">{mission.subtitle}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
