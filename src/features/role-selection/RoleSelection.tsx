import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useParentStore } from '@/stores/parentStore';
import { Pip } from '@/components/pip/Pip';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Sparkles, Play, Shield, Users, Compass } from 'lucide-react';
import {
  RaincoatSyntheticIllustration,
  CottonIllustration,
  NylonIllustration,
  PlasticIllustration,
} from '@/components/illustrations/MaterialIllustrations';

export function RoleSelection() {
  const navigate = useNavigate();
  const isSetUp = useParentStore((state) => state.isSetUp);

  const handleScientistClick = () => {
    sounds.fanfare();
    voiceAssistant.stop();
    if (!isSetUp) {
      navigate('/parent/setup');
    } else {
      navigate('/chapter-hub');
    }
  };

  const handleParentClick = () => {
    sounds.pop();
    voiceAssistant.stop();
    if (!isSetUp) {
      navigate('/parent/setup');
    } else {
      navigate('/parent/pin');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-300 via-blue-100 to-amber-100 flex flex-col items-center justify-between pt-10 pb-20 px-6 font-sans relative overflow-hidden">
      {/* ── Background Floating Illustrated Badges ── */}
      <div className="absolute top-12 left-12 opacity-80 pointer-events-none hidden md:block">
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [-6, 6, -6] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-20 h-20 p-2 bg-white/70 backdrop-blur-xs rounded-3xl border-2 border-white shadow-lg"
        >
          <RaincoatSyntheticIllustration className="w-full h-full" />
        </motion.div>
      </div>

      <div className="absolute top-16 right-16 opacity-80 pointer-events-none hidden md:block">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [6, -6, 6] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-20 h-20 p-2 bg-white/70 backdrop-blur-xs rounded-3xl border-2 border-white shadow-lg"
        >
          <NylonIllustration className="w-full h-full" />
        </motion.div>
      </div>

      <div className="absolute bottom-16 left-20 opacity-80 pointer-events-none hidden md:block">
        <motion.div
          animate={{ y: [0, -14, 0], rotate: [-8, 8, -8] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-20 h-20 p-2 bg-white/70 backdrop-blur-xs rounded-3xl border-2 border-white shadow-lg"
        >
          <CottonIllustration className="w-full h-full" />
        </motion.div>
      </div>

      <div className="absolute bottom-20 right-20 opacity-80 pointer-events-none hidden md:block">
        <motion.div
          animate={{ y: [0, -18, 0], rotate: [8, -8, 8] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-20 h-20 p-2 bg-white/70 backdrop-blur-xs rounded-3xl border-2 border-white shadow-lg"
        >
          <PlasticIllustration className="w-full h-full" />
        </motion.div>
      </div>

      {/* ── Title & Mascot Header ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="text-center my-auto flex flex-col items-center z-10 max-w-2xl"
      >
        <div className="mb-4">
          <Pip mood="celebrating" size="xl" />
        </div>

        <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border-2 border-slate-200 shadow-md mb-3">
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span className="text-xs font-black uppercase tracking-widest text-slate-700">
            Interactive Science Playground (Grades 5–6)
          </span>
        </div>

        <h1
          className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tight drop-shadow-sm"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          POLY<span className="text-sky-600">QUEST</span>
        </h1>
        <p className="text-lg sm:text-2xl font-black text-slate-700 mt-2 max-w-md mx-auto">
          The World of Synthetic Materials
        </p>

        {/* ── Two Big Chunky 3D Entry Cards ── */}
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl mt-8">
          {/* Scientist Card */}
          <motion.button
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleScientistClick}
            className="flex-1 bg-gradient-to-b from-sky-400 to-sky-600 border-4 border-sky-300 shadow-[0_10px_0_#0369A1] active:translate-y-2 active:shadow-none p-8 rounded-3xl flex flex-col items-center justify-center text-white cursor-pointer group"
          >
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Compass className="w-12 h-12 text-white stroke-[2.5]" />
            </div>
            <h2 className="font-black text-2xl md:text-3xl tracking-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
              I'M A SCIENTIST!
            </h2>
            <p className="text-sky-100 text-xs md:text-sm font-bold mt-1.5">
              Explore hands-on experiments & earn stars
            </p>

            <div className="mt-5 px-6 py-2.5 bg-amber-400 border-2 border-amber-600 text-slate-950 font-black text-sm rounded-2xl shadow-md flex items-center gap-2">
              <Play className="w-4 h-4 fill-current" />
              <span>Enter Lab!</span>
            </div>
          </motion.button>

          {/* Parent Card */}
          <motion.button
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleParentClick}
            className="flex-1 bg-gradient-to-b from-indigo-500 to-indigo-700 border-4 border-indigo-300 shadow-[0_10px_0_#3730A3] active:translate-y-2 active:shadow-none p-8 rounded-3xl flex flex-col items-center justify-center text-white cursor-pointer group"
          >
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield className="w-12 h-12 text-white stroke-[2.5]" />
            </div>
            <h2 className="font-black text-2xl md:text-3xl tracking-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
              PARENT PORTAL
            </h2>
            <p className="text-indigo-100 text-xs md:text-sm font-bold mt-1.5">
              Curriculum tracking & 5-min home activities
            </p>

            <div className="mt-5 px-6 py-2.5 bg-white/20 border-2 border-white/40 text-white font-black text-sm rounded-2xl shadow-sm flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Parent Access</span>
            </div>
          </motion.button>
        </div>
      </motion.div>

      <div className="text-xs font-black text-slate-600 bg-white/70 backdrop-blur-xs px-5 py-2 rounded-full border border-white/60 shadow-xs z-10">
        Google Antigravity EdTech Edition • Grade 5–6 Science Curriculum
      </div>
    </div>
  );
}
