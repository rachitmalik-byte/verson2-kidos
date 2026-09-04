import React, { useState, useEffect } from 'react';
import { InteractiveChapterVideoLab } from './InteractiveChapterVideoLab';
import { MaterialsAnimatedLabBackground } from '@/components/effects/MaterialsAnimatedLabBackground';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProgressStore } from '@/stores/progressStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { missions } from '@/data/missions';
import { SparkyMascot } from '@/components/mascot/SparkyMascot';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { FirstTimeTutorialOverlay } from '@/components/tutorial/FirstTimeTutorialOverlay';
import { GamifiedAdventureMap } from '@/components/trail/GamifiedAdventureMap';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Lock,
  CheckCircle2,
  Play,
  Compass,
  GraduationCap,
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

import { PersistentAppShell } from '@/components/navigation/PersistentAppShell';

export function ChapterHub() {
  const navigate = useNavigate();
  const completedMissions = useProgressStore((state) => state.completedMissions);
  const discoveries = useDiscoveryStore((state) => state.discoveries);
  const hasSeenTutorial = useProgressStore((state) => state.hasSeenTutorial);
  const [showTutorial, setShowTutorial] = useState(!hasSeenTutorial);
  const [activeTab, setActiveTab] = useState<'map' | 'missions' | 'video' | 'guidebook'>('map');
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('map');
  const [showRecallModal, setShowRecallModal] = useState(false);
  const shouldPromptRecall = useSpacedRecallStore((s) => s.shouldPromptRecall);

  useEffect(() => {
    if (completedMissions.length > 0 && shouldPromptRecall()) {
      const timer = setTimeout(() => setShowRecallModal(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [completedMissions.length]);

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
    <PersistentAppShell activeDestination="map">
      <div className="min-h-screen w-full bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between pt-4 sm:pt-6 pb-20 px-4 sm:px-6 md:px-8 font-sans relative overflow-x-hidden">
        <MaterialsAnimatedLabBackground />
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 relative z-10">
          {/* ── Expedition Header Bar ── */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  sounds.pop();
                  voiceAssistant.stop();
                  navigate('/subjects');
                }}
                className="edtech-btn-secondary px-3 py-1.5 text-xs flex items-center gap-1.5"
                title="Return to Subjects"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Subjects</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-mono font-bold border border-teal-200/70">
                  THEME 6
                </span>
                <span className="font-heading font-bold text-sm sm:text-base text-slate-900">
                  Materials Science & Inventions
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sounds.pop();
                  voiceAssistant.stop();
                  navigate('/teacher-studio');
                }}
                className="edtech-btn-secondary px-3 py-1.5 text-xs flex items-center gap-1 text-slate-600"
                title="Open Teacher Studio"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Teacher Studio</span>
              </button>
            </div>
          </div>

        {/* ── Cinematic Materials Lab World Hero Stage ── */}
        <div id="chapter-hero-banner" className="portal-hero p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950 border border-teal-500/20 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden font-sans">
          {/* Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Left Column: World Identity & Science Objective */}
          <div className="flex-1 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-mono font-bold tracking-wide mb-3">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>THEME 6 • MATERIALS & INVENTIONS</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight leading-tight">
              The World of Natural & Synthetic Materials 🧪
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed font-normal">
              Investigate the molecular properties of matter. Crumple cotton vs. polyester in the hydraulic press,
              test tensile cord breaking points, and inspect micro-weave fibers under the electron lens.
            </p>

            {/* Visual Progression Meter */}
            <div className="w-full max-w-md mt-4 flex flex-col gap-1.5 mx-auto md:mx-0">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>Expedition Mastery</span>
                <span className="font-mono text-emerald-300">{progressPercent}% Mastered • {completedMissions.length}/13 Missions</span>
              </div>
              <div className="w-full bg-white/15 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="bg-gradient-to-r from-teal-400 to-emerald-300 h-full rounded-full"
                />
              </div>
            </div>

            {/* Interactive Mode Switcher Tabs */}
            <div className="flex flex-wrap gap-2.5 mt-5 justify-center md:justify-start">
              <button
                id="tab-map-btn"
                onClick={() => {
                  sounds.pop();
                  voiceAssistant.stop();
                  setActiveTab('map');
                }}
                className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'map'
                    ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-700/25'
                    : 'bg-white/10 hover:bg-white/15 text-slate-300 border border-white/10'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Expedition Trail Map</span>
              </button>

              <button
                id="tab-missions-btn"
                onClick={() => {
                  sounds.pop();
                  voiceAssistant.stop();
                  setActiveTab('missions');
                }}
                className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'missions'
                    ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-700/25'
                    : 'bg-white/10 hover:bg-white/15 text-slate-300 border border-white/10'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Mission Grid</span>
              </button>

              <button
                id="chapter-story-intro-btn"
                onClick={() => {
                  sounds.pop();
                  voiceAssistant.stop();
                  navigate('/intro/materials');
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 border border-white/10 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
                <span>Story Intro</span>
              </button>

              <button
                id="tab-video-btn"
                onClick={() => {
                  sounds.pop();
                  voiceAssistant.stop();
                  setActiveTab('video');
                }}
                className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'video'
                    ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-700/25'
                    : 'bg-white/10 hover:bg-white/15 text-slate-300 border border-white/10'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current text-amber-400" />
                <span>Video Lab</span>
              </button>

              <button
                id="tab-guidebook-btn"
                onClick={() => {
                  sounds.pop();
                  voiceAssistant.stop();
                  setActiveTab('guidebook');
                }}
                className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'guidebook'
                    ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-700/25'
                    : 'bg-white/10 hover:bg-white/15 text-slate-300 border border-white/10'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Field Guide</span>
              </button>

              <button
                id="chapter-journal-btn"
                onClick={() => {
                  sounds.pop();
                  voiceAssistant.stop();
                  navigate('/discovery-book');
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 border border-white/10 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>Field Journal ({discoveries.length})</span>
              </button>
            </div>
          </div>

          {/* Right Column: Pip Companion */}
          <div className="relative z-10 shrink-0 flex flex-col items-center bg-slate-900/80 p-4 rounded-2xl border border-white/15 backdrop-blur-md">
            <SparkyMascot mood={isAllComplete ? 'celebrating' : 'thinking'} size={80} animate />
            <span className="text-[11px] font-bold text-slate-300 mt-2">
              {isAllComplete ? 'Citadel Mastered! 🏆' : 'Laboratory Active 🔬'}
            </span>
          </div>
        </div>

        {/* ── Dynamic Tab Content View ── */}
        {activeTab === 'map' && (
          <div className="w-full">
            <GamifiedAdventureMap />
          </div>
        )}

        {activeTab === 'video' && <InteractiveChapterVideoLab />}

        {activeTab === 'guidebook' && <IntegratedGuidebook />}

        {activeTab === 'missions' && (
          <>
            {/* First-Time Start Banner (Warm Butter-Yellow with Sparky) */}
            {completedMissions.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="squircle-card p-4 sm:p-5 bg-[#FEFCE8] border border-[#FEF08A] shadow-soft-card flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 text-center sm:text-left">
                  <div className="w-11 h-11 rounded-2xl bg-[#FEF9C3] flex items-center justify-center text-2xl shrink-0">
                    🔬
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#262930] text-sm sm:text-base">
                      Ready to begin your Science Journey?
                    </h3>
                    <p className="text-xs font-medium text-[#5A6072] mt-0.5">
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
                  className="shrink-0 pill-btn-primary px-5 py-2.5 text-xs sm:text-sm flex items-center gap-2 shadow-soft-pill"
                >
                  <span>Start Mission 1</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* ── Daily Curiosity Quest Riddle Widget ── */}
            <DailyCuriosityQuest />

            {/* ── Winding Adventure Map vs Grid View Controls ── */}
            <div className="flex items-center justify-between squircle-card p-3 sm:p-3.5 shadow-soft-card flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <Compass className="w-5 h-5 text-[#EA580C]" />
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#262930] leading-none">
                    Chapter 3 Science Level Trail 🗺️
                  </h3>
                  <span className="text-[11px] font-medium text-[#7E8494]">
                    {completedMissions.length} of {missions.length} Missions Completed
                  </span>
                </div>
              </div>

              {/* View Switcher Toggle */}
              <div className="flex items-center gap-1 bg-[#F1EFEA] p-1 rounded-full border border-slate-200/80">
                <button
                  onClick={() => {
                    sounds.pop();
                    setViewMode('map');
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                    viewMode === 'map'
                      ? 'bg-[#262930] text-white shadow-soft-pill'
                      : 'text-[#5A6072] hover:text-[#262930]'
                  }`}
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>Road Map</span>
                </button>
                <button
                  onClick={() => {
                    sounds.pop();
                    setViewMode('grid');
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                    viewMode === 'grid'
                      ? 'bg-[#262930] text-white shadow-soft-pill'
                      : 'text-[#5A6072] hover:text-[#262930]'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>Mission Cards</span>
                </button>
              </div>
            </div>

            {/* ── View Mode: Winding Adventure Map (Reference Design) ── */}
            {viewMode === 'map' && (
              <div id="chapter-adventure-road-map" className="w-full flex justify-center">
                <GamifiedAdventureMap />
              </div>
            )}

            {/* ── View Mode: Specimen Grid Cards (Squircle & Diffuse Shadows) ── */}
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
                        whileHover={isUnlocked ? { scale: 1.015, y: -3 } : {}}
                        whileTap={isUnlocked ? { scale: 0.98 } : {}}
                        onClick={() => handleMissionClick(m, isUnlocked)}
                        className={`squircle-card p-0 overflow-hidden transition-all flex flex-col justify-between cursor-pointer relative ${
                          isCompleted
                            ? 'hover:border-[#BBF7D0] shadow-soft-card'
                            : isNextMission
                            ? 'border-[#FED7AA] shadow-soft-float ring-2 ring-[#FED7AA]/60'
                            : isUnlocked
                            ? 'shadow-soft-card hover:border-slate-300'
                            : 'opacity-60 bg-[#FAF8F5]/80 cursor-not-allowed border-dashed'
                        }`}
                      >
                        {/* Visual Image Banner Header */}
                        <div className="relative w-full h-36 md:h-40 overflow-hidden bg-[#FAF8F5]">
                          <img
                            src={thumbnail}
                            alt={m.title}
                            className={`w-full h-full object-cover transition-transform duration-500 ${
                              isUnlocked ? 'hover:scale-105' : 'grayscale contrast-75'
                            }`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#262930]/80 via-[#262930]/20 to-transparent" />

                          {/* Top Overlay Badges */}
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md text-[#262930] rounded-full text-[10px] font-extrabold tracking-wider uppercase shadow-xs">
                              Mission {m.number}
                            </span>

                            {isCompleted ? (
                              <span className="flex items-center gap-1 bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0] px-2.5 py-1 rounded-full text-[10px] font-extrabold shadow-xs">
                                <CheckCircle2 className="w-3 h-3 text-[#16A34A]" />
                                <span>Completed ⭐</span>
                              </span>
                            ) : isNextMission ? (
                              <span className="flex items-center gap-1 bg-[#262930] text-white px-3 py-1 rounded-full text-[10px] font-extrabold shadow-soft-pill">
                                <Zap className="w-3 h-3 text-[#FDE047]" />
                                <span>Start Next</span>
                              </span>
                            ) : isUnlocked ? (
                              <span className="flex items-center gap-1 bg-[#FEFCE8] text-[#854D0E] border border-[#FEF08A] px-2.5 py-1 rounded-full text-[10px] font-extrabold">
                                <span>Unlocked</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 bg-white/80 backdrop-blur-sm text-[#7E8494] px-2.5 py-1 rounded-full text-[10px] font-bold">
                                <Lock className="w-3 h-3" />
                                <span>Locked</span>
                              </span>
                            )}
                          </div>

                          {/* Bottom Title on Image */}
                          <div className="absolute bottom-2.5 left-3 right-3 flex items-center gap-2 text-white">
                            <span className="text-2xl filter drop-shadow-sm">{m.icon}</span>
                            <h4 className="text-base md:text-lg font-extrabold leading-tight tracking-tight truncate">
                              {m.title}
                            </h4>
                          </div>
                        </div>

                        {/* Card Content Body */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-xs font-medium text-[#5A6072] line-clamp-2 leading-relaxed mb-3">
                              {m.subtitle}
                            </p>

                            {/* Concept Tags (Muted Pastels) */}
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {m.concepts.slice(0, 3).map((c) => (
                                <span
                                  key={c}
                                  className="text-[9px] font-bold uppercase tracking-wider bg-[#F1EFEA] text-[#5A6072] px-2 py-0.5 rounded-full border border-slate-200/80"
                                >
                                  #{c}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Footer Action Button */}
                          <div className="pt-2.5 border-t border-slate-100">
                            {isCompleted ? (
                              <div className="w-full py-2 px-3.5 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] font-bold text-xs flex items-center justify-between">
                                <span className="flex items-center gap-1.5">
                                  <RotateCcw className="w-3.5 h-3.5 text-[#16A34A]" />
                                  Replay Lab
                                </span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </div>
                            ) : isUnlocked ? (
                              <div className="w-full py-2 px-3.5 rounded-full bg-[#262930] text-white font-bold text-xs flex items-center justify-between shadow-soft-pill">
                                <span>Start Experiment 🔬</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </div>
                            ) : (
                              <div className="w-full py-2 px-3.5 rounded-full bg-[#F1EFEA] text-[#8A90A0] font-medium text-xs flex items-center justify-between">
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

      {/* Spaced Recall Practice Modal */}
      <SpacedRecallModal isOpen={showRecallModal} onClose={() => setShowRecallModal(false)} />
    </div>
    </PersistentAppShell>
  );
}
