import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Thermometer, Gauge, Sparkles, RotateCcw, CheckCircle2, Factory } from 'lucide-react';

// Stage Images
import rawPelletsImg from '@/assets/images/specimens/plastic_pet_pellets.jpg';
import heating200cImg from '@/assets/images/experiments/plastic_heating_200c.jpg';
import mouldPress500psiImg from '@/assets/images/experiments/plastic_mould_press_500psi.jpg';
import finishedBottleImg from '@/assets/images/experiments/pet_water_bottle_molding.jpg';

export interface PlasticFactoryMouldingSimulatorProps {
  onComplete?: () => void;
  isStepCompleted?: boolean;
}

interface FactoryStage {
  id: number;
  title: string;
  shortName: string;
  badge: string;
  temp: number;
  pressure: number;
  image: string;
  alt: string;
  caption: string;
  description: string;
  pipSpeech: string;
}

const STAGES: FactoryStage[] = [
  {
    id: 1,
    title: '1. Raw Thermoplastic Pellets in Hopper',
    shortName: 'Raw Pellets',
    badge: '⚪ Stage 1: Room Temp (25°C)',
    temp: 25,
    pressure: 0,
    image: rawPelletsImg,
    alt: 'Raw synthetic PET plastic pellets before heating',
    caption: 'Hard, granular thermoplastic pellets (polyethylene terephthalate) loaded into the machine.',
    description: 'Thermoplastic polymers arrive at the factory as hard, cold beads called pellets or resin.',
    pipSpeech: 'Look at these tiny plastic pellets! At room temperature, they are solid, hard, and cannot take new shapes yet.',
  },
  {
    id: 2,
    title: '2. Applying 200°C Thermal Heat',
    shortName: 'Melting at 200°C',
    badge: '🔥 Stage 2: Molten Polymer (200°C)',
    temp: 200,
    pressure: 0,
    image: heating200cImg,
    alt: 'PET plastic pellets melting into glowing liquid polymer in heated stainless steel cylinder',
    caption: 'Heating coils heat the chamber to 200°C. Long polymer chains slide past each other, turning molten!',
    description: 'Heat breaks the weak intermolecular bonds between polymer chains, turning the plastic into a thick, moldable liquid.',
    pipSpeech: '200 degrees Celsius applied! Look at the plastic melting like warm honey! Heat lets the polymer chains slide freely.',
  },
  {
    id: 3,
    title: '3. 500 PSI High-Pressure Steel Moulding',
    shortName: '500 PSI Moulding',
    badge: '⚙️ Stage 3: High Pressure (500 PSI)',
    temp: 180,
    pressure: 500,
    image: mouldPress500psiImg,
    alt: 'Precision polished steel bottle mould clamping around molten plastic parison with 500 PSI air',
    caption: 'Two polished steel mould halves clamp shut! 500 PSI compressed air blasts inside, forcing molten plastic into the cavity contours!',
    description: 'Massive hydraulic pressure and compressed air expand the hot plastic to take the exact hollow shape of the steel mould.',
    pipSpeech: '500 PSI pressure pressed! Powerful compressed air blasts the molten plastic tightly against the steel mould walls!',
  },
  {
    id: 4,
    title: '4. Rapid Cooling & Finished PET Bottle Ejected',
    shortName: 'Cooled Bottle',
    badge: '✨ Stage 4: Solidified & Ejected',
    temp: 25,
    pressure: 0,
    image: finishedBottleImg,
    alt: 'Finished high-strength molded PET plastic water bottle',
    caption: 'Chilled water lines cool the mould down to 25°C. The polymer solidifies permanently into a lightweight, durable bottle!',
    description: 'As it cools, the polymer chains lock into place, producing a lightweight, waterproof, shatter-resistant container.',
    pipSpeech: 'Moulding complete! Rapid cooling locked the plastic into a lightweight, shatterproof bottle ready for drinking water!',
  },
];

export const PlasticFactoryMouldingSimulator: React.FC<PlasticFactoryMouldingSimulatorProps> = ({
  onComplete,
  isStepCompleted,
}) => {
  const [currentStageId, setCurrentStageId] = useState<number>(1);
  const [heatUnlocked, setHeatUnlocked] = useState(false);
  const [pressureUnlocked, setPressureUnlocked] = useState(false);

  const activeStage = STAGES.find((s) => s.id === currentStageId) || STAGES[0];

  const handleSelectStage = (stageId: number) => {
    sounds.pop();
    setCurrentStageId(stageId);
    const target = STAGES.find((s) => s.id === stageId);
    if (target) {
      voiceAssistant.speak(target.pipSpeech);
    }
    if (stageId >= 3 && onComplete) {
      onComplete();
    }
  };

  const handleApplyHeat = () => {
    sounds.splash();
    setHeatUnlocked(true);
    setCurrentStageId(2);
    voiceAssistant.speak(STAGES[1].pipSpeech);
  };

  const handleApplyPressure = () => {
    if (!heatUnlocked && currentStageId < 2) {
      sounds.boing();
      voiceAssistant.speak('Heat the plastic to 200°C first so it turns soft and molten before applying pressure!');
      return;
    }
    sounds.success();
    setPressureUnlocked(true);
    setCurrentStageId(3);
    voiceAssistant.speak(STAGES[2].pipSpeech);
    if (onComplete) {
      onComplete();
    }
  };

  const handleEject = () => {
    sounds.fanfare();
    setCurrentStageId(4);
    voiceAssistant.speak(STAGES[3].pipSpeech);
    if (onComplete) {
      onComplete();
    }
  };

  const handleReset = () => {
    sounds.pop();
    setCurrentStageId(1);
    setHeatUnlocked(false);
    setPressureUnlocked(false);
    voiceAssistant.speak('Simulator reset! Ready to operate the factory moulding press from Stage 1!');
  };

  return (
    <div className="w-full max-w-3xl bg-white p-5 sm:p-7 rounded-3xl border-3 border-amber-300 shadow-xl flex flex-col items-center select-none font-sans text-slate-900">
      {/* Simulator Header */}
      <div className="w-full flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-tr from-amber-400 to-orange-400 rounded-2xl text-slate-950 shadow-xs">
            <Factory className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="text-left">
            <h3 className="text-base sm:text-lg font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Factory Heat & Pressure Moulding Simulator
            </h3>
            <span className="text-[11px] font-bold text-amber-700">
              Interactive 4-Stage Industrial Blow-Moulding Demonstration
            </span>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black cursor-pointer active:scale-95 transition-all"
          title="Reset Simulator"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Main Visual Screen Stage */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[360px] rounded-2xl overflow-hidden border-2 border-slate-200 shadow-inner bg-slate-950 flex items-center justify-center mb-4">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeStage.id}
            src={activeStage.image}
            alt={activeStage.alt}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Live HUD Gauges Overlay (Top-Left) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {/* Temperature HUD */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md border text-xs font-black transition-all ${
              activeStage.temp >= 180
                ? 'bg-rose-950/85 border-rose-500/60 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                : 'bg-slate-900/80 border-slate-700 text-slate-300'
            }`}
          >
            <Thermometer
              className={`w-3.5 h-3.5 ${activeStage.temp >= 180 ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`}
            />
            <span>{activeStage.temp}°C Heat</span>
          </div>

          {/* Pressure HUD */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md border text-xs font-black transition-all ${
              activeStage.pressure > 0
                ? 'bg-emerald-950/85 border-emerald-500/60 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'bg-slate-900/80 border-slate-700 text-slate-300'
            }`}
          >
            <Gauge
              className={`w-3.5 h-3.5 ${activeStage.pressure > 0 ? 'text-emerald-400 animate-spin' : 'text-slate-400'}`}
            />
            <span>{activeStage.pressure} PSI Pressure</span>
          </div>
        </div>

        {/* Live Stage Badge (Top-Right) */}
        <div className="absolute top-3 right-3 pointer-events-none">
          <span className="px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[11px] font-black shadow-md">
            Stage {activeStage.id} of 4
          </span>
        </div>

        {/* Bottom Caption Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 sm:p-4 text-left pointer-events-none">
          <span className="text-white font-black text-xs sm:text-sm block leading-tight">
            {activeStage.title}
          </span>
          <p className="text-slate-200 font-bold text-[11px] sm:text-xs mt-0.5 line-clamp-2 leading-relaxed">
            {activeStage.caption}
          </p>
        </div>
      </div>

      {/* 4 Interactive Stage Selector Buttons (Thumbnails Strip) */}
      <div className="grid grid-cols-4 gap-2 w-full mb-4">
        {STAGES.map((st) => {
          const isSelected = st.id === currentStageId;
          return (
            <button
              key={st.id}
              onClick={() => handleSelectStage(st.id)}
              className={`p-2 rounded-2xl border-2 flex flex-col items-center gap-1 cursor-pointer transition-all ${
                isSelected
                  ? 'bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-300/60 scale-[1.02]'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                <img src={st.image} alt={st.shortName} className="w-full h-full object-cover" />
              </div>
              <span
                className={`text-[10px] sm:text-xs font-black truncate w-full text-center ${
                  isSelected ? 'text-amber-900' : 'text-slate-600'
                }`}
              >
                {st.shortName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Step-by-Step Action Control Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full mb-4">
        {/* Step 1: Heat to 200°C */}
        <button
          onClick={handleApplyHeat}
          className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${
            currentStageId === 2
              ? 'bg-rose-500 border-rose-600 text-white font-black shadow-md ring-2 ring-rose-300/60'
              : 'bg-rose-50 border-rose-300 text-rose-900 hover:bg-rose-100 font-bold'
          }`}
        >
          <Thermometer className="w-4 h-4 text-rose-500" />
          <span className="text-xs font-black">
            {currentStageId >= 2 ? '✓ 200°C Heat Applied' : '1. Apply 200°C Heat 🔥'}
          </span>
        </button>

        {/* Step 2: Apply 500 PSI */}
        <button
          onClick={handleApplyPressure}
          className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${
            currentStageId === 3
              ? 'bg-emerald-500 border-emerald-600 text-white font-black shadow-md ring-2 ring-emerald-300/60'
              : 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100 font-bold'
          }`}
        >
          <Gauge className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-black">
            {currentStageId >= 3 ? '✓ 500 PSI Pressed!' : '2. Apply 500 PSI ⚙️'}
          </span>
        </button>

        {/* Step 3: Cool & Eject */}
        <button
          onClick={handleEject}
          className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${
            currentStageId === 4
              ? 'bg-gradient-to-r from-amber-400 to-orange-400 border-amber-500 text-slate-950 font-black shadow-md ring-2 ring-amber-300/60'
              : 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100 font-bold'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-black">
            {currentStageId === 4 ? '✓ Bottle Ejected ✨' : '3. Cool & Eject 🧴'}
          </span>
        </button>
      </div>

      {/* Completion Banner */}
      {currentStageId >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 bg-emerald-50 border-2 border-emerald-400 rounded-2xl w-full flex items-center gap-2.5 text-left"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-black text-xs sm:text-sm text-emerald-950 block">
              ✨ Moulding Complete! High-strength thermoplastic bottle formed!
            </span>
            <span className="text-[11px] font-bold text-emerald-800">
              💡 Science Fact: Because PET is a thermoplastic, this bottle can be shredded, remelted at 200°C, and molded into a new bottle again!
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
