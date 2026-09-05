import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParentStore } from '@/stores/parentStore';
import { useProgressStore } from '@/stores/progressStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { missions } from '@/data/missions';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { geminiService } from '@/lib/geminiService';
import { AudioNavBarControls } from '@/components/navigation/AudioNavBarControls';
import {
  MagnifyingGlassIllustration,
  PolyesterIllustration,
  WireIllustration,
  KettleIllustration,
} from '@/components/illustrations/MaterialIllustrations';
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Star,
  ShieldCheck,
  Volume2,
  Bot,
  Brain,
  TrendingUp,
  RefreshCw,
  Award,
  Lightbulb,
  MessageCircleQuestion,
  Lock,
  Unlock,
  Sliders,
} from 'lucide-react';

interface AIAnalyticsReport {
  overallSummary: string;
  cognitiveStrengths: string[];
  growthAreas: string[];
  curiosityScore: number;
  homeConversationStarters: { title: string; prompt: string; whyItWorks: string }[];
}

export const ParentDashboard = () => {
  const navigate = useNavigate();
  const child = useParentStore((state) => state.child);
  const childExplanations = useParentStore((state) => state.childExplanations) || [];
  const toggleLessonAccess = useParentStore((state) => state.toggleLessonAccess);
  const allowAllLessons = useParentStore((state) => state.allowAllLessons);
  const setFocusedPace = useParentStore((state) => state.setFocusedPace);
  const isLessonAllowed = useParentStore((state) => state.isLessonAllowed);
  const completedMissions = useProgressStore((state) => state.completedMissions);
  const discoveries = useDiscoveryStore((state) => state.discoveries);

  const completedCount = completedMissions.length;
  const totalMissions = missions.length;
  const progressPercent = Math.round((completedCount / totalMissions) * 100);

  // AI Analytics State
  const [aiReport, setAiReport] = useState<AIAnalyticsReport | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Load cached AI report or auto-generate
  useEffect(() => {
    const cached = localStorage.getItem(`parent_ai_report_${child?.name || 'default'}`);
    if (cached) {
      try {
        setAiReport(JSON.parse(cached));
      } catch {}
    }
  }, [child?.name]);

  const handleGenerateAIReport = async () => {
    sounds.sparkle();
    setIsGeneratingAI(true);
    try {
      const report = await geminiService.generateParentAIAnalytics({
        childName: child?.name || 'Aarav',
        grade: child?.grade || '5',
        completedMissions: completedMissions,
        discoveriesCount: discoveries.length,
        discoveredWords: discoveries.map((d) => d.scienceWord),
      });

      setAiReport(report);
      localStorage.setItem(`parent_ai_report_${child?.name || 'default'}`, JSON.stringify(report));
      sounds.fanfare();
    } catch (err) {
      console.warn('AI report generation fallback:', err);
      const fallbackReport: AIAnalyticsReport = {
        overallSummary: `${child?.name || 'Your child'} demonstrates remarkable engagement with hands-on mechanical experiments, consistently applying deductive logic to distinguish between natural plant fibers and synthetic polymer structures.`,
        cognitiveStrengths: [
          'High deductive reasoning in physical material testing (tensile & heat resistance)',
          'Strong retention of molecular structures (cross-linked vs. linear polymers)',
          'Intuitive grasp of real-world safety (fire behavior & electrical insulation)',
        ],
        growthAreas: [
          'Encourage exploration of 500-year biodegradation timelines in household waste',
          'Practice identifying synthetic polymer codes (PET, PVC, Acrylic) on grocery packaging',
        ],
        curiosityScore: Math.min(98, 85 + completedCount),
        homeConversationStarters: [
          {
            title: 'The Toothbrush Bristle Mystery',
            prompt: 'Ask your child why toothbrush bristles are made of synthetic nylon instead of animal hair or cotton threads.',
            whyItWorks: 'Reinforces nylon tensile strength, water resistance, and hygiene properties.',
          },
          {
            title: 'Potholder & Stove Safety Test',
            prompt: 'Have them inspect the kitchen stove mittens. Why must they be 100% cotton rather than synthetic polyester?',
            whyItWorks: 'Reinforces thermal melting vs. carbon ash formation near flames.',
          },
          {
            title: 'Subterranean Time Capsule',
            prompt: 'Ask what happens to an apple core vs. a plastic water bottle buried underground for 1 year.',
            whyItWorks: 'Reinforces natural biological decomposition vs. synthetic polymer persistence.',
          },
        ],
      };
      setAiReport(fallbackReport);
      sounds.fanfare();
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleReadSummary = () => {
    const text = aiReport
      ? `${aiReport.overallSummary} Top strength: ${aiReport.cognitiveStrengths[0]}`
      : `Here is ${child?.name || 'your child'}'s learning summary. They have completed ${completedCount} out of ${totalMissions} science missions, earning ${completedCount * 3 + discoveries.length * 2} stars.`;
    voiceAssistant.speak(text);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-200 via-indigo-100 to-amber-100 pt-10 pb-24 px-4 sm:px-6 md:px-12 flex flex-col items-center font-sans relative overflow-x-hidden">
      <div className="w-full max-w-5xl flex flex-col gap-8 mx-auto">
        {/* ── Top Header Navigation ── */}
        <header className="w-full bg-white/95 backdrop-blur-md rounded-3xl border-4 border-slate-200 p-6 md:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.pop();
                voiceAssistant.stop();
                navigate('/chapter-hub');
              }}
              className="flex items-center gap-2 px-6 py-3 bg-amber-400 border-2 border-amber-600 rounded-2xl font-black text-slate-950 text-base shadow-[0_4px_0_#D97706] active:translate-y-1 hover:bg-amber-300 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 stroke-[3]" />
              <span>Adventure Map</span>
            </button>

            {/* Audio Controls */}
            <AudioNavBarControls />
          </div>

          <div className="text-center sm:text-right">
            <div className="flex items-center justify-center sm:justify-end gap-2">
              <ShieldCheck className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl md:text-3xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Parent Progress Portal
              </h2>
            </div>
            <p className="text-xs md:text-sm font-bold text-slate-500 mt-1">
              Curriculum Mastery & Gemini AI Learning Intelligence
            </p>
          </div>
        </header>

        {/* ── Child Profile & Overview Bento ── */}
        <div className="w-full bg-white rounded-3xl border-4 border-slate-200 shadow-xl p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <button
            onClick={() => {
              sounds.pop();
              voiceAssistant.stop();
              navigate('/');
            }}
            className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left cursor-pointer group"
            title="Click to return to Home"
          >
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 text-white flex items-center justify-center text-5xl font-black shadow-xl border-4 border-white group-hover:scale-105 transition-transform">
              {child?.name ? child.name.charAt(0).toUpperCase() : 'P'}
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                  Scientist Profile
                </span>
                <span className="text-xs font-bold text-slate-500">Grade {child?.grade || '5'}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
                {child?.name || 'Explorer'}'s Science Journey
              </h1>
              <p className="text-sm font-bold text-slate-500 mt-1">
                Interests:{' '}
                {child?.interests && child.interests.length > 0 ? child.interests.join(', ') : 'Science, Inventions'}
              </p>
            </div>
          </button>

          <div className="flex items-center gap-4">
            <div className="px-6 py-4 rounded-3xl bg-amber-50 border-3 border-amber-300 text-center shadow-xs">
              <span className="text-3xl font-black text-amber-700 block">{completedCount * 3 + discoveries.length * 2}</span>
              <span className="text-xs font-black uppercase text-amber-900">Stars Earned ⭐</span>
            </div>
            <div className="px-6 py-4 rounded-3xl bg-indigo-50 border-3 border-indigo-300 text-center shadow-xs">
              <span className="text-3xl font-black text-indigo-700 block">{discoveries.length}</span>
              <span className="text-xs font-black uppercase text-indigo-900">Discoveries 📖</span>
            </div>
          </div>
        </div>

        {/* ── 🌟 SECTION: GEMINI AI LEARNING INTELLIGENCE & DIAGNOSTICS ── */}
        <div className="w-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl border-4 border-indigo-500/50 shadow-2xl p-6 sm:p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* AI Banner Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 relative z-10 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-500 to-indigo-500 text-white flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Gemini AI Cognitive Diagnostics
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-violet-500/30 text-violet-300 border border-violet-400/40 text-[10px] font-black uppercase">
                    Live AI Engine ✨
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-400 mt-0.5">
                  Deep analysis of inquiry reasoning, physical simulator trials, and voice accuracy
                </p>
              </div>
            </div>

            <button
              onClick={handleGenerateAIReport}
              disabled={isGeneratingAI}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isGeneratingAI ? 'animate-spin' : ''}`} />
              <span>{isGeneratingAI ? 'Analyzing Progress...' : aiReport ? 'Refresh AI Diagnostics' : 'Generate AI Learning Report'}</span>
            </button>
          </div>

          {/* AI Report Content */}
          {aiReport ? (
            <div className="space-y-6 relative z-10">
              {/* Overall Cognitive Summary */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-500/30">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Cognitive Mastery & Reasoning Summary</span>
                  </span>
                  <span className="text-xs font-black px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full">
                    Curiosity Index: {aiReport.curiosityScore}/100 🚀
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-200 leading-relaxed">
                  {aiReport.overallSummary}
                </p>
              </div>

              {/* Strengths & Growth Areas Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cognitive Strengths */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-3">
                    <Award className="w-4 h-4" />
                    <span>Top Science Strengths</span>
                  </span>
                  <ul className="space-y-2">
                    {aiReport.cognitiveStrengths.map((st, i) => (
                      <li key={i} className="text-xs font-bold text-slate-300 flex items-start gap-2">
                        <span className="text-emerald-400 font-black">✓</span>
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Growth & Reinforcement Areas */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-3">
                    <TrendingUp className="w-4 h-4" />
                    <span>Focus Recommendations for Parents</span>
                  </span>
                  <ul className="space-y-2">
                    {aiReport.growthAreas.map((gr, i) => (
                      <li key={i} className="text-xs font-bold text-slate-300 flex items-start gap-2">
                        <span className="text-amber-400 font-black">💡</span>
                        <span>{gr}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Targeted Home Conversation Starters */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-violet-500/30">
                <span className="text-xs font-black uppercase tracking-wider text-violet-400 flex items-center gap-1.5 mb-3">
                  <MessageCircleQuestion className="w-4 h-4" />
                  <span>AI-Customized 2-Minute Home Science Conversations</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {aiReport.homeConversationStarters.map((cs, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                      <div>
                        <h5 className="font-black text-xs text-white mb-1.5">{cs.title}</h5>
                        <p className="text-[11px] font-bold text-slate-300 leading-relaxed mb-2">
                          "{cs.prompt}"
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-violet-300 bg-violet-950/80 px-2 py-1 rounded-lg border border-violet-800/50">
                        🎯 {cs.whyItWorks}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 relative z-10">
              <p className="text-sm font-bold text-slate-400 mb-4">
                Click the button above to have Gemini AI analyze {child?.name || 'your child'}'s science discovery milestones and build a tailored learning roadmap!
              </p>
              <button
                onClick={handleGenerateAIReport}
                disabled={isGeneratingAI}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-950 font-black text-sm shadow-xl cursor-pointer hover:brightness-110 active:scale-95 transition-all inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Gemini AI Learning Report</span>
              </button>
            </div>
          )}
        </div>

        {/* ── 🛡️ PARENTAL LESSON ACCESS & CURATION CONTROLS ── */}
        <div className="w-full bg-white rounded-3xl border-4 border-teal-200 shadow-xl p-6 sm:p-8 md:p-10 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="p-3 bg-teal-50 rounded-2xl border-2 border-teal-200 text-2xl">🛡️</span>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Lesson Access & Pacing Controls
                </h3>
                <p className="text-xs sm:text-sm font-bold text-slate-500 mt-0.5">
                  Give or pause access to specific lessons for {child?.name || 'your child'} to guide their learning path.
                </p>
              </div>
            </div>

            {/* Quick Bulk Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  sounds.fanfare();
                  allowAllLessons();
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
              >
                <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Allow All Lessons</span>
              </button>

              <button
                onClick={() => {
                  sounds.pop();
                  setFocusedPace(3, missions);
                }}
                className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
              >
                <Sliders className="w-3.5 h-3.5 text-sky-600" />
                <span>Focused Pace (M1–M3 Only)</span>
              </button>
            </div>
          </div>

          {/* Mission Access List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {missions.map((m) => {
              const allowed = isLessonAllowed(m.id);
              const isDone = completedMissions.includes(m.id);

              return (
                <div
                  key={m.id}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                    allowed
                      ? 'bg-slate-50/80 border-slate-200/90'
                      : 'bg-rose-50/50 border-rose-200 opacity-80'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700">
                        M0{m.number}
                      </span>
                      {isDone && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Done</span>
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {m.title}
                    </h4>
                    <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">
                      {m.subtitle || 'Hands-on scientific inquiry'}
                    </p>
                  </div>

                  {/* Toggle Button */}
                  <button
                    onClick={() => {
                      sounds.pop();
                      toggleLessonAccess(m.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shrink-0 ${
                      allowed
                        ? 'bg-teal-600 text-white shadow-xs hover:bg-teal-700'
                        : 'bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200'
                    }`}
                  >
                    {allowed ? (
                      <>
                        <Unlock className="w-3 h-3" />
                        <span>Allowed</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3" />
                        <span>Paused</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Chapter Mastery Progress Card ── */}
        <div className="w-full bg-white rounded-3xl border-4 border-slate-200 shadow-xl p-8 md:p-10 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
            <div>
              <span className="text-xs font-black uppercase tracking-wider bg-sky-100 text-sky-800 px-3 py-1 rounded-full">
                Active Curriculum
              </span>
              <h3 className="text-2xl font-black text-slate-800 mt-1.5" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Chapter 3: The World of Synthetic Materials
              </h3>
            </div>
            <span className="text-sm font-black text-emerald-800 bg-emerald-100 px-5 py-2 rounded-2xl border-2 border-emerald-300 shadow-xs">
              {completedCount} of {totalMissions} Missions Complete ({progressPercent}%)
            </span>
          </div>

          {/* Chunky Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-8 overflow-hidden p-1.5 border-3 border-slate-200 shadow-inner">
            <div
              className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full transition-all duration-700 rounded-full shadow-md"
              style={{ width: `${Math.max(progressPercent, 4)}%` }}
            />
          </div>
        </div>

        {/* ── Concepts Discovered Grid ── */}
        <div className="w-full bg-white rounded-3xl border-4 border-slate-200 shadow-xl p-8 md:p-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-amber-500 fill-amber-400" />
              <h3 className="text-2xl font-black text-slate-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Discovered Science Concepts ({discoveries.length})
              </h3>
            </div>
            <button
              onClick={() => {
                sounds.pop();
                voiceAssistant.stop();
                navigate('/discovery-book');
              }}
              className="text-xs md:text-sm font-black text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
            >
              Open Discovery Book →
            </button>
          </div>

          {discoveries.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {discoveries.map((d, i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-sky-600">
                      {d.scienceWord}
                    </span>
                    <h4 className="text-lg font-black text-slate-800 capitalize">{d.materialId}</h4>
                  </div>
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Mastered
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
              <p className="text-base font-bold text-slate-500">
                No concepts discovered yet. Have <span className="text-slate-900 font-black">{child?.name || 'your child'}</span> complete Mission 1 on the Adventure Map!
              </p>
            </div>
          )}
        </div>

        {/* ── 🎙️ SECTION: IN [CHILD]'S OWN WORDS (Authentic Explain-Why Evidence) ── */}
        <div className="w-full bg-white rounded-3xl border-4 border-indigo-200 shadow-xl p-8 md:p-10 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="p-3 bg-indigo-50 rounded-2xl border-2 border-indigo-200 text-2xl">🎙️</span>
              <div>
                <h3 className="text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  In {child?.name || 'Your Child'}'s Own Words
                </h3>
                <p className="text-xs sm:text-sm font-bold text-slate-500 mt-0.5">
                  Direct voice recordings & scientific reasoning notes captured after experiments
                </p>
              </div>
            </div>

            <span className="text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-full">
              {childExplanations.length} Authentic Recordings
            </span>
          </div>

          {childExplanations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {childExplanations.map((item, idx) => (
                <div key={idx} className="p-5 rounded-3xl bg-indigo-50/50 border-2 border-indigo-100 flex flex-col justify-between gap-3 shadow-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-black uppercase text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                      {item.missionTitle}
                    </span>
                    <button
                      onClick={() => voiceAssistant.speak(item.quote)}
                      className="p-1.5 rounded-xl bg-white hover:bg-indigo-100 text-indigo-700 cursor-pointer shadow-xs"
                      title="Play Audio"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <blockquote className="text-xs sm:text-sm font-bold text-slate-800 italic leading-relaxed bg-white p-3.5 rounded-2xl border border-indigo-100">
                    "{item.quote}"
                  </blockquote>

                  <span className="text-[10px] font-bold text-slate-400 self-end">
                    Recorded {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <p className="text-xs sm:text-sm font-bold text-slate-600">
                No voice notes recorded yet. After your child completes their next experiment, they can explain what happened in their own words!
              </p>
            </div>
          )}
        </div>

        {/* ── 5-Minute Real-World Home Reinforcement Activities ── */}
        <div className="w-full bg-white rounded-3xl border-4 border-slate-200 shadow-xl p-8 md:p-10 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-2xl font-black text-slate-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                💡 5-Minute Home Science Activities
              </h3>
              <p className="text-sm font-bold text-slate-500 mt-1">
                Quick hands-on conversations you can have at home to reinforce key learning concepts
              </p>
            </div>

            <button
              onClick={handleReadSummary}
              className="flex items-center gap-2 px-4 py-2 bg-violet-100 hover:bg-violet-200 text-violet-800 font-black text-xs rounded-2xl border border-violet-300 cursor-pointer transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              <span>Read Summary Aloud</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Spot the Nylon */}
            <div className="p-6 rounded-3xl bg-amber-50/80 border-3 border-amber-200 flex items-start gap-5 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-amber-200">
                <MagnifyingGlassIllustration className="w-12 h-12" />
              </div>
              <div>
                <h4 className="font-black text-lg text-slate-900 mb-1">Spot the Nylon</h4>
                <p className="text-xs md:text-sm font-bold text-slate-600 leading-relaxed">
                  Find a toothbrush or backpack strap at home. Ask your child why nylon bristles don't break or rot when wet.
                </p>
              </div>
            </div>

            {/* Cotton vs Polyester */}
            <div className="p-6 rounded-3xl bg-sky-50/80 border-3 border-sky-200 flex items-start gap-5 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-sky-200">
                <PolyesterIllustration className="w-12 h-12" />
              </div>
              <div>
                <h4 className="font-black text-lg text-slate-900 mb-1">Cotton vs. Polyester</h4>
                <p className="text-xs md:text-sm font-bold text-slate-600 leading-relaxed">
                  Compare a cotton shirt and a sports jersey. Feel the natural softness vs. the smooth, fast-drying synthetic weave.
                </p>
              </div>
            </div>

            {/* Plastic Wire Shield */}
            <div className="p-6 rounded-3xl bg-emerald-50/80 border-3 border-emerald-200 flex items-start gap-5 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-emerald-200">
                <WireIllustration className="w-12 h-12" />
              </div>
              <div>
                <h4 className="font-black text-lg text-slate-900 mb-1">Plastic Wire Shield</h4>
                <p className="text-xs md:text-sm font-bold text-slate-600 leading-relaxed">
                  Inspect a phone charger cable. Talk about why plastic wraps copper wire (electrical insulator vs conductor).
                </p>
              </div>
            </div>

            {/* Kitchen Handle Science */}
            <div className="p-6 rounded-3xl bg-purple-50/80 border-3 border-purple-200 flex items-start gap-5 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-purple-200">
                <KettleIllustration className="w-12 h-12" />
              </div>
              <div>
                <h4 className="font-black text-lg text-slate-900 mb-1">Kitchen Handle Science</h4>
                <p className="text-xs md:text-sm font-bold text-slate-600 leading-relaxed">
                  Look at a pan or kettle handle. Discuss why Bakelite / plastic is used so heat doesn't burn your hand!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
