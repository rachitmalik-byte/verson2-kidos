import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Volume2,
  Bot,
  User,
  FlaskConical,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  Home as HomeIcon,
  Star,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Pip } from '@/components/pip/Pip';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { geminiService, PipStructuredResponse } from '@/lib/geminiService';
import { useProgressStore } from '@/stores/progressStore';

interface SocraticPipAITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextTopic?: string;
}

interface ChatMessage {
  id: string;
  sender: 'pip' | 'user';
  text?: string;
  structured?: PipStructuredResponse;
  timestamp: string;
  selectedOption?: number | null;
  isQuizAnswered?: boolean;
}

const TOPIC_CHIPS = [
  { label: '👕 Why cotton absorbs sweat', q: 'Why does cotton absorb sweat?' },
  { label: '🌧️ Why raincoats use polyester', q: 'Why do raincoats use polyester instead of cotton?' },
  { label: '⚡ Why copper wires have plastic', q: 'Why are electric copper wires wrapped in plastic?' },
  { label: '🍳 Why pan handles use Bakelite', q: 'Why are frying pan handles made of Bakelite?' },
  { label: '🪢 Why nylon ropes are strong', q: 'Why is nylon rope used for climbing and parachutes?' },
  { label: '⏳ 500-Year Soil Decay', q: 'Why does plastic take 500 years to decompose in soil?' },
];

export const SocraticPipAITutorModal: React.FC<SocraticPipAITutorModalProps> = ({
  isOpen,
  onClose,
  contextTopic,
}) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'pip',
      text: "Hello, Young Scientist! 🔬 I'm Pip, your AI Science Mentor! Ask me anything about materials, chemistry, conductors, or at-home science tests!",
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pipMood, setPipMood] = useState<'happy' | 'curious' | 'celebrating' | 'explaining'>('happy');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isLoading) return;

    sounds.pop();
    setInputText('');
    setPipMood('curious');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const pipStructured = await geminiService.askSocraticPipStructured(textToSend, contextTopic);
      const pipMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'pip',
        structured: pipStructured,
        timestamp: 'Just now',
        selectedOption: null,
        isQuizAnswered: false,
      };
      setMessages((prev) => [...prev, pipMsg]);
      setPipMood('explaining');
      sounds.sparkle();
      voiceAssistant.speak(
        `${pipStructured.simpleExplanation} ${pipStructured.everydayAnalogy}`
      );
    } catch (err) {
      console.error('Error asking Pip:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizAnswer = (msgId: string, optionIdx: number, isCorrect: boolean) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === msgId) {
          return {
            ...msg,
            selectedOption: optionIdx,
            isQuizAnswered: true,
          };
        }
        return msg;
      })
    );

    if (isCorrect) {
      sounds.fanfare();
      setPipMood('celebrating');
      voiceAssistant.speak('Brilliant deduction! You got the science challenge right! +5 Science Stars!');
    } else {
      sounds.boing();
      setPipMood('curious');
      voiceAssistant.speak('Good try! Look closely at the molecular explanation.');
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-2.5 sm:p-4">
          {/* Glassmorphic Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              sounds.pop();
              voiceAssistant.stop();
              onClose();
            }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="relative z-10 bg-white w-full max-w-xl rounded-3xl md:rounded-[36px] border-4 border-sky-400 shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[92vh]"
          >
            {/* Header */}
            <div className="p-3.5 sm:p-4 bg-gradient-to-r from-sky-500 via-indigo-600 to-sky-600 flex items-center justify-between text-white border-b-2 border-sky-600 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white/20 p-0.5 flex items-center justify-center shadow-inner">
                  <Pip mood={pipMood} size="sm" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950/40 text-amber-300 px-2.5 py-0.5 rounded-full">
                      CBSE Class 5 AI Mentor
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white tracking-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Ask Pip Live Science Tutor 🤖✨
                  </h3>
                </div>
              </div>

              <button
                onClick={() => {
                  sounds.pop();
                  voiceAssistant.stop();
                  onClose();
                }}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 cursor-pointer transition-all active:scale-95 shadow-xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages Scroll Container */}
            <div className="p-3.5 sm:p-4 overflow-y-auto flex-1 flex flex-col gap-3.5 bg-slate-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {msg.sender === 'pip' ? (
                    <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}

                  {/* Simple User Message */}
                  {msg.sender === 'user' && (
                    <div className="p-3.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xs rounded-tr-none max-w-[85%]">
                      {msg.text}
                    </div>
                  )}

                  {/* Welcome Plain Message */}
                  {msg.sender === 'pip' && msg.text && (
                    <div className="p-3.5 rounded-2xl bg-white border-2 border-slate-200 text-slate-800 font-bold text-xs sm:text-sm shadow-xs rounded-tl-none max-w-[88%]">
                      <span>{msg.text}</span>
                    </div>
                  )}

                  {/* Structured Rich Pedagogical Card from Pip */}
                  {msg.sender === 'pip' && msg.structured && (
                    <div className="bg-white border-2 sm:border-3 border-sky-200 rounded-2xl sm:rounded-3xl p-4 shadow-sm text-slate-800 flex flex-col gap-3 max-w-[92%] rounded-tl-none">
                      {/* 1. Clear Concept Explanation */}
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs sm:text-sm font-black text-slate-900 leading-relaxed">
                          {msg.structured.simpleExplanation}
                        </p>
                        <button
                          onClick={() =>
                            voiceAssistant.speak(
                              `${msg.structured?.simpleExplanation} ${msg.structured?.everydayAnalogy}`
                            )
                          }
                          className="p-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 cursor-pointer shrink-0 transition-colors"
                          title="Read Explanation"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* 2. Everyday Analogy Pill */}
                      {msg.structured.everydayAnalogy && (
                        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-950 flex items-start gap-2">
                          <span className="text-base shrink-0">🌟</span>
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                              Everyday Analogy:
                            </span>
                            <span>{msg.structured.everydayAnalogy}</span>
                          </div>
                        </div>
                      )}

                      {/* 3. Kitchen / At-Home Safe Experiment */}
                      {msg.structured.kitchenExperiment && (
                        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-950 flex items-start gap-2">
                          <span className="text-base shrink-0">🏡</span>
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                              Try at Home:
                            </span>
                            <span>{msg.structured.kitchenExperiment}</span>
                          </div>
                        </div>
                      )}

                      {/* 4. Interactive Quick Challenge Quiz */}
                      {msg.structured.quickChallenge && (
                        <div className="p-3 bg-indigo-50 border-2 border-indigo-200 rounded-2xl flex flex-col gap-2">
                          <div className="flex items-center gap-1.5 text-xs font-black text-indigo-950">
                            <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                            <span>Pop Quiz: {msg.structured.quickChallenge.question}</span>
                          </div>

                          <div className="grid grid-cols-1 gap-1.5">
                            {msg.structured.quickChallenge.options.map((opt, oIdx) => {
                              const isSelected = msg.selectedOption === oIdx;
                              return (
                                <button
                                  key={oIdx}
                                  disabled={msg.isQuizAnswered}
                                  onClick={() => handleQuizAnswer(msg.id, oIdx, opt.isCorrect)}
                                  className={`p-2.5 rounded-xl text-left text-xs font-black transition-all flex items-center justify-between cursor-pointer ${
                                    msg.isQuizAnswered && opt.isCorrect
                                      ? 'bg-emerald-200 border-2 border-emerald-600 text-emerald-950'
                                      : isSelected && !opt.isCorrect
                                      ? 'bg-rose-200 border-2 border-rose-600 text-rose-950'
                                      : 'bg-white hover:bg-indigo-100 border border-indigo-200 text-indigo-900'
                                  }`}
                                >
                                  <span>{opt.text}</span>
                                  {msg.isQuizAnswered && opt.isCorrect && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {msg.isQuizAnswered && (
                            <p className="text-[11px] font-bold text-indigo-900 bg-white/80 p-2 rounded-xl border border-indigo-200">
                              💡 {msg.structured.quickChallenge.explanation}
                            </p>
                          )}
                        </div>
                      )}

                      {/* 5. Direct Mission Link Shortcut */}
                      {msg.structured.relatedMission && (
                        <button
                          onClick={() => {
                            sounds.sparkle();
                            onClose();
                            navigate('/chapter-hub');
                          }}
                          className="w-full py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
                        >
                          <FlaskConical className="w-3.5 h-3.5 text-amber-300" />
                          <span>{msg.structured.relatedMission.actionText}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-sky-200 w-fit shadow-xs animate-pulse">
                  <Sparkles className="w-4 h-4 text-sky-500 animate-spin" />
                  <span className="text-xs font-black text-sky-800">
                    Pip is preparing an experiment clue & analogy...
                  </span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="p-2.5 bg-white border-t border-slate-200 flex gap-2 overflow-x-auto shrink-0 scrollbar-none">
              {TOPIC_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip.q)}
                  className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-full text-xs font-black text-sky-900 whitespace-nowrap cursor-pointer transition-all active:scale-95 shadow-2xs shrink-0"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-2.5 sm:p-3 bg-slate-100 border-t border-slate-200 flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask Pip any science question (e.g. why is nylon strong?)..."
                className="flex-1 px-4 py-2.5 bg-white rounded-2xl text-xs sm:text-sm font-bold text-slate-800 border-2 border-slate-200 focus:outline-none focus:border-sky-500 shadow-inner"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isLoading}
                className="p-2.5 sm:px-4 sm:py-2.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-40 text-white font-black text-xs rounded-2xl cursor-pointer transition-all shadow-md active:scale-95 flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Ask</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
