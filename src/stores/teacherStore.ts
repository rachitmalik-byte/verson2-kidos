import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LessonMissionConfig, ActivityType } from '@/types/lessonEngine';

export interface TeacherTheme {
  id: string;
  name: string;
  description: string;
  icon: string;
  grade: number;
  curriculumStandard: 'NCERT' | 'CBSE' | 'ICSE' | 'Cambridge' | 'NGSS';
  colorTheme: 'emerald' | 'cyan' | 'indigo' | 'amber' | 'rose' | 'stone';
  atmosphere: 'day' | 'sunset' | 'night' | 'rain';
  learningObjectives: string[];
  chaptersCount: number;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  rollNo: string;
  grade: string;
  readingLevel: 'emerging' | 'standard' | 'advanced';
  completedActivities: number;
  pendingReviewCount: number;
  badges: string[];
}

export interface Assignment {
  id: string;
  title: string;
  lessonId: string;
  lessonTitle: string;
  assignedTo: 'all' | string[]; // 'all' or student IDs
  targetGroupName?: string;
  dueDate: string;
  instructions: string;
  status: 'active' | 'completed';
  submissionsCount: number;
  totalAssigned: number;
  createdAt: string;
  passingScorePercent: number;
  badgeReward: string;
}

export interface StudentSubmission {
  id: string;
  assignmentId?: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  lessonId: string;
  lessonTitle: string;
  activityType: ActivityType;
  submittedAt: string;
  status: 'pending' | 'approved' | 'revision_requested';
  scorePercent: number;
  studentReflection: string;
  specimensTested?: string[];
  teacherFeedback?: string;
  teacherStamp?: string;
}

interface TeacherState {
  // Lessons
  customLessons: LessonMissionConfig[];
  activeLessonId: string;
  
  // Themes
  customThemes: TeacherTheme[];
  
  // Class Roster
  students: StudentProfile[];
  
  // Assignments
  assignments: Assignment[];
  
  // Submissions for approval
  submissions: StudentSubmission[];
  
  // Actions
  saveLesson: (lesson: LessonMissionConfig) => void;
  deleteLesson: (lessonId: string) => void;
  setActiveLessonId: (lessonId: string) => void;
  
  createTheme: (theme: TeacherTheme) => void;
  deleteTheme: (themeId: string) => void;
  
  createAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt' | 'submissionsCount'>) => void;
  toggleAssignmentStatus: (assignmentId: string) => void;
  
  approveSubmission: (submissionId: string, feedback?: string, stamp?: string) => void;
  requestRevision: (submissionId: string, feedback: string) => void;
  
  updateStudentReadingLevel: (studentId: string, level: 'emerging' | 'standard' | 'advanced') => void;
  resetToDefaults: () => void;
}

// ── Realistic Demo Seeds ──
const INITIAL_THEMES: TeacherTheme[] = [
  {
    id: 'theme-living-systems',
    name: 'Super Senses & Living Systems',
    description: 'Investigate ant pheromone communication, snake seismic hearing, and bio-inspired Velcro mechanisms.',
    icon: '🌿',
    grade: 5,
    curriculumStandard: 'NCERT',
    colorTheme: 'emerald',
    atmosphere: 'day',
    learningObjectives: ['Sensory organs', 'Ground vibrations', 'Chemical trail communication', 'Biomimicry'],
    chaptersCount: 4,
    createdAt: '2026-09-01',
  },
  {
    id: 'theme-water-wonders',
    name: 'Oceans, Density & Fluid Physics',
    description: 'Discover Archimedes principle, Dead Sea salinity buoyancy, and desert stepwell water engineering.',
    icon: '🌊',
    grade: 5,
    curriculumStandard: 'CBSE',
    colorTheme: 'cyan',
    atmosphere: 'day',
    learningObjectives: ['Buoyant force', 'Salinity density', 'Evaporation cycles', 'Hydraulic storage'],
    chaptersCount: 4,
    createdAt: '2026-09-02',
  },
  {
    id: 'theme-alpine-habitats',
    name: 'High-Altitude Shelters & Habitats',
    description: 'Examine Changpa yak wool thermal insulation, Golconda Fort hydraulics, and earthquake dampers.',
    icon: '🏔️',
    grade: 5,
    curriculumStandard: 'NCERT',
    colorTheme: 'amber',
    atmosphere: 'sunset',
    learningObjectives: ['Thermal insulation', 'Atmospheric pressure', 'Earthquake damping', 'Nomadic structures'],
    chaptersCount: 5,
    createdAt: '2026-09-03',
  },
  {
    id: 'theme-materials-science',
    name: 'Materials Science & Synthetic Polymers',
    description: 'Compare cellulose vs polyester in hydraulic rigs, test tensile cords, and inspect fiber weaves.',
    icon: '🧪',
    grade: 5,
    curriculumStandard: 'NCERT',
    colorTheme: 'emerald',
    atmosphere: 'night',
    learningObjectives: ['Hydrophobic pores', 'Tensile yield strength', 'Polymer chains', 'Recyclability'],
    chaptersCount: 13,
    createdAt: '2026-09-04',
  },
];

const INITIAL_STUDENTS: StudentProfile[] = [
  { id: 'std-1', name: 'Aarav Sharma', avatar: '🦁', rollNo: '05-A-01', grade: 'Grade 5-A', readingLevel: 'standard', completedActivities: 12, pendingReviewCount: 1, badges: ['Polymer Pioneer', 'Hydrophobe Hunter', 'Ant Master'] },
  { id: 'std-2', name: 'Diya Patel', avatar: '🦊', rollNo: '05-A-02', grade: 'Grade 5-A', readingLevel: 'advanced', completedActivities: 16, pendingReviewCount: 1, badges: ['Water Magician', 'Seismic Sleuth', 'Optics Master'] },
  { id: 'std-3', name: 'Kabir Sen', avatar: '🐼', rollNo: '05-A-03', grade: 'Grade 5-A', readingLevel: 'emerging', completedActivities: 8, pendingReviewCount: 1, badges: ['Junior Investigator', 'Wool Whisperer'] },
  { id: 'std-4', name: 'Ananya Verma', avatar: '🐨', rollNo: '05-A-04', grade: 'Grade 5-A', readingLevel: 'advanced', completedActivities: 15, pendingReviewCount: 0, badges: ['Buoyancy Champion', 'Desert Architect'] },
  { id: 'std-5', name: 'Rohan Gupta', avatar: '🐯', rollNo: '05-A-05', grade: 'Grade 5-A', readingLevel: 'standard', completedActivities: 10, pendingReviewCount: 0, badges: ['Circuit Builder', 'Nature Sorter'] },
  { id: 'std-6', name: 'Meera Nair', avatar: '🦉', rollNo: '05-A-06', grade: 'Grade 5-A', readingLevel: 'standard', completedActivities: 11, pendingReviewCount: 0, badges: ['Microscope Sleuth', 'Scent Tracker'] },
];

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    title: 'Raincoat Mystery: Water Porosity Lab',
    lessonId: 'custom-lesson-1',
    lessonTitle: 'Natural vs Synthetic Materials Lab',
    assignedTo: 'all',
    targetGroupName: 'Whole Class (Grade 5-A)',
    dueDate: 'Tomorrow at 4:00 PM',
    instructions: 'Spray water droplets on both cotton and polyester swatches. Note down why the cotton gets heavy while water beads up on polyester!',
    status: 'active',
    submissionsCount: 4,
    totalAssigned: 6,
    createdAt: '2026-09-04',
    passingScorePercent: 80,
    badgeReward: 'Waterproof Chemist ⭐',
  },
  {
    id: 'asg-2',
    title: 'Dead Sea Salt Buoyancy Simulation',
    lessonId: 'template-buoyancy',
    lessonTitle: 'Dead Sea Salinity & Buoyant Forces',
    assignedTo: ['std-1', 'std-2', 'std-4'],
    targetGroupName: 'Advanced Science Explorers',
    dueDate: 'Friday at 6:00 PM',
    instructions: 'Add salt gradually to water and determine how much dissolved salt is required to make a fresh egg float.',
    status: 'active',
    submissionsCount: 2,
    totalAssigned: 3,
    createdAt: '2026-09-05',
    passingScorePercent: 85,
    badgeReward: 'Density Master 🌊',
  },
];

const INITIAL_SUBMISSIONS: StudentSubmission[] = [
  {
    id: 'sub-1',
    assignmentId: 'asg-1',
    studentId: 'std-1',
    studentName: 'Aarav Sharma',
    studentAvatar: '🦁',
    lessonId: 'custom-lesson-1',
    lessonTitle: 'Natural vs Synthetic Materials Lab',
    activityType: 'water_absorption_lab',
    submittedAt: 'Today at 2:15 PM',
    status: 'pending',
    scorePercent: 100,
    studentReflection: 'Cotton has hollow cellulose tubes that suck in water like tiny straws, whereas polyester filaments are smooth solid plastic with no holes so water bounces off!',
    specimensTested: ['Cotton Swatch (Absorbed in 2s)', 'Polyester Swatch (Beaded 100%)'],
  },
  {
    id: 'sub-2',
    assignmentId: 'asg-1',
    studentId: 'std-2',
    studentName: 'Diya Patel',
    studentAvatar: '🦊',
    lessonId: 'custom-lesson-1',
    lessonTitle: 'Natural vs Synthetic Materials Lab',
    activityType: 'microscopic_zoom_viewer',
    submittedAt: 'Today at 1:40 PM',
    status: 'pending',
    scorePercent: 95,
    studentReflection: 'Under 100x magnification, the plant cellulose fibers were rough and uneven, but the polyester filaments were completely uniform cylinders made in a factory machine.',
    specimensTested: ['Cellulose Ribbon (100x)', 'Polyester Extrusion (100x)'],
  },
  {
    id: 'sub-3',
    assignmentId: 'asg-1',
    studentId: 'std-3',
    studentName: 'Kabir Sen',
    studentAvatar: '🐼',
    lessonId: 'custom-lesson-1',
    lessonTitle: 'Natural vs Synthetic Materials Lab',
    activityType: 'sorting_tray',
    submittedAt: 'Today at 11:30 AM',
    status: 'pending',
    scorePercent: 75,
    studentReflection: 'I sorted cotton and wool as natural, and nylon and plastic bottle as synthetic. But I accidentally thought nylon was natural at first.',
    specimensTested: ['Cotton Boll', 'Nylon Thread', 'Sheep Wool', 'Plastic Bottle'],
  },
  {
    id: 'sub-4',
    assignmentId: 'asg-2',
    studentId: 'std-4',
    studentName: 'Ananya Verma',
    studentAvatar: '🐨',
    lessonId: 'template-buoyancy',
    lessonTitle: 'Dead Sea Salinity & Buoyant Forces',
    activityType: 'scenario_sim',
    submittedAt: 'Yesterday at 5:20 PM',
    status: 'approved',
    scorePercent: 100,
    studentReflection: 'When you dissolve enough salt in water, the liquid becomes denser than an egg or human body, pushing upward with stronger buoyant force than gravity pulls down.',
    specimensTested: ['Fresh Water (Sink)', 'Salt Water 20% (Float)'],
    teacherFeedback: 'Outstanding scientific analysis of buoyant equilibrium, Ananya!',
    teacherStamp: '🌟 Star Scientist',
  },
];

export const useTeacherStore = create<TeacherState>()(
  persist(
    (set, get) => ({
      customLessons: [],
      activeLessonId: 'custom-lesson-1',
      customThemes: INITIAL_THEMES,
      students: INITIAL_STUDENTS,
      assignments: INITIAL_ASSIGNMENTS,
      submissions: INITIAL_SUBMISSIONS,

      saveLesson: (lesson) => {
        set((state) => {
          const index = state.customLessons.findIndex((l) => l.id === lesson.id);
          if (index >= 0) {
            const updated = [...state.customLessons];
            updated[index] = lesson;
            return { customLessons: updated };
          }
          return { customLessons: [lesson, ...state.customLessons] };
        });
      },

      deleteLesson: (lessonId) => {
        set((state) => ({
          customLessons: state.customLessons.filter((l) => l.id !== lessonId),
        }));
      },

      setActiveLessonId: (activeLessonId) => set({ activeLessonId }),

      createTheme: (theme) => {
        set((state) => ({
          customThemes: [theme, ...state.customThemes],
        }));
      },

      deleteTheme: (themeId) => {
        set((state) => ({
          customThemes: state.customThemes.filter((t) => t.id !== themeId),
        }));
      },

      createAssignment: (assignmentData) => {
        const newAssignment: Assignment = {
          ...assignmentData,
          id: `asg-${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
          submissionsCount: 0,
        };
        set((state) => ({
          assignments: [newAssignment, ...state.assignments],
        }));
      },

      toggleAssignmentStatus: (assignmentId) => {
        set((state) => ({
          assignments: state.assignments.map((a) =>
            a.id === assignmentId
              ? { ...a, status: a.status === 'active' ? 'completed' : 'active' }
              : a
          ),
        }));
      },

      approveSubmission: (submissionId, feedback = 'Excellent scientific work!', stamp = '🌟 Star Scientist') => {
        set((state) => ({
          submissions: state.submissions.map((sub) =>
            sub.id === submissionId
              ? {
                  ...sub,
                  status: 'approved' as const,
                  teacherFeedback: feedback,
                  teacherStamp: stamp,
                }
              : sub
          ),
          students: state.students.map((std) => {
            const match = state.submissions.find((s) => s.id === submissionId);
            if (match && match.studentId === std.id) {
              return {
                ...std,
                completedActivities: std.completedActivities + 1,
                pendingReviewCount: Math.max(0, std.pendingReviewCount - 1),
                badges: std.badges.includes(stamp) ? std.badges : [...std.badges, stamp],
              };
            }
            return std;
          }),
        }));
      },

      requestRevision: (submissionId, feedback) => {
        set((state) => ({
          submissions: state.submissions.map((sub) =>
            sub.id === submissionId
              ? {
                  ...sub,
                  status: 'revision_requested' as const,
                  teacherFeedback: feedback,
                }
              : sub
          ),
        }));
      },

      updateStudentReadingLevel: (studentId, level) => {
        set((state) => ({
          students: state.students.map((std) =>
            std.id === studentId ? { ...std, readingLevel: level } : std
          ),
        }));
      },

      resetToDefaults: () => {
        set({
          customThemes: INITIAL_THEMES,
          students: INITIAL_STUDENTS,
          assignments: INITIAL_ASSIGNMENTS,
          submissions: INITIAL_SUBMISSIONS,
        });
      },
    }),
    {
      name: 'polyquest-teacher-studio',
    }
  )
);
