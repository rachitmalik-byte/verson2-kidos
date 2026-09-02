import { ThreeAquariumSim } from '@/components/three-lab/ThreeAquariumSim';
import React, { useState } from 'react';
import mosquitoMicroscopeImg from '@/assets/images/specimens/mosquito_larva_microscope.jpg';
import oilFilmPreventionImg from '@/assets/images/specimens/oil_film_mosquito_prevention.jpg';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Droplets, Sparkles, Waves, Castle, Microscope, Shield, RotateCcw, CheckCircle2, ArrowRight } from 'lucide-react';

/* ============================================================================
   1. 🏰 GHADISAR LAKE 9-TANK INTERCONNECTED STEPWELL SIMULATOR (WATER CHAPTER 2)
   ============================================================================ */
export const GhadisarStepwellWaterSim: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [filledTanks, setFilledTanks] = useState<number>(1);
  const [rainActive, setRainActive] = useState<boolean>(false);

  const handleStartRain = () => {
    sounds.bubble();
    setRainActive(true);
    voiceAssistant.speak(
      'Monsoon rains begin in Jaisalmer! In King Ghadsi’s 650-year-old engineering design, water fills Lake 1, overflows through stone canals into Lake 2, and cascades across all 9 interconnected lakes!'
    );

    const interval = setInterval(() => {
      setFilledTanks((prev) => {
        if (prev >= 9) {
          clearInterval(interval);
          sounds.fanfare();
          if (onCompleted) onCompleted();
          return 9;
        }
        sounds.pop();
        return prev + 1;
      });
    }, 700);
  };

  const handleReset = () => {
    sounds.pop();
    setFilledTanks(1);
    setRainActive(false);
  };

  return (
    <div className="w-full bg-white p-6 sm:p-8 rounded-3xl border-4 border-amber-400 shadow-xl flex flex-col items-center">
      <div className="flex items-center gap-2 mb-2">
        <Castle className="w-6 h-6 text-amber-600" />
        <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
          Jaisalmer Ghadisar Lake: 9 Interconnected Tanks & Stepwell
        </h3>
      </div>
      <p className="text-xs sm:text-sm text-slate-600 font-bold mb-4 text-center max-w-lg">
        Built 650 years ago in Rajasthan: rain fills the highest lake, and natural gravity channels overflow water to 9 lower lakes without wasting a single drop!
      </p>

      {/* 9 Interconnected Tanks Visual Grid */}
      <div className="w-full bg-gradient-to-b from-amber-50 to-orange-100 p-5 rounded-3xl border-2 border-amber-200 shadow-inner my-2">
        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
          {[...Array(9)].map((_, idx) => {
            const isFilled = idx < filledTanks;
            return (
              <motion.div
                key={idx}
                animate={{
                  scale: isFilled ? [1, 1.05, 1] : 1,
                  borderColor: isFilled ? '#0284C7' : '#D97706',
                }}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-between text-center transition-all ${
                  isFilled
                    ? 'bg-gradient-to-b from-sky-400 to-blue-500 text-white shadow-md'
                    : 'bg-amber-100/80 text-amber-900 border-dashed border-amber-300'
                }`}
              >
                <span className="text-[10px] font-black uppercase">Tank {idx + 1}</span>
                <span className="text-2xl my-1">{isFilled ? '💧' : '🏜️'}</span>
                <span className="text-[9px] font-bold">
                  {isFilled ? '100% Full' : 'Empty'}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Gravity Flow Direction Arrows */}
        <div className="flex items-between justify-between px-2 mt-3 text-amber-700 text-xs font-black">
          <span>⬆️ Lake 1 (Catchment Basin)</span>
          <span className="hidden sm:inline">Gravity Flow Canals ➔ ➔ ➔</span>
          <span>Lake 9 (Underground Bawri) ⬇️</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
        {!rainActive ? (
          <button
            onClick={handleStartRain}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black text-sm shadow-lg cursor-pointer transition-all active:scale-95 flex items-center gap-2"
          >
            <span>🌧️ Start Monsoon Rain on Lake 1</span>
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs border border-slate-300 cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Lakes</span>
          </button>
        )}
      </div>

      {filledTanks >= 9 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3.5 bg-emerald-50 border border-emerald-400 rounded-2xl text-xs font-black text-emerald-950 text-center"
        >
          🎉 Ancient Engineering Discovery: All 9 lakes are full! In dry desert summers, stepwells (Bawris) provide clean drinking water year-round!
        </motion.div>
      )}
    </div>
  );
};

/* ============================================================================
   2. 🧪 DEAD SEA DENSITY & BUOYANCY SIMULATOR (WATER CHAPTER 3) — 3D THREE.JS LAB
   ============================================================================ */
export const DensityBuoyancyDeadSeaSim: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  return <ThreeAquariumSim onCompleted={onCompleted} />;
};

/* ============================================================================
   3. 🔬 MOSQUITO LARVAE WATER ECOLOGY & BREATHING SIPHON LAB (2.5D CROSS-SECTION)
   ============================================================================ */
export const MosquitoLarvaeEcologySim: React.FC<{ onCompleted?: () => void }> = ({ onCompleted }) => {
  const [activeTab, setActiveTab] = useState<'cross_section' | 'microscope' | 'prevention_methods'>('cross_section');
  const [preventionMethod, setPreventionMethod] = useState<'none' | 'oil' | 'fish' | 'drain'>('none');
  const [isWiggling, setIsWiggling] = useState<boolean>(false);
  const [zoomScale, setZoomScale] = useState<number>(100);

  const handleApplyMethod = (method: 'oil' | 'fish' | 'drain') => {
    sounds.pop();
    setPreventionMethod(method);

    if (method === 'oil') {
      sounds.sparkle();
      voiceAssistant.speak(
        'Eco-Oil Barrier Applied! Oil is lighter than water (0.8 g/cm³), so it forms a surface film that clogs the breathing siphon tube of mosquito larvae, preventing them from inhaling air!'
      );
    } else if (method === 'fish') {
      sounds.success();
      voiceAssistant.speak(
        'Gambusia Guppy Fish Released! These small fish love eating mosquito larvae, consuming over 100 larvae per day without chemicals!'
      );
    } else if (method === 'drain') {
      sounds.fanfare();
      voiceAssistant.speak(
        'Stagnant Water Drained! Mosquito eggs take 7 to 10 days to grow into flying adults. Emptying and scrubbing water tanks once a week breaks the breeding cycle completely!'
      );
    }

    if (onCompleted) onCompleted();
  };

  const handleReset = () => {
    sounds.pop();
    setPreventionMethod('none');
  };

  const handleTriggerWiggle = () => {
    sounds.bubble();
    setIsWiggling(true);
    voiceAssistant.speak(
      'Larvae wriggle through the water with an S-shaped thrash, then float upside down back to the surface to breathe air through their tail siphon!'
    );
    setTimeout(() => setIsWiggling(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl bg-white p-5 sm:p-7 rounded-[36px] border-4 border-emerald-400 shadow-2xl flex flex-col items-center select-none font-sans text-slate-900">
      {/* Top Header HUD */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full mb-4 border-b-2 border-emerald-100 pb-3">
        <div className="text-center sm:text-left">
          <span className="text-xs font-black uppercase text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 inline-block mb-1 shadow-xs">
            🔬 Water Ecology & Disease Prevention
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Mosquito Larvae: Breathing Siphon & Water Ecology Lab
          </h3>
        </div>

        {/* 3 Nav Station Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          {[
            { id: 'cross_section', label: '🌊 1. Water Cross-Section' },
            { id: 'microscope', label: '🔬 2. 100x Siphon Scope' },
            { id: 'prevention_methods', label: '🛡️ 3. Prevention Methods' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.pop();
                setActiveTab(tab.id as any);
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          STATION 1: 2.5D CROSS-SECTION OF STAGNANT WATER & BREATHING LARVAE
      ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'cross_section' && (
        <div className="w-full flex flex-col items-center">
          {/* Main 2.5D Cross-Section Tank */}
          <div className="relative w-full h-84 sm:h-96 rounded-3xl overflow-hidden border-4 border-emerald-600 shadow-2xl bg-gradient-to-b from-sky-100 via-sky-300 to-teal-800 flex flex-col justify-between p-4 relative">
            {/* Atmospheric Air Zone (Top 25%) */}
            <div className="w-full h-20 bg-gradient-to-b from-sky-200/90 to-sky-100/40 p-2 flex items-center justify-between z-10">
              <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-full border border-sky-300 shadow-xs text-xs font-black text-sky-950">
                <span>🌬️ Atmospheric Air Zone (21% Oxygen O₂)</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-slate-700 bg-white/90 px-2.5 py-0.5 rounded-md border">
                  Stagnant Water Pool
                </span>
              </div>
            </div>

            {/* ── WATER SURFACE MENISCUS (SURFACE TENSION BOUNDARY) ── */}
            <div className="relative w-full z-20">
              {/* Shimmering Surface Tension Line */}
              <div className="w-full h-2 bg-gradient-to-r from-sky-400 via-cyan-200 to-sky-400 shadow-[0_0_12px_#38bdf8] relative flex items-center justify-center">
                <span className="text-[9px] font-black text-slate-900 bg-white/95 px-3 py-0.5 rounded-full border border-sky-400 shadow-xs">
                  💧 Water Surface Meniscus (Surface Tension Skin)
                </span>
              </div>

              {/* Golden Oil Film Overlay if Applied */}
              {preventionMethod === 'oil' && (
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="w-full h-3.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 shadow-[0_0_15px_#f59e0b] flex items-center justify-center -mt-1.5"
                >
                  <span className="text-[9px] font-black text-slate-950 bg-amber-200 px-3 py-0.5 rounded-full border border-amber-500">
                    🛡️ Floating Eco-Oil Film (ρ = 0.8 g/cm³) — O₂ Cut Off!
                  </span>
                </motion.div>
              )}
            </div>

            {/* ── UNDERWATER HABITAT (UNDERWATER CROSS-SECTION) ── */}
            <div className="relative flex-1 w-full flex items-center justify-around overflow-hidden z-10">
              {/* 4 Anatomically Accurate 2.5D Mosquito Larvae (Wrigglers) */}
              {preventionMethod !== 'drain' && (
                <div className="absolute inset-0 flex items-start justify-around pt-2 px-8">
                  {[1, 2, 3, 4].map((larvaId) => {
                    const isDeadFromOil = preventionMethod === 'oil';
                    const isEatenByFish = preventionMethod === 'fish';

                    if (isEatenByFish) return null;

                    return (
                      <motion.div
                        key={larvaId}
                        animate={
                          isDeadFromOil
                            ? { y: [0, 160], rotate: [0, 180], opacity: [1, 0.4] }
                            : isWiggling
                            ? { y: [0, 60, 20, 0], x: [0, -15, 15, 0], rotate: [-10, 25, -25, 0] }
                            : { y: [-2, 4, -2], rotate: [-4, 4, -4] }
                        }
                        transition={
                          isDeadFromOil
                            ? { duration: 2, ease: 'easeIn' }
                            : { repeat: Infinity, duration: 2.2 + larvaId * 0.3, ease: 'easeInOut' }
                        }
                        className="flex flex-col items-center cursor-pointer group"
                        title="Mosquito Larva (Wriggler) hanging upside down from surface"
                      >
                        {/* BREATHING SIPHON (TAIL SNORKEL) */}
                        <div className="w-2.5 h-6 bg-amber-800 border border-amber-950 rounded-t-sm relative shadow-xs flex flex-col items-center">
                          <div className="w-4 h-1.5 bg-red-600 rounded-full absolute -top-1 shadow-xs" />
                          {!isDeadFromOil && (
                            <div className="w-2 h-2 rounded-full bg-white/90 absolute -top-3 animate-ping" />
                          )}
                        </div>

                        {/* SEGMENTED LARVA BODY HANGING DOWN */}
                        <div className="w-4 h-5 bg-emerald-800 border border-emerald-950 rounded-md -mt-0.5 shadow-xs" />
                        <div className="w-4.5 h-5 bg-emerald-700 border border-emerald-950 rounded-md -mt-0.5 shadow-xs" />
                        <div className="w-5 h-6 bg-emerald-600 border border-emerald-950 rounded-md -mt-0.5 shadow-xs flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-black mx-auto" />
                        </div>
                        {/* Feathery Brushes (Head Feeding Brushes at Bottom) */}
                        <div className="flex gap-1 text-[8px] text-emerald-950 font-black">
                          <span>彡</span>
                          <span>彡</span>
                        </div>

                        <span className="text-[8px] font-black text-white bg-slate-950/80 px-1.5 py-0.5 rounded-md mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {isDeadFromOil ? 'Clogged Siphon' : 'Larva (Wriggler)'}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Gambusia Guppy Fish Swimming if Released */}
              {preventionMethod === 'fish' && (
                <div className="absolute inset-0 flex items-center justify-around pointer-events-none">
                  {[1, 2, 3].map((fishId) => (
                    <motion.div
                      key={fishId}
                      animate={{
                        x: [-60, 60, -60],
                        y: [-15, 15, -15],
                        scaleX: [1, 1, -1, -1, 1],
                      }}
                      transition={{ repeat: Infinity, duration: 4 + fishId, ease: 'easeInOut' }}
                      className="flex items-center gap-1 text-4xl filter drop-shadow-md"
                    >
                      <span>🐟</span>
                      <span className="text-[10px] font-black text-amber-200 bg-slate-900/90 px-2 py-0.5 rounded-full border border-amber-400">
                        Gambusia Fish (Eating Larvae 😋)
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Drained Tank State */}
              {preventionMethod === 'drain' && (
                <div className="flex flex-col items-center justify-center text-center p-6 bg-slate-950/90 rounded-3xl border-2 border-emerald-400 z-30 shadow-2xl">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-2" />
                  <h4 className="text-base font-black text-white">Stagnant Water Drained & Scrubbed!</h4>
                  <p className="text-xs text-emerald-200 mt-1 max-w-sm font-bold">
                    By cleaning coolers, flowerpots, and buckets once every week, mosquito eggs never have the 7 days needed to become biting adults!
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Status Information Banner */}
            <div className="w-full bg-slate-950/90 backdrop-blur-md p-2.5 rounded-2xl border border-emerald-400 text-white text-xs font-bold flex flex-col sm:flex-row items-center justify-between gap-2 z-20 shadow-lg">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {preventionMethod === 'none' ? '⚠️' : '🛡️'}
                </span>
                <span>
                  {preventionMethod === 'none'
                    ? '4 Mosquito Larvae hanging upside down breathing atmospheric air through tail siphons.'
                    : preventionMethod === 'oil'
                    ? 'Eco-Oil film blocked oxygen siphons! Larvae cannot breathe and sink.'
                    : preventionMethod === 'fish'
                    ? 'Gambusia fish released! Biological control eating 100+ larvae/day.'
                    : 'Cooler drained! Weekly cleaning stops mosquito life cycle.'}
                </span>
              </div>

              {/* Wiggle Button */}
              {preventionMethod === 'none' && (
                <button
                  onClick={handleTriggerWiggle}
                  className="px-3.5 py-1 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-[11px] cursor-pointer active:scale-95 transition-all shrink-0"
                >
                  ⚡ Trigger Larvae Swim
                </button>
              )}
            </div>
          </div>

          {/* Quick Prevention Action Triggers Below Tank */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4 w-full">
            <button
              onClick={() => handleApplyMethod('oil')}
              className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm cursor-pointer active:scale-95 transition-all flex items-center gap-1.5 shadow-md ${
                preventionMethod === 'oil'
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-500 font-black'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:brightness-110'
              }`}
            >
              <span>🛢️ 1. Pour Eco-Oil Film</span>
            </button>

            <button
              onClick={() => handleApplyMethod('fish')}
              className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm cursor-pointer active:scale-95 transition-all flex items-center gap-1.5 shadow-md ${
                preventionMethod === 'fish'
                  ? 'bg-cyan-400 text-slate-950 ring-2 ring-cyan-500 font-black'
                  : 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white hover:brightness-110'
              }`}
            >
              <span>🐟 2. Add Gambusia Fish</span>
            </button>

            <button
              onClick={() => handleApplyMethod('drain')}
              className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm cursor-pointer active:scale-95 transition-all flex items-center gap-1.5 shadow-md ${
                preventionMethod === 'drain'
                  ? 'bg-emerald-400 text-slate-950 ring-2 ring-emerald-500 font-black'
                  : 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:brightness-110'
              }`}
            >
              <span>🚰 3. Drain Stagnant Water</span>
            </button>

            {preventionMethod !== 'none' && (
              <button
                onClick={handleReset}
                className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs border border-slate-300 cursor-pointer active:scale-95 transition-all flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Water</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          STATION 2: 100X OPTICAL MICROSCOPE (BREATHING SIPHON TIP)
      ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'microscope' && (
        <div className="w-full flex flex-col items-center">
          <div className="relative w-full h-84 sm:h-96 rounded-3xl overflow-hidden border-4 border-emerald-600 shadow-2xl bg-slate-950 flex flex-col sm:flex-row items-center justify-around p-6 text-white">
            {/* Authentic 100x Microscope Image */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full border-6 border-emerald-400 shadow-[0_0_30px_#10b981] overflow-hidden flex items-center justify-center shrink-0">
              <img
                src={mosquitoMicroscopeImg}
                alt="Mosquito Larva Breathing Siphon Microscope"
                className="w-full h-full object-cover"
                style={{ transform: `scale(${zoomScale / 100})` }}
              />
              <div className="absolute inset-0 pointer-events-none border border-emerald-400/40 rounded-full flex items-center justify-center">
                <div className="w-full h-[1px] bg-emerald-400/40 absolute" />
                <div className="h-full w-[1px] bg-emerald-400/40 absolute" />
              </div>
              <span className="absolute bottom-2 bg-slate-950/80 px-2.5 py-0.5 rounded-full text-[10px] font-black text-emerald-300 border border-emerald-500">
                100x Optical Microscope
              </span>
            </div>

            {/* Microscope Anatomical Explanations */}
            <div className="flex flex-col max-w-sm mt-4 sm:mt-0 gap-3">
              <div className="bg-slate-900/90 p-4 rounded-2xl border-2 border-emerald-400 shadow-md">
                <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500">
                  Tail Breathing Siphon (Snorkel)
                </span>
                <h4 className="text-base font-black text-white mt-1">Why Do Larvae Hang Upside Down?</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed font-bold">
                  Unlike fish, mosquito larvae do <strong>not have gills</strong>. They have a specialized tube at their tail called a <strong>breathing siphon</strong> with 5 water-repellent valves that pierce the water surface to breathe atmospheric air!
                </p>
              </div>

              {/* Magnification Slider */}
              <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-700 flex items-center justify-between gap-3">
                <span className="text-xs font-black text-slate-300">Magnification: {zoomScale}%</span>
                <input
                  type="range"
                  min="100"
                  max="180"
                  value={zoomScale}
                  onChange={(e) => setZoomScale(Number(e.target.value))}
                  className="accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          STATION 3: REAL-WORLD PREVENTION SCIENCE COMPARISON
      ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'prevention_methods' && (
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Eco-Oil Surface Film */}
          <div className="bg-amber-50 border-3 border-amber-400 rounded-3xl p-5 flex flex-col justify-between shadow-md">
            <div>
              <span className="text-3xl mb-2 block">🛢️</span>
              <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-200 px-2.5 py-0.5 rounded-full border border-amber-300">
                Physics Method
              </span>
              <h4 className="text-base font-black text-slate-900 mt-2">Eco-Oil Surface Barrier</h4>
              <p className="text-xs text-slate-700 mt-1 font-bold leading-relaxed">
                Oil floats on top of water (`ρ = 0.8 g/cm³`) creating a sealed liquid blanket that clogs breathing siphons and stops oxygen intake!
              </p>
            </div>
            <span className="text-[10px] font-black text-amber-900 bg-amber-100 px-2 py-1 rounded-xl mt-3 text-center border">
              Used in drains & stagnant puddles
            </span>
          </div>

          {/* Card 2: Gambusia Fish */}
          <div className="bg-cyan-50 border-3 border-cyan-400 rounded-3xl p-5 flex flex-col justify-between shadow-md">
            <div>
              <span className="text-3xl mb-2 block">🐟</span>
              <span className="text-[10px] font-black uppercase text-cyan-900 bg-cyan-200 px-2.5 py-0.5 rounded-full border border-cyan-300">
                Biological Control
              </span>
              <h4 className="text-base font-black text-slate-900 mt-2">Gambusia Fish (Guppy)</h4>
              <p className="text-xs text-slate-700 mt-1 font-bold leading-relaxed">
                Releasing Gambusia fish into freshwater ponds provides natural biological control — each fish eats over 100 larvae every single day!
              </p>
            </div>
            <span className="text-[10px] font-black text-cyan-900 bg-cyan-100 px-2 py-1 rounded-xl mt-3 text-center border">
              Zero chemicals • Eco-friendly
            </span>
          </div>

          {/* Card 3: Weekly Cooler Drainage */}
          <div className="bg-emerald-50 border-3 border-emerald-400 rounded-3xl p-5 flex flex-col justify-between shadow-md">
            <div>
              <span className="text-3xl mb-2 block">🚰</span>
              <span className="text-[10px] font-black uppercase text-emerald-900 bg-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-300">
                Life-Cycle Disruption
              </span>
              <h4 className="text-base font-black text-slate-900 mt-2">Weekly Cooler Cleaning</h4>
              <p className="text-xs text-slate-700 mt-1 font-bold leading-relaxed">
                Mosquitoes take 7 to 10 days to grow from eggs into biting adults. Emptying and drying water coolers every week breaks the cycle!
              </p>
            </div>
            <span className="text-[10px] font-black text-emerald-900 bg-emerald-100 px-2 py-1 rounded-xl mt-3 text-center border">
              Best home prevention practice
            </span>
          </div>
        </div>
      )}

      {/* 5th Grade Key Teaching Secret */}
      <div className="w-full bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-200 text-center sm:text-left text-xs font-bold text-emerald-950 mt-4">
        🦟 <strong>5th Grade Science Secret (A Treat for Mosquitoes):</strong> Mosquito larvae (wrigglers) hang upside down because their <strong>breathing siphon is at their tail</strong>. Pouring a drop of oil creates a surface film that cuts off their air, while Gambusia fish and weekly water drainage stop malaria and dengue breeding!
      </div>
    </div>
  );
};
