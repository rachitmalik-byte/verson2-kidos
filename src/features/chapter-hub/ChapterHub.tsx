import React, { useState, useEffect } from 'react';
import { InteractiveChapterVideoLab } from './InteractiveChapterVideoLab';
import { MaterialsAnimatedLabBackground } from '@/components/effects/MaterialsAnimatedLabBackground';
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
import { FirstTimeTutorialOverlay } from '@/components/tutorial/FirstTimeTutorialOverlay';
import { GamifiedAdventureMap } from '@/components/trail/GamifiedAdventureMap';
import {
  BookOpen,
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
  FlaskConical, GraduationCap,
  Zap,
  RotateCcw,
  Map,
  Grid,
} from 'lucide-react';

// Real Studio Macro Educational Photography
import raincoatWaterproofImg from '@/assets/images/raincoat/polyester_raincoat_waterproof.jpg';
import cottonBollSpecimenImg from '@/assets/images/specimens/raw_cotton_boll.jpg';
import nylonRopeHeavyImg from '@/assets/images/experiments/nylon_rope_heavy_weight.jpg';
import polyesterFabricRollImg from '@/assets/images/specimens/polyester_fabric_roll.jpg';
import flameMeltingBeadImg from '@/assets/images/experiments/polyester_melting_bead.jpg';
import cottonSwatchCleanImg from '@/assets/images/experiments/cotton_swatch_clean.jpg';
import plasticMoldingBottleImg from '@/assets/images/experiments/pet_water_bottle_molding.jpg';
import circuitWireLightbulbImg from '@/assets/images/wire/lightbulb_glowing_bright.jpg';
import kettleBoilingSteamImg from '@/assets/images/experiments/boiling_tea_kettle_steam.jpg';
import plasticDecay100YrsImg from '@/assets/images/decay/plastic_100yrs.jpg';
import raceCarTireTreadImg from '@/assets/images/experiments/vulcanized_car_tire_tread.jpg';
import epoxyAdhesiveSealantImg from '@/assets/images/experiments/epoxy_resin_adhesive_glue.jpg';
import parachuteCanopyJumpImg from '@/assets/images/experiments/parachute_canopy_jump.jpg';


import { IntegratedGuidebook } from './IntegratedGuidebook';
import { DailyCuriosityQuest } from '@/components/gamification/DailyCuriosityQuest';
import { SpacedRecallModal } from '@/components/recall/SpacedRecallModal';
import { useSpacedRecallStore } from '@/stores/spacedRecallStore';

const missionThumbnails: Record<string, string> = {
  'mission-01': raincoatWaterproofImg,
  'mission-02': cottonBollSpecimenImg,
  'mission-03': nylonRopeHeavyImg,
  'mission-04': polyesterFabricRollImg,
  'mission-05': flameMeltingBeadImg,
  'mission-06': cottonSwatchCleanImg,
  'mission-07': plasticMoldingBottleImg,
  'mission-08': circuitWireLightbulbImg,
  'mission-09': kettleBoilingSteamImg,
  'mission-10': plasticDecay100YrsImg,
  'mission-11': raceCarTireTreadImg,
  'mission-12': epoxyAdhesiveSealantImg,
  'mission-13': parachuteCanopyJumpImg,
};

export function ChapterHub() {
  const navigate = useNavigate();
  const child = useParentStore((state) => state.child);
  const completedMissions = useProgressStore((state) => state.completedMissions);
  const discoveries = useDiscoveryStore((state) => state.discoveries);
  const hasSeenTutorial = useProgressStore((state) => state.hasSeenTutorial);
  const [showTutorial, setShowTutorial] = useState(!hasSeenTutorial);
  const [activeTab, setActiveTab] = useState<'missions' | 'video' | 'guidebook'>('missions');
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('grid');
  const [showRecallModal, setShowRecallModal] = useState(false);
  const shouldPromptRecall = useSpacedRecallStore((s) => s.shouldPromptRecall);

  useEffect(() => {
    if (completedMissions.length > 0 && shouldPromptRecall()) {
      const timer = setTimeout(() => setShowRecallModal(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [completedMissions.length]);

  const totalStars = completedMissions.length * 3 + discoveries.length * 2;
  const isAllComplete = completedMissions.length === missions.length;
  const progressPercent = Math.round((completedMissions.length / missions.length) * 100);

  const handleMissionClick = (mission: (typeof missions)[0], isUnlocked: boolean) => {
    sounds.pop();
    if (isUnlocked) {
      voiceAssistant.stop();
      navigate(`/chapter/3/mission/${mission.number}`);
    } else {
      sounds.boing();
      voiceAssistant.speak(`Complete Mission ${mission.number - 1} first to unlock this hands-on experiment!`);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between pt-4 sm:pt-6 pb-24 px-3 sm:px-6 md:px-8 font-sans relative overflow-x-hidden">
      <MaterialsAnimatedLabBackground />
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
        {/* ── Top Game Navbar ── */}
        <div id="navbar-top-controls" className="flex items-center justify-between bg-white/90 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl border-2 border-slate-200 shadow-md">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.pop();
                voiceAssistant.stop();
                navigate('/subjects');
              }}
              className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center gap-1.5 border border-slate-300 cursor-pointer transition-all active:scale-95 shadow-xs"
              title="Return to Subjects"
            >
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Subjects</span>
            </button>

            <div className="flex items-center gap-2 ml-1 shrink-0">
              <FlaskConical className="w-5 h-5 text-amber-500 shrink-0" />
              <span className="font-black text-xs sm:text-sm text-slate-800 whitespace-nowrap">
                Theme 6: Materials Science
              </span>
            </div>

            <button
              onClick={() => {
                sounds.pop();
                voiceAssistant.stop();
                navigate('/teacher-studio');
              }}
              className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 font-black text-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-xs ml-2"
              title="Open Teacher Studio"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Teacher Studio</span>
            </button>
          </div>

          <AudioNavBarControls showProfile={true} />
        </div>

        {/* ── Compact Chapter Hero Banner (All Elements Preserved, Tightly Formatted) ── */}
        <div id="chapter-hero-banner" className="bg-white/95 rounded-3xl p-4 sm:p-6 border-4 border-amber-400 shadow-xl flex flex-col md:flex-row items-center gap-5 relative overflow-hidden font-sans">
          {/* Pip Mascot in Compact Size */}
          <div className="relative shrink-0 flex items-center justify-center">
            <Pip mood={isAllComplete ? 'celebrating' : 'idle'} size="sm" />
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 p-1 rounded-full shadow-md border border-white"
            >
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            </motion.div>
          </div>

          {/* Banner Text & All 6 Actions */}
          <div className="flex-1 text-center md:text-left">
            {/* Badges Row */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 mb-1.5">
              <span className="px-2.5 py-0.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-full text-[11px] font-black uppercase tracking-wider">
                CBSE Class 5 EVS • Chapter 3
              </span>
              <span className="px-2.5 py-0.5 bg-amber-100 border border-amber-300 text-amber-900 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                <span>{totalStars} Science Stars</span>
              </span>
              <span className="px-2.5 py-0.5 bg-sky-100 border border-sky-300 text-sky-900 rounded-full text-[11px] font-black uppercase tracking-wider">
                {progressPercent}% Mastered
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              The World of Natural & Synthetic Materials 🧪✨
            </h1>
            <p className="text-xs font-bold text-slate-600 mt-0.5 max-w-2xl">
              Welcome back, {child?.name || 'Aarav'} (Grade 5)! Explore Class 5 hands-on science missions with real materials, interactive simulations, and speech challenges!
            </p>

            {/* Progress Bar */}
            <div className="w-full max-w-md mt-2 bg-slate-100 rounded-full h-2.5 p-0.5 border border-slate-300 shadow-inner mx-auto md:mx-0">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-500 h-full rounded-full shadow-xs"
              />
            </div>

            {/* All 6 Action Buttons (Compact & Organized) */}
            <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
              <button
                id="chapter-story-intro-btn"
                onClick={() => {
                  sounds.pop();
                  voiceAssistant.stop();
                  navigate('/intro/materials');
                }}
                className="font-black text-xs py-2 px-3.5 rounded-xl shadow-xs bg-gradient-to-r from-sky-500 to-indigo-600 text-white flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all border border-sky-400"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>📖 Play Chapter Story Intro</span>
              </button>

              <button
                id="tab-missions-btn"
                onClick={() => {
                  sounds.pop();
                  voiceAssistant.stop();
                  setActiveTab('missions');
                }}
                className={`font-black text-xs py-2 px-3.5 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all ${
                  activeTab === 'missions'
                    ? 'bg-amber-400 border border-amber-600 text-slate-950 font-black'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-amber-700" />
                <span>13 Hands-on Missions 🗺️</span>
              </button>

              <button
                id="tab-video-btn"
                onClick={() => {
                  sounds.pop();
                  voiceAssistant.stop();
                  setActiveTab('video');
                }}
                className={`font-black text-xs py-2 px-3.5 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all ${
                  activeTab === 'video'
                    ? 'bg-sky-500 border border-sky-700 text-white'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Video Lab 🎬</span>
              </button>

              <button
                id="tab-guidebook-btn"
                onClick={() => {
                  sounds.pop();
                  voiceAssistant.stop();
                  setActiveTab('guidebook');
                }}
                className={`font-black text-xs py-2 px-3.5 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all ${
                  activeTab === 'guidebook'
                    ? 'bg-indigo-600 border border-indigo-800 text-white'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Science Guidebook 📖</span>
              </button>

              <button
                id="chapter-mystery-quiz-btn"
                onClick={() => {
                  sounds.pop();
                  voiceAssistant.stop();
                  navigate('/mystery-lab');
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all border border-amber-500"
              >
                <Sparkles className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                <span>Mystery Quiz Lab 🔬 (+25🪙)</span>
              </button>

              <button
                id="chapter-journal-btn"
                onClick={() => {
                  sounds.pop();
                  voiceAssistant.stop();
                  navigate('/discovery-book');
                }}
                className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 font-black text-xs flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs transition-all"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Field Journal ({discoveries.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Dynamic Tab Content View ── */}
        {activeTab === 'video' && <InteractiveChapterVideoLab />}

        {activeTab === 'guidebook' && <IntegratedGuidebook />}

        {activeTab === 'missions' && (
          <>
            {/* First-Time Start Banner (shown if no missions completed yet) */}
            {completedMissions.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-2xl p-4 sm:p-5 border-2 border-amber-600 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl shrink-0">🔬</span>
                  <div>
                    <h3 className="font-black text-slate-950 text-sm sm:text-base" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      Ready to begin your Science Journey?
                    </h3>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">
                      Start with <strong>Mission 1: The Raincoat Mystery</strong> below to unlock the rest! 🗺️
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sounds.pop();
                    voiceAssistant.stop();
                    navigate('/chapter/3/mission/1');
                  }}
                  className="shrink-0 px-5 py-2.5 bg-slate-950 text-amber-400 font-black text-xs sm:text-sm rounded-xl flex items-center gap-1.5 cursor-pointer hover:bg-slate-800 transition-all active:scale-95 shadow-md"
                >
                  <span>Start Mission 1</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </motion.div>
            )}

            {/* ── Daily Curiosity Quest Riddle Widget ── */}
            <DailyCuriosityQuest />

            {/* ── Winding Adventure Map vs Grid View Controls ── */}
            <div className="flex items-center justify-between bg-white/90 p-3 rounded-2xl border-2 border-slate-200 shadow-sm flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 leading-none" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Chapter 3 Adventure Level Road 🗺️
                  </h3>
                  <span className="text-[11px] font-bold text-slate-500">
                    {completedMissions.length} of {missions.length} Missions Completed
                  </span>
                </div>
              </div>

              {/* View Switcher Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-300">
                <button
                  onClick={() => {
                    sounds.pop();
                    setViewMode('map');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1 cursor-pointer transition-all ${
                    viewMode === 'map'
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>Adventure Road Map</span>
                </button>
                <button
                  onClick={() => {
                    sounds.pop();
                    setViewMode('grid');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1 cursor-pointer transition-all ${
                    viewMode === 'grid'
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>Specimen Cards</span>
                </button>
              </div>
            </div>

            {/* ── View Mode: Winding Adventure Map (Reference Design) ── */}
            {viewMode === 'map' && (
              <div id="chapter-adventure-road-map" className="w-full flex justify-center">
                <GamifiedAdventureMap />
              </div>
            )}

            {/* ── View Mode: Specimen Grid Cards ── */}
            {viewMode === 'grid' && (
              <div id="chapter-missions-trail" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {missions.map((m, index) => {
                    const isCompleted = completedMissions.includes(m.id);
                    const isUnlocked = index === 0 || completedMissions.includes(missions[index - 1]?.id);
                    const isNextMission = !isCompleted && isUnlocked && index === completedMissions.length;
                    const thumbnail = missionThumbnails[m.id] || raincoatWaterproofImg;

                    return (
                      <motion.div
                        key={m.id}
                        whileHover={isUnlocked ? { scale: 1.025, y: -4 } : {}}
                        whileTap={isUnlocked ? { scale: 0.98 } : {}}
                        onClick={() => handleMissionClick(m, isUnlocked)}
                        className={`rounded-3xl border-3 transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden bg-white shadow-md ${
                          isCompleted
                            ? 'border-emerald-400 hover:shadow-emerald-100/60'
                            : isNextMission
                            ? 'border-amber-500 ring-4 ring-amber-400/70 shadow-lg shadow-amber-200/50'
                            : isUnlocked
                            ? 'border-amber-300 ring-2 ring-amber-200/40 hover:shadow-amber-100'
                            : 'border-slate-200 opacity-60 bg-slate-50 cursor-not-allowed'
                        }`}
                      >
                        {/* Visual Image Banner Header */}
                        <div className="relative w-full h-36 md:h-40 overflow-hidden bg-slate-900">
                          <img
                            src={thumbnail}
                            alt={m.title}
                            className={`w-full h-full object-cover transition-transform duration-500 ${
                              isUnlocked ? 'hover:scale-105' : 'grayscale contrast-75'
                            }`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                          {/* Top Overlay Badges */}
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                            <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-amber-300 border border-amber-400/40 rounded-full text-[10px] font-black tracking-wider uppercase shadow-xs">
                              Mission {m.number}
                            </span>

                            {isCompleted ? (
                              <span className="flex items-center gap-1 bg-emerald-500 text-white px-2.5 py-1 rounded-full text-[10px] font-black shadow-md">
                                <CheckCircle2 className="w-3 h-3 text-white" />
                                <span>Done ⭐⭐⭐</span>
                              </span>
                            ) : isNextMission ? (
                              <span className="flex items-center gap-1 bg-amber-400 text-slate-950 px-2.5 py-1 rounded-full text-[10px] font-black shadow-md animate-pulse">
                                <Zap className="w-3 h-3 fill-slate-950" />
                                <span>Start Here! 👈</span>
                              </span>
                            ) : isUnlocked ? (
                              <span className="flex items-center gap-1 bg-amber-200 text-amber-950 px-2.5 py-1 rounded-full text-[10px] font-black shadow-md">
                                <span>Unlocked</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 bg-slate-800/90 text-slate-300 px-2.5 py-1 rounded-full text-[10px] font-black shadow-md">
                                <Lock className="w-3 h-3" />
                                <span>Locked</span>
                              </span>
                            )}
                          </div>

                          {/* Bottom Title on Image */}
                          <div className="absolute bottom-2.5 left-3 right-3 flex items-center gap-2">
                            <span className="text-2xl filter drop-shadow-md">{m.icon}</span>
                            <h4
                              className="text-base md:text-lg font-black text-white leading-tight tracking-tight filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] truncate"
                              style={{ fontFamily: 'Nunito, sans-serif' }}
                            >
                              {m.title}
                            </h4>
                          </div>
                        </div>

                        {/* Card Content Body */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-600 line-clamp-2 leading-relaxed mb-3">
                              {m.subtitle}
                            </p>

                            {/* Concept Tags */}
                            <div className="flex flex-wrap gap-1 mb-3">
                              {m.concepts.slice(0, 3).map((c) => (
                                <span
                                  key={c}
                                  className="text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                                >
                                  #{c}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Footer Action Button */}
                          <div className="pt-2.5 border-t border-slate-100">
                            {isCompleted ? (
                              <div className="w-full py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-black text-xs flex items-center justify-between">
                                <span className="flex items-center gap-1.5">
                                  <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                                  Replay Lab
                                </span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </div>
                            ) : isUnlocked ? (
                              <div className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black text-xs flex items-center justify-between shadow-xs">
                                <span>Start Experiment 🔬</span>
                                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            ) : (
                              <div className="w-full py-2 px-3 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs flex items-center justify-between">
                                <span>Locked</span>
                                <Lock className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* First-Time Guided Tutorial Tour */}
      <FirstTimeTutorialOverlay isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
    </div>
  );
}
