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
  Lightbulb,
} from 'lucide-react';
import { Pip } from '@/components/pip/Pip';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { geminiService } from '@/lib/geminiService';

interface SocraticPipAITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextTopic?: string;
}

interface ChatMessage {
  id: string;
  sender: 'pip' | 'user';
  text: string;
  timestamp: string;
}

const SAMPLE_QUESTIONS = [
  'Why does cotton absorb sweat?',
  'Why do raincoats use polyester?',
  'Why are electric wires coated in plastic?',
  'Why are cooking pan handles made of Bakelite?',
  'Why is nylon rope so strong for climbing?',
  'Why does ice float on water?',
];

export const SocraticPipAITutorModal: React.FC<SocraticPipAITutorModalProps> = ({
  isOpen,
  onClose,
  contextTopic,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'pip',
      text: "Hello, Young Scientist! 🔬 I'm Pip! Ask me any science question and I will explain it in simple, easy words!",
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
      const pipAnswer = await geminiService.askSocraticPip(textToSend, contextTopic);
      const pipMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'pip',
        text: pipAnswer,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, pipMsg]);
      setPipMood('explaining');
      sounds.sparkle();
      voiceAssistant.speak(pipAnswer);
    } catch (err: any) {
      console.error('Error asking Pip:', err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'pip',
        text: "I couldn't reach the AI server right now. Please check your internet connection and ask again! 🌐",
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
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
            className="relative z-10 bg-white w-full max-w-lg rounded-3xl md:rounded-[36px] border-4 border-sky-400 shadow-2xl overflow-hidden flex flex-col h-[580px] max-h-[92vh]"
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
                      Real-Time Gemini AI
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white tracking-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Ask Pip Live AI Mentor 🤖✨
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
            <div className="p-3.5 sm:p-4 overflow-y-auto flex-1 flex flex-col gap-3 bg-slate-50">
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

                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] text-xs sm:text-sm font-bold shadow-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-amber-400 text-slate-950 rounded-tr-none font-black'
                        : 'bg-white border-2 border-slate-200 text-slate-900 rounded-tl-none'
                    }`}
                  >
                    <span>{msg.text}</span>
                    {msg.sender === 'pip' && (
                      <button
                        onClick={() => voiceAssistant.speak(msg.text)}
                        className="ml-2 inline-flex items-center text-sky-600 hover:text-sky-800 cursor-pointer align-middle p-1 rounded hover:bg-sky-50 transition-colors"
                        title="Read aloud"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-sky-200 w-fit shadow-xs animate-pulse">
                  <Sparkles className="w-4 h-4 text-sky-500 animate-spin" />
                  <span className="text-xs font-black text-sky-800">
                    Pip is thinking of a simple explanation...
                  </span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="p-2.5 bg-white border-t border-slate-200 flex gap-2 overflow-x-auto shrink-0 scrollbar-none">
              {SAMPLE_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-full text-xs font-bold text-sky-900 whitespace-nowrap cursor-pointer transition-all active:scale-95 shadow-2xs shrink-0"
                >
                  {q}
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
                placeholder="Ask Pip any science question..."
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
