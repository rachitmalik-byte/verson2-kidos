import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { Moon, Sparkles, ArrowRight, Home } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onContinue: () => void;
}

export const NaturalStoppingPointModal: React.FC<Props> = ({ isOpen, onContinue }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none font-sans">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md bg-white rounded-[36px] border-4 border-emerald-400 p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center gap-4 relative overflow-hidden"
      >
        <span className="text-5xl p-3 bg-emerald-50 rounded-3xl border border-emerald-200">🌿</span>

        <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
          Great Science Session Today! 🌟
        </h3>

        <p className="text-xs sm:text-sm font-bold text-slate-600 leading-relaxed">
          You've completed multiple hands-on experiments! Did you know scientific discoveries lock into your brain deepest when you rest and reflect?
        </p>

        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-950 w-full">
          💡 Recommended: Take a healthy break or show your discoveries to family!
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full mt-2">
          <button
            onClick={() => {
              sounds.pop();
              navigate('/subjects');
            }}
            className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs rounded-2xl cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Rest & Back Home</span>
          </button>

          <button
            onClick={() => {
              sounds.sparkle();
              onContinue();
            }}
            className="py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-2xl cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
          >
            <span>Keep Exploring 🚀</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
