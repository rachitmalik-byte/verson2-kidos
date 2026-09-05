import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { missions } from '@/data/missions';
import { useProgressStore } from '@/stores/progressStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Pip } from '@/components/pip/Pip';
import {
  Star,
  Lock,
  CheckCircle2,
  ArrowRight,
  Play,
  X,
  Compass,
  Zap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// Real educational photography thumbnails
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

// 13 Coordinates along a smooth winding Left-to-Right road (x: 4% to 96%, y: 24% to 75%)
const HORIZONTAL_LEVEL_COORDINATES = [
  { level: 1, x: 4.5, y: 50 },
  { level: 2, x: 12.0, y: 70 },
  { level: 3, x: 19.5, y: 74 },
  { level: 4, x: 27.0, y: 58 },
  { level: 5, x: 34.5, y: 35 },
  { level: 6, x: 42.0, y: 25 },
  { level: 7, x: 49.5, y: 36 },
  { level: 8, x: 57.0, y: 60 },
  { level: 9, x: 64.5, y: 75 },
  { level: 10, x: 72.0, y: 70 },
  { level: 11, x: 79.5, y: 48 },
  { level: 12, x: 87.0, y: 28 },
  { level: 13, x: 94.5, y: 26 },
];

// Milestone gift boxes placed in road curves
const MILESTONE_GIFTS = [
  { id: 'gift-1', level: 4.5, x: 31.0, y: 46, rewardStars: 50, title: 'Polymer Explorer Gift Box 🎁' },
  { id: 'gift-2', level: 8.5, x: 61.0, y: 68, rewardStars: 75, title: 'Conductor Master Treasure 💎' },
  { id: 'gift-3', level: 12.5, x: 91.0, y: 24, rewardStars: 100, title: 'Grand Science Citadel Vault 🏆' },
];

export type BiomeTheme = 'citadel' | 'glacier' | 'savannah';

import { useParentStore } from '@/stores/parentStore';

export const GamifiedAdventureMap: React.FC = () => {
  const navigate = useNavigate();
  const completedMissions = useProgressStore((state) => state.completedMissions);
  const addDiscovery = useDiscoveryStore((state) => state.addDiscovery);
  const isLessonAllowed = useParentStore((state) => state.isLessonAllowed);

  const [selectedBiome, setSelectedBiome] = useState<BiomeTheme>('citadel');
  const [selectedMission, setSelectedMission] = useState<(typeof missions)[0] | null>(null);
  const [openedGifts, setOpenedGifts] = useState<string[]>([]);
  const [claimedReward, setClaimedReward] = useState<{ stars: number; title: string } | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeNodeRef = useRef<HTMLDivElement>(null);

  // Auto-scroll horizontally to current active level on mount
  useEffect(() => {
    if (activeNodeRef.current && scrollContainerRef.current) {
      setTimeout(() => {
        activeNodeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }, 500);
    }
  }, []);

  const handleNodeClick = (mission: (typeof missions)[0], isUnlocked: boolean, isParentLocked: boolean) => {
    sounds.pop();
    if (isParentLocked) {
      sounds.boing();
      voiceAssistant.speak(`This mission is paused by your parent. Ask them to enable it in the Parent Dashboard!`);
      return;
    }
    if (isUnlocked) {
      setSelectedMission(mission);
      voiceAssistant.speak(`Mission ${mission.number}: ${mission.title}. ${mission.subtitle}`);
    } else {
      sounds.boing();
      voiceAssistant.speak(`Complete Mission ${mission.number - 1} first to unlock this level!`);
    }
  };

  const handleOpenGift = (gift: (typeof MILESTONE_GIFTS)[0]) => {
    if (openedGifts.includes(gift.id)) return;
    sounds.fanfare();
    setOpenedGifts((prev) => [...prev, gift.id]);
    setClaimedReward({ stars: gift.rewardStars, title: gift.title });
    addDiscovery({
      id: `milestone-${gift.id}`,
      name: gift.title,
      category: 'synthetic',
      icon: '🎁',
      description: `Unlocked milestone research vault! Earned +${gift.rewardStars} Science Stars!`,
      discoveredIn: 'Adventure Expedition Milestone',
      funFact: 'Scientists unlock exciting new materials by mastering each step along the discovery road!',
    });
    voiceAssistant.speak(`Hooray! You opened the ${gift.title} and earned ${gift.rewardStars} Science Stars!`);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  // Modern Expedition Theme styles
  const getThemeStyles = () => {
    switch (selectedBiome) {
      case 'glacier':
        return {
          bgGradient: 'from-[#082f49] via-[#0c4a6e] to-[#082f49]',
          roadBase: '#075985',
          roadSurface: '#0284c7',
          roadDash: '#38bdf8',
          decorIcon: '❄️',
        };
      case 'savannah':
        return {
          bgGradient: 'from-[#1c1917] via-[#292524] to-[#1c1917]',
          roadBase: '#44403c',
          roadSurface: '#78716c',
          roadDash: '#f59e0b',
          decorIcon: '🌿',
        };
      case 'citadel':
      default:
        return {
          bgGradient: 'from-slate-900 via-indigo-950 to-slate-900',
          roadBase: '#1e1b4b',
          roadSurface: '#312e81',
          roadDash: '#6366f1',
          decorIcon: '🔬',
        };
    }
  };

  const theme = getThemeStyles();

  // Generate SVG path connecting all 13 level points from Left to Right
  const svgPathD = React.useMemo(() => {
    let d = `M ${HORIZONTAL_LEVEL_COORDINATES[0].x} ${HORIZONTAL_LEVEL_COORDINATES[0].y}`;
    for (let i = 1; i < HORIZONTAL_LEVEL_COORDINATES.length; i++) {
      const prev = HORIZONTAL_LEVEL_COORDINATES[i - 1];
      const curr = HORIZONTAL_LEVEL_COORDINATES[i];
      const midX = (prev.x + curr.x) / 2;
      d += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    return d;
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-3">
      {/* ── Top Header Controls & Biome Selector ── */}
      <div className="w-full flex items-center justify-between bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200/80 shadow-xs flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 ml-1 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-blue-600" />
            <span>Expedition Environment:</span>
          </span>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => {
                sounds.pop();
                setSelectedBiome('citadel');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                selectedBiome === 'citadel'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🔬 Research Citadel</span>
            </button>
            <button
              onClick={() => {
                sounds.pop();
                setSelectedBiome('glacier');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                selectedBiome === 'glacier'
                  ? 'bg-white text-sky-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>❄️ Arctic Glacier</span>
            </button>
            <button
              onClick={() => {
                sounds.pop();
                setSelectedBiome('savannah');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                selectedBiome === 'savannah'
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🌿 Earth Geosphere</span>
            </button>
          </div>
        </div>

        {/* Scroll Left / Right Buttons */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-500 hidden sm:inline">
            Swipe or Scroll Left ➔ Right:
          </span>
          <button
            onClick={scrollLeft}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer shadow-xs active:scale-95 transition-all"
            title="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4 stroke-[3]" />
          </button>
          <button
            onClick={scrollRight}
            className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs active:scale-95 transition-all"
            title="Scroll Right"
          >
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* ── Horizontally Winding Left-to-Right Level Track Canvas ── */}
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto rounded-3xl border border-slate-700/80 shadow-2xl bg-slate-950 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-900 pb-2"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div
          className={`relative min-w-[1550px] h-[520px] sm:h-[580px] p-6 bg-gradient-to-r ${theme.bgGradient} select-none overflow-hidden`}
        >
          {/* Start & Finish Visual Banners */}
          <div className="absolute top-6 left-4 flex flex-col items-center pointer-events-none z-10">
            <span className="text-4xl filter drop-shadow-md">🏁</span>
            <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 text-amber-300 px-3 py-0.5 rounded-full border border-amber-400 shadow-md">
              Start (Level 1)
            </span>
          </div>

          <div className="absolute top-6 right-6 flex flex-col items-center pointer-events-none z-10">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="text-5xl filter drop-shadow-xl"
            >
              🏰
            </motion.div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 text-amber-300 px-3 py-0.5 rounded-full border border-amber-400 shadow-md mt-1">
              Citadel (Level 13)
            </span>
          </div>

          {/* Biome Landscape Icons Scattered */}
          <div className="absolute top-[15%] left-[15%] text-3xl opacity-70 pointer-events-none">🌳</div>
          <div className="absolute bottom-[12%] left-[24%] text-3xl opacity-70 pointer-events-none">🌸</div>
          <div className="absolute top-[18%] left-[38%] text-3xl opacity-70 pointer-events-none">🧪</div>
          <div className="absolute bottom-[15%] left-[52%] text-3xl opacity-70 pointer-events-none">🔬</div>
          <div className="absolute top-[12%] left-[68%] text-3xl opacity-70 pointer-events-none">🌱</div>
          <div className="absolute bottom-[18%] left-[82%] text-3xl opacity-70 pointer-events-none">✨</div>

          {/* ── Curving Left-to-Right Winding SVG Road ── */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            {/* 3D Road Shadow */}
            <path
              d={svgPathD}
              fill="none"
              stroke={theme.roadBase}
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="filter drop-shadow-[0_10px_16px_rgba(0,0,0,0.35)]"
            />

            {/* Inner Road Surface */}
            <path
              d={svgPathD}
              fill="none"
              stroke={theme.roadSurface}
              strokeWidth="7.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Dashed Center Guide Line */}
            <path
              d={svgPathD}
              fill="none"
              stroke={theme.roadDash}
              strokeWidth="1"
              strokeDasharray="2 3"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.85"
            />
          </svg>

          {/* ── Milestone Gift Box Stops in Curves ── */}
          {MILESTONE_GIFTS.map((gift) => {
            const isOpened = openedGifts.includes(gift.id);
            return (
              <motion.div
                key={gift.id}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleOpenGift(gift)}
                style={{ top: `${gift.y}%`, left: `${gift.x}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
              >
                <div className="relative flex flex-col items-center">
                  <motion.div
                    animate={!isOpened ? { rotate: [-6, 6, -6], y: [0, -3, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-2xl border-2 ${
                      isOpened
                        ? 'bg-slate-100 border-slate-300 text-slate-400 opacity-60'
                        : 'bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-amber-400 border-white text-white ring-4 ring-fuchsia-300/80 animate-bounce'
                    }`}
                  >
                    {isOpened ? '✨' : '🎁'}
                  </motion.div>
                  <span className="text-[9px] font-black tracking-tight uppercase bg-slate-950/80 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/60 mt-1 shadow-sm whitespace-nowrap">
                    {isOpened ? 'Claimed ✓' : `Bonus +${gift.rewardStars}⭐`}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {/* ── 13 Level Nodes with Real Educational Photography Thumbnails ── */}
          {missions.map((mission, index) => {
            const coords = HORIZONTAL_LEVEL_COORDINATES[index];
            const isCompleted = completedMissions.includes(mission.id);
            const isParentAllowed = isLessonAllowed(mission.id);
            const isProgressionUnlocked = index === 0 || completedMissions.includes(missions[index - 1]?.id);
            const isUnlocked = isParentAllowed && isProgressionUnlocked;
            const isParentLocked = !isParentAllowed;
            const isCurrent = isUnlocked && !isCompleted;
            const thumbnail = missionThumbnails[mission.id] || raincoatWaterproofImg;

            return (
              <div
                key={mission.id}
                ref={isCurrent ? activeNodeRef : undefined}
                style={{ top: `${coords.y}%`, left: `${coords.x}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center"
              >
                {/* Floating Pip Character over Current Active Level */}
                {isCurrent && (
                  <motion.div
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: [-4, 4, -4], opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    className="mb-1 flex flex-col items-center pointer-events-none"
                  >
                    <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-lg border-2 border-white ring-2 ring-amber-400/80 animate-pulse">
                      READY! 🔬
                    </span>
                    <div className="w-10 h-10 filter drop-shadow-lg -mt-1">
                      <Pip mood="celebrating" size="sm" />
                    </div>
                  </motion.div>
                )}

                {/* 3 Golden Stars over Completed Level */}
                {isCompleted && (
                  <div className="flex items-center gap-0.5 mb-1 animate-scaleIn">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 filter drop-shadow-sm -rotate-12" />
                    <Star className="w-4 h-4 fill-amber-400 text-amber-500 filter drop-shadow-md -translate-y-0.5" />
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 filter drop-shadow-sm rotate-12" />
                  </div>
                )}

                {/* 3D Circular Level Portal with REAL PHOTO */}
                <motion.button
                  whileHover={isUnlocked ? { scale: 1.14, y: -4 } : {}}
                  whileTap={isUnlocked ? { scale: 0.94 } : {}}
                  onClick={() => handleNodeClick(mission, isUnlocked, isParentLocked)}
                  className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-3xl p-1.5 flex flex-col items-center justify-between cursor-pointer transition-all shadow-2xl overflow-hidden ${
                    isCompleted
                      ? 'bg-gradient-to-b from-emerald-400 via-emerald-500 to-teal-700 border-3 border-emerald-200 ring-4 ring-emerald-400/40'
                      : isParentLocked
                      ? 'bg-gradient-to-b from-rose-900 to-slate-950 border-3 border-rose-500/60 opacity-80 shadow-md'
                      : isCurrent
                      ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-orange-600 border-4 border-white ring-6 ring-amber-400 animate-pulse'
                      : 'bg-gradient-to-b from-slate-600 to-slate-800 border-3 border-slate-400 opacity-75 cursor-not-allowed'
                  }`}
                >
                  {/* Photo Thumbnail Inset */}
                  <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950">
                    <img
                      src={thumbnail}
                      alt={mission.title}
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        isUnlocked ? 'hover:scale-110' : 'grayscale contrast-75'
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                    {/* Level Number Badge Top Left */}
                    <div className="absolute top-1 left-1 bg-slate-950/90 text-amber-300 border border-amber-400/60 text-[10px] font-black px-1.5 py-0.2 rounded-md shadow-xs">
                      {mission.number}
                    </div>

                    {/* Status Badge Top Right */}
                    <div className="absolute top-1 right-1">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-slate-950" />
                      ) : isParentLocked ? (
                        <Lock className="w-3.5 h-3.5 text-rose-400" />
                      ) : isUnlocked ? (
                        <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>

                    {/* Bottom Title on Thumbnail */}
                    <div className="absolute bottom-0.5 left-1 right-1 flex items-center gap-1">
                      <span className="text-xs">{mission.icon}</span>
                      <span className="text-[9px] font-black text-white truncate leading-tight">
                        {mission.title}
                      </span>
                    </div>
                  </div>
                </motion.button>

                {/* Level Title Pill below Node */}
                <span
                  className={`text-[10px] font-black px-2.5 py-0.5 rounded-full mt-1.5 shadow-md border truncate max-w-[130px] text-center ${
                    isCompleted
                      ? 'bg-emerald-950/90 text-emerald-200 border-emerald-400/50'
                      : isCurrent
                      ? 'bg-slate-950 text-amber-300 border-amber-400 font-black scale-105'
                      : 'bg-slate-800/80 text-slate-400 border-slate-600'
                  }`}
                >
                  {mission.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Interactive Mission Preview Popup Modal ── */}
      <AnimatePresence>
        {selectedMission && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl md:rounded-[36px] max-w-md w-full border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Thumbnail Image Header */}
              <div className="relative w-full h-44 bg-slate-900 overflow-hidden">
                <img
                  src={missionThumbnails[selectedMission.id] || raincoatWaterproofImg}
                  alt={selectedMission.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                <button
                  onClick={() => setSelectedMission(null)}
                  className="absolute top-3 right-3 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full cursor-pointer shadow-md"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full shadow-xs">
                    Mission {selectedMission.number} • Hands-on Lab
                  </span>
                  <h3 className="text-xl font-black mt-1 flex items-center gap-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    <span>{selectedMission.icon}</span>
                    <span>{selectedMission.title}</span>
                  </h3>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 flex flex-col gap-3">
                <p className="text-xs font-bold text-slate-600 leading-relaxed">
                  {selectedMission.subtitle}
                </p>

                {/* Concepts */}
                <div className="flex flex-wrap gap-1">
                  {selectedMission.concepts.map((c) => (
                    <span
                      key={c}
                      className="text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200"
                    >
                      #{c}
                    </span>
                  ))}
                </div>

                {/* Play Button */}
                <button
                  onClick={() => {
                    sounds.pop();
                    voiceAssistant.stop();
                    navigate(`/chapter/3/mission/${selectedMission.number}`);
                  }}
                  className="w-full py-3.5 mt-2 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-sm rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>START MISSION {selectedMission.number} 🔬</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Milestone Gift Claim Popup Modal ── */}
      <AnimatePresence>
        {claimedReward && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full border-4 border-amber-400 shadow-2xl text-center flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-inner animate-bounce">
                🎁
              </div>
              <h4 className="text-lg font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                {claimedReward.title}
              </h4>
              <p className="text-xs font-bold text-slate-600">
                You earned <strong className="text-amber-600 font-black">+{claimedReward.stars} Science Stars</strong> and a new specimen card for your Field Journal!
              </p>
              <button
                onClick={() => setClaimedReward(null)}
                className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl cursor-pointer shadow-md active:scale-95"
              >
                Awesome! 🌟
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
