import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  Shield,
  Eye,
  Volume2,
  Sparkles,
  Layers,
} from 'lucide-react';
import fortBastionsImg from '@/assets/images/theme-shelter/golconda_fort_bastions.jpg';
import fatehDarwazaImg from '@/assets/images/theme-shelter/golconda_fateh_darwaza.jpg';

/* ============================================================================
   FORT ARCHITECT STUDIO (REAL FORTRESS PHOTOGRAPHS & TACTICAL ANNOTATIONS)
   Used for: Golconda Fort Bastions (Burj), Walls & Fateh Darwaza Acoustics
   ============================================================================ */
export const FortArchitectStudio: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'straight_wall' | 'curved_bastion' | 'acoustics'>('curved_bastion');

  const handleModeChange = (mode: 'straight_wall' | 'curved_bastion' | 'acoustics') => {
    sounds.pop();
    setActiveMode(mode);
    if (mode === 'straight_wall') {
      voiceAssistant.speak('Straight wall hazard: Defenders looking down have massive blind spots along the wall base!');
    } else if (mode === 'curved_bastion') {
      sounds.sparkle();
      voiceAssistant.speak('Curved Bastion (Burj): Semicircular stone towers project outwards, providing 360-degree crossfire coverage with zero blind spots!');
    } else {
      sounds.fanfare();
      voiceAssistant.speak('Acoustic archway dome: Clapping hands at the Fateh Darwaza main gate echoes clearly to the Bala Hissar palace 1 kilometer up on the hill!');
    }
  };

  return (
    <div className="w-full bg-slate-950 p-6 sm:p-8 rounded-3xl border-4 border-amber-600 shadow-2xl flex flex-col items-center text-white">
      {/* HUD Header */}
      <div className="w-full flex items-center justify-between mb-4 flex-wrap gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-500" />
          <span className="text-xs font-black uppercase tracking-widest text-amber-300">
            Golconda Fort Tactical Architecture Studio
          </span>
        </div>
        <span
          className={`text-xs font-black px-3.5 py-1 rounded-full ${
            activeMode === 'curved_bastion'
              ? 'bg-emerald-500 text-slate-950 font-black'
              : activeMode === 'straight_wall'
              ? 'bg-rose-500 text-white'
              : 'bg-amber-400 text-slate-950'
          }`}
        >
          {activeMode === 'curved_bastion'
            ? '✓ ZERO BLIND SPOTS (360° CROSSFIRE)'
            : activeMode === 'straight_wall'
            ? '⚠️ VULNERABLE BASE BLIND SPOT'
            : '🔊 1KM ACOUSTIC ECHO DOME'}
        </span>
      </div>

      {/* Mode Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full mb-4">
        {[
          { id: 'straight_wall', label: '1. Flat Wall (Blind Spot Hazard)', desc: 'Invaders climb unseen at base' },
          { id: 'curved_bastion', label: '2. Curved Bastion / Burj (360° FOV)', desc: 'Overlapping crossfire arcs' },
          { id: 'acoustics', label: '3. Fateh Darwaza Acoustic Gate', desc: '1km acoustic early warning dome' },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => handleModeChange(m.id as any)}
            className={`p-3 rounded-2xl border-2 text-left font-black transition-all cursor-pointer ${
              activeMode === m.id
                ? 'bg-amber-500 border-amber-300 text-slate-950 shadow-lg scale-102 ring-2 ring-amber-300'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-xs block">{m.label}</span>
            <span className="text-[10px] text-slate-700 dark:text-slate-300 block font-bold mt-0.5">{m.desc}</span>
          </button>
        ))}
      </div>

      {/* Photorealistic Canvas with Interactive Overlays */}
      <div className="relative w-full max-w-2xl h-96 rounded-3xl bg-slate-900 border-3 border-amber-500/70 shadow-2xl overflow-hidden flex items-center justify-center">
        {/* Base Image switching according to mode */}
        <motion.img
          key={activeMode === 'acoustics' ? 'gate' : 'bastion'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          src={activeMode === 'acoustics' ? fatehDarwazaImg : fortBastionsImg}
          alt="Golconda Fort Architecture"
          className="w-full h-full object-cover select-none"
        />

        {/* ════ OVERLAY 1: STRAIGHT WALL BLIND SPOT HAZARD ════ */}
        {activeMode === 'straight_wall' && (
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-between p-6">
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-rose-950/90 backdrop-blur-md p-3 rounded-2xl border-2 border-rose-500 max-w-sm text-center"
            >
              <div className="text-rose-400 font-black text-xs uppercase mb-1">
                ⚠️ Blind Spot Tactical Vulnerability
              </div>
              <p className="text-[11px] text-slate-200 font-bold">
                When walls are flat and straight, defenders at the top battlements cannot see enemies climbing the base of the wall directly underneath them!
              </p>
            </motion.div>

            {/* Visual Danger Zone Graphic */}
            <div className="w-48 h-16 bg-rose-600/60 border-2 border-rose-400 rounded-xl backdrop-blur-xs flex items-center justify-center text-xs font-black text-white animate-pulse">
              🚨 Wall Base Blind Spot Zone
            </div>
          </div>
        )}

        {/* ════ OVERLAY 2: CURVED BASTION 360° ARCS OF FIRE ════ */}
        {activeMode === 'curved_bastion' && (
          <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-between p-6 pointer-events-none">
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-emerald-950/90 backdrop-blur-md p-3.5 rounded-2xl border-2 border-emerald-400 max-w-sm text-center"
            >
              <div className="text-emerald-300 font-black text-xs uppercase mb-1 flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>360° Semicircular Bastion (Burj)</span>
              </div>
              <p className="text-[11px] text-slate-200 font-bold">
                Golconda's 87 circular stone bastions project outwards past the wall line. Guards stationed inside can shoot arrows and cannons in all directions, completely eliminating blind spots!
              </p>
            </motion.div>

            <div className="bg-slate-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-emerald-400 text-xs font-black text-emerald-300 shadow-xl">
              🛡️ Overlapping Crossfire Defense Coverage
            </div>
          </div>
        )}

        {/* ════ OVERLAY 3: FATEH DARWAZA ACOUSTIC ECHO ARCH ════ */}
        {activeMode === 'acoustics' && (
          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-between p-6 pointer-events-none">
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-amber-950/90 backdrop-blur-md p-3.5 rounded-2xl border-2 border-amber-400 max-w-sm text-center"
            >
              <div className="text-amber-300 font-black text-xs uppercase mb-1 flex items-center justify-center gap-1.5">
                <Volume2 className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>Fateh Darwaza Acoustic Dome</span>
              </div>
              <p className="text-[11px] text-slate-200 font-bold">
                Notice the domed stone ceiling arches! Even a single handclap underneath this archway focuses sound waves that reverberate all the way to the king's palace at Bala Hissar (1 km away) for instant defense alert!
              </p>
            </motion.div>

            {/* Sound Wave Rings */}
            <div className="relative flex items-center justify-center">
              {[1, 2, 3].map((w) => (
                <motion.div
                  key={w}
                  animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: w * 0.4 }}
                  className="w-16 h-16 rounded-full border-2 border-cyan-300 absolute"
                />
              ))}
              <span className="text-xs font-black text-amber-200 bg-slate-950/90 px-3 py-1 rounded-full border border-amber-400 z-10">
                👏 Handclap Echo (1km Acoustic Travel)
              </span>
            </div>
          </div>
        )}

        {/* HUD Tag */}
        <div className="absolute bottom-3 left-4 bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-xl border border-amber-400/60 text-[10px] font-black text-amber-200">
          🏰 Golconda Fort Structure: 87 Bastions (Burj) • 8 Spiked Gates
        </div>
      </div>

      <div className="w-full bg-slate-900 p-4 rounded-2xl border border-amber-600/40 text-center text-xs font-bold text-amber-200 mt-4">
        🛡️ <strong>CBSE Architecture Law:</strong> Ancient Indian forts were designed with curved protruding bastions to eliminate blind spots, iron-spiked doors to repel war elephants, and acoustic ceiling arches for long-distance military communication!
      </div>
    </div>
  );
};
