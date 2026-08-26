import React, { useState, useRef } from 'react';
import { VocabPopup } from './VocabPopup';
import { findVocabWord } from '@/data/vocabulary';

export interface VocabHighlightProps {
  text: string;
}

export const VocabHighlight: React.FC<VocabHighlightProps> = ({ text }) => {
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
  
  // This is a simplified approach. In a real app, you might want to parse
  // the text more robustly to find multiple vocab words without breaking HTML.
  const words = text.split(' ');
  
  const handleWordClick = (word: string, e: React.MouseEvent) => {
    const cleanWord = word.replace(/[.,!?]/g, '');
    const vocabData = findVocabWord(cleanWord);
    
    if (vocabData) {
      setTriggerRect(e.currentTarget.getBoundingClientRect());
      setActiveWord(cleanWord);
    }
  };

  return (
    <>
      <span className="font-body">
        {words.map((word, index) => {
          const cleanWord = word.replace(/[.,!?]/g, '');
          const isVocab = findVocabWord(cleanWord) !== undefined;
          
          if (isVocab) {
            return (
              <span key={index}>
                <button
                  onClick={(e) => handleWordClick(word, e)}
                  className="inline-block text-[color:var(--pq-sky)] font-bold decoration-2 underline decoration-[color:var(--pq-sky)] decoration-dotted underline-offset-4 hover:bg-[color:var(--pq-cream)] rounded px-1 cursor-pointer transition-colors"
                >
                  {cleanWord}
                </button>
                {word.substring(cleanWord.length)}{' '}
              </span>
            );
          }
          
          return <span key={index}>{word} </span>;
        })}
      </span>
      
      <VocabPopup
        word={activeWord || ''}
        triggerRect={triggerRect}
        isOpen={!!activeWord}
        onClose={() => setActiveWord(null)}
      />
    </>
  );
};
