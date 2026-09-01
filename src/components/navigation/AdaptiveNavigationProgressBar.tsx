import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '@/stores/progressStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { useNavigationProgressStore } from '@/stores/navigationProgressStore';
import { sounds } from '@/lib/sounds';
import {
  BookOpen,
  MapPin,
  FlaskConical,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ProgressContextData {
  type: 'subjects' | 'chapters' | 'experiment' | 'exercise' | 'general';
  title: string;
  completed: number;
  total: number;
  percentage: number;
  stepsDone: number;
  stepsLeft: number;
  label: string;
  subLabel: string;
  accentGradient: string;
  glowColor: string;
  icon: React.ReactNode;
}

export const AdaptiveNavigationProgressBar: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Global store states
  const completedMissions = useProgressStore((state) => state.completedMissions);
  const discoveries = useDiscoveryStore((state) => state.discoveries);
  const activeExperiment = useNavigationProgressStore((state) => state.activeExperiment);
  const activeExercise = useNavigationProgressStore((state) => state.activeExercise);

  const contextData: ProgressContextData = useMemo(() => {
    // 1. Live Exercise / Quiz Override
    if (activeExercise) {
      const pct = Math.min(100, Math.round((activeExercise.completedCount / Math.max(1, activeExercise.totalCount)) * 100));
      const left = Math.max(0, activeExercise.totalCount - activeExercise.completedCount);
      return {
        type: 'exercise',
        title: activeExercise.exerciseName,
        completed: activeExercise.completedCount,
        total: activeExercise.totalCount,
        percentage: pct,
        stepsDone: activeExercise.completedCount,
        stepsLeft: left,
        label: `Question ${activeExercise.currentIndex} of ${activeExercise.totalCount}`,
        subLabel: left === 0 ? 'All Questions Answered! 🎉' : `${left} question${left === 1 ? '' : 's'} left`,
        accentGradient: 'from-amber-400 via-orange-500 to-rose-500',
        glowColor: 'rgba(249, 115, 22, 0.8)',
        icon: <HelpCircle className="w-3.5 h-3.5 text-amber-500" />,
      };
    }

    // 2. Live Experiment / Mission Step Override
    if (activeExperiment) {
      const pct = Math.min(100, Math.round((activeExperiment.stepIndex / Math.max(1, activeExperiment.totalSteps)) * 100));
      return {
        type: 'experiment',
        title: `Phase: ${activeExperiment.phaseName}`,
        completed: activeExperiment.stepIndex,
        total: activeExperiment.totalSteps,
        percentage: pct,
        stepsDone: activeExperiment.stepsDone,
        stepsLeft: activeExperiment.stepsLeft,
        label: `Step ${activeExperiment.stepIndex} of ${activeExperiment.totalSteps}`,
        subLabel: activeExperiment.stepsLeft === 0 ? 'Experiment Completed! 🏆' : `${activeExperiment.stepsLeft} step${activeExperiment.stepsLeft === 1 ? '' : 's'} left`,
        accentGradient: 'from-cyan-400 via-sky-500 to-purple-600',
        glowColor: 'rgba(56, 189, 248, 0.8)',
        icon: <FlaskConical className="w-3.5 h-3.5 text-sky-400" />,
      };
    }

    // 3. Subjects Route (/subjects) -> Subject Mastery Progress
    if (path === '/subjects' || path === '/') {
      const totalSubjects = 4;
      let completedSubjects = 0;
      if (completedMissions.some((m) => m.startsWith('mission-'))) completedSubjects += 1; // Materials
      if (discoveries.some((d) => d.materialId.startsWith('ant') || d.materialId.startsWith('snake'))) completedSubjects += 1; // Super Senses
      if (discoveries.some((d) => d.materialId.startsWith('water') || d.materialId.startsWith('ghadisar'))) completedSubjects += 1; // Water
      if (discoveries.some((d) => d.materialId.startsWith('pashmina') || d.materialId.startsWith('shelter'))) completedSubjects += 1; // Shelter

      const pct = Math.min(100, Math.round((completedSubjects / totalSubjects) * 100));
      const left = totalSubjects - completedSubjects;

      return {
        type: 'subjects',
        title: 'CBSE EVS Subjects Mastery',
        completed: completedSubjects,
        total: totalSubjects,
        percentage: pct,
        stepsDone: completedSubjects,
        stepsLeft: left,
        label: `${completedSubjects} / ${totalSubjects} Subjects Done`,
        subLabel: left === 0 ? 'All 4 Subjects Mastered! 🎓' : `${left} subject${left === 1 ? '' : 's'} to explore`,
        accentGradient: 'from-emerald-400 via-teal-400 to-sky-400',
        glowColor: 'rgba(52, 211, 153, 0.8)',
        icon: <BookOpen className="w-3.5 h-3.5 text-emerald-500" />,
      };
    }

    // 4. Course / Chapters Hub Routes (/theme/:themeId/hub or /chapter-hub)
    if (path.includes('/hub') || path === '/chapter-hub') {
      let courseName = 'Materials Science';
      let totalChapters = 13;
      let completedChapters = completedMissions.length;

      if (path.includes('water')) {
        courseName = 'Water & Aquatic Experiments';
        totalChapters = 4;
        completedChapters = discoveries.filter((d) => d.materialId.includes('water') || d.materialId.includes('ghadisar')).length;
      } else if (path.includes('shelter')) {
        courseName = 'Shelter, Mountains & Earth';
        totalChapters = 5;
        completedChapters = discoveries.filter((d) => d.materialId.includes('pashmina') || d.materialId.includes('shelter') || d.materialId.includes('petroleum')).length;
      } else if (path.includes('1') || path.includes('senses')) {
        courseName = 'Super Senses & Living World';
        totalChapters = 4;
        completedChapters = discoveries.filter((d) => d.materialId.includes('ant') || d.materialId.includes('snake') || d.materialId.includes('tongue')).length;
      }

      const completed = Math.min(totalChapters, completedChapters);
      const pct = Math.min(100, Math.round((completed / totalChapters) * 100));
      const left = Math.max(0, totalChapters - completed);

      return {
        type: 'chapters',
        title: courseName,
        completed: completed,
        total: totalChapters,
        percentage: pct,
        stepsDone: completed,
        stepsLeft: left,
        label: `${completed} / ${totalChapters} Chapters Done`,
        subLabel: left === 0 ? 'Course Complete! 🌟' : `${left} chapter${left === 1 ? '' : 's'} remaining`,
        accentGradient: 'from-indigo-400 via-sky-400 to-teal-400',
        glowColor: 'rgba(129, 140, 248, 0.8)',
        icon: <MapPin className="w-3.5 h-3.5 text-indigo-500" />,
      };
    }

    // Default Fallback
    return {
      type: 'general',
      title: 'PolyQuest Science Quest',
      completed: 1,
      total: 5,
      percentage: 20,
      stepsDone: 1,
      stepsLeft: 4,
      label: 'Step 1 of 5',
      subLabel: '4 steps left',
      accentGradient: 'from-sky-400 via-blue-500 to-indigo-500',
      glowColor: 'rgba(56, 189, 248, 0.8)',
      icon: <Sparkles className="w-3.5 h-3.5 text-sky-400" />,
    };
  }, [path, completedMissions, discoveries, activeExperiment, activeExercise]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none select-none">
      {/* ── 1. Sleek Full-Width Top Progress Line ── */}
      <div className="w-full h-1.5 sm:h-2 bg-slate-900/10 backdrop-blur-xs relative overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${contextData.percentage}%` }}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          className={`h-full bg-gradient-to-r ${contextData.accentGradient} relative`}
          style={{
            boxShadow: `0 0 14px ${contextData.glowColor}, 0 0 4px ${contextData.glowColor}`,
          }}
        >
          {/* Glowing leading spark */}
          <div className="absolute right-0 top-0 bottom-0 w-3 bg-white shadow-[0_0_8px_#ffffff] rounded-full" />
        </motion.div>
      </div>

      {/* ── 2. Floating Top-Center Progress Pill Badge ── */}
      <div
        className="pointer-events-auto flex justify-center mt-1 sm:mt-1.5"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.button
          whileHover={{ scale: 1.05, y: 1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            sounds.pop();
            setIsExpanded(!isExpanded);
          }}
          className="px-3.5 py-1 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-slate-200/80 hover:border-indigo-300 shadow-md text-slate-800 text-[11px] font-black flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
          title="Click to view detailed breakdown"
        >
          {contextData.icon}
          <span className="font-bold">{contextData.label}</span>
          <span className="px-1.5 py-0.2 rounded-md bg-slate-100 text-[10px] font-mono font-black text-indigo-600">
            {contextData.percentage}%
          </span>
          <div className="text-slate-400">
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </div>
        </motion.button>
      </div>

      {/* ── 3. Expandable Detailed Breakdown Dropdown ── */}
      <AnimatePresence>
        {isExpanded && (
          <div className="pointer-events-auto flex justify-center mt-2 px-4">
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-72 sm:w-80 bg-white/95 backdrop-blur-xl border-3 border-indigo-200 shadow-2xl rounded-3xl p-4 text-slate-800"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700">
                  {contextData.title}
                </span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {contextData.percentage}%
                </span>
              </div>

              <div className="my-3 flex items-center justify-between text-xs font-bold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Done: <strong>{contextData.stepsDone}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>Left: <strong>{contextData.stepsLeft}</strong></span>
                </div>
              </div>

              {/* Detail Progress Bar */}
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200 relative mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${contextData.percentage}%` }}
                  className={`h-full bg-gradient-to-r ${contextData.accentGradient} rounded-full`}
                />
              </div>

              <p className="text-[11px] text-slate-500 font-bold text-center">
                {contextData.subLabel}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
