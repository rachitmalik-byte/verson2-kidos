import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SpacedRecallQuestion {
  id: string;
  sourceMission: string;
  topicTitle: string;
  icon: string;
  question: string;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
}

export const RECALL_QUESTION_BANK: SpacedRecallQuestion[] = [
  {
    id: 'recall-raincoat',
    sourceMission: 'mission-01',
    topicTitle: 'Raincoat Science',
    icon: '🧥',
    question: 'Do you remember why synthetic polyester makes a better raincoat than cotton?',
    options: [
      { text: 'Polyester has tight non-porous fibers that repel water droplets so they roll right off!', isCorrect: true },
      { text: 'Cotton is heavier and soaks up all the rain water until it weighs 5 kg.', isCorrect: false },
    ],
    explanation: 'Synthetic polyester fibers have no capillary pores for water to seep into!',
  },
  {
    id: 'recall-sorting',
    sourceMission: 'mission-02',
    topicTitle: 'Natural vs Synthetic',
    icon: '🌿',
    question: 'Where do natural materials like cotton and wool originate from?',
    options: [
      { text: 'Directly from living plants, animals, trees, and earth minerals.', isCorrect: true },
      { text: 'Synthesized inside chemical factory machines using petroleum.', isCorrect: false },
    ],
    explanation: 'Natural materials come from organic plants and animals without factory chemical polymerization!',
  },
  {
    id: 'recall-nylon',
    sourceMission: 'mission-03',
    topicTitle: 'Super-Nylon Strength',
    icon: '🪢',
    question: 'Why does synthetic nylon rope hold climbers without snapping like cotton?',
    options: [
      { text: 'Nylon is made of long continuous polymer chains that stretch and lock tight under load!', isCorrect: true },
      { text: 'Nylon is glued together with tree sap.', isCorrect: false },
    ],
    explanation: 'Continuous synthetic polymer chains have higher tensile strength than short twisted plant hairs!',
  },
  {
    id: 'recall-fire',
    sourceMission: 'mission-04',
    topicTitle: 'Flame Safety',
    icon: '🔥',
    question: 'What dangerous reaction happens when synthetic polyester touches an open flame?',
    options: [
      { text: 'It melts into hot sticky molten plastic beads that cling to skin.', isCorrect: true },
      { text: 'It burns cleanly into harmless grey mineral powder ash.', isCorrect: false },
    ],
    explanation: 'Synthetic petrochemical fabrics melt like plastic, which is why lab coats must be 100% natural cotton!',
  },
  {
    id: 'recall-dead-sea',
    sourceMission: 'water-ch3',
    topicTitle: 'Dead Sea Buoyancy',
    icon: '🧂',
    question: 'Why is it impossible for a person to sink in the Dead Sea?',
    options: [
      { text: 'High salt density (300 g/L) makes the water heavier than the human body!', isCorrect: true },
      { text: 'The water is magnetic and pushes people upward.', isCorrect: false },
    ],
    explanation: 'Dense salty water pushes upward with buoyant force greater than our body weight!',
  },
];

interface SpacedRecallState {
  lastRecallTimestamp: number;
  recallScore: number;
  answeredQuestionIds: string[];
  recordAnswer: (questionId: string, isCorrect: boolean) => void;
  shouldPromptRecall: () => boolean;
}

export const useSpacedRecallStore = create<SpacedRecallState>()(
  persist(
    (set, get) => ({
      lastRecallTimestamp: 0,
      recallScore: 0,
      answeredQuestionIds: [],

      recordAnswer: (questionId, isCorrect) => {
        const { recallScore, answeredQuestionIds } = get();
        set({
          lastRecallTimestamp: Date.now(),
          recallScore: isCorrect ? recallScore + 1 : recallScore,
          answeredQuestionIds: [...answeredQuestionIds, questionId],
        });
      },

      shouldPromptRecall: () => {
        const { lastRecallTimestamp } = get();
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;
        return Date.now() - lastRecallTimestamp > ONE_DAY_MS;
      },
    }),
    { name: 'polyquest-spaced-recall' }
  )
);
