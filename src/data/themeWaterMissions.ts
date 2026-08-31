export interface WaterChapter {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  cbseChapterRef: string;
  icon: string;
  themeColor: string;
  concepts: string[];
  stagesCount: number;
}

export const WATER_CHAPTERS: WaterChapter[] = [
  {
    id: 'chapter-water-cycle',
    chapterNumber: 1,
    title: "Earth's Water Cycle Simulation",
    subtitle: 'Evaporation, Condensation, Precipitation & Solar Energy (NCERT EVS)',
    cbseChapterRef: 'CBSE Class 5 EVS • Water Theme',
    icon: '🌊',
    themeColor: 'sky',
    concepts: ['Evaporation', 'Condensation', 'Precipitation', 'Solar Heat', 'Water Vapor'],
    stagesCount: 4,
  },
  {
    id: 'chapter-every-drop-counts',
    chapterNumber: 2,
    title: 'Every Drop Counts (Bawris & Stepwells)',
    subtitle: 'Ghadisar Lake, 9 Interconnected Tanks & Rainwater Harvesting in Rajasthan',
    cbseChapterRef: 'NCERT Chapter 6 • Every Drop Counts',
    icon: '🏰',
    themeColor: 'amber',
    concepts: ['Rainwater Harvesting', 'Stepwells (Bawris)', 'Johads', 'Conservation'],
    stagesCount: 4,
  },
  {
    id: 'chapter-experiments-with-water',
    chapterNumber: 3,
    title: 'Experiments with Water (Density & Buoyancy)',
    subtitle: 'Why does an iron nail sink while a giant ship floats? Dead Sea Salt Physics',
    cbseChapterRef: 'NCERT Chapter 7 • Experiments with Water',
    icon: '🧪',
    themeColor: 'teal',
    concepts: ['Buoyancy', 'Density', 'Dead Sea Salt', 'Surface Tension'],
    stagesCount: 4,
  },
  {
    id: 'chapter-mosquito-ecology',
    chapterNumber: 4,
    title: 'A Treat for Mosquitoes (Water Ecology)',
    subtitle: 'Ronald Ross, Microscope Discovery of Malaria & Stagnant Water Cleanliness',
    cbseChapterRef: 'NCERT Chapter 8 • A Treat for Mosquitoes',
    icon: '🦟',
    themeColor: 'emerald',
    concepts: ['Mosquito Larvae', 'Stagnant Water', 'Malaria Prevention', 'Ronald Ross Nobel Prize'],
    stagesCount: 4,
  },
];
