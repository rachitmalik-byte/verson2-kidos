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
import { FirstTimeTutorialOverlay } from '@/components/tutorial/FirstTimeTutorialOverlay';
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
  FlaskConical,
  Zap,
  RotateCcw,
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
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-200 via-indigo-50 to-amber-100 flex flex-col justify-between pt-4 sm:pt-6 pb-24 px-3 sm:px-6 md:px-8 font-sans relative">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
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

            <div className="flex items-center gap-2 ml-1">
              <FlaskConical className="w-5 h-5 text-amber-500" />
              <span className="font-black text-sm text-slate-800 hidden md:inline">
                CBSE Class 5 EVS • Things We Make & Do
              </span>
            </div>
          </div>

          <AudioNavBarControls showProfile={true} />
        </div>

        {/* ── Chapter Hero Banner with Progress Gauge ── */}
        <div id="chapter-hero-banner" className="bg-white/95 rounded-3xl md:rounded-[36px] p-6 md:p-8 border-4 border-amber-400 shadow-2xl flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
          <div className="relative">
            <Pip mood={isAllComplete ? 'celebrating' : 'explaining'} size="lg" />
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 p-1.5 rounded-full shadow-md border-2 border-white"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
            </motion.div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              <span className="px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-full text-xs font-black uppercase tracking-wider">
                CBSE Class 5 EVS • Chapter 3
              </span>
              <span className="px-3 py-1 bg-amber-100 border border-amber-300 text-amber-900 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{totalStars} Science Stars</span>
              </span>
              <span className="px-3 py-1 bg-sky-100 border border-sky-300 text-sky-900 rounded-full text-xs font-black uppercase tracking-wider">
                {progressPercent}% Mastered
              </span>
            </div>

            <h1
              className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              The World of Natural & Synthetic Materials 🧪✨
            </h1>
            <p className="text-xs md:text-sm font-bold text-slate-600 mt-1 max-w-xl">
              Welcome back, {child?.name || 'Young Scientist'}! Explore Class 5 EVS hands-on laboratory missions with real materials, interactive simulations, and speech challenges!
            </p>

            {/* Chapter Progress Bar */}
            <div className="w-full max-w-md mt-3 bg-slate-100 rounded-full h-3.5 p-0.5 border border-slate-300 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-500 h-full rounded-full shadow-xs"
              />
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap gap-2.5 mt-4 justify-center md:justify-start">
              <button
                id="chapter-intro-btn"
                onClick={() => {
                  sounds.pop();
                  navigate('/chapter/3');
                }}
                className="btn-3d-amber text-slate-950 font-black text-xs py-2.5 px-4 rounded-2xl shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
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
                className="px-4 py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 text-indigo-900 font-black text-xs flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs transition-all"
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
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                <span>Mystery Specimen Quiz Lab 🔬 (+25🪙)</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Chapters Roadmap Preview ── */}
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
                className={`p-4 rounded-2xl border-2 flex flex-col justify-between transition-all ${
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
                  className={`text-[10px] font-black uppercase tracking-wider mt-2.5 px-2.5 py-0.5 rounded-full w-fit ${
                    ch.active ? 'bg-amber-400 text-slate-950 font-black shadow-xs' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {ch.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── 13 Interactive Mission Visual Adventure Cards ── */}
        <div id="chapter-missions-trail" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-500" />
              <h3 className="text-base md:text-lg font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Chapter 3 Interactive Mission Trail 🗺️
              </h3>
            </div>
            <span className="text-xs font-black text-slate-600 bg-white/80 px-3 py-1 rounded-full border border-slate-200 shadow-xs">
              {completedMissions.length} of {missions.length} Missions Completed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {missions.map((m, index) => {
              const isCompleted = completedMissions.includes(m.id);
              const isUnlocked = index === 0 || completedMissions.includes(missions[index - 1]?.id);
              const thumbnail = missionThumbnails[m.id] || raincoatWaterproofImg;

              return (
                <motion.div
                  key={m.id}
                  id={m.id === 'mission-01' ? 'chapter-mission-1-card' : undefined}
                  whileHover={isUnlocked ? { scale: 1.025, y: -4 } : {}}
                  whileTap={isUnlocked ? { scale: 0.98 } : {}}
                  onClick={() => handleMissionClick(m, isUnlocked)}
                  className={`rounded-3xl border-3 transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden bg-white shadow-md ${
                    isCompleted
                      ? 'border-emerald-400 hover:shadow-emerald-100/60'
                      : isUnlocked
                      ? 'border-amber-400 ring-4 ring-amber-300/40 hover:shadow-amber-100'
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
                      ) : isUnlocked ? (
                        <span className="flex items-center gap-1 bg-amber-400 text-slate-950 px-2.5 py-1 rounded-full text-[10px] font-black shadow-md animate-pulse">
                          <Zap className="w-3 h-3 fill-slate-950" />
                          <span>Ready!</span>
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
      </div>

      {/* First-Time Guided Tutorial Tour */}
      <FirstTimeTutorialOverlay isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
    </div>
  );
}
