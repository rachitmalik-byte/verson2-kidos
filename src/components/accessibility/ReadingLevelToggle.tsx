import React from 'react';
import { useReadingLevelStore } from '@/stores/readingLevelStore';
import { sounds } from '@/lib/sounds';
import { BookOpen, Sparkles } from 'lucide-react';

export const ReadingLevelToggle: React.FC<{ compact?: boolean; className?: string }> = ({
  compact = false,
  className = '',
}) => {
  const { readingLevel, setReadingLevel } = useReadingLevelStore();

  const handleToggle = () => {
    sounds.pop();
    const next = readingLevel === 'junior' ? 'senior' : 'junior';
    setReadingLevel(next);
  };

  return (
    <button
      onClick={handleToggle}
      className={`px-2.5 py-1 rounded-full font-bold text-xs flex items-center gap-1.5 border transition-all cursor-pointer shadow-xs shrink-0 active:scale-95 ${
        readingLevel === 'junior'
          ? 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100'
          : 'bg-indigo-50 border-indigo-200 text-indigo-900 hover:bg-indigo-100'
      } ${className}`}
      title={`Reading Level: ${readingLevel === 'junior' ? 'Junior Explorer (Grades 4-5)' : 'Senior Scientist (Grades 6-8)'} - Tap to toggle`}
    >
      <span className="text-sm">{readingLevel === 'junior' ? '🐣' : '🔬'}</span>
      <span className={compact ? 'hidden' : 'hidden sm:inline font-bold'}>
        {readingLevel === 'junior' ? 'Junior' : 'Senior'}
      </span>
    </button>
  );
};

