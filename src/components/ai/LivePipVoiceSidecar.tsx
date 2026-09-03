import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  X,
  Volume2,
  VolumeX,
  Bot,
  MessageCircle,
  Lightbulb,
  Smile,
  Zap,
  Tv,
  Film,
} from 'lucide-react';
import { Pip } from '@/components/pip/Pip';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { geminiService } from '@/lib/geminiService';
import { useLocation } from 'react-router-dom';
import { useAiVideoStore } from '@/stores/aiVideoStore';
import { useUiSettingsStore } from '@/stores/uiSettingsStore';

interface ChatMessage {
  id: string;
  sender: 'user' | 'pip';
  text: string;
  timestamp: number;
}

const QUICK_PROMPTS = [
  '🎬 Find video for this experiment!',
  '🔬 What is a polymer?',
  '🛞 Why do car tires need sulfur?',
  '🔥 Why do synthetic clothes melt?',
  '🌧️ Why is polyester waterproof?',
  '😂 Tell me a science joke!',
];

export const LivePipVoiceSidecar: React.FC = () => {
  const location = useLocation();
  const { openVideoByContext } = useAiVideoStore();
  const isLivePipOpen = useUiSettingsStore((state) => state.isLivePipOpen);
  const setIsLivePipOpen = useUiSettingsStore((state) => state.setIsLivePipOpen);
  const isOpen = isLivePipOpen;
  const setIsOpen = setIsLivePipOpen;

  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'pip',
      text: "Hi there, Master Scientist! 🤖 I'm Pip, your live AI buddy! Ask me anything about materials, chemistry, or tap 'Play Video' to watch a cool science clip about what you're testing right now!",
      timestamp: Date.now(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Handle Voice Input via Web Speech API
  const startVoiceInput = () => {
    sounds.pop();
    voiceAssistant.stop();

    if (typeof window === 'undefined') return;
    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      alert('Speech Recognition is not supported on this browser. You can type your question to Pip below!');
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }

      const recognition = new SpeechRec();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      let finalCaptured = '';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        finalCaptured = transcript.trim();
        setInputVal(finalCaptured);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (finalCaptured.length > 1) {
          sendMessage(finalCaptured);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const stopVoiceInput = () => {
    sounds.pop();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userText = text.trim();
    setInputVal('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);
    sounds.pop();

    // Smart Video Query Detection
    const lower = userText.toLowerCase();
    const isAskingVideo =
      lower.includes('video') ||
      lower.includes('watch') ||
      lower.includes('youtube') ||
      lower.includes('show me') ||
      lower.includes('clip');

    if (isAskingVideo) {
      const videoAnswer = "I scanned what you're doing and found the perfect science video! Opening Pip's AI Cinema for you right now... 🍿🎬";
      const pipMsg: ChatMessage = {
        id: `pip-${Date.now()}`,
        sender: 'pip',
        text: videoAnswer,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, pipMsg]);
      sounds.sparkle();
      if (autoSpeak) {
        voiceAssistant.speak(videoAnswer);
      }
      setIsThinking(false);
      setTimeout(() => {
        openVideoByContext(location.pathname, userText);
      }, 700);
      return;
    }

    try {
      const pageContext = `User is currently viewing path: ${location.pathname}`;
      const pipAnswer = await geminiService.chatWithLivePip(userText, pageContext);

      const pipMsg: ChatMessage = {
        id: `pip-${Date.now()}`,
        sender: 'pip',
        text: pipAnswer,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, pipMsg]);
      sounds.sparkle();

      if (autoSpeak) {
        voiceAssistant.speak(pipAnswer);
      }
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `pip-${Date.now()}`,
        sender: 'pip',
        text: "That's an awesome science question! 🌟 Remember, natural materials come from plants and animals, while synthetics are made by scientists in labs!",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      if (autoSpeak) {
        voiceAssistant.speak(fallbackMsg.text);
      }
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <>
      {/* Floating Action Button for Pip (Right Side) */}
      <div className="fixed bottom-12 sm:bottom-14 right-3 sm:right-6 z-[99900] flex items-center">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            sounds.sparkle();
            setIsOpen(!isOpen);
          }}
          className="flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-600 text-white font-black text-xs sm:text-sm shadow-[0_8px_30px_rgba(79,70,229,0.5)] border-2 sm:border-3 border-white cursor-pointer active:scale-95 transition-all group"
          title="Open Live Pip AI Science Companion"
        >
          <span className="text-xl animate-bounce">🤖</span>
          <span className="hidden sm:inline tracking-tight font-black" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Talk to Pip AI ✨
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
        </motion.button>
      </div>

      {/* ── Compact Floating Live AI Dialog (Right Side) ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[999994] sm:hidden"
            />

            {/* Compact Floating Dialog on Right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 25, x: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 25, x: 20 }}
              transition={{ type: 'spring', damping: 24, stiffness: 280 }}
              className="fixed bottom-24 right-3 sm:right-6 w-[calc(100vw-1.5rem)] sm:w-[380px] max-h-[540px] h-[72vh] bg-slate-950/95 backdrop-blur-xl border-2 border-indigo-500/50 rounded-3xl shadow-2xl z-[999995] flex flex-col justify-between text-white overflow-hidden ring-4 ring-indigo-500/10"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-500 to-indigo-600 p-1 flex items-center justify-center shadow-md">
                    <Pip mood={isThinking ? 'thinking' : isListening ? 'curious' : 'happy'} size="sm" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-black text-base text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        Live Pip AI
                      </h3>
                      <span className="px-2 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[10px] font-black">
                        Gemini 3.5 ⚡
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">Class 5 Science Companion</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Voice Toggle */}
                  <button
                    onClick={() => {
                      sounds.pop();
                      setAutoSpeak(!autoSpeak);
                    }}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      autoSpeak
                        ? 'bg-violet-950/60 border-violet-500/50 text-violet-300'
                        : 'bg-slate-800 border-slate-700 text-slate-500'
                    }`}
                    title={autoSpeak ? 'Voice Replies ON' : 'Voice Replies MUTED'}
                  >
                    {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>

                  {/* Close */}
                  <button
                    onClick={() => {
                      sounds.pop();
                      setIsOpen(false);
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

                {/* Contextual Video Quick Launcher Banner */}
                <div className="px-4 py-2.5 bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-violet-500/20 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-lg shrink-0">🎬</span>
                    <div className="flex flex-col truncate">
                      <span className="text-xs font-black text-amber-300 truncate" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        Need a visual explanation?
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 truncate">
                        Pip scans screen & finds YouTube video
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      sounds.sparkle();
                      openVideoByContext(location.pathname);
                    }}
                    className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95 shrink-0"
                  >
                    <Tv className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Play Video 🍿</span>
                  </button>
                </div>

                {/* Chat Message Scroll View */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.sender === 'pip' && (
                      <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-sm shrink-0 mt-1 shadow-xs">
                        🤖
                      </div>
                    )}

                    <div
                      className={`p-3.5 rounded-2xl max-w-[85%] text-xs sm:text-sm font-bold leading-relaxed shadow-sm ${
                        m.sender === 'user'
                          ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-bl-none'
                      }`}
                    >
                      <p>{m.text}</p>
                      {m.sender === 'pip' && (
                        <button
                          onClick={() => {
                            sounds.sparkle();
                            voiceAssistant.speak(m.text);
                          }}
                          className="mt-2 text-[10px] text-violet-400 hover:text-violet-300 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Speak aloud</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isThinking && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 p-3 bg-slate-900/80 rounded-2xl border border-slate-800 max-w-[70%]"
                  >
                    <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-xs animate-spin">
                      ✨
                    </div>
                    <span className="text-xs font-bold text-violet-300">Pip is thinking with Gemini...</span>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Science Prompt Suggestions */}
              <div className="px-4 py-2 border-t border-slate-900 bg-slate-950 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {QUICK_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(p.replace(/^[^\s]+\s/, ''))}
                    className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-bold text-slate-300 hover:text-white whitespace-nowrap cursor-pointer transition-all active:scale-95 shrink-0"
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Input Action Bar */}
              <div className="p-3.5 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2">
                {/* Voice Mic Button */}
                {!isListening ? (
                  <button
                    onClick={startVoiceInput}
                    className="p-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black cursor-pointer shadow-md active:scale-95 transition-all"
                    title="Speak to Pip (Voice Mode)"
                  >
                    <Mic className="w-5 h-5 stroke-[2.5]" />
                  </button>
                ) : (
                  <button
                    onClick={stopVoiceInput}
                    className="p-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black cursor-pointer shadow-md active:scale-95 animate-pulse"
                    title="Stop Listening"
                  >
                    <MicOff className="w-5 h-5" />
                  </button>
                )}

                {/* Text Input */}
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') sendMessage(inputVal);
                  }}
                  placeholder={isListening ? 'Listening to your voice...' : 'Ask Pip any science question...'}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />

                {/* Send Button */}
                <button
                  onClick={() => sendMessage(inputVal)}
                  disabled={!inputVal.trim() || isThinking}
                  className="p-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-black cursor-pointer disabled:opacity-40 transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
