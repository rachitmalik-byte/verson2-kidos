import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface CardProps {
  title?: string;
  children: ReactNode;
  color?: string;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  color,
  className = '',
  onClick
}) => {
  const Component = onClick ? motion.button : motion.div;
  
  return (
    <Component
      whileHover={onClick ? { y: -4, rotate: -1 } : {}}
      onClick={onClick}
      className={`relative bg-white rounded-lg border border-[color:var(--pq-slate)] shadow-md p-6 text-left ${onClick ? 'cursor-pointer w-full' : ''} ${className}`}
      style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
      }}
    >
      {/* Tape decoration */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 border border-white/60 shadow-sm transform -rotate-2" />
      
      {/* Optional color stripe */}
      {color && (
        <div 
          className="absolute left-0 top-0 bottom-0 w-2 rounded-l-lg"
          style={{ backgroundColor: color }}
        />
      )}
      
      {title && (
        <h3 className="font-heading text-xl font-bold text-[color:var(--pq-charcoal)] mb-3">
          {title}
        </h3>
      )}
      
      <div className="font-body text-[color:var(--pq-charcoal)]">
        {children}
      </div>
    </Component>
  );
};
