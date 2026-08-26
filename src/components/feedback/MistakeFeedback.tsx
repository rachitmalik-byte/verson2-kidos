import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pip } from '@/components/pip/Pip';

export interface MistakeFeedbackProps {
  isVisible: boolean;
  message?: string;
  onDismiss: () => void;
  children: React.ReactNode;
}

export const MistakeFeedback: React.FC<MistakeFeedbackProps> = ({
  isVisible,
  message = "Hmm, let's try again!",
  onDismiss,
  children
}) => {
  
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  return (
    <div className="relative inline-block">
      <motion.div
        animate={isVisible ? {
          x: [-5, 5, -3, 3, 0],
          boxShadow: ['0 0 0 0 rgba(232, 115, 90, 0)', '0 0 0 10px rgba(232, 115, 90, 0.3)', '0 0 0 0 rgba(232, 115, 90, 0)']
        } : {}}
        transition={{ duration: 0.5 }}
        className={isVisible ? 'rounded-lg z-10 relative' : ''}
      >
        {children}
      </motion.div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg border-2 border-[color:var(--pq-coral)] z-20 pointer-events-none whitespace-nowrap"
          >
            <div className="w-8 h-8 -ml-2">
              <Pip mood="thinking" />
            </div>
            <span className="font-heading font-bold text-[color:var(--pq-charcoal)]">
              {message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
