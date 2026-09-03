import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Pip } from './Pip';
import { PipSpeechBubble } from './PipSpeechBubble';
import { useUiSettingsStore } from '@/stores/uiSettingsStore';

interface FloatingMissionPipProps {
  mood: any;
  message: string;
  isVisible: boolean;
}

export const FloatingMissionPip: React.FC<FloatingMissionPipProps> = ({ mood, message, isVisible }) => {
  const { pipMode, showPipText } = useUiSettingsStore();

  if (pipMode === 'hidden' || !isVisible) return null;

  const content = (
    <div className={`flex ${pipMode === 'floating' ? 'flex-col-reverse' : 'flex-row items-center'} gap-4 pointer-events-none`}>
      <div className="pointer-events-auto">
        <Pip mood={mood} size={pipMode === 'floating' ? 'sm' : 'md'} />
      </div>
      {showPipText && (
        <div className="pointer-events-auto">
          <PipSpeechBubble message={message} isVisible={true} />
        </div>
      )}
    </div>
  );

  if (pipMode === 'floating') {
    if (typeof document === 'undefined') return null;
    return createPortal(
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="fixed bottom-36 left-6 z-[99905]"
        >
          {content}
        </motion.div>
      </AnimatePresence>,
      document.body
    );
  }

  return <div className="mb-6">{content}</div>;
};
