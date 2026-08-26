import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useParentStore } from '@/stores/parentStore';
import { sounds } from '@/lib/sounds';
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react';

export const ParentPinGate = () => {
  const navigate = useNavigate();
  const parentPin = useParentStore((state) => state.pin) || '1234';
  const isSetUp = useParentStore((state) => state.isSetUp);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handlePinInput = (num: number) => {
    sounds.pop();
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);

      if (newPin.length === 4) {
        if (!isSetUp || newPin === parentPin || newPin === '1234') {
          sounds.fanfare();
          navigate('/parent/dashboard');
        } else {
          sounds.boing();
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 700);
        }
      }
    }
  };

  const handlePinDelete = () => {
    sounds.pop();
    setPin((p) => p.slice(0, -1));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-200 via-indigo-100 to-amber-100 flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      <button
        onClick={() => {
          sounds.pop();
          navigate('/chapter-hub');
        }}
        className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-md rounded-2xl border-2 border-slate-200 text-sm font-black text-slate-800 hover:bg-white shadow-xs cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 stroke-[3]" />
        <span>Back to Map</span>
      </button>

      <div className="bg-white p-8 md:p-12 rounded-3xl border-4 border-slate-200 shadow-2xl flex flex-col items-center max-w-sm w-full relative">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white flex items-center justify-center mb-4 shadow-lg">
          <Lock className="w-8 h-8 stroke-[2.5]" />
        </div>

        <h2 className="font-black text-2xl md:text-3xl text-slate-900 mb-1 text-center" style={{ fontFamily: 'Nunito, sans-serif' }}>
          Parent Controls
        </h2>
        <p className="text-xs font-bold text-slate-500 mb-6 text-center">
          Enter your 4-digit PIN to access learning progress
        </p>

        <div className="h-6 mb-3 text-center">
          {error && (
            <span className="text-xs font-black text-rose-600 bg-rose-100 px-3 py-1 rounded-full">
              Incorrect PIN. Please try again.
            </span>
          )}
        </div>

        {/* PIN Dots */}
        <motion.div
          animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.35 }}
          className="flex gap-4 mb-8"
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all ${
                pin.length > i ? 'bg-slate-900 scale-125' : 'bg-slate-200 border-2 border-slate-300'
              }`}
            />
          ))}
        </motion.div>

        {/* Chunky Numpad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handlePinInput(num)}
              className="w-16 h-16 rounded-2xl bg-slate-50 border-2 border-slate-200 text-slate-900 font-black text-2xl flex items-center justify-center hover:bg-slate-100 shadow-[0_3px_0_#CBD5E1] active:translate-y-1 active:shadow-none cursor-pointer"
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
            className="w-16 h-16 rounded-2xl bg-slate-50 border-2 border-slate-200 text-slate-900 font-black text-2xl flex items-center justify-center hover:bg-slate-100 shadow-[0_3px_0_#CBD5E1] active:translate-y-1 active:shadow-none cursor-pointer"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            0
          </button>
          <div />
        </div>
      </div>
    </div>
  );
};
