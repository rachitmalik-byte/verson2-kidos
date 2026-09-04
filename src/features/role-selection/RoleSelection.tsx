import React from 'react';
import { PersistentAppShell } from '@/components/navigation/PersistentAppShell';
import { HeroVolcanoChamber } from '@/features/home/components/HeroVolcanoChamber';
import { FeatureStrip } from '@/features/home/components/FeatureStrip';
import { RoleEntrySection } from '@/features/home/components/RoleEntrySection';
import { ScienceLabExploration } from '@/features/home/components/ScienceLabExploration';
import { ExperimentShowcase } from '@/features/home/components/ExperimentShowcase';
import { useNavigate } from 'react-router-dom';
import { Compass, ShieldCheck, Award, HeartHandshake } from 'lucide-react';
import { sounds } from '@/lib/sounds';

export const RoleSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PersistentAppShell activeDestination="home">
      {/* ── SUBTLE SCIENTIFIC LABORATORY CANVAS (Clean, Bright & Technical) ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#F8FAFC]">
        {/* Technical Blueprint Dot Grid */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94A3B8_1px,transparent_1px)] [background-size:28px_28px]" />
        
        {/* Soft Ambient Light Orbs (Very faint, non-distracting) */}
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-cyan-200/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-[550px] h-[550px] bg-emerald-100/20 rounded-full blur-3xl" />
      </div>

      {/* ── MAIN LANDING PAGE CONTENT ── */}
      <div className="relative z-10 flex flex-col w-full">
        
        {/* 1. HERO SECTION: 3D VOLCANO LAB CHAMBER & VALUE PROPOSITION */}
        <HeroVolcanoChamber />

        {/* 2. RESTRAINED FEATURE STRIP */}
        <FeatureStrip />

        {/* 3. CHOOSE YOUR PATH (YOUNG SCIENTIST, PARENT, TEACHER) */}
        <RoleEntrySection />

        {/* 4. EXPLORE THE SCIENCE LAB (6 DISCIPLINES WITH 3D MUSEUM ASSETS) */}
        <ScienceLabExploration />

        {/* 5. SCIENCE YOU CAN ACTUALLY EXPLORE (3 INTERACTIVE PREVIEWS & SANDBOX) */}
        <ExperimentShowcase />

        {/* 6. ACADEMY FOOTER & TRUST ACCREDITATION */}
        <footer className="w-full bg-slate-900 text-white border-t border-slate-800 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-left">
              
              {/* Brand Col */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-md">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-display font-black text-lg text-white tracking-wider block">
                      POLYQUEST ACADEMY
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">
                      Digital Interactive Science Lab
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-sm leading-relaxed mb-4">
                  Real science. Real experiments. Real learning. Hands-on 3D physics, biological systems, and chemical reactions for young explorers.
                </p>

                <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <ShieldCheck className="w-4 h-4" /> COPPA Compliant & Ad-Free
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 text-blue-400 font-bold">
                    <Award className="w-4 h-4" /> NCERT & STEM Aligned
                  </span>
                </div>
              </div>

              {/* Exploration Links */}
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-300 block mb-4">
                  Curriculum Portals
                </span>
                <ul className="space-y-2 text-xs font-bold text-slate-400">
                  <li>
                    <button
                      onClick={() => {
                        sounds.pop();
                        navigate('/subjects');
                      }}
                      className="hover:text-cyan-400 transition-colors cursor-pointer"
                    >
                      All Learning Realms →
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        sounds.pop();
                        navigate('/theme/1/hub');
                      }}
                      className="hover:text-cyan-400 transition-colors cursor-pointer"
                    >
                      Living World & Biosphere →
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        sounds.pop();
                        navigate('/chapter-hub');
                      }}
                      className="hover:text-cyan-400 transition-colors cursor-pointer"
                    >
                      Materials Science & Polymers →
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        sounds.pop();
                        navigate('/theme/water/hub');
                      }}
                      className="hover:text-cyan-400 transition-colors cursor-pointer"
                    >
                      Oceans & Hydrosphere →
                    </button>
                  </li>
                </ul>
              </div>

              {/* Roles Links */}
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-300 block mb-4">
                  Portals & Tools
                </span>
                <ul className="space-y-2 text-xs font-bold text-slate-400">
                  <li>
                    <button
                      onClick={() => {
                        sounds.pop();
                        navigate('/parent/dashboard');
                      }}
                      className="hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      Parent Zone & Progress →
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        sounds.pop();
                        navigate('/teacher-studio');
                      }}
                      className="hover:text-indigo-400 transition-colors cursor-pointer"
                    >
                      Teacher Studio & Worksheets →
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        sounds.pop();
                        navigate('/discovery-book');
                      }}
                      className="hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      Field Discovery Journal →
                    </button>
                  </li>
                </ul>
              </div>

            </div>

            <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
              <span>© 2026 PolyQuest Academy. Dedicated to hands-on scientific discovery.</span>
              <span className="text-[11px] text-slate-400">Designed for curious minds aged 9–14.</span>
            </div>
          </div>
        </footer>

      </div>
    </PersistentAppShell>
  );
};
