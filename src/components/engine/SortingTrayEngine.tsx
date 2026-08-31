import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SortingTrayData, SortingItem } from '@/types/lessonEngine';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { CheckCircle2, RotateCcw, Sparkles, HelpCircle } from 'lucide-react';

interface Props {
  data: SortingTrayData;
  onComplete: () => void;
  isCompleted?: boolean;
}

export const SortingTrayEngine: React.FC<Props> = ({ data, onComplete }) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [trayItems, setTrayItems] = useState<Record<string, SortingItem[]>>({});
  const [unplacedItems, setUnplacedItems] = useState<SortingItem[]>(data.items);
  const [hintMessage, setHintMessage] = useState<string | null>(null);

  const handleItemSelect = (item: SortingItem) => {
    sounds.pop();
    setSelectedItemId(item.id);
    setHintMessage(item.hint);
  };

  const handleTrayPlace = (trayId: string) => {
    if (!selectedItemId) return;
    const item = unplacedItems.find((i) => i.id === selectedItemId);
    if (!item) return;

    if (item.category === trayId) {
      // Correct classification
      sounds.bubble();
      setTrayItems((prev) => ({
        ...prev,
        [trayId]: [...(prev[trayId] || []), item],
      }));
      const nextUnplaced = unplacedItems.filter((i) => i.id !== selectedItemId);
      setUnplacedItems(nextUnplaced);
      setSelectedItemId(null);
      setHintMessage(null);

      if (nextUnplaced.length === 0) {
        sounds.fanfare();
        onComplete();
      } else {
        sounds.sparkle();
      }
    } else {
      // Incorrect classification
      sounds.boing();
      setHintMessage(`Not quite! ${item.hint}`);
    }
  };

  const handleReset = () => {
    sounds.pop();
    setSelectedItemId(null);
    setTrayItems({});
    setUnplacedItems(data.items);
    setHintMessage(null);
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Classification Trays Dropzones */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.trays.map((tray) => {
          const placed = trayItems[tray.id] || [];
          return (
            <div
              key={tray.id}
              onClick={() => handleTrayPlace(tray.id)}
              className={`rounded-3xl p-5 border-3 transition-all cursor-pointer flex flex-col justify-between min-h-[220px] ${
                tray.id === 'natural'
                  ? 'bg-emerald-50/80 border-emerald-300 hover:border-emerald-500'
                  : 'bg-sky-50/80 border-sky-300 hover:border-sky-500'
              } ${selectedItemId ? 'ring-4 ring-amber-300/60 shadow-lg' : 'shadow-md'}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{tray.icon}</span>
                    <h3 className="text-base font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                      {tray.title}
                    </h3>
                  </div>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-white border border-slate-200">
                    {placed.length} Sorted
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-600 mt-1">
                  {tray.description}
                </p>
              </div>

              {/* Placed Item Chips */}
              <div className="flex flex-wrap gap-2 mt-4 min-h-[60px] p-2 bg-white/70 rounded-2xl border border-slate-200">
                {placed.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-black shadow-xs"
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                  </motion.div>
                ))}
                {placed.length === 0 && (
                  <span className="text-xs font-bold text-slate-400 italic m-auto">
                    Tap a specimen below, then tap here to classify!
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hint Banner */}
      {hintMessage && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-100 text-amber-950 px-4 py-2 rounded-2xl border border-amber-300 text-xs font-black flex items-center gap-2 shadow-xs"
        >
          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{hintMessage}</span>
        </motion.div>
      )}

      {/* Specimen Source Tray (Items to classify) */}
      <div className="w-full max-w-4xl bg-white/95 rounded-3xl p-5 border-3 border-slate-200 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-600">
            Specimens to Classify ({unplacedItems.length} remaining):
          </span>
          <button
            onClick={handleReset}
            className="text-xs font-black text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {unplacedItems.map((item) => {
            const isSelected = item.id === selectedItemId;
            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleItemSelect(item)}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-amber-300 border-amber-500 ring-4 ring-amber-200 shadow-lg scale-105 font-black text-slate-950'
                    : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-800 font-bold'
                }`}
              >
                <span className="text-3xl filter drop-shadow-xs">{item.icon}</span>
                <span className="text-xs text-center leading-tight truncate w-full">
                  {item.name}
                </span>
              </motion.button>
            );
          })}
        </div>

        {unplacedItems.length === 0 && (
          <div className="text-center py-6 flex flex-col items-center gap-2">
            <Sparkles className="w-8 h-8 text-amber-500 animate-spin" />
            <h4 className="text-base font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
              All Specimens Classified Correctly! ⭐
            </h4>
          </div>
        )}
      </div>
    </div>
  );
};
