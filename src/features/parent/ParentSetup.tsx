import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useParentStore } from '@/stores/parentStore';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  Sparkles,
  ArrowRight,
  Check,
  ArrowLeft,
  Rocket,
  TreePine,
  Bot,
  Car,
  Lightbulb,
  Cpu,
  CloudRain,
  Microscope,
  Palette,
  Search,
  Flame,
  Globe,
} from 'lucide-react';

const GRADES = ['4', '5', '6', '7', '8'];

const INTERESTS = [
  { id: 'space', label: 'Space Science', icon: <Rocket className="w-5 h-5 text-indigo-500" /> },
  { id: 'nature', label: 'Nature & Wildlife', icon: <TreePine className="w-5 h-5 text-emerald-500" /> },
  { id: 'robotics', label: 'Robots & AI', icon: <Bot className="w-5 h-5 text-sky-500" /> },
  { id: 'cars', label: 'Automobiles', icon: <Car className="w-5 h-5 text-rose-500" /> },
  { id: 'inventions', label: 'Modern Inventions', icon: <Lightbulb className="w-5 h-5 text-amber-500" /> },
  { id: 'coding', label: 'Coding & Tech', icon: <Cpu className="w-5 h-5 text-violet-500" /> },
  { id: 'weather', label: 'Weather Science', icon: <CloudRain className="w-5 h-5 text-blue-500" /> },
  { id: 'microscope', label: 'Chemistry & Biology', icon: <Microscope className="w-5 h-5 text-teal-500" /> },
  { id: 'art', label: 'Creative Design', icon: <Palette className="w-5 h-5 text-fuchsia-500" /> },
  { id: 'mysteries', label: 'Science Mysteries', icon: <Search className="w-5 h-5 text-orange-500" /> },
  { id: 'volcanoes', label: 'Earth & Volcanoes', icon: <Flame className="w-5 h-5 text-red-500" /> },
  { id: 'ocean', label: 'Ocean Exploration', icon: <Globe className="w-5 h-5 text-cyan-500" /> },
];

export function ParentSetup() {
  const navigate = useNavigate();
  const { setChild, setPin, completeSetup } = useParentStore();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('5');
  const [birthdate, setBirthdate] = useState('2015-06-15');
  const [interests, setSelectedInterests] = useState<string[]>(['inventions', 'microscope']);
  const [pin, setPinState] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isConfirmingPin, setIsConfirmingPin] = useState(false);
  const [pinError, setPinError] = useState(false);

  const nextStep = () => {
    sounds.pop();
    setStep((s) => s + 1);
  };

  const prevStep = () => {
    sounds.pop();
    if (step > 1) setStep((s) => s - 1);
    else navigate('/');
  };

  const toggleInterest = (id: string) => {
    sounds.pop();
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handlePinInput = (num: number) => {
    sounds.pop();
    if (isConfirmingPin) {
      if (confirmPin.length < 4) {
        const newConfirmPin = confirmPin + num;
        setConfirmPin(newConfirmPin);
        if (newConfirmPin.length === 4) {
          if (newConfirmPin === pin) {
            sounds.fanfare();
            voiceAssistant.stop();
            setChild({ name: name.trim() || 'Explorer', grade, birthdate, interests });
            setPin(newConfirmPin);
            completeSetup();
            navigate('/chapter-hub');
          } else {
            sounds.boing();
            setPinError(true);
            setTimeout(() => {
              setConfirmPin('');
              setPinError(false);
            }, 800);
          }
        }
      }
    } else {
      if (pin.length < 4) {
        const newPin = pin + num;
        setPinState(newPin);
        if (newPin.length === 4) {
          setTimeout(() => {
            setIsConfirmingPin(true);
          }, 250);
        }
      }
    }
  };

  const handlePinDelete = () => {
    sounds.pop();
    if (isConfirmingPin) {
      setConfirmPin((p) => p.slice(0, -1));
    } else {
      setPinState((p) => p.slice(0, -1));
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-200 via-indigo-100 to-amber-100 flex flex-col items-center justify-between pt-10 pb-20 px-4 md:px-8 font-sans relative overflow-x-hidden">
      {/* Back Button */}
      <button
        onClick={prevStep}
        className="self-start inline-flex items-center gap-2 px-5 py-2.5 bg-white/95 rounded-2xl border-2 border-slate-200 text-sm font-extrabold text-slate-800 hover:bg-white shadow-xs cursor-pointer mb-4"
      >
        <ArrowLeft className="w-4 h-4 stroke-[3]" />
        <span>Back</span>
      </button>

      <div className="w-full max-w-xl bg-white rounded-3xl border-4 border-slate-200 shadow-2xl p-8 md:p-12 my-auto flex flex-col items-center">
        {/* Step Progress Pills */}
        <div className="flex items-center gap-2.5 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-3 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-10 bg-amber-400 border-2 border-amber-600'
                  : s < step
                  ? 'w-3.5 bg-emerald-500'
                  : 'w-3.5 bg-slate-200'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── STEP 1: CHILD NAME ── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="w-full flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 text-white flex items-center justify-center text-5xl font-black mb-5 shadow-xl border-4 border-white">
                {name.trim() ? name.trim().charAt(0).toUpperCase() : 'P'}
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                What is our young scientist's name?
              </h2>
              <p className="text-xs md:text-sm font-bold text-slate-500 mb-6">
                This personalizes Pip's lessons, speech, and progress certificates!
              </p>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && name.trim() && nextStep()}
                autoFocus
                placeholder="Enter scientist name..."
                className="w-full max-w-sm text-center text-xl md:text-2xl font-black p-4 rounded-2xl border-3 border-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-200 outline-none mb-8 text-slate-800 bg-slate-50 transition-all shadow-inner"
              />

              <button
                onClick={nextStep}
                disabled={!name.trim()}
                className="w-full max-w-sm btn-3d-amber text-slate-950 font-black text-xl py-4 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5 stroke-[3]" />
              </button>
            </motion.div>
          )}

          {/* ── STEP 2: GRADE ── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="w-full flex flex-col items-center text-center"
            >
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Which grade is {name} in?
              </h2>
              <p className="text-xs md:text-sm font-bold text-slate-500 mb-6">
                PolyQuest adapts terminology and challenges for Grade 5–6 standards
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-6">
                {GRADES.map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      sounds.pop();
                      setGrade(g);
                    }}
                    className={`w-16 h-16 md:w-18 md:h-18 rounded-2xl font-black text-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                      grade === g
                        ? 'btn-3d-emerald scale-105'
                        : 'btn-3d-slate'
                    }`}
                  >
                    <span>{g}</span>
                    <span className="text-[10px] uppercase font-bold opacity-80">Grade</span>
                  </button>
                ))}
              </div>

              {/* Date of Birth Picker */}
              <div className="w-full max-w-sm bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 mb-8 text-left shadow-inner">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                  🎂 Date of Birth (For Age Adaptation):
                </label>
                <input
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className="w-full p-3 rounded-xl border-2 border-slate-300 font-black text-sm text-slate-800 bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none"
                />
              </div>

              <button
                onClick={nextStep}
                className="w-full max-w-sm btn-3d-amber text-slate-950 font-black text-xl py-4 rounded-2xl cursor-pointer flex items-center justify-center gap-2"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5 stroke-[3]" />
              </button>
            </motion.div>
          )}

          {/* ── STEP 3: INTERESTS ── */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="w-full flex flex-col items-center text-center"
            >
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                What does {name} love?
              </h2>
              <p className="text-xs font-bold text-slate-500 mb-5">Pick topics to tailor real-world science examples!</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 max-h-[260px] overflow-y-auto p-1 w-full">
                {INTERESTS.map((item) => {
                  const isSelected = interests.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleInterest(item.id)}
                      className={`flex items-center gap-2.5 p-3 rounded-2xl font-extrabold text-xs border-2 transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'bg-sky-500 text-white border-sky-700 shadow-md'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="p-1 bg-white rounded-xl shadow-xs">{item.icon}</div>
                      <span className="flex-1 truncate">{item.label}</span>
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={nextStep}
                className="w-full max-w-sm btn-3d-amber text-slate-950 font-black text-xl py-4 rounded-2xl cursor-pointer flex items-center justify-center gap-2"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                <span>Set Parent PIN →</span>
              </button>
            </motion.div>
          )}

          {/* ── STEP 4: PIN ── */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="w-full flex flex-col items-center text-center"
            >
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                {isConfirmingPin ? 'Confirm your 4-digit PIN' : 'Set a 4-Digit Parent PIN'}
              </h2>
              <p className="text-xs font-bold text-slate-500 mb-2">
                {isConfirmingPin ? 'Re-enter the same PIN to confirm' : 'Protects parent dashboard & learning controls'}
              </p>

              <div className="h-6 mb-2">
                {pinError && (
                  <span className="text-xs font-black text-rose-600 bg-rose-100 px-3 py-1 rounded-full">
                    PINs don't match! Try again.
                  </span>
                )}
              </div>

              {/* PIN Dots */}
              <div className="flex gap-4 mb-6">
                {[0, 1, 2, 3].map((i) => {
                  const cur = isConfirmingPin ? confirmPin : pin;
                  return (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-full transition-all ${
                        cur.length > i ? 'bg-slate-900 scale-125' : 'bg-slate-200 border-2 border-slate-300'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Chunky Numpad */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => handlePinInput(num)}
                    className="w-16 h-16 rounded-2xl btn-3d-slate font-black text-2xl flex items-center justify-center cursor-pointer"
                    style={{ fontFamily: 'Nunito, sans-serif' }}
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={handlePinDelete}
                  className="w-16 h-16 rounded-2xl bg-slate-100 border-2 border-slate-300 text-slate-700 font-black text-sm flex items-center justify-center hover:bg-slate-200 cursor-pointer"
                >
                  ←
                </button>
                <button
                  onClick={() => handlePinInput(0)}
                  className="w-16 h-16 rounded-2xl btn-3d-slate font-black text-2xl flex items-center justify-center cursor-pointer"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  0
                </button>
                <div />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-xs font-bold text-slate-500">
        All settings can be changed anytime from the Parent Portal
      </div>
    </div>
  );
}
