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
      className={`px-3 py-1.5 rounded-2xl font-black text-xs flex items-center gap-1.5 border-2 transition-all cursor-pointer shadow-xs ${
        readingLevel === 'junior'
          ? 'bg-amber-100 border-amber-300 text-amber-950 hover:bg-amber-200'
          : 'bg-indigo-100 border-indigo-300 text-indigo-950 hover:bg-indigo-200'
      }`}
      title="Click to toggle Reading Level (Junior: Grades 4-5 vs Senior: Grades 6-8)"
    >
      <span>{readingLevel === 'junior' ? '🐣 Junior Explorer' : '🔬 Senior Scientist'}</span>
    </button>
  );
};
