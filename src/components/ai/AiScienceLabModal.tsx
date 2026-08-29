import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Bot,
  FlaskConical,
  X,
  Sparkles,
  ArrowRight,
  Star,
  Zap,
  Volume2,
} from 'lucide-react';
import { Pip } from '@/components/pip/Pip';
import { sounds } from '@/lib/sounds';

interface AiScienceLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenScan: () => void;
  onOpenAskPip: () => void;
  onOpenWhatIf: () => void;
}

export const AiScienceLabModal: React.FC<AiScienceLabModalProps> = ({
  isOpen,
  onClose,
  onOpenScan,
  onOpenAskPip,
  onOpenWhatIf,
}) => {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-5">
          {/* Glassmorphic Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="relative z-10 bg-white w-full max-w-2xl rounded-3xl md:rounded-[36px] border-4 border-indigo-400 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 flex items-center justify-between text-white border-b-2 border-indigo-500 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 p-1 flex items-center justify-center shadow-inner">
                  <Pip mood="celebrating" size="sm" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950/40 text-amber-300 px-2.5 py-0.5 rounded-full">
                    Gemini 2.5 Multimodal AI
                  </span>
                  <h3 className="text-lg font-black text-white tracking-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Pip's AI Science Superpowers 🚀✨
                  </h3>
                </div>
              </div>

              <button
                onClick={() => {
                  sounds.pop();
                  onClose();
                }}
                className="p-2 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 cursor-pointer transition-all active:scale-95 shadow-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Cards */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-4 bg-slate-50">
              <p className="text-xs sm:text-sm font-bold text-slate-600 text-center">
                Choose an interactive AI science tool below to explore real materials, ask voice questions, or simulate physical reactions!
              </p>

              <div className="grid grid-cols-1 gap-3.5">
                {/* 1. Scan My World */}
                <motion.div
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => {
                    sounds.sparkle();
                    onClose();
                    onOpenScan();
                  }}
                  className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg cursor-pointer border-3 border-emerald-300 flex items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-inner">
                      <Camera className="w-8 h-8 text-amber-300 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950/30 text-emerald-100 px-2 py-0.5 rounded-full">
                          Vision Camera AI
                        </span>
                        <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-300 text-amber-400" /> +25 Stars
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-black tracking-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        Scan My World • Material Detective 📷
                      </h4>
                      <p className="text-xs font-bold text-emerald-100 leading-snug">
                        Point camera at your shirt, water bottle, or table to detect polymers & fibers!
                      </p>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                    <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                  </div>
                </motion.div>

                {/* 2. Ask Pip AI Socratic Tutor */}
                <motion.div
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => {
                    sounds.sparkle();
                    onClose();
                    onOpenAskPip();
                  }}
                  className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg cursor-pointer border-3 border-sky-300 flex items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-inner">
                      <Bot className="w-8 h-8 text-amber-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950/30 text-sky-100 px-2 py-0.5 rounded-full">
                          Socratic Voice Tutor
                        </span>
                        <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                          <Volume2 className="w-3.5 h-3.5" /> Spoken Audio
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-black tracking-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        Ask Pip Live AI Science Mentor 🤖
                      </h4>
                      <p className="text-xs font-bold text-sky-100 leading-snug">
                        Ask any question about materials, electricity, or nature and get friendly clues!
                      </p>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                    <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                  </div>
                </motion.div>

                {/* 3. What If Sandbox */}
                <motion.div
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => {
                    sounds.sparkle();
                    onClose();
                    onOpenWhatIf();
                  }}
                  className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-purple-500 via-fuchsia-600 to-indigo-600 text-white shadow-lg cursor-pointer border-3 border-purple-300 flex items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-inner">
                      <FlaskConical className="w-8 h-8 text-amber-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950/30 text-purple-100 px-2 py-0.5 rounded-full">
                          Physics Reaction Lab
                        </span>
                        <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 fill-current" /> Generative Sim
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-black tracking-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        "What If?" Science Sandbox 🧪
                      </h4>
                      <p className="text-xs font-bold text-purple-100 leading-snug">
                        Mix materials with boiling water, fire, or freezing cold to predict reactions!
                      </p>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                    <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
