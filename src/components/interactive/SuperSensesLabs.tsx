import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  Eye,
  Sparkles,
  Volume2,
  RotateCcw,
  ZoomIn,
  Moon,
  Sun,
  Flame,
} from 'lucide-react';

/* ============================================================================
   1. 🐍 SNAKE INFRARED THERMAL PIT ORGAN NIGHT VISION LAB (CBSE CH 1 & 2)
   ============================================================================ */
export const SnakeInfraredThermalVisionLab: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [visionMode, setVisionMode] = useState<'normal_human' | 'snake_thermal'>('normal_human');

  const handleToggleVision = (mode: 'normal_human' | 'snake_thermal') => {
    sounds.pop();
    setVisionMode(mode);
    if (mode === 'snake_thermal') {
      sounds.sparkle();
      voiceAssistant.speak(
        'Thermal Pit Organ vision activated! Pit vipers have specialized heat-sensing pits between their eyes and nostrils that detect infrared body heat radiation in total pitch darkness!'
      );
      if (onCompleted) onCompleted();
    }
  };

  return (
    <div className="w-full bg-slate-950 p-6 sm:p-8 rounded-3xl border-4 border-emerald-400 shadow-2xl flex flex-col items-center text-white relative overflow-hidden">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-700">
          <Moon className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-black uppercase text-emerald-300">
            Night Burrow Simulation (0 Lux Pitch Darkness)
          </span>
        </div>
        <span className="text-xs font-black px-3.5 py-1 rounded-full bg-emerald-400 text-slate-950">
          {visionMode === 'snake_thermal' ? '🔥 SNAKE INFRARED THERMAL SIGHT' : '👁️ HUMAN NIGHT BLINDNESS (BLACK)'}
        </span>
      </div>

      {/* Viewport Box */}
      <div
        className={`relative w-full max-w-lg h-72 rounded-3xl border-3 shadow-2xl flex items-center justify-center p-6 transition-all duration-700 ${
          visionMode === 'snake_thermal'
            ? 'bg-gradient-to-b from-blue-950 via-purple-950 to-slate-950 border-emerald-400'
            : 'bg-black border-slate-800'
        }`}
      >
        {visionMode === 'normal_human' ? (
          <div className="flex flex-col items-center text-center p-4">
            <span className="text-4xl mb-2">🌑</span>
            <span className="text-xs font-black text-slate-500">
              Total Darkness: The human eye cannot see anything without visible light.
            </span>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Thermal Rat radiating 37°C body heat */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex flex-col items-center z-10"
            >
              <div className="w-24 h-16 rounded-full bg-gradient-to-r from-red-600 via-amber-400 to-yellow-300 shadow-[0_0_40px_#ef4444] border-2 border-white flex items-center justify-center text-3xl">
                🐀
              </div>
              <span className="text-[10px] font-black text-amber-200 bg-red-950/80 px-2 py-0.5 rounded-full mt-2 border border-red-500">
                Heat Signature: 37°C
              </span>
            </motion.div>

            {/* Infrared Waveform Grids */}
            <div className="absolute inset-0 pointer-events-none border border-emerald-400/20 rounded-3xl flex items-center justify-center">
              <div className="w-36 h-36 rounded-full border border-emerald-400/40 animate-ping opacity-40" />
            </div>
          </div>
        )}
      </div>

      {/* Switcher Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md mt-5">
        <button
          onClick={() => handleToggleVision('normal_human')}
          className={`p-4 rounded-2xl font-black text-xs sm:text-sm border-2 cursor-pointer transition-all ${
            visionMode === 'normal_human'
              ? 'bg-slate-800 border-slate-500 text-white shadow-md ring-2 ring-slate-400'
              : 'bg-slate-900 border-slate-700 text-slate-400'
          }`}
        >
          👁️ 1. Human Sight in Dark (Pitch Black)
        </button>

        <button
          onClick={() => handleToggleVision('snake_thermal')}
          className={`p-4 rounded-2xl font-black text-xs sm:text-sm border-2 cursor-pointer transition-all ${
            visionMode === 'snake_thermal'
              ? 'bg-emerald-400 border-emerald-300 text-slate-950 shadow-xl ring-4 ring-emerald-400/40 scale-102'
              : 'bg-slate-900 border-slate-700 text-slate-400'
          }`}
        >
          🐍 2. Snake Infrared Thermal Pit Organs
        </button>
      </div>

      <div className="w-full bg-emerald-950/70 p-4 rounded-2xl border-2 border-emerald-500/50 text-center text-xs font-bold text-emerald-200 mt-4">
        🐍 <strong>Pit Organ Super Sense:</strong> Pit vipers and pythons have membrane-covered heat sensing pits lined with infrared receptors that detect body temperature differences of even 0.003°C, allowing them to hunt warm prey in complete darkness!
      </div>
    </div>
  );
};
