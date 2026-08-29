import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Volume2,
  Bot,
  HelpCircle,
  Lightbulb,
  User,
} from 'lucide-react';
import { Pip } from '@/components/pip/Pip';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { geminiService } from '@/lib/geminiService';

interface SocraticPipAITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'pip';
  text: string;
  timestamp: string;
}

const QUICK_QUESTIONS = [
  'Why do raincoats use polyester?',
  'Why does cotton absorb sweat?',
  'Why are wires coated in PVC plastic?',
  'Why do plastics not decompose in soil?',
  'Why are kettle handles made of Bakelite?',
];

export const SocraticPipAITutorModal: React.FC<SocraticPipAITutorModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'pip',
      text: "Hello, Young Scientist! 🔬 I'm Pip, your AI Science Guide! Ask me anything about materials, polymers, electricity, or nature!",
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const pipReply = await geminiService.askSocraticPip(textToSend);
      const pipMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'pip',
        text: pipReply,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, pipMsg]);
      sounds.sparkle();
      voiceAssistant.speak(pipReply);
    } catch (err) {
      console.error('Error asking Pip:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl md:rounded-[36px] border-4 border-sky-400 shadow-2xl overflow-hidden flex flex-col h-[560px] max-h-[92vh]">
        {/* Header */}
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-sky-400 via-indigo-500 to-sky-500 flex items-center justify-between text-white border-b-2 border-sky-500 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 p-0.5 flex items-center justify-center shadow-inner">
              <Pip mood="curious" size="sm" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950/40 text-amber-300 px-2 py-0.5 rounded-full">
                Gemini 2.5 Socratic AI
              </span>
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
        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-3 bg-slate-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {msg.sender === 'pip' ? (
                <div className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                  <User className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-3 sm:p-3.5 rounded-2xl max-w-[82%] text-xs sm:text-sm font-bold shadow-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-amber-400 text-slate-950 rounded-tr-none'
                    : 'bg-white border-2 border-slate-200 text-slate-800 rounded-tl-none'
                }`}
              >
                <span>{msg.text}</span>
                {msg.sender === 'pip' && (
                  <button
                    onClick={() => voiceAssistant.speak(msg.text)}
                    className="ml-1.5 inline-flex items-center text-sky-600 hover:text-sky-800 cursor-pointer align-middle"
                    title="Read Aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-2.5 bg-white rounded-2xl border border-slate-200 w-fit">
              <Sparkles className="w-4 h-4 text-sky-500 animate-spin" />
              <span className="text-xs font-bold text-slate-500">Pip is thinking of a Socratic clue...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2 bg-white border-t border-slate-200 flex gap-1.5 overflow-x-auto shrink-0">
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-full text-[11px] font-bold text-sky-900 whitespace-nowrap cursor-pointer transition-all active:scale-95"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask Pip any science question..."
            className="flex-1 px-3.5 py-2 bg-slate-100 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white rounded-2xl cursor-pointer transition-all shadow-md active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
