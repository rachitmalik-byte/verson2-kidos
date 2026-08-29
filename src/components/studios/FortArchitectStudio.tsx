import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  Shield,
  Eye,
  Volume2,
  Sparkles,
  Layers,
} from 'lucide-react';

/* ============================================================================
   FORT ARCHITECT STUDIO (1:500 TACTICAL ARCHITECTURAL SCALE)
   Used for: Golconda Fort Bastions (Burj), Iron Spiked Gates & Acoustic Archways
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
            Fort Tactical Architectural Plan (1:500 Scale)
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
          { id: 'straight_wall', label: '1. Flat Wall (Blind Spot Hazard)', desc: 'Invaders climb unseen' },
          { id: 'curved_bastion', label: '2. Curved Bastion / Burj (360° FOV)', desc: 'Overlapping crossfire arcs' },
          { id: 'acoustics', label: '3. Fateh Darwaza Sound Dome', desc: '1km acoustic early warning' },
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

      {/* Tactical Grid Canvas */}
      <div className="relative w-full max-w-xl h-80 rounded-3xl bg-[#141b2d] border-3 border-amber-500/50 shadow-2xl flex items-center justify-center p-4 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 340 220">
          <defs>
            <radialGradient id="fieldOfView" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="blindSpotGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ════ VIEW 1: FLAT STRAIGHT WALL (BLIND SPOT HAZARD) ════ */}
          {activeMode === 'straight_wall' && (
            <g transform="translate(170, 110)">
              {/* Massive Stone Fort Wall */}
              <rect x="-140" y="-15" width="280" height="30" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
              {/* Guards on top looking straight out */}
              <circle cx="-60" cy="-5" r="5" fill="#f59e0b" />
              <circle cx="60" cy="-5" r="5" fill="#f59e0b" />

              {/* Red Blind Spot Cone along the wall base */}
              <path d="M -140 15 L 140 15 L 90 70 L -90 70 Z" fill="url(#blindSpotGrad)" />
              <text x="0" y="45" fill="#f87171" fontSize="8" fontWeight="900" textAnchor="middle">
                ⚠️ BLIND SPOT ZONE (GUARDS CANNOT SEE BASE)
              </text>
              {/* Invaders Climbing */}
              <circle cx="-30" cy="25" r="4" fill="#ef4444" />
              <circle cx="30" cy="25" r="4" fill="#ef4444" />
              <text x="0" y="-30" fill="#94a3b8" fontSize="8" fontWeight="900" textAnchor="middle">
                FLAT STONE CURTAIN WALL
              </text>
            </g>
          )}

          {/* ════ VIEW 2: CURVED BASTION (BURJ) WITH 360° ARCS OF FIRE ════ */}
          {activeMode === 'curved_bastion' && (
            <g transform="translate(170, 110)">
              {/* Fort Walls */}
              <rect x="-140" y="-15" width="100" height="30" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
              <rect x="40" y="-15" width="100" height="30" fill="#475569" stroke="#94a3b8" strokeWidth="2" />

              {/* Overlapping Semicircular Green Crossfire Arcs */}
              <path d="M 0 0 L -120 80 A 130 130 0 0 0 120 80 Z" fill="url(#fieldOfView)" />
              <path d="M 0 0 L -80 -80 A 130 130 0 0 1 80 -80 Z" fill="url(#fieldOfView)" />

              {/* Semicircular Protruding Bastion Tower (Burj) */}
              <path d="M -40 -15 L -40 15 A 40 40 0 0 0 40 15 L 40 -15 Z" fill="#78350f" stroke="#fbbf24" strokeWidth="3" />
              <circle cx="0" cy="15" r="6" fill="#10b981" />
              {/* Cannon Openings */}
              <circle cx="-25" cy="30" r="3" fill="#020617" />
              <circle cx="0" cy="45" r="3" fill="#020617" />
              <circle cx="25" cy="30" r="3" fill="#020617" />

              <text x="0" y="85" fill="#34d399" fontSize="8" fontWeight="900" textAnchor="middle">
                360° OVERLAPPING ARCS OF FIRE (ZERO BLIND SPOTS)
              </text>
              <text x="0" y="-35" fill="#fef08a" fontSize="8" fontWeight="900" textAnchor="middle">
                OUTWARD-PROTRUDING BASTION (BURJ)
              </text>
            </g>
          )}

          {/* ════ VIEW 3: ACOUSTIC RESONANCE SOUND DOME ════ */}
          {activeMode === 'acoustics' && (
            <g transform="translate(170, 110)">
              {/* Fateh Darwaza Entrance Dome */}
              <path d="M -110 50 Q -110 -20 0 -20 Q 110 -20 110 50 Z" fill="none" stroke="#fbbf24" strokeWidth="3" />
              {/* Concentric Sound Waves Expanding to Bala Hissar */}
              {[20, 45, 70, 95].map((r, i) => (
                <circle
                  key={i}
                  cx="0"
                  cy="40"
                  r={r}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                  opacity={1 - i * 0.2}
                />
              ))}
              <circle cx="0" cy="40" r="6" fill="#f59e0b" />
              <text x="0" y="60" fill="#fef08a" fontSize="7" fontWeight="900" textAnchor="middle">
                CLAPPING AT FATEH DARWAZA ENTRANCE
              </text>
              <text x="0" y="-40" fill="#38bdf8" fontSize="8" fontWeight="900" textAnchor="middle">
                ACOUSTIC ECHO CARRIES 1KM UP TO BALA HISSAR
              </text>
            </g>
          )}
        </svg>

        {/* HUD Footnote */}
        <div className="absolute bottom-3 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/60 text-[10px] font-black text-amber-200">
          🏰 Golconda Fort Structure: 87 Bastions (Burj) • 8 Massive Spiked Gates
        </div>
      </div>

      <div className="w-full bg-slate-900 p-4 rounded-2xl border border-amber-600/40 text-center text-xs font-bold text-amber-200 mt-4">
        🛡️ <strong>Military Architecture:</strong> Golconda’s 87 circular bastions projected past the straight curtain walls so defenders could spot approaching enemies from any angle without exposing themselves!
      </div>
    </div>
  );
};
