import { useNavigate } from 'react-router-dom';
import { useParentStore } from '@/stores/parentStore';
import { useProgressStore } from '@/stores/progressStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { missions } from '@/data/missions';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { AudioNavBarControls } from '@/components/navigation/AudioNavBarControls';
import {
  MagnifyingGlassIllustration,
  PolyesterIllustration,
  WireIllustration,
  KettleIllustration,
} from '@/components/illustrations/MaterialIllustrations';
import { ArrowLeft, CheckCircle2, Sparkles, BookOpen, Star, ShieldCheck, Volume2 } from 'lucide-react';

export const ParentDashboard = () => {
  const navigate = useNavigate();
  const child = useParentStore((state) => state.child);
  const completedMissions = useProgressStore((state) => state.completedMissions);
  const discoveries = useDiscoveryStore((state) => state.discoveries);

  const completedCount = completedMissions.length;
  const totalMissions = missions.length;
  const progressPercent = Math.round((completedCount / totalMissions) * 100);

  const handleReadSummary = () => {
    const text = `Here is ${child?.name || 'your child'}'s learning summary. They have completed ${completedCount} out of ${totalMissions} science missions, earning ${completedCount * 3 + discoveries.length * 2} stars. Check out the 5-minute home science activities below to reinforce their learning!`;
    voiceAssistant.speak(text);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-200 via-indigo-100 to-amber-100 pt-10 pb-24 px-6 md:px-12 flex flex-col items-center font-sans relative overflow-x-hidden">
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
              Curriculum Mastery & Home Science Coaching
            </p>
          </div>
        </header>

        {/* ── Child Profile & Overview Bento ── */}
        <div className="w-full bg-white rounded-3xl border-4 border-slate-200 shadow-xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
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

        {/* ── Chapter Mastery Progress Card ── */}
        <div className="w-full bg-white rounded-3xl border-4 border-slate-200 shadow-xl p-8 md:p-10">
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
