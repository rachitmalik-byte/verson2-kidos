import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { lookupWord, DictionaryResult } from '@/lib/dictionaryService';
import { vocabulary } from '@/data/vocabulary';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { sounds } from '@/lib/sounds';
import { BookOpen, Volume2, X, Search, Loader2 } from 'lucide-react';

interface Position {
  x: number;
  y: number;
  isAbove: boolean;
}

export const GlobalWordExplainer: React.FC = () => {
  const [selectedEntry, setSelectedEntry] = useState<DictionaryResult | null>(null);
  const [position, setPosition] = useState<Position | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const currentRequestRef = useRef<string>('');

  useEffect(() => {
    const handleWordLookup = async (text: string, rect?: DOMRect) => {
      const clean = text.trim();
      if (!clean || clean.length > 50 || clean.length < 2) return;

      currentRequestRef.current = clean;

      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;
      let isAbove = false;

      if (rect) {
        isAbove = rect.top > 250;
        x = Math.min(Math.max(rect.left + rect.width / 2, 170), window.innerWidth - 170);
        y = isAbove ? rect.top - 12 : rect.bottom + 12;
      }

      setPosition({ x, y, isAbove });
      setIsLoading(true);
      setSelectedEntry(null);
      sounds.pop();

      try {
        const result = await lookupWord(clean);
        // Only update if this is still the most recent request
        if (currentRequestRef.current === clean) {
          setSelectedEntry(result);
          setIsLoading(false);

          // Speak definition automatically with Pip voice
          const speechText = `${result.word}. ${result.category}. ${result.definition}`;
          voiceAssistant.speak(speechText);
        }
      } catch {
        setIsLoading(false);
      }
    };

    const handleSelectionEvent = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;

      const text = selection.toString().trim();
      if (!text) return;

      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        handleWordLookup(text, rect);
      } catch {}
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (tooltipRef.current && tooltipRef.current.contains(e.target as Node)) {
        return;
      }
      setTimeout(handleSelectionEvent, 40);
    };

    const handleDblClick = (e: MouseEvent) => {
      if (tooltipRef.current && tooltipRef.current.contains(e.target as Node)) {
        return;
      }
      setTimeout(handleSelectionEvent, 30);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (tooltipRef.current && tooltipRef.current.contains(e.target as Node)) {
        return;
      }
      setTimeout(handleSelectionEvent, 80);
    };

    const handleDismiss = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) {
          setSelectedEntry(null);
          setPosition(null);
          setIsLoading(false);
          voiceAssistant.stop();
        }
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('dblclick', handleDblClick);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('mousedown', handleDismiss);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('dblclick', handleDblClick);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('mousedown', handleDismiss);
    };
  }, []);

  const handlePronounce = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.pop();
    if (selectedEntry) {
      voiceAssistant.speak(`${selectedEntry.word}. ${selectedEntry.category}. ${selectedEntry.definition}`);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.pop();
    setSelectedEntry(null);
    setPosition(null);
    setIsLoading(false);
    voiceAssistant.stop();
  };

  const filteredVocab = vocabulary.filter(
    (v) =>
      v.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      {/* ── Floating Real Dictionary Popup ── */}
      <AnimatePresence>
        {(selectedEntry || isLoading) && position && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.85, y: position.isAbove ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: position.isAbove ? 10 : -10 }}
            transition={{ type: 'spring', damping: 22, stiffness: 350 }}
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              transform: position.isAbove ? 'translate(-50%, -100%)' : 'translate(-50%, 0%)',
            }}
            className="fixed z-[100000] w-80 sm:w-96 bg-white p-5 rounded-3xl border-4 border-amber-400 shadow-2xl font-sans pointer-events-auto"
          >
            {/* Arrow Tail */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-amber-400 transform rotate-45 ${
                position.isAbove ? '-bottom-2.5 border-b-4 border-r-4' : '-top-2.5 border-t-4 border-l-4'
              }`}
            />

            {isLoading ? (
              <div className="flex items-center justify-center py-6 gap-3 text-slate-600 font-black text-sm">
                <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                <span>Looking up in dictionary...</span>
              </div>
            ) : selectedEntry ? (
              <>
                {/* Header with Title + Part of Speech + Audio */}
                <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-100 text-amber-900 rounded-2xl border border-amber-300 shadow-xs">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        {selectedEntry.category}
                      </span>
                      <h4
                        className="text-xl font-black text-slate-900 tracking-tight"
                        style={{ fontFamily: 'Nunito, sans-serif' }}
                      >
                        {selectedEntry.word}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handlePronounce}
                      className="p-2 rounded-xl bg-violet-100 hover:bg-violet-200 text-violet-800 border border-violet-300 transition-all cursor-pointer active:scale-95 shadow-xs"
                      title="Hear Word & Definition Aloud"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleClose}
                      className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                      title="Close Dictionary Card"
                    >
                      <X className="w-4 h-4 stroke-[3]" />
                    </button>
                  </div>
                </div>

                {/* Pronunciation phonetics */}
                {selectedEntry.pronunciation && (
                  <div className="text-[11px] font-mono text-slate-500 font-bold mb-2">
                    🗣️ [{selectedEntry.pronunciation}]
                  </div>
                )}

                {/* Real Dictionary Definition */}
                <p className="text-xs sm:text-sm font-extrabold text-slate-800 leading-relaxed mb-3">
                  {selectedEntry.definition}
                </p>

                {/* Real Sentence Example */}
                {selectedEntry.example && (
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] sm:text-xs font-bold text-amber-950">
                    <span className="font-black text-amber-900">Example: </span>
                    "{selectedEntry.example}"
                  </div>
                )}
              </>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Quick Search Modal ── */}
      <AnimatePresence>
        {showSearchModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSearchModal(false)}
              className="fixed inset-0 bg-black/50 z-[100000] backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100000] w-full max-w-lg bg-white rounded-3xl border-4 border-amber-400 shadow-2xl p-6 font-sans"
            >
              <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                  <h3 className="text-xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Science Dictionary Search 📖
                  </h3>
                </div>
                <button
                  onClick={() => setShowSearchModal(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5 stroke-[3]" />
                </button>
              </div>

              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  placeholder="Type any word (e.g., Nylon, Latex, Instantly)..."
                  className="w-full p-3.5 pl-11 rounded-2xl border-2 border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-200 outline-none font-black text-sm text-slate-800 bg-slate-50"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
                {filteredVocab.map((v) => (
                  <div
                    key={v.word}
                    onClick={() => {
                      sounds.pop();
                      voiceAssistant.speak(`${v.word}. ${v.definition}`);
                    }}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50 border-2 border-slate-200 hover:border-amber-300 transition-all cursor-pointer flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-base text-slate-900">{v.word}</span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                        {v.category}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-600 leading-snug">{v.definition}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
};
