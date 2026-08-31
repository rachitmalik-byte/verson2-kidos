import React, { useState, useEffect, useRef } from 'react';
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
  Gift,
  Sparkles,
  ArrowRight,
  Play,
  RotateCcw,
  Trophy,
  X,
  Compass,
  Zap,
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

// 13 Coordinates along a smooth winding serpentine road (0-100% scale)
const LEVEL_COORDINATES = [
  { level: 1, x: 50, y: 92 },
  { level: 2, x: 74, y: 85 },
  { level: 3, x: 80, y: 78 },
  { level: 4, x: 62, y: 71 },
  { level: 5, x: 38, y: 64 },
  { level: 6, x: 22, y: 57 },
  { level: 7, x: 25, y: 50 },
  { level: 8, x: 45, y: 43 },
  { level: 9, x: 72, y: 36 },
  { level: 10, x: 80, y: 29 },
  { level: 11, x: 68, y: 22 },
  { level: 12, x: 46, y: 15 },
  { level: 13, x: 28, y: 8 },
];

// Milestone gift boxes along the path
const MILESTONE_GIFTS = [
  { id: 'gift-1', level: 4.5, x: 48, y: 67.5, rewardStars: 50, title: 'Polymer Explorer Gift Box 🎁' },
  { id: 'gift-2', level: 8.5, x: 60, y: 39.5, rewardStars: 75, title: 'Conductor Master Treasure 💎' },
  { id: 'gift-3', level: 12.5, x: 36, y: 11.5, rewardStars: 100, title: 'Grand Scientist Trophy Vault 🏆' },
];

export type BiomeTheme = 'savannah' | 'glacier' | 'candy';

export const GamifiedAdventureMap: React.FC = () => {
  const navigate = useNavigate();
  const completedMissions = useProgressStore((state) => state.completedMissions);
  const addDiscovery = useDiscoveryStore((state) => state.addDiscovery);

  const [selectedBiome, setSelectedBiome] = useState<BiomeTheme>('savannah');
  const [selectedMission, setSelectedMission] = useState<(typeof missions)[0] | null>(null);
  const [openedGifts, setOpenedGifts] = useState<string[]>([]);
  const [claimedReward, setClaimedReward] = useState<{ stars: number; title: string } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeNodeRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current active level on mount
  useEffect(() => {
    if (activeNodeRef.current) {
      setTimeout(() => {
        activeNodeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, []);

  const handleNodeClick = (mission: (typeof missions)[0], isUnlocked: boolean) => {
    sounds.pop();
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
      description: `Unlocked milestone treasure box! Earned +${gift.rewardStars} Science Stars!`,
      discoveredIn: 'Adventure Map Milestone',
      funFact: 'Scientists unlock exciting new inventions by mastering each step along the discovery road!',
    });
    voiceAssistant.speak(`Hooray! You opened the ${gift.title} and earned ${gift.rewardStars} Science Stars!`);
  };

  // Theme-specific styles
  const getThemeStyles = () => {
    switch (selectedBiome) {
      case 'glacier':
        return {
          bgGradient: 'from-[#0ea5e9] via-[#38bdf8] to-[#bae6fd]',
          roadBase: '#0369a1',
          roadSurface: '#e0f2fe',
          roadDash: '#0284c7',
          nodeBase: '#0284c7',
          nodeCompleted: 'from-emerald-400 to-teal-500',
          nodeActive: 'from-amber-400 via-yellow-300 to-orange-400',
          sceneryDecor: '❄️',
          rockColor: '#0c4a6e',
          bushColor: '#7dd3fc',
        };
      case 'candy':
        return {
          bgGradient: 'from-[#f472b6] via-[#fbcfe8] to-[#fdf2f8]',
          roadBase: '#78350f',
          roadSurface: '#f43f5e',
          roadDash: '#fef08a',
          nodeBase: '#be185d',
          nodeCompleted: 'from-emerald-400 to-green-500',
          nodeActive: 'from-amber-300 via-pink-400 to-rose-500',
          sceneryDecor: '🍭',
          rockColor: '#fda4af',
          bushColor: '#f472b6',
        };
      case 'savannah':
      default:
        return {
          bgGradient: 'from-[#fbbf24] via-[#fde68a] to-[#fef3c7]',
          roadBase: '#b45309',
          roadSurface: '#f59e0b',
          roadDash: '#fef3c7',
          nodeBase: '#92400e',
          nodeCompleted: 'from-emerald-500 to-teal-600',
          nodeActive: 'from-amber-400 via-yellow-300 to-orange-500',
          sceneryDecor: '🌿',
          rockColor: '#d97706',
          bushColor: '#4ade80',
        };
    }
  };

  const theme = getThemeStyles();

  // Generate SVG path connecting all 13 level points in a smooth curving road
  const svgPathD = React.useMemo(() => {
    let d = `M ${LEVEL_COORDINATES[0].x} ${LEVEL_COORDINATES[0].y}`;
    for (let i = 1; i < LEVEL_COORDINATES.length; i++) {
      const prev = LEVEL_COORDINATES[i - 1];
      const curr = LEVEL_COORDINATES[i];
      const midY = (prev.y + curr.y) / 2;
      d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
    }
    return d;
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* ── Biome & Theme Switcher Bar ── */}
      <div className="w-full max-w-xl flex items-center justify-between bg-white/95 backdrop-blur-md p-2 rounded-2xl border-2 border-amber-300 shadow-md">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 ml-2 flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-amber-600" />
          Map Theme:
        </span>
        <div className="flex gap-1.5">
          <button
            onClick={() => {
              sounds.pop();
              setSelectedBiome('savannah');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
              selectedBiome === 'savannah'
                ? 'bg-amber-400 text-slate-950 shadow-sm ring-2 ring-amber-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>🌿 Savannah</span>
          </button>
          <button
            onClick={() => {
              sounds.pop();
              setSelectedBiome('glacier');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
              selectedBiome === 'glacier'
                ? 'bg-sky-400 text-slate-950 shadow-sm ring-2 ring-sky-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>❄️ Glacier</span>
          </button>
          <button
            onClick={() => {
              sounds.pop();
              setSelectedBiome('candy');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
              selectedBiome === 'candy'
                ? 'bg-pink-400 text-slate-950 shadow-sm ring-2 ring-pink-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>🍭 Sweet Lab</span>
          </button>
        </div>
      </div>

      {/* ── Gamified Winding Map Canvas ── */}
      <div
        ref={containerRef}
        className={`w-full max-w-2xl rounded-[40px] border-4 border-amber-400 shadow-2xl overflow-hidden relative p-4 sm:p-6 bg-gradient-to-b ${theme.bgGradient} min-h-[1100px] select-none`}
      >
        {/* Background Environment Decorative Visual Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Top Finish Castle / Victory Lab */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="text-5xl filter drop-shadow-xl"
            >
              🏰
            </motion.div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 text-amber-300 px-3 py-0.5 rounded-full shadow-md border border-amber-400">
              Science Citadel (Level 13)
            </span>
          </div>

          {/* Biome Landscape Features */}
          <div className="absolute top-[18%] left-[8%] text-4xl opacity-80 animate-pulse">🌳</div>
          <div className="absolute top-[26%] right-[8%] text-3xl opacity-75">🌸</div>
          <div className="absolute top-[38%] left-[12%] text-4xl opacity-80">🧪</div>
          <div className="absolute top-[48%] right-[10%] text-4xl opacity-75">🔬</div>
          <div className="absolute top-[60%] left-[8%] text-3xl opacity-80">🌱</div>
          <div className="absolute top-[72%] right-[12%] text-4xl opacity-80">🌿</div>
          <div className="absolute top-[82%] left-[10%] text-4xl opacity-80">🌼</div>
          <div className="absolute bottom-4 right-1/2 translate-x-1/2 text-4xl">🏁</div>
        </div>

        {/* ── Smooth Winding Curving SVG Road ── */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          {/* Outer Road 3D Shadow Layer */}
          <path
            d={svgPathD}
            fill="none"
            stroke={theme.roadBase}
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.35)]"
          />

          {/* Inner Road Surface Layer */}
          <path
            d={svgPathD}
            fill="none"
            stroke={theme.roadSurface}
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Center Dashed White Guide Line */}
          <path
            d={svgPathD}
            fill="none"
            stroke={theme.roadDash}
            strokeWidth="1.2"
            strokeDasharray="2 3"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />
        </svg>

        {/* ── Milestone Gift Box Stops along the Road ── */}
        {MILESTONE_GIFTS.map((gift) => {
          const isOpened = openedGifts.includes(gift.id);
          return (
            <motion.div
              key={gift.id}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleOpenGift(gift)}
              style={{ top: `${gift.y}%`, left: `${gift.x}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
            >
              <div className="relative flex flex-col items-center">
                <motion.div
                  animate={!isOpened ? { rotate: [-5, 5, -5], y: [0, -3, 0] } : {}}
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

        {/* ── 13 3D Stepping Stone Level Buttons ── */}
        {missions.map((mission, index) => {
          const coords = LEVEL_COORDINATES[index];
          const isCompleted = completedMissions.includes(mission.id);
          const isUnlocked = index === 0 || completedMissions.includes(missions[index - 1]?.id);
          const isCurrent = isUnlocked && !isCompleted;

          return (
            <div
              key={mission.id}
              ref={isCurrent ? activeNodeRef : undefined}
              style={{ top: `${coords.y}%`, left: `${coords.x}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center"
            >
              {/* Floating Character / Mascot on Active Level */}
              {isCurrent && (
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: [-4, 4, -4], opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="mb-1 flex flex-col items-center pointer-events-none"
                >
                  <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-lg border-2 border-white ring-2 ring-amber-400/80 animate-pulse">
                    READY! 🔬
                  </span>
                  <div className="w-11 h-11 filter drop-shadow-lg -mt-1">
                    <Pip mood="celebrating" size="sm" />
                  </div>
                </motion.div>
              )}

              {/* 3 Golden Stars over Completed Levels */}
              {isCompleted && (
                <div className="flex items-center gap-0.5 mb-1 animate-scaleIn">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 filter drop-shadow-sm -rotate-12" />
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500 filter drop-shadow-md -translate-y-0.5" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 filter drop-shadow-sm rotate-12" />
                </div>
              )}

              {/* 3D Stepping Stone Button */}
              <motion.button
                whileHover={isUnlocked ? { scale: 1.15, y: -4 } : {}}
                whileTap={isUnlocked ? { scale: 0.92 } : {}}
                onClick={() => handleNodeClick(mission, isUnlocked)}
                className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all shadow-2xl ${
                  isCompleted
                    ? 'bg-gradient-to-b from-emerald-400 via-emerald-500 to-teal-700 text-white border-4 border-emerald-200 ring-4 ring-emerald-400/40'
                    : isCurrent
                    ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-orange-600 text-slate-950 border-4 border-white ring-6 ring-amber-400 animate-pulse font-black'
                    : 'bg-gradient-to-b from-slate-300 via-slate-400 to-slate-600 text-slate-200 border-4 border-slate-400 opacity-80 cursor-not-allowed'
                }`}
                style={{
                  boxShadow: isCurrent
                    ? '0 12px 25px rgba(245, 158, 11, 0.6), inset 0 3px 6px rgba(255,255,255,0.8)'
                    : isCompleted
                    ? '0 10px 20px rgba(16, 185, 129, 0.5), inset 0 3px 6px rgba(255,255,255,0.7)'
                    : '0 6px 12px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.3)',
                }}
              >
                {/* Glossy Button Cap */}
                <div className="absolute top-1 left-2 right-2 h-4 rounded-full bg-white/40 pointer-events-none" />

                {/* Center Content */}
                {isCompleted ? (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-xl font-black">{mission.number}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-100" />
                  </div>
                ) : isCurrent ? (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl">{mission.icon}</span>
                    <span className="text-[11px] font-black text-slate-950 -mt-0.5 leading-none">
                      L{mission.number}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <Lock className="w-5 h-5 text-slate-300" />
                    <span className="text-[10px] font-bold text-slate-300 leading-none mt-0.5">
                      {mission.number}
                    </span>
                  </div>
                )}
              </motion.button>

              {/* Node Mini Label Pill */}
              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full mt-1.5 shadow-md border truncate max-w-[120px] text-center ${
                  isCompleted
                    ? 'bg-emerald-950/80 text-emerald-200 border-emerald-400/50'
                    : isCurrent
                    ? 'bg-slate-950 text-amber-300 border-amber-400 font-black scale-105'
                    : 'bg-slate-800/80 text-slate-400 border-slate-600'
                }`}
              >
                {mission.title.split(' ')[0]} {mission.title.split(' ')[1] || ''}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Interactive Mission Preview Popup Modal ── */}
      <AnimatePresence>
        {selectedMission && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
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
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
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
