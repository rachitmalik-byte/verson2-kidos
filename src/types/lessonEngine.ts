/**
 * PolyQuest Interactive Learning Engine — Type Definitions
 * Scalable, data-driven architecture for Grade 5 (Ages 10-11) science lessons.
 */

export type ActivityType =
  | 'water_absorption_lab'
  | 'microscopic_zoom_viewer'
  | 'sorting_tray'
  | 'tensile_strength_rig'
  | 'mcq_assessment'
  | 'read_aloud_coach'
  | 'scenario_sim'
  | 'concept_summary';

export interface BaseStepData {
  id: string;
  type: ActivityType;
  title: string;
  subtitle?: string;
  pipPrompt: string;
  pipMood?: 'explaining' | 'curious' | 'thinking' | 'celebrating' | 'hinting' | 'encouraging';
  audioPrompt?: string;
  conceptBadge?: string;
}

// 1. Water Absorption Lab Schema
export interface WaterSpecimen {
  id: string;
  name: string;
  materialType: 'cotton' | 'polyester' | 'nylon' | 'wool' | 'silk';
  category: 'Natural' | 'Synthetic';
  dryImage: string;
  wetImage: string;
  isHydrophobic: boolean;
  absorptionRateSec: number;
  description: string;
  microscopicNote: string;
}

export interface WaterAbsorptionLabData extends BaseStepData {
  type: 'water_absorption_lab';
  specimens: WaterSpecimen[];
  dropletCountPerSpray?: number;
  learningGoal: string;
}

// 2. Microscopic Zoom Viewer Schema
export interface MicroscopicZoomTier {
  magnification: '1x' | '10x' | '100x';
  label: string;
  image: string;
  scaleBarText: string;
  structuralFeatures: string[];
  scientificExplanation: string;
}

export interface MicroscopicZoomData extends BaseStepData {
  type: 'microscopic_zoom_viewer';
  specimenName: string;
  specimenCategory: 'Natural' | 'Synthetic' | 'Metallic' | 'Mineral';
  tiers: MicroscopicZoomTier[];
  interactiveQuestion?: {
    question: string;
    options: { text: string; isCorrect: boolean }[];
    explanation: string;
  };
}

// 3. Sorting Tray Engine Schema
export interface SortingItem {
  id: string;
  name: string;
  icon: string;
  image?: string;
  category: string; // matches tray.id
  hint: string;
  originDetails: string;
}

export interface SortingTray {
  id: string;
  title: string;
  icon: string;
  themeColor: 'sage' | 'sky' | 'amber' | 'coral' | 'indigo';
  allowedCategories: string[];
  description: string;
}

export interface SortingTrayData extends BaseStepData {
  type: 'sorting_tray';
  items: SortingItem[];
  trays: SortingTray[];
  reflectionQuestion?: {
    question: string;
    options: { text: string; isCorrect: boolean }[];
    explanation: string;
  };
}

// 4. Tensile Strength Rig Schema
export interface TensileSpecimen {
  id: string;
  name: string;
  material: string;
  icon: string;
  breakingWeightGrams: number;
  elasticDeformationMm: number;
  snapSound: string;
  description: string;
  realWorldUse: string;
}

export interface TensileStrengthRigData extends BaseStepData {
  type: 'tensile_strength_rig';
  specimens: TensileSpecimen[];
  weightIncrementGrams: number;
  maxWeightGrams: number;
  scientificTakeaway: string;
}

// 5. MCQ Assessment Schema
export interface McqOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface McqAssessmentData extends BaseStepData {
  type: 'mcq_assessment';
  question: string;
  options: McqOption[];
  isMultiSelect?: boolean;
  explanation: string;
  hint?: string;
  illustrationImage?: string;
}

// 6. Speech Read-Aloud Coach Schema
export interface ReadAloudCoachData extends BaseStepData {
  type: 'read_aloud_coach';
  targetSentence: string;
  phoneticTips?: string[];
  targetWord?: string;
  scienceDefinition?: string;
}

// 7. Scenario Simulation Schema
export interface ScenarioSimulationData extends BaseStepData {
  type: 'scenario_sim';
  scenarioType: 'pipe_leak' | 'race_tire' | 'molecular_vulcanization' | 'epoxy_mixer' | 'circuit_bench';
  specimenChoices?: {
    id: string;
    title: string;
    material: string;
    isOptimal: boolean;
    outcomeDescription: string;
  }[];
}

// 8. Concept Summary Schema
export interface ConceptSummaryData extends BaseStepData {
  type: 'concept_summary';
  takeawayCards: {
    icon: string;
    title: string;
    description: string;
    formula?: string;
  }[];
  journalSpecimenReward?: {
    name: string;
    category: 'natural' | 'synthetic';
    icon: string;
    funFact: string;
  };
}

// Union of all step data types
export type LessonStepData =
  | WaterAbsorptionLabData
  | MicroscopicZoomData
  | SortingTrayData
  | TensileStrengthRigData
  | McqAssessmentData
  | ReadAloudCoachData
  | ScenarioSimulationData
  | ConceptSummaryData;

// Mission Configuration
export interface LessonMissionConfig {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: string;
  themeColor: string;
  bgmTrack?: string;
  concepts: string[];
  steps: LessonStepData[];
}
