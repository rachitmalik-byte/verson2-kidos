import React from 'react';
import { useReadingLevelStore } from '@/stores/readingLevelStore';
import { sounds } from '@/lib/sounds';
import { BookOpen, Sparkles } from 'lucide-react';

export const ReadingLevelToggle: React.FC = () => {
  const { readingLevel, setReadingLevel } = useReadingLevelStore();

  const handleToggle = () => {
    sounds.pop();
    const next = readingLevel === 'junior' ? 'senior' : 'junior';
    setReadingLevel(next);
  };

  return (
    <button
      onClick={handleToggle}
      className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl font-black text-xs flex items-center gap-1 sm:gap-1.5 border-2 transition-all cursor-pointer shadow-xs shrink-0 active:scale-95 ${
        readingLevel === 'junior'
          ? 'bg-amber-100 border-amber-300 text-amber-950 hover:bg-amber-200'
          : 'bg-indigo-100 border-indigo-300 text-indigo-950 hover:bg-indigo-200'
      }`}
      title={`Reading Level: ${readingLevel === 'junior' ? 'Junior Explorer (Grades 4-5)' : 'Senior Scientist (Grades 6-8)'} - Tap to toggle`}
    >
      <span className="text-sm">{readingLevel === 'junior' ? '🐣' : '🔬'}</span>
      <span className="hidden sm:inline md:hidden">{readingLevel === 'junior' ? 'Junior' : 'Senior'}</span>
      <span className="hidden md:inline">{readingLevel === 'junior' ? 'Junior Explorer' : 'Senior Scientist'}</span>
    </button>
  );
};
