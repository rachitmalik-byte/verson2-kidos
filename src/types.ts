// ─── Material & Vocabulary Types ───

export interface MaterialProperty {
  name: string;
  description: string; // child-friendly
  icon: string; // emoji
}

export interface Material {
  id: string;
  name: string;
  type: 'natural' | 'synthetic';
  category: 'fibre' | 'plastic' | 'rubber' | 'adhesive' | 'metal' | 'other';
  image: string; // SVG path or emoji
  color: string; // theme color
  properties: MaterialProperty[];
  uses: string[];
  funFact?: string;
  discoveredIn?: string; // mission ID where first encountered
}

export interface VocabWord {
  word: string;
  definition: string; // child-friendly, one line
  icon: string; // emoji
  pronunciation?: string;
}

export interface MissionStep {
  id: string;
  type: 'hook' | 'interactive' | 'understanding' | 'practice' | 'apply' | 'remember';
  title: string;
}

export interface Mission {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: string; // emoji
  theme: string; // visual theme
  themeColor: string;
  steps: MissionStep[];
  unlockAfter: string | null; // mission ID
  concepts: string[];
}

export interface ChildProfile {
  name: string;
  grade: string;
  interests: string[];
  avatar?: string;
}

export interface DiscoveryEntry {
  materialId: string;
  discoveredAt: number; // timestamp
  properties: string[];
  uses: string[];
  scienceWord: string;
}

export type PipMood = 'idle' | 'curious' | 'encouraging' | 'thinking' | 'celebrating' | 'hinting' | 'explaining' | 'concerned';
