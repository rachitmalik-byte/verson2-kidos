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
  'Find video for this experiment',
  'What is a polymer?',
  'Why do car tires need sulfur?',
  'Why do synthetic clothes melt?',
  'Why is polyester waterproof?',
  'Tell me a fun science fact',
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
      {/* Floating Action Button for Pip (Cleanly offset from bottom-right DEV menu) */}
      <div className="fixed bottom-20 md:bottom-4 right-20 sm:right-24 z-[99900] flex items-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            sounds.sparkle();
            setIsOpen(!isOpen);
          }}
          className="flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-700/25 border border-white/60 cursor-pointer active:scale-95 transition-all group"
          title="Open Live Pip AI Science Companion"
        >
          <Bot className="w-4 h-4 text-white" />
          <span className="hidden sm:inline tracking-tight font-heading font-bold">
            Talk to Pip AI
          </span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
        </motion.button>
      </div>

      {/* ── Compact Floating Live AI Dialog (Right Side, Light Themed) ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-[999994] sm:hidden"
            />

            {/* Compact Floating Dialog on Right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20, x: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20, x: 15 }}
              transition={{ type: 'spring', damping: 24, stiffness: 280 }}
              className="fixed bottom-20 right-3 sm:right-6 w-[calc(100vw-1.5rem)] sm:w-[380px] max-h-[520px] h-[70vh] bg-white/98 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-2xl z-[999995] flex flex-col justify-between text-slate-900 overflow-hidden ring-4 ring-slate-900/5"
            >
              {/* Header */}
              <div className="p-3.5 sm:p-4 bg-slate-50/95 border-b border-slate-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-center shadow-xs">
                    <Pip mood={isThinking ? 'thinking' : isListening ? 'curious' : 'happy'} size="sm" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-heading font-extrabold text-sm sm:text-base text-slate-900">
                        Pip AI Coach
                      </h3>
                      <span className="px-2 py-0.5 bg-teal-50 text-teal-800 border border-teal-200/70 rounded-full text-[10px] font-mono font-bold">
                        Assistant
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-500">Science Learning Companion</span>
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
                        ? 'bg-teal-50 border-teal-300 text-teal-700'
                        : 'bg-slate-100 border-slate-200 text-slate-400'
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
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Contextual Video Quick Launcher Banner */}
              <div className="px-3.5 py-2 bg-amber-50/80 border-b border-amber-200/60 flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Film className="w-4 h-4 text-amber-700 shrink-0" />
                  <div className="flex flex-col truncate">
                    <span className="text-xs font-bold text-amber-950 truncate font-heading">
                      Need a visual explanation?
                    </span>
                    <span className="text-[10px] text-slate-500 truncate">
                      Watch interactive lab video
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sounds.sparkle();
                    openVideoByContext(location.pathname);
                  }}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-xs cursor-pointer transition-all active:scale-95 shrink-0"
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>Watch Video</span>
                </button>
              </div>

              {/* Chat Message Scroll View */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.sender === 'pip' && (
                      <div className="w-7 h-7 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div
                      className={`p-3 rounded-2xl max-w-[85%] text-xs sm:text-sm font-medium leading-relaxed shadow-xs ${
                        m.sender === 'user'
                          ? 'bg-teal-600 text-white rounded-br-none font-bold'
                          : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-none'
                      }`}
                    >
                      <p>{m.text}</p>
                      {m.sender === 'pip' && (
                        <button
                          onClick={() => {
                            sounds.sparkle();
                            voiceAssistant.speak(m.text);
                          }}
                          className="mt-2 text-[10px] text-teal-600 hover:text-teal-700 font-bold flex items-center gap-1 cursor-pointer"
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
                    className="flex items-center gap-2 p-2.5 bg-white rounded-2xl border border-slate-200/90 max-w-[70%] shadow-xs"
                  >
                    <div className="w-5 h-5 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 animate-spin">
                      <Sparkles className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-bold text-teal-700">Pip is thinking...</span>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Science Prompt Suggestions */}
              <div className="px-3.5 py-2 border-t border-slate-200/80 bg-slate-50/90 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {QUICK_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(p)}
                    className="px-2.5 py-1 rounded-full bg-white hover:bg-slate-100 border border-slate-200/80 text-[11px] font-bold text-slate-700 hover:text-slate-900 whitespace-nowrap cursor-pointer transition-all active:scale-95 shrink-0 shadow-xs"
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Input Action Bar */}
              <div className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2">
                {/* Voice Mic Button */}
                {!isListening ? (
                  <button
                    onClick={startVoiceInput}
                    className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 font-bold cursor-pointer shadow-xs active:scale-95 transition-all"
                    title="Speak to Pip (Voice Mode)"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={stopVoiceInput}
                    className="p-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold cursor-pointer shadow-xs active:scale-95 animate-pulse"
                    title="Stop Listening"
                  >
                    <MicOff className="w-4 h-4" />
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
                  className="flex-1 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                />

                {/* Send Button */}
                <button
                  onClick={() => sendMessage(inputVal)}
                  disabled={!inputVal.trim() || isThinking}
                  className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold cursor-pointer disabled:opacity-40 transition-all active:scale-95 shadow-xs"
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
