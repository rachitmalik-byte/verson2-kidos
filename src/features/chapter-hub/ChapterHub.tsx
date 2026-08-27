import React, { useState } from 'react';
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
import { FieldGuideModal } from '@/features/guidebook/FieldGuideModal';
import { FirstTimeTutorialOverlay } from '@/components/tutorial/FirstTimeTutorialOverlay';
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
  ArrowLeft,
  Lock,
  CheckCircle2,
  Star,
  Trophy,
  Play,
  Flame,
  Sun,
  Layers,
  Compass,
  Tv,
  FlaskConical,
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
      return <span className="text-4xl">🧴</span>;
    case 'mission-13':
      return <ParachuteIllustration className={className} />;
    default:
      return <Sparkles className={className} />;
  }
};

export function ChapterHub() {
  const navigate = useNavigate();
  const child = useParentStore((state) => state.child);
  const completedMissions = useProgressStore((state) => state.completedMissions);
  const discoveries = useDiscoveryStore((state) => state.discoveries);
  const hasSeenTutorial = useProgressStore((state) => state.hasSeenTutorial);
  const [showTutorial, setShowTutorial] = useState(!hasSeenTutorial);

  const totalStars = completedMissions.length * 3 + discoveries.length * 2;
  const isAllComplete = completedMissions.length === missions.length;

  const handleMissionClick = (mission: (typeof missions)[0], isUnlocked: boolean) => {
    sounds.pop();
    if (isUnlocked) {
      voiceAssistant.stop();
      if (mission.number <= 4) {
        navigate(`/chapter/3/mission/${mission.number}`);
      } else {
        navigate(`/chapter/3/mission/${mission.number}`);
      }
    } else {
      sounds.boing();
      voiceAssistant.speak(`Complete Mission ${mission.number - 1} first to unlock this hands-on experiment!`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-200 via-indigo-50 to-amber-100 flex flex-col justify-between pt-4 sm:pt-6 pb-24 px-3 sm:px-6 md:px-8 font-sans relative">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
        {/* ── Top Game Navbar ── */}
        <div id="navbar-top-controls" className="flex items-center justify-between bg-white/90 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl border-2 border-slate-200 shadow-md">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.pop();
                voiceAssistant.stop();
                navigate('/subjects');
              }}
              className="px-3 py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center gap-1.5 border border-slate-300 cursor-pointer transition-all active:scale-95"
              title="Return to Subjects"
            >
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Subjects</span>
            </button>

            <div className="flex items-center gap-2 ml-1">
              <FlaskConical className="w-5 h-5 text-amber-500" />
              <span className="font-black text-sm text-slate-800 hidden md:inline">
                Chemistry & Materials
              </span>
            </div>
          </div>

          <AudioNavBarControls showProfile={true} />
        </div>

        {/* ── Chapter Hero Banner with Pre-Lesson Study Hub ── */}
        <div id="chapter-hero-banner" className="bg-white/95 rounded-3xl p-6 md:p-8 border-4 border-amber-400 shadow-xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
          <Pip mood="celebrating" size="lg" />

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              <span className="px-3 py-1 bg-amber-100 border border-amber-300 text-amber-900 rounded-full text-xs font-black uppercase tracking-wider">
                Chapter 3 • Active Curriculum
              </span>
              <span className="px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{totalStars} Science Stars</span>
              </span>
            </div>

            <h1
              className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              The World of Synthetic Materials 🧪
            </h1>
            <p className="text-xs md:text-sm font-bold text-slate-600 mt-1 max-w-xl">
              Welcome back, {child?.name || 'Young Scientist'}! Prepare with the illustrated stories & video lessons below, then master all 13 interactive lab missions!
            </p>

            {/* Quick Actions: Field Storybook & Video Lab & Journal */}
            <div className="flex flex-wrap gap-2.5 mt-4 justify-center md:justify-start">
              <button
                id="chapter-intro-btn"
                onClick={() => {
                  sounds.pop();
                  navigate('/chapter/3');
                }}
                className="px-4 py-2 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Chapter Intro 🎬</span>
              </button>

              <button
                id="chapter-journal-btn"
                onClick={() => {
                  sounds.pop();
                  navigate('/discovery-book');
                }}
                className="px-4 py-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 text-indigo-900 font-black text-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Field Specimen Journal ({discoveries.length})</span>
              </button>

              <button
                id="chapter-mystery-quiz-btn"
                onClick={() => {
                  sounds.pop();
                  navigate('/mystery-lab');
                }}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                <span>Mystery Specimen Quiz Lab 🔬 (+25🪙)</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Chapters Roadmap Preview (Multi-Chapter Structure) ── */}
        <div id="chapter-modules-grid" className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">
            Chemistry Course Modules & Chapters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { num: 'Ch 1', title: 'States of Matter: Solids & Gases', status: 'Coming Soon', active: false },
              { num: 'Ch 2', title: 'Pure Substances & Mixtures', status: 'Coming Soon', active: false },
              { num: 'Ch 3', title: 'Synthetic Materials & Polymers', status: 'ACTIVE (13 Missions)', active: true },
              { num: 'Ch 4', title: 'Acids, Bases & Neutralization', status: 'Coming Soon', active: false },
            ].map((ch) => (
              <div
                key={ch.num}
                className={`p-3.5 rounded-2xl border-2 flex flex-col justify-between ${
                  ch.active
                    ? 'bg-amber-50 border-amber-400 shadow-md ring-2 ring-amber-300'
                    : 'bg-white/80 border-slate-200 opacity-60'
                }`}
              >
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    {ch.num}
                  </span>
                  <span className="font-extrabold text-xs text-slate-800 leading-tight block mt-0.5">
                    {ch.title}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider mt-2.5 px-2 py-0.5 rounded-md w-fit ${
                    ch.active ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {ch.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── 13 Interactive Mission Stepping-Stone Trail ── */}
        <div id="chapter-missions-trail" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base md:text-lg font-black text-slate-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Chapter 3 Interactive Mission Trail 🗺️
            </h3>
            <span className="text-xs font-black text-slate-500">
              {completedMissions.length} / {missions.length} Missions Completed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {missions.map((m, index) => {
              const isCompleted = completedMissions.includes(m.id);
              const isUnlocked = index === 0 || completedMissions.includes(missions[index - 1]?.id);

              return (
                <motion.div
                  key={m.id}
                  id={m.id === 'mission-01' ? 'chapter-mission-1-card' : undefined}
                  whileHover={isUnlocked ? { scale: 1.03, y: -3 } : {}}
                  whileTap={isUnlocked ? { scale: 0.97 } : {}}
                  onClick={() => handleMissionClick(m, isUnlocked)}
                  className={`p-5 rounded-3xl border-3 transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden bg-white ${
                    isCompleted
                      ? 'border-emerald-400 shadow-md bg-emerald-50/40'
                      : isUnlocked
                      ? 'border-amber-400 shadow-lg ring-4 ring-amber-300/40'
                      : 'border-slate-200 opacity-60 bg-slate-50 cursor-not-allowed'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-xs">
                      {renderMissionIllustration(m.id)}
                    </div>

                    {isCompleted ? (
                      <div className="flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-black">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Done ⭐⭐⭐</span>
                      </div>
                    ) : isUnlocked ? (
                      <span className="px-2.5 py-1 bg-amber-400 text-slate-950 rounded-full text-xs font-black">
                        Ready!
                      </span>
                    ) : (
                      <div className="p-1.5 bg-slate-200 rounded-xl text-slate-500">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  {/* Mission Title & Topic */}
                  <div className="space-y-1 mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Mission {m.number}
                    </span>
                    <h4
                      className="text-base font-black text-slate-900 leading-snug"
                      style={{ fontFamily: 'Nunito, sans-serif' }}
                    >
                      {m.title}
                    </h4>
                    <p className="text-xs font-bold text-slate-500 leading-snug">
                      {m.subtitle}
                    </p>
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-3 border-t-2 border-slate-100 flex items-center justify-between">
                    <div className="flex gap-1">
                      {m.concepts.slice(0, 2).map((c) => (
                        <span key={c} className="text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                          {c}
                        </span>
                      ))}
                    </div>

                    <div
                      className={`p-1.5 rounded-xl font-black ${
                        isUnlocked ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* First-Time Guided Tutorial Tour */}
      <FirstTimeTutorialOverlay isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
    </div>
  );
}
