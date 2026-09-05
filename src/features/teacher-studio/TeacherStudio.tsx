import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type {
  LessonMissionConfig,
  LessonStepData,
  ActivityType,
} from '@/types/lessonEngine';
import { ActivityRenderer } from '@/components/engine/ActivityRenderer';
import { StepPropertyEditor } from './StepPropertyEditor';
import { generateLessonFromPrompt, generateFallbackLessonConfig } from '@/lib/geminiService';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { useTeacherStore, TeacherTheme, Assignment, StudentSubmission } from '@/stores/teacherStore';
import { useFXStore } from '@/stores/fxStore';
import {
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Plus,
  Trash2,
  Copy,
  Check,
  Smartphone,
  Monitor,
  Wand2,
  BookOpen,
  Layers,
  HelpCircle,
  Eye,
  Sliders,
  CheckCircle2,
  FlaskConical,
  Scale,
  FileCode,
  Lightbulb,
  Home,
  ChevronUp,
  ChevronDown,
  Columns,
  Play,
  ClipboardList,
  UserCheck,
  Globe2,
  Users,
  Library,
  Calendar,
  Clock,
  Award,
  Send,
  MessageSquare,
  AlertCircle,
  FolderPlus,
  ExternalLink,
  Search,
  Filter,
  CheckCheck,
} from 'lucide-react';

const ACTIVITY_CATALOG: { type: ActivityType; label: string; icon: string; desc: string }[] = [
  { type: 'water_absorption_lab', label: 'Water Absorption Lab', icon: '💧', desc: 'Spray test to compare absorbent vs waterproof materials' },
  { type: 'microscopic_zoom_viewer', label: 'Microscope Studio', icon: '🔬', desc: 'Interactive magnifications (1x, 100x, 500x) with scale bars' },
  { type: 'sorting_tray', label: 'Classification Sorting Trays', icon: '🗂️', desc: 'Drag or tap specimens into classification groups' },
  { type: 'tensile_strength_rig', label: 'Tensile Strength Rig', icon: '⚖️', desc: 'Add weight loads to test tensile limits and snapping points' },
  { type: 'matching_pairs', label: 'Matching Pairs Game', icon: '🔗', desc: 'Connect everyday objects to their scientific superpowers' },
  { type: 'mcq_assessment', label: 'Inquiry Challenge Quiz', icon: '❓', desc: 'Formative questions with instant feedback and explanations' },
  { type: 'interactive_diagram', label: 'Interactive Diagram Map', icon: '🗺️', desc: 'Clickable diagram stages with hotspots and animations' },
  { type: 'read_aloud_coach', label: 'Speech Fluency Coach', icon: '🗣️', desc: 'Voice coaching for scientific vocabulary' },
  { type: 'scenario_sim', label: 'Interactive Scenario Lab', icon: '🌤️', desc: 'Evaluate material performance under simulated conditions' },
  { type: 'concept_summary', label: 'Golden Law Synthesis', icon: '⚡', desc: '3-Pillar summary: Material ➔ Property ➔ Use' },
];

function createBlankStep(type: ActivityType, index: number): LessonStepData {
  switch (type) {
    case 'water_absorption_lab':
      return {
        id: `step-${Date.now()}-${index}`,
        type: 'water_absorption_lab',
        title: 'Water Absorption Testing Lab',
        subtitle: 'Observe how natural vs synthetic materials react to moisture',
        pipPrompt: 'Spray water droplets onto each fabric to see if it absorbs moisture or beads off!',
        learningGoal: 'Compare hydrophobic vs hydrophilic materials',
        specimens: [
          { id: 'mat-1', name: 'Cotton Swatch', materialType: 'cotton', category: 'Natural', dryImage: '', wetImage: '', isHydrophobic: false, absorptionRateSec: 2, description: 'Porous cellulose plant fibers absorb water rapidly', microscopicNote: 'Hollow ribbon fibers soak up moisture' },
          { id: 'mat-2', name: 'Polyester Swatch', materialType: 'polyester', category: 'Synthetic', dryImage: '', wetImage: '', isHydrophobic: true, absorptionRateSec: 999, description: 'Smooth synthetic polymer repels water', microscopicNote: 'Tight extruded filament weave causes water to bead up' },
        ],
      };
    case 'sorting_tray':
      return {
        id: `step-${Date.now()}-${index}`,
        type: 'sorting_tray',
        title: 'Material Classification Desk',
        subtitle: 'Sort specimens into the correct scientific category',
        pipPrompt: 'Help me classify each specimen into Natural or Synthetic!',
        trays: [
          { id: 'natural', title: 'From Nature', icon: '🌿', themeColor: 'sage', allowedCategories: ['natural'], description: 'Grown in nature' },
          { id: 'synthetic', title: 'Made in Labs', icon: '🏭', themeColor: 'sky', allowedCategories: ['synthetic'], description: 'Synthesized in factories' },
        ],
        items: [
          { id: 'item-1', name: 'Cotton Boll', icon: '🌿', category: 'natural', hint: 'Grows on bushes', originDetails: 'Plant cellulose' },
          { id: 'item-2', name: 'Nylon Thread', icon: '🧵', category: 'synthetic', hint: 'Petroleum polymer', originDetails: 'Factory synthesized' },
          { id: 'item-3', name: 'Sheep Wool', icon: '🐑', category: 'natural', hint: 'Animal fleece', originDetails: 'Protein keratin' },
          { id: 'item-4', name: 'Plastic Bottle', icon: '🫙', category: 'synthetic', hint: 'Molded polymer', originDetails: 'Synthetic resin' },
        ],
      };
    case 'tensile_strength_rig':
      return {
        id: `step-${Date.now()}-${index}`,
        type: 'tensile_strength_rig',
        title: 'Tensile Strength Testing Rig',
        subtitle: 'Determine snapping thresholds of natural vs synthetic cords',
        pipPrompt: 'Add weights to each suspension cord until it reaches its breaking limit!',
        weightIncrementGrams: 500,
        maxWeightGrams: 10000,
        scientificTakeaway: 'Synthetic polymer chains can withstand massive tensile stress before snapping.',
        specimens: [
          { id: 'c-1', name: 'Cotton Cord', material: 'Twisted Plant Cellulose', icon: '🧶', breakingWeightGrams: 1500, elasticDeformationMm: 4, snapSound: 'snap', description: 'Breaks under moderate tension loads', realWorldUse: 'Clothing stitching' },
          { id: 'c-2', name: 'Nylon Parachute Cord', material: 'Polyamide Filament', icon: '🪢', breakingWeightGrams: 6500, elasticDeformationMm: 18, snapSound: 'snap', description: 'Extremely high tensile breaking point', realWorldUse: 'Climbing ropes and parachutes' },
        ],
      };
    case 'matching_pairs':
      return {
        id: `step-${Date.now()}-${index}`,
        type: 'matching_pairs',
        title: 'Match Superpowers to Uses',
        subtitle: 'Connect each object to its primary scientific property',
        pipPrompt: 'Tap an object on the left, then tap its matching superpower on the right!',
        instruction: 'Match everyday science inventions to their material superpower.',
        feedbackSuccess: 'Outstanding! You connected all scientific superpowers correctly!',
        pairs: [
          { id: 'p-1', leftText: 'Raincoat', leftIcon: '🧥', rightText: 'Waterproof & Lightweight', explanation: 'Polyester repels rainwater easily!' },
          { id: 'p-2', leftText: 'Climbing Rope', leftIcon: '🪢', rightText: 'High Tensile Strength', explanation: 'Nylon holds climbers safely!' },
          { id: 'p-3', leftText: 'Kettle Handle', leftIcon: '🫖', rightText: 'Heat-Resistant Thermoset', explanation: 'Bakelite plastic stays cool on stoves!' },
        ],
      };
    case 'mcq_assessment':
      return {
        id: `step-${Date.now()}-${index}`,
        type: 'mcq_assessment',
        title: 'Science Discovery Checkpoint',
        subtitle: 'Test your understanding',
        pipPrompt: 'Think carefully about why scientists chose this material!',
        question: 'Why does synthetic polyester make a superior raincoat compared to 100% natural cotton?',
        conceptBadge: 'Material Physics',
        explanation: 'Synthetic polyester fibers are tightly extruded without hollow capillary pores, causing rainwater to bead up and roll off.',
        options: [
          { id: 'opt-1', text: 'Polyester has non-porous synthetic fibers that repel liquid water droplets', isCorrect: true, feedback: 'Correct! Water beads up and rolls off smooth polyester fibers.' },
          { id: 'opt-2', text: 'Cotton is completely waterproof and never gets heavy in rain', isCorrect: false, feedback: 'Not quite! Cotton absorbs water until it gets soaked and heavy.' },
        ],
      };
    case 'interactive_diagram':
      return {
        id: `step-${Date.now()}-${index}`,
        type: 'interactive_diagram',
        title: 'Water Cycle Phase Transition Map',
        subtitle: 'Click on each phase to explore how temperature triggers phase change',
        pipPrompt: 'Tap each hotspot to watch evaporation, condensation and precipitation!',
        topic: 'water_cycle',
        diagramTitle: 'Atmospheric Hydrologic Cycle',
        backgroundTheme: 'sky_ocean',
        learningObjective: 'Understand solar heat evaporation and high-altitude condensation',
        summaryTakeaway: 'Water constantly circulates between oceans, skies, and earth through solar thermal energy.',
        hotspots: [
          { id: 'h-1', name: 'Evaporation', stageNumber: 1, icon: '☀️', xPercent: 25, yPercent: 65, title: 'Solar Heat Ascent', explanation: 'Sunlight energizes liquid water molecules into rising invisible vapor.', animationType: 'evaporate_steam', funFact: 'Ocean water evaporates leaving salt behind!' },
          { id: 'h-2', name: 'Condensation', stageNumber: 2, icon: '☁️', xPercent: 55, yPercent: 30, title: 'Cloud Formation', explanation: 'High altitudes are cold, condensing vapor into liquid water droplets.', animationType: 'condense_cloud', funFact: 'Clouds are made of billions of floating micro-droplets.' },
          { id: 'h-3', name: 'Precipitation', stageNumber: 3, icon: '🌧️', xPercent: 80, yPercent: 60, title: 'Rain Precipitation', explanation: 'Heavy droplets fall to earth under gravity as rain, snow, or hail.', animationType: 'rain_drops', funFact: 'Raindrops are shaped like hamburger buns, not teardrops!' },
        ],
      };
    case 'read_aloud_coach':
      return {
        id: `step-${Date.now()}-${index}`,
        type: 'read_aloud_coach',
        title: 'Scientific Vocabulary Fluency',
        subtitle: 'Practice pronunciation and definition with Pip',
        pipPrompt: 'Read this scientific sentence aloud clearly into your microphone!',
        targetSentence: 'Hydrophobic polymers repel water droplets because their molecular lattice has no capillary pores.',
        scienceDefinition: 'Hydrophobic: Water-fearing substances that naturally bead and repel moisture.',
      };
    default:
      return {
        id: `step-${Date.now()}-${index}`,
        type: 'microscopic_zoom_viewer',
        title: 'Microscopic Zoom Studio',
        subtitle: 'Examine specimen microstructure at multiple magnifications',
        specimenName: 'Natural Plant Cellulose',
        specimenCategory: 'Natural',
        pipPrompt: 'Use the zoom reticle to inspect the fiber alignment under high optical magnification!',
        tiers: [
          { magnification: '1x', label: 'Specimen Surface', image: '', scaleBarText: '10 mm', structuralFeatures: ['Visible texture', 'Surface fibers'], scientificExplanation: 'Macroscopic inspection shows woven natural filaments.' },
          { magnification: '100x', label: 'Microstructure', image: '', scaleBarText: '50 µm', structuralFeatures: ['Hollow capillary pores', 'Cellulose wall'], scientificExplanation: 'High-power light microscopy reveals fine cellular pores.' },
        ],
      };
  }
}

const DEFAULT_CLEAN_LESSON: LessonMissionConfig = {
  id: 'custom-lesson-1',
  number: 1,
  title: 'Natural vs Synthetic Materials Lab',
  subtitle: 'Grade 5 Hands-On Science Discovery',
  targetGrade: 5,
  icon: '🧪',
  themeColor: '#059669',
  concepts: ['Polymer Molecular Chains', 'Hydrophobic Micropores', 'Tensile Break Points'],
  steps: [
    createBlankStep('water_absorption_lab', 0),
    createBlankStep('sorting_tray', 1),
    createBlankStep('mcq_assessment', 2),
  ],
};

// ── 6 Pre-Built Curated NCERT Activity Templates ──
const ACTIVITY_TEMPLATES: {
  id: string;
  title: string;
  theme: string;
  themeIcon: string;
  grade: string;
  description: string;
  stepCount: number;
  config: LessonMissionConfig;
}[] = [
  {
    id: 'tmpl-1',
    title: 'Water Repellency & Raincoat Physics',
    theme: 'Materials & Inventions',
    themeIcon: '🧪',
    grade: 'Class 5 NCERT',
    description: 'Compare cotton versus polyester swatches in fluid spray rigs to discover hydrophobic polymers.',
    stepCount: 3,
    config: DEFAULT_CLEAN_LESSON,
  },
  {
    id: 'tmpl-2',
    title: 'Ant Pheromone Scent Radar',
    theme: 'Super Senses & Living Systems',
    themeIcon: '🐜',
    grade: 'Class 5 NCERT',
    description: 'Investigate how scout ants lay chemical trails, why they walk in lines, and antennae sensory mechanics.',
    stepCount: 3,
    config: {
      id: 'template-ants',
      number: 2,
      title: 'Ant Pheromone Scent Radar',
      subtitle: 'Chemical Communication in Social Insects',
      targetGrade: 5,
      icon: '🐜',
      themeColor: '#10B981',
      concepts: ['Pheromone Scents', 'Antennae Radar', 'Social Teamwork'],
      steps: [
        createBlankStep('sorting_tray', 0),
        createBlankStep('mcq_assessment', 1),
      ],
    },
  },
  {
    id: 'tmpl-3',
    title: 'Dead Sea Salt Density & Buoyancy',
    theme: 'Oceans & Hydrosphere',
    themeIcon: '🌊',
    grade: 'Class 5 NCERT',
    description: 'Add dissolved mineral salts to observe how liquid density increases upward buoyant forces.',
    stepCount: 3,
    config: {
      id: 'template-buoyancy',
      number: 3,
      title: 'Dead Sea Salinity & Buoyant Forces',
      subtitle: 'Why Heavy Objects Float in Dense Liquids',
      targetGrade: 5,
      icon: '🌊',
      themeColor: '#06B6D4',
      concepts: ['Salinity Density', 'Archimedes Buoyancy', 'Floating vs Sinking'],
      steps: [
        createBlankStep('interactive_diagram', 0),
        createBlankStep('mcq_assessment', 1),
      ],
    },
  },
  {
    id: 'tmpl-4',
    title: 'Himalayan Yak Wool Thermal Tent',
    theme: 'Shelter & Habitats',
    themeIcon: '🏔️',
    grade: 'Class 5 NCERT',
    description: 'Explore Changpa nomad Rebo tents made of woven yak hair at 5,000m sub-zero Ladakh altitudes.',
    stepCount: 3,
    config: {
      id: 'template-shelter',
      number: 4,
      title: 'Himalayan Rebo Yak Wool Insulation',
      subtitle: 'Nomadic Architecture in Sub-Zero Climates',
      targetGrade: 5,
      icon: '🏔️',
      themeColor: '#F59E0B',
      concepts: ['Woven Yak Hair', 'Thermal Traps', 'High Altitude Air'],
      steps: [
        createBlankStep('tensile_strength_rig', 0),
        createBlankStep('matching_pairs', 1),
      ],
    },
  },
  {
    id: 'tmpl-5',
    title: 'Closed Electric Circuit Switchboard',
    theme: 'Electricity & Circuits',
    themeIcon: '⚡',
    grade: 'Class 6 NCERT',
    description: 'Inspect electron flows, closed vs open switches, and conductors vs insulators.',
    stepCount: 2,
    config: {
      id: 'template-circuit',
      number: 5,
      title: 'Closed Electric Circuit Switchboard',
      subtitle: 'Conductors, Insulators & Current Loops',
      targetGrade: 6,
      icon: '⚡',
      themeColor: '#6366F1',
      concepts: ['Conductors vs Insulators', 'Switch Loops', 'Current Flow'],
      steps: [
        createBlankStep('interactive_diagram', 0),
        createBlankStep('sorting_tray', 1),
      ],
    },
  },
  {
    id: 'tmpl-6',
    title: 'Botanical Seed Dispersal Vectors',
    theme: 'Living Biosphere',
    themeIcon: '🌱',
    grade: 'Class 5 NCERT',
    description: 'Classify burdock velcro hooks, dandelion wind parachutes, and coconut water floaters.',
    stepCount: 2,
    config: {
      id: 'template-seeds',
      number: 6,
      title: 'Botanical Seed Dispersal Vectors',
      subtitle: 'Nature Inventions & Biomimicry',
      targetGrade: 5,
      icon: '🌱',
      themeColor: '#84CC16',
      concepts: ['Biomimicry Hooks', 'Wind Parachutes', 'Seed Travel'],
      steps: [
        createBlankStep('sorting_tray', 0),
        createBlankStep('matching_pairs', 1),
      ],
    },
  },
];

export function TeacherStudio() {
  const navigate = useNavigate();

  // Ensure Teacher Studio is strictly clean, simple, light, and isolated from global atmosphere modes
  useEffect(() => {
    useFXStore.getState().clearFX();
    document.documentElement.removeAttribute('data-atmosphere');
    document.documentElement.classList.remove('dark');
  }, []);

  // Navigation Tabs: 'builder' | 'assignments' | 'approvals' | 'themes' | 'roster' | 'templates'
  const [activeTab, setActiveTab] = useState<'builder' | 'assignments' | 'approvals' | 'themes' | 'roster' | 'templates'>('builder');

  // Teacher Store
  const customThemes = useTeacherStore((s) => s.customThemes);
  const createTheme = useTeacherStore((s) => s.createTheme);
  const deleteTheme = useTeacherStore((s) => s.deleteTheme);

  const students = useTeacherStore((s) => s.students);
  const updateStudentReadingLevel = useTeacherStore((s) => s.updateStudentReadingLevel);

  const assignments = useTeacherStore((s) => s.assignments);
  const createAssignment = useTeacherStore((s) => s.createAssignment);
  const toggleAssignmentStatus = useTeacherStore((s) => s.toggleAssignmentStatus);

  const submissions = useTeacherStore((s) => s.submissions);
  const approveSubmission = useTeacherStore((s) => s.approveSubmission);
  const requestRevision = useTeacherStore((s) => s.requestRevision);

  // Lesson Builder State
  const [missionConfig, setMissionConfig] = useState<LessonMissionConfig>(DEFAULT_CLEAN_LESSON);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [viewLayout, setViewLayout] = useState<'split' | 'edit_only' | 'preview_only'>('split');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  // Assignment Modal State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTitle, setAssignTitle] = useState('');
  const [assignTarget, setAssignTarget] = useState<'all' | string[]>('all');
  const [assignDueDate, setAssignDueDate] = useState('Tomorrow at 4:00 PM');
  const [assignInstructions, setAssignInstructions] = useState('');
  const [assignScoreThreshold, setAssignScoreThreshold] = useState(80);
  const [assignBadge, setAssignBadge] = useState('Mastery Explorer ⭐');

  // Approval Modal State
  const [selectedSubmissionForReview, setSelectedSubmissionForReview] = useState<StudentSubmission | null>(null);
  const [approvalFeedback, setApprovalFeedback] = useState('Excellent scientific analysis!');
  const [approvalStamp, setApprovalStamp] = useState('🌟 Star Scientist');
  const [revisionFeedback, setRevisionFeedback] = useState('');

  // Theme Builder Modal State
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [newThemeName, setNewThemeName] = useState('');
  const [newThemeDesc, setNewThemeDesc] = useState('');
  const [newThemeIcon, setNewThemeIcon] = useState('🧪');
  const [newThemeGrade, setNewThemeGrade] = useState(5);
  const [newThemeStandard, setNewThemeStandard] = useState<'NCERT' | 'CBSE' | 'ICSE' | 'Cambridge' | 'NGSS'>('NCERT');
  const [newThemeColor, setNewThemeColor] = useState<'emerald' | 'cyan' | 'indigo' | 'amber' | 'rose' | 'stone'>('emerald');

  // Approvals Filter
  const [submissionFilter, setSubmissionFilter] = useState<'all' | 'pending' | 'approved'>('pending');

  const steps = missionConfig?.steps || [];
  const currentStep: LessonStepData = steps[activeStepIndex] || steps[0] || createBlankStep('water_absorption_lab', 0);

  const pendingSubmissionsCount = submissions.filter((s) => s.status === 'pending').length;

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    sounds.pop();
    setIsGenerating(true);
    voiceAssistant.stop();

    try {
      const generated = await generateLessonFromPrompt(aiPrompt, missionConfig.targetGrade || 5);
      sounds.fanfare();
      setMissionConfig(generated);
      setActiveStepIndex(0);
      setPreviewKey((k) => k + 1);
    } catch {
      sounds.boing();
      const fallback = generateFallbackLessonConfig(aiPrompt);
      setMissionConfig(fallback);
      setActiveStepIndex(0);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddStep = (type: ActivityType) => {
    sounds.pop();
    const newStep = createBlankStep(type, steps.length);
    setMissionConfig((prev) => ({
      ...prev,
      steps: [...prev.steps, newStep],
    }));
    setActiveStepIndex(steps.length);
    setShowAddDrawer(false);
    setPreviewKey((k) => k + 1);
  };

  const handleDeleteStep = (index: number) => {
    if (steps.length <= 1) {
      alert('A lesson must have at least 1 activity step.');
      return;
    }
    sounds.pop();
    const updated = steps.filter((_, i) => i !== index);
    setMissionConfig((prev) => ({ ...prev, steps: updated }));
    setActiveStepIndex(Math.max(0, index - 1));
    setPreviewKey((k) => k + 1);
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === steps.length - 1) return;
    sounds.pop();
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...steps];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setMissionConfig((prev) => ({ ...prev, steps: updated }));
    setActiveStepIndex(targetIndex);
    setPreviewKey((k) => k + 1);
  };

  const handleDuplicateStep = (index: number) => {
    sounds.pop();
    const stepToCopy = JSON.parse(JSON.stringify(steps[index]));
    stepToCopy.id = `step-${Date.now()}`;
    stepToCopy.title = `${stepToCopy.title} (Copy)`;
    const updated = [...steps.slice(0, index + 1), stepToCopy, ...steps.slice(index + 1)];
    setMissionConfig((prev) => ({ ...prev, steps: updated }));
    setActiveStepIndex(index + 1);
    setPreviewKey((k) => k + 1);
  };

  const handleUpdateCurrentStep = (updatedStep: LessonStepData) => {
    setMissionConfig((prev) => {
      const updated = [...prev.steps];
      updated[activeStepIndex] = updatedStep;
      return { ...prev, steps: updated };
    });
    setPreviewKey((k) => k + 1);
  };

  const handleCopyJson = () => {
    sounds.sparkle();
    navigator.clipboard.writeText(JSON.stringify(missionConfig, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenAssignModal = () => {
    sounds.pop();
    setAssignTitle(missionConfig.title);
    setAssignInstructions(`Explore all ${missionConfig.steps.length} interactive stages in this hands-on lab.`);
    setShowAssignModal(true);
  };

  const handleConfirmAssignment = () => {
    if (!assignTitle.trim()) return;
    sounds.fanfare();
    createAssignment({
      title: assignTitle,
      lessonId: missionConfig.id,
      lessonTitle: missionConfig.title,
      assignedTo: assignTarget,
      targetGroupName: assignTarget === 'all' ? 'Whole Class (Grade 5-A)' : `${assignTarget.length} Selected Students`,
      dueDate: assignDueDate,
      instructions: assignInstructions,
      status: 'active',
      totalAssigned: assignTarget === 'all' ? students.length : assignTarget.length,
      passingScorePercent: assignScoreThreshold,
      badgeReward: assignBadge,
    });
    setShowAssignModal(false);
    setActiveTab('assignments');
  };

  const handleConfirmApprove = () => {
    if (!selectedSubmissionForReview) return;
    sounds.fanfare();
    approveSubmission(selectedSubmissionForReview.id, approvalFeedback, approvalStamp);
    setSelectedSubmissionForReview(null);
  };

  const handleConfirmRevision = () => {
    if (!selectedSubmissionForReview) return;
    sounds.pop();
    requestRevision(selectedSubmissionForReview.id, revisionFeedback || 'Please review your observations and try again!');
    setSelectedSubmissionForReview(null);
  };

  const handleCreateNewTheme = () => {
    if (!newThemeName.trim()) return;
    sounds.fanfare();
    createTheme({
      id: `theme-${Date.now()}`,
      name: newThemeName,
      description: newThemeDesc || 'Interactive science learning realm.',
      icon: newThemeIcon || '🔬',
      grade: newThemeGrade,
      curriculumStandard: newThemeStandard,
      colorTheme: newThemeColor,
      learningObjectives: ['Inquiry exploration', 'Empirical data analysis'],
      chaptersCount: 1,
      createdAt: new Date().toISOString().split('T')[0],
    });
    setNewThemeName('');
    setNewThemeDesc('');
    setShowThemeModal(false);
  };

  const handleLoadTemplate = (template: (typeof ACTIVITY_TEMPLATES)[0]) => {
    sounds.sparkle();
    setMissionConfig(JSON.parse(JSON.stringify(template.config)));
    setActiveStepIndex(0);
    setPreviewKey((k) => k + 1);
    setActiveTab('builder');
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (submissionFilter === 'pending') return s.status === 'pending';
    if (submissionFilter === 'approved') return s.status === 'approved';
    return true;
  });

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 font-sans flex flex-col select-none">
      {/* ── Educator Suite Master Header Bar ── */}
      <header className="w-full bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 z-30 shadow-xs sticky top-0">
        {/* Left: Home Return & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/subjects')}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-all shrink-0"
            title="Return to Subjects"
          >
            <Home className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-slate-900 tracking-tight">
                PolyQuest Teacher Studio 🎓
              </span>
              <span className="text-[10px] font-mono font-bold uppercase text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                CBSE Grade 5-A
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-500 block -mt-0.5">
              Educator Command Center & Activity Authoring Engine
            </span>
          </div>
        </div>

        {/* Center: Suite Navigation Tabs */}
        <nav className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 gap-1 overflow-x-auto">
          <button
            onClick={() => {
              sounds.pop();
              setActiveTab('builder');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'builder' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Activity Studio</span>
          </button>

          <button
            onClick={() => {
              sounds.pop();
              setActiveTab('assignments');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'assignments' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Assignments ({assignments.filter((a) => a.status === 'active').length})</span>
          </button>

          <button
            onClick={() => {
              sounds.pop();
              setActiveTab('approvals');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap relative ${
              activeTab === 'approvals' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Student Approvals</span>
            {pendingSubmissionsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                {pendingSubmissionsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              sounds.pop();
              setActiveTab('themes');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'themes' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>Themes & Worlds ({customThemes.length})</span>
          </button>

          <button
            onClick={() => {
              sounds.pop();
              setActiveTab('roster');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'roster' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Student Roster ({students.length})</span>
          </button>

          <button
            onClick={() => {
              sounds.pop();
              setActiveTab('templates');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'templates' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Library className="w-3.5 h-3.5" />
            <span>Templates</span>
          </button>
        </nav>

        {/* Right Actions: Assign Button & Export */}
        <div className="flex items-center gap-2">
          {activeTab === 'builder' && (
            <>
              <button
                onClick={handleOpenAssignModal}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Assign to Class</span>
              </button>

              <button
                onClick={handleCopyJson}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <FileCode className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Export JSON'}</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* ── TAB 1: ACTIVITY STUDIO BUILDER ── */}
      {activeTab === 'builder' && (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Sidebar: Steps Timeline & Sequence */}
          <aside className="w-full md:w-72 bg-white border-r border-slate-200 p-4 flex flex-col justify-between shrink-0 shadow-xs overflow-y-auto">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Lesson Steps ({steps.length})
                </span>
                <button
                  onClick={() => setShowAddDrawer(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Step</span>
                </button>
              </div>

              {/* Step Pills */}
              <div className="space-y-2">
                {steps.map((step, idx) => {
                  const isSelected = idx === activeStepIndex;
                  const cat = ACTIVITY_CATALOG.find((c) => c.type === step.type);

                  return (
                    <div
                      key={step.id || idx}
                      onClick={() => {
                        sounds.pop();
                        setActiveStepIndex(idx);
                        setPreviewKey((k) => k + 1);
                      }}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-2 ${
                        isSelected
                          ? 'bg-indigo-50/80 border-indigo-600 text-indigo-950 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base shrink-0">{cat?.icon || '🔬'}</span>
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-slate-400 block font-mono">Step {idx + 1}</span>
                            <span className="text-xs font-black text-slate-800 truncate block">{step.title}</span>
                          </div>
                        </div>
                      </div>

                      {/* Step Action Buttons (Up/Down/Copy/Delete) */}
                      {isSelected && (
                        <div className="flex items-center justify-end gap-1 pt-1.5 border-t border-indigo-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveStep(idx, 'up');
                            }}
                            disabled={idx === 0}
                            className="p-1 text-slate-500 hover:text-indigo-700 disabled:opacity-30 rounded hover:bg-white cursor-pointer"
                            title="Move step up"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveStep(idx, 'down');
                            }}
                            disabled={idx === steps.length - 1}
                            className="p-1 text-slate-500 hover:text-indigo-700 disabled:opacity-30 rounded hover:bg-white cursor-pointer"
                            title="Move step down"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateStep(idx);
                            }}
                            className="p-1 text-slate-500 hover:text-indigo-700 rounded hover:bg-white cursor-pointer"
                            title="Duplicate step"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteStep(idx);
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-white cursor-pointer"
                            title="Delete step"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Generator In Sidebar */}
            <div className="pt-4 border-t border-slate-200 mt-4 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                AI Lesson Generator ✨
              </span>
              <div className="flex flex-col gap-1.5">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
                  placeholder="Topic: Friction, Volcanoes..."
                  className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                />
                <button
                  onClick={handleAiGenerate}
                  disabled={isGenerating || !aiPrompt.trim()}
                  className="w-full py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs cursor-pointer transition-all flex items-center justify-center gap-1"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>{isGenerating ? 'Synthesizing...' : 'Generate with AI'}</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Center / Right: Step Inspector & Live Simulator */}
          <main className="flex-1 bg-slate-100 p-4 sm:p-6 flex flex-col md:flex-row gap-6 items-start justify-center overflow-y-auto">
            {/* View Layout Switcher */}
            <div className="w-full flex items-center justify-between pb-1 md:hidden">
              <span className="text-xs font-bold text-slate-600">View Mode</span>
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setViewLayout('split')}
                  className={`px-2 py-1 text-xs font-bold rounded-lg ${viewLayout === 'split' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'}`}
                >
                  Split
                </button>
                <button
                  onClick={() => setViewLayout('edit_only')}
                  className={`px-2 py-1 text-xs font-bold rounded-lg ${viewLayout === 'edit_only' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'}`}
                >
                  Editor
                </button>
                <button
                  onClick={() => setViewLayout('preview_only')}
                  className={`px-2 py-1 text-xs font-bold rounded-lg ${viewLayout === 'preview_only' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'}`}
                >
                  Preview
                </button>
              </div>
            </div>

            {/* 1. Step Inspector */}
            {(viewLayout === 'split' || viewLayout === 'edit_only') && (
              <div className={`${viewLayout === 'split' ? 'w-full md:w-1/2' : 'w-full max-w-2xl mx-auto'} flex flex-col gap-3`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider font-mono">
                    ⚙️ Step Inspector (Step {activeStepIndex + 1})
                  </span>
                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    Reactive State Sync
                  </span>
                </div>
                <StepPropertyEditor
                  step={currentStep}
                  onChange={handleUpdateCurrentStep}
                />
              </div>
            )}

            {/* 2. Device Simulator Preview */}
            {(viewLayout === 'split' || viewLayout === 'preview_only') && (
              <div className={`${viewLayout === 'split' ? 'w-full md:w-1/2' : 'w-full max-w-3xl mx-auto'} flex flex-col items-center gap-3`}>
                <div className="w-full flex items-center justify-between">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider font-mono">
                    🎨 Live Interactive Simulator
                  </span>
                  <button
                    onClick={() => {
                      sounds.pop();
                      setPreviewKey((k) => k + 1);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Simulation</span>
                  </button>
                </div>

                <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm flex flex-col items-center min-h-[500px]">
                  <ActivityRenderer
                    key={`${currentStep.id}-${previewKey}`}
                    stepData={currentStep}
                    onComplete={() => sounds.fanfare()}
                    onStepComplete={() => sounds.fanfare()}
                  />
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* ── TAB 2: CLASS ASSIGNMENTS HUB ── */}
      {activeTab === 'assignments' && (
        <div className="flex-1 bg-slate-50 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Classroom Assignments 📋
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Assign hands-on experiments to the entire class or differentiated learning groups with due dates.
              </p>
            </div>
            <button
              onClick={handleOpenAssignModal}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Assignment</span>
            </button>
          </div>

          {/* Assignments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {assignments.map((asg) => {
              const percentComplete = Math.round((asg.submissionsCount / Math.max(1, asg.totalAssigned)) * 100);

              return (
                <div
                  key={asg.id}
                  className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 text-left"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                        asg.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {asg.status === 'active' ? '● Active Expedition' : 'Archived'}
                      </span>
                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Due {asg.dueDate}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      {asg.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {asg.instructions}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">Student Submissions</span>
                      <span className="text-indigo-600 font-mono">
                        {asg.submissionsCount} of {asg.totalAssigned} Turned In ({percentComplete}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentComplete}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>Reward: {asg.badgeReward}</span>
                      </span>

                      <button
                        onClick={() => {
                          sounds.pop();
                          toggleAssignmentStatus(asg.id);
                        }}
                        className="text-xs font-bold text-slate-500 hover:text-indigo-600 cursor-pointer"
                      >
                        {asg.status === 'active' ? 'Mark Completed' : 'Reactivate'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 3: STUDENT SUBMISSIONS & APPROVAL REVIEW ── */}
      {activeTab === 'approvals' && (
        <div className="flex-1 bg-slate-50 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Student Activity Review & Approval Queue ✍️
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Evaluate student empirical findings, award praise badges, or request revisions with targeted teacher feedback.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={() => setSubmissionFilter('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  submissionFilter === 'pending' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Pending ({submissions.filter((s) => s.status === 'pending').length})
              </button>
              <button
                onClick={() => setSubmissionFilter('approved')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  submissionFilter === 'approved' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Approved ({submissions.filter((s) => s.status === 'approved').length})
              </button>
              <button
                onClick={() => setSubmissionFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  submissionFilter === 'all' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                All ({submissions.length})
              </button>
            </div>
          </div>

          {/* Submissions List */}
          <div className="space-y-4">
            {filteredSubmissions.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
                <CheckCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h4 className="text-base font-black text-slate-800">All caught up!</h4>
                <p className="text-xs text-slate-500 mt-1">No submissions currently matching this filter.</p>
              </div>
            ) : (
              filteredSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 text-left"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2 bg-slate-100 rounded-2xl shrink-0">
                        {sub.studentAvatar}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-black text-slate-900">{sub.studentName}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            sub.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : sub.status === 'revision_requested'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {sub.status === 'approved' ? 'Approved 🌟' : sub.status === 'revision_requested' ? 'Revision Needed 🔄' : 'Pending Review ⏳'}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-slate-500">
                          {sub.lessonTitle} • Submitted {sub.submittedAt}
                        </span>
                      </div>
                    </div>

                    {/* Student Reflection Quote */}
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                        Student Empirical Finding / Reflection:
                      </span>
                      <p className="text-xs font-medium text-slate-700 italic leading-relaxed">
                        "{sub.studentReflection}"
                      </p>
                    </div>

                    {/* Specimens & Accuracy */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-600">
                      <span className="bg-slate-100 px-2.5 py-1 rounded-lg">
                        Accuracy: {sub.scorePercent}%
                      </span>
                      {sub.specimensTested && sub.specimensTested.map((spec, i) => (
                        <span key={i} className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg">
                          ✓ {spec}
                        </span>
                      ))}
                    </div>

                    {/* Teacher Feedback Note if already approved/reviewed */}
                    {sub.teacherFeedback && (
                      <div className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center gap-2">
                        <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Teacher Stamp: <strong>{sub.teacherStamp}</strong> — "{sub.teacherFeedback}"</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col gap-2 shrink-0 justify-end">
                    <button
                      onClick={() => {
                        sounds.pop();
                        setSelectedSubmissionForReview(sub);
                        setApprovalFeedback('Superb scientific reasoning and accurate observations!');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all"
                    >
                      <Award className="w-4 h-4" />
                      <span>{sub.status === 'approved' ? 'Edit Approval' : 'Approve & Badge'}</span>
                    </button>

                    <button
                      onClick={() => {
                        sounds.pop();
                        setSelectedSubmissionForReview(sub);
                        setRevisionFeedback('Please check the scale bar observations again and resubmit!');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-300 cursor-pointer transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Request Revision</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── TAB 4: THEMES & WORLDS MANAGER ── */}
      {activeTab === 'themes' && (
        <div className="flex-1 bg-slate-50 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Curriculum Themes & Science Realms 🌐
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Configure curriculum subjects, grade levels, and inquiry learning goals for your class.
              </p>
            </div>
            <button
              onClick={() => {
                sounds.pop();
                setShowThemeModal(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all self-start sm:self-auto"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Create New Theme</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {customThemes.map((theme) => (
              <div
                key={theme.id}
                className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 text-left"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{theme.icon}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                        {theme.curriculumStandard} • Grade {theme.grade}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                      Active Theme
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    {theme.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {theme.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {theme.learningObjectives.map((obj, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-slate-600">
                        • {obj}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-400">
                    {theme.chaptersCount} Learning Chapters
                  </span>
                  <button
                    onClick={() => {
                      sounds.pop();
                      deleteTheme(theme.id);
                    }}
                    className="text-xs font-bold text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    Delete Theme
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 5: STUDENT ROSTER ── */}
      {activeTab === 'roster' && (
        <div className="flex-1 bg-slate-50 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6 overflow-y-auto">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs text-left">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Class Roster: Grade 5-A Darwin Explorers 👥
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Configure student reading levels (Emerging, Standard, Advanced) to adapt scientific text difficulty and assign individual activities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {students.map((student) => (
              <div
                key={student.id}
                className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between gap-4 text-left"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl p-2 bg-slate-100 rounded-2xl">
                      {student.avatar}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
                      {student.rollNo}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-slate-900">{student.name}</h4>
                    <span className="text-xs font-bold text-indigo-600">{student.grade}</span>
                  </div>

                  {/* Reading Level Selector */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                      Adaptive Reading Level
                    </label>
                    <select
                      value={student.readingLevel}
                      onChange={(e) => {
                        sounds.pop();
                        updateStudentReadingLevel(student.id, e.target.value as any);
                      }}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none cursor-pointer capitalize"
                    >
                      <option value="emerging">🌱 Emerging (Simplified vocabulary)</option>
                      <option value="standard">⭐ Standard (Grade-level NCERT)</option>
                      <option value="advanced">🚀 Advanced (Technical terminology)</option>
                    </select>
                  </div>

                  {/* Badges Earned */}
                  <div className="flex flex-wrap gap-1">
                    {student.badges.slice(0, 3).map((b, i) => (
                      <span key={i} className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">
                    {student.completedActivities} Activities Mastered
                  </span>
                  <button
                    onClick={() => {
                      sounds.pop();
                      setAssignTarget([student.id]);
                      handleOpenAssignModal();
                    }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    Assign Task →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 6: ACTIVITY TEMPLATE LIBRARY ── */}
      {activeTab === 'templates' && (
        <div className="flex-1 bg-slate-50 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6 overflow-y-auto">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs text-left">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Curated Activity Template Library 📚
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pre-built interactive activities designed by NCERT science educators. 1-Click to clone and customize for your class.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ACTIVITY_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 text-left"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl p-2 bg-slate-100 rounded-xl">
                      {tmpl.themeIcon}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
                      {tmpl.grade}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    {tmpl.title}
                  </h3>
                  <span className="text-xs font-bold text-indigo-600 block">
                    {tmpl.theme}
                  </span>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">
                    {tmpl.stepCount} Steps Included
                  </span>
                  <button
                    onClick={() => handleLoadTemplate(tmpl)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer transition-all shadow-xs"
                  >
                    Clone & Edit →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODAL 1: ASSIGN TO CLASS / STUDENTS ── */}
      <AnimatePresence>
        {showAssignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xl bg-white rounded-[32px] border-4 border-indigo-200 p-6 sm:p-8 shadow-2xl flex flex-col gap-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Assign Activity to Students 📋
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    Send to the whole class or individual students
                  </span>
                </div>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
                    Assignment Title
                  </label>
                  <input
                    type="text"
                    value={assignTitle}
                    onChange={(e) => setAssignTitle(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
                    Target Learners
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAssignTarget('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        assignTarget === 'all'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      Whole Class (Grade 5-A • 6 Students)
                    </button>
                    <button
                      onClick={() => setAssignTarget(['std-1', 'std-2'])}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        Array.isArray(assignTarget)
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      Specific Students Only
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
                      Due Date
                    </label>
                    <input
                      type="text"
                      value={assignDueDate}
                      onChange={(e) => setAssignDueDate(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
                      Reward Badge
                    </label>
                    <input
                      type="text"
                      value={assignBadge}
                      onChange={(e) => setAssignBadge(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
                    Teacher Instructions & Guidance
                  </label>
                  <textarea
                    rows={2}
                    value={assignInstructions}
                    onChange={(e) => setAssignInstructions(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAssignment}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-md transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Assign Now</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL 2: SUBMISSION APPROVAL & PRAISE STAMP ── */}
      <AnimatePresence>
        {selectedSubmissionForReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xl bg-white rounded-[32px] border-4 border-emerald-200 p-6 sm:p-8 shadow-2xl flex flex-col gap-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{selectedSubmissionForReview.studentAvatar}</span>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      Review: {selectedSubmissionForReview.studentName}
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">
                      {selectedSubmissionForReview.lessonTitle}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSubmissionForReview(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Student Finding Quote */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Student's Written Finding:
                </span>
                <p className="text-xs font-medium text-slate-700 italic leading-relaxed">
                  "{selectedSubmissionForReview.studentReflection}"
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
                    Choose Praise Stamp to Award:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      '🌟 Star Scientist',
                      '🔬 Precision Observer',
                      '💡 Master Hypothesis',
                      '⚡ Problem Solver',
                    ].map((stamp) => (
                      <button
                        key={stamp}
                        onClick={() => setApprovalStamp(stamp)}
                        className={`p-2 rounded-xl text-xs font-bold border text-left transition-all cursor-pointer ${
                          approvalStamp === stamp
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        {stamp}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
                    Teacher Feedback Note
                  </label>
                  <textarea
                    rows={2}
                    value={approvalFeedback}
                    onChange={(e) => setApprovalFeedback(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  onClick={handleConfirmRevision}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 cursor-pointer"
                >
                  Request Revision
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedSubmissionForReview(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmApprove}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-md transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Award Honors</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL 3: CREATE NEW THEME / WORLD ── */}
      <AnimatePresence>
        {showThemeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-white rounded-[32px] border-4 border-indigo-200 p-6 sm:p-8 shadow-2xl flex flex-col gap-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Create New Curriculum Theme 🌐
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    Configure a new science realm with atmospheric lighting
                  </span>
                </div>
                <button
                  onClick={() => setShowThemeModal(false)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
                    Theme Name
                  </label>
                  <input
                    type="text"
                    value={newThemeName}
                    onChange={(e) => setNewThemeName(e.target.value)}
                    placeholder="e.g. Microbial Biosphere & Virology"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newThemeDesc}
                    onChange={(e) => setNewThemeDesc(e.target.value)}
                    placeholder="e.g. Microscopic single-celled organisms, bacteria and virus defense"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
                      Curriculum Standard
                    </label>
                    <select
                      value={newThemeStandard}
                      onChange={(e) => setNewThemeStandard(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none cursor-pointer"
                    >
                      <option value="NCERT">NCERT Class 5 EVS</option>
                      <option value="CBSE">CBSE Science</option>
                      <option value="ICSE">ICSE Science</option>
                      <option value="Cambridge">Cambridge Primary</option>
                      <option value="NGSS">NGSS STEM</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
                      Target Grade
                    </label>
                    <select
                      value={newThemeGrade}
                      onChange={(e) => setNewThemeGrade(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none cursor-pointer"
                    >
                      <option value={3}>Grade 3 (Foundational)</option>
                      <option value={4}>Grade 4 (Preparatory)</option>
                      <option value={5}>Grade 5 (Intermediate)</option>
                      <option value={6}>Grade 6 (Middle School)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase text-slate-500 block mb-1">
                    Icon Symbol
                  </label>
                  <div className="flex items-center gap-2">
                    {['🌿', '🌊', '🏔️', '🧪', '🚀', '⚡', '🦠', '🦖'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setNewThemeIcon(emoji)}
                        className={`text-xl p-2 rounded-xl border transition-all cursor-pointer ${
                          newThemeIcon === emoji ? 'bg-indigo-100 border-indigo-500' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setShowThemeModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNewTheme}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-md transition-all flex items-center gap-1.5"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>Create Theme</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL 4: ADD ACTIVITY STEP DRAWER ── */}
      <AnimatePresence>
        {showAddDrawer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl bg-white rounded-[32px] border-4 border-indigo-200 p-6 sm:p-8 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Choose Activity Engine Type 🔬
                  </h3>
                  <span className="text-xs font-bold text-slate-500">Pick any interactive experiment engine for this step</span>
                </div>
                <button
                  onClick={() => setShowAddDrawer(false)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {ACTIVITY_CATALOG.map((cat) => (
                  <button
                    key={cat.type}
                    onClick={() => handleAddStep(cat.type)}
                    className="p-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 text-left transition-all cursor-pointer flex items-start gap-3 shadow-xs"
                  >
                    <span className="text-2xl p-2 bg-slate-50 rounded-xl border border-slate-200 shrink-0">
                      {cat.icon}
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-black text-xs sm:text-sm text-slate-900 mb-0.5">{cat.label}</h4>
                      <p className="text-[11px] font-bold text-slate-500 leading-snug">{cat.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
