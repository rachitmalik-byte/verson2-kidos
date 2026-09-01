import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { useParentStore } from '@/stores/parentStore';
import { Mic, MicOff, Send, Sparkles, CheckCircle2, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  missionTitle: string;
  onClose: () => void;
}

export const ExplainItBackModal: React.FC<Props> = ({ isOpen, missionTitle, onClose }) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleStartListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your explanation below!');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        sounds.pop();
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
        sounds.success();
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleSave = () => {
    if (!inputText.trim()) return;
    sounds.fanfare();
    setIsSaved(true);

    // Save explanation in parentStore
    const state: any = useParentStore.getState();
    const existing = state.childExplanations || [];
    if (state.saveExplanation) {
      state.saveExplanation({
        missionTitle,
        quote: inputText.trim(),
        timestamp: Date.now(),
      });
    }

    setTimeout(() => {
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none font-sans">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md bg-white rounded-[36px] border-4 border-indigo-400 p-6 sm:p-8 shadow-2xl flex flex-col gap-4 relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl p-2 bg-indigo-50 rounded-2xl border border-indigo-200">🎙️</span>
            <div>
              <h3 className="text-lg font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Explain It In Your Own Words!
              </h3>
              <span className="text-[11px] font-bold text-indigo-700">Saved for your Parent Dashboard 👨‍👩‍👧</span>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.pop();
              onClose();
            }}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs font-bold text-slate-600 leading-relaxed">
          How would you explain <span className="font-black text-indigo-900">"{missionTitle}"</span> to a friend or parent? Tap the mic or type below:
        </p>

        {/* Input & Voice Controls */}
        <div className="flex flex-col gap-3">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. Cotton absorbs water because of its hollow fibers, while polyester repels water so it beads right off!"
            rows={3}
            className="w-full p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 focus:border-indigo-500 focus:bg-white outline-none resize-none"
          />

          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handleStartListening}
              className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 cursor-pointer transition-all ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-indigo-600" />}
              <span>{isListening ? 'Listening...' : 'Speak Voice Note 🎤'}</span>
            </button>

            <button
              onClick={handleSave}
              disabled={!inputText.trim() || isSaved}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black text-xs rounded-2xl flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSaved ? 'Saved! ✨' : 'Save Note'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
