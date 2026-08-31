/**
 * PolyQuest Interactive Learning Engine — Type Definitions
 * Scalable, data-driven architecture for Grade 5 (Ages 10-11) science lessons.
 */

export type ActivityType =
  | 'interactive_diagram'
  | 'water_absorption_lab'
  | 'microscopic_zoom_viewer'
  | 'sorting_tray'
  | 'tensile_strength_rig'
  | 'matching_pairs'
  | 'mcq_assessment'
  | 'summer_comfort_sim'
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
  intactImage?: string;
  snappedImage?: string;
}

export interface TensileStrengthRigData extends BaseStepData {
  type: 'tensile_strength_rig';
  specimens: TensileSpecimen[];
  weightIncrementGrams: number;
  maxWeightGrams: number;
  scientificTakeaway: string;
}

// 5. Matching Pairs Schema
export interface MatchingPairItem {
  id: string;
  leftText: string;
  leftIcon?: string;
  leftImage?: string;
  rightText: string;
  rightIcon?: string;
  rightImage?: string;
  explanation: string;
}

export interface MatchingPairsData extends BaseStepData {
  type: 'matching_pairs';
  instruction: string;
  pairs: MatchingPairItem[];
  feedbackSuccess: string;
}

// 6. MCQ Assessment Schema
export interface McqOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
  icon?: string;
}

export interface McqAssessmentData extends BaseStepData {
  type: 'mcq_assessment';
  question: string;
  options: McqOption[];
  isMultiSelect?: boolean;
  explanation: string;
  hint?: string;
  illustrationImage?: string;
  scenarioEmoji?: string;
}

// 7. Summer Comfort 2D Vector Sim Schema
export interface SummerComfortSimData extends BaseStepData {
  type: 'summer_comfort_sim';
  ambientTempC: number;
  cottonCoolingRate: number;
  polyesterHeatingRate: number;
  takeaway: string;
}

// 8. Speech Read-Aloud Coach Schema
export interface ReadAloudCoachData extends BaseStepData {
  type: 'read_aloud_coach';
  targetSentence: string;
  phoneticTips?: string[];
  targetWord?: string;
  scienceDefinition?: string;
}

// 9. Scenario Simulation Schema
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

// 10. Concept Summary Schema
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

// 11. Interactive Animated Diagram Schema
export interface DiagramHotspot {
  id: string;
  name: string;
  stageNumber: number;
  icon: string;
  xPercent: number; // 0 to 100 on canvas
  yPercent: number; // 0 to 100 on canvas
  title: string;
  explanation: string;
  animationType: 'evaporate_steam' | 'rain_drops' | 'condense_cloud' | 'flow_water' | 'pulse_sun' | 'spin_electrons' | 'flow_energy';
  audioPrompt?: string;
  funFact?: string;
}

export interface DiagramControlToggle {
  id: string;
  label: string;
  icon: string;
  activeColor: string;
  actionType: 'heat_sun' | 'cool_sky' | 'trigger_rain' | 'flow_current' | 'speed_cycle';
}

export interface InteractiveDiagramData extends BaseStepData {
  type: 'interactive_diagram';
  topic: 'water_cycle' | 'photosynthesis' | 'electric_circuit' | 'states_of_matter' | 'solar_system' | 'custom';
  diagramTitle: string;
  backgroundTheme: 'sky_ocean' | 'nature_field' | 'circuit_board' | 'deep_space' | 'science_lab';
  hotspots: DiagramHotspot[];
  controls?: DiagramControlToggle[];
  learningObjective: string;
  summaryTakeaway: string;
}

// Union of all step data types
export type LessonStepData =
  | InteractiveDiagramData
  | WaterAbsorptionLabData
  | MicroscopicZoomData
  | SortingTrayData
  | TensileStrengthRigData
  | MatchingPairsData
  | McqAssessmentData
  | SummerComfortSimData
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
  targetGrade?: number;
  bgmTrack?: string;
  concepts: string[];
  steps: LessonStepData[];
}
