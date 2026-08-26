import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { findVocabWord } from '@/data/vocabulary';

export interface VocabPopupProps {
  word: string;
  triggerRect: DOMRect | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VocabPopup: React.FC<VocabPopupProps> = ({ word, triggerRect, isOpen, onClose }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isMobile, setIsMobile] = useState(false);
  
  const vocabData = findVocabWord(word);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      
      if (triggerRect && !isMobile) {
        const MARGIN = 12;
        const popupWidth = 250;
        const popupHeight = 120; // Estimated height
        
        let top = triggerRect.bottom + MARGIN;
        let left = triggerRect.left + (triggerRect.width / 2) - (popupWidth / 2);
        
        // Adjust if out of bounds
        if (left < MARGIN) left = MARGIN;
        if (left + popupWidth > window.innerWidth - MARGIN) {
          left = window.innerWidth - popupWidth - MARGIN;
        }
        if (top + popupHeight > window.innerHeight - MARGIN) {
          top = triggerRect.top - popupHeight - MARGIN;
        }
        
        setPosition({ top: top + window.scrollY, left });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [triggerRect, isMobile]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!vocabData || !isOpen) return null;

  const handlePlayAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(vocabData.word);
      utterance.pitch = 1.1;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const content = (
    <div className="p-4 bg-white rounded-2xl shadow-xl border-2 border-[color:var(--pq-sky)] max-w-[250px] w-full">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-heading font-bold text-lg text-[color:var(--pq-charcoal)] flex items-center gap-2">
          {vocabData.word}
          <span className="text-xl">{vocabData.emoji}</span>
        </h4>
        <button 
          onClick={handlePlayAudio}
          className="p-1.5 text-[color:var(--pq-sky)] hover:bg-[color:var(--pq-cream)] rounded-full transition-colors"
          aria-label="Listen to word"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>
      <p className="font-body text-sm text-[color:var(--pq-slate)]">
        {vocabData.definition}
      </p>
    </div>
  );

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile Overlay */}
          {isMobile && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/20 z-40"
            />
          )}
          
          <motion.div
            initial={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.9, y: 10 }}
            animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.9, y: 10 }}
            className={`fixed z-50 ${isMobile ? 'bottom-0 left-0 right-0 p-4 rounded-t-3xl bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)]' : ''}`}
            style={isMobile ? {} : { top: position.top, left: position.left }}
          >
            {isMobile ? (
               <div className="max-w-md mx-auto relative">
                 <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
                 {content}
               </div>
            ) : content}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};
