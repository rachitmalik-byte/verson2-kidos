import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SylvaHero } from '@designcodeio/threeui';
import '@designcodeio/threeui/style.css';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { AudioNavBarControls } from '@/components/navigation/AudioNavBarControls';
import { THEME_1_CHAPTERS } from '@/data/theme1Missions';
import { ArrowLeft, BookOpen, ArrowRight, Compass, ChevronDown } from 'lucide-react';
import { useDiscoveryStore } from '@/stores/discoveryStore';

// Specimen Photography & 3D Artwork
import voxelForestImg from '@/assets/images/nature/kaykit_forest_biome_sample.png';
import snakeVibrationImg from '@/assets/images/specimens/snake_jawbone_vibrations.jpg';
import tonguePapillaeImg from '@/assets/images/specimens/tongue_taste_papillae.jpg';
import burdockVelcroImg from '@/assets/images/specimens/burdock_velcro_macro.jpg';

const CHAPTER_ARTWORK: Record<number, {
  imageSrc: string;
  tagline: string;
  telemetry: string;
  frequency: string;
}> = {
  1: {
    imageSrc: voxelForestImg,
    tagline: '3D Voxel Canopy & Scent Navigation',
    telemetry: 'PHEROMONE MATRIX',
    frequency: '0.002 ppm Trail Density',
  },
  2: {
    imageSrc: snakeVibrationImg,
    tagline: 'Ground Compression & Seismic Ear',
    telemetry: 'SEISMIC ACOUSTICS',
    frequency: '12 – 40 Hz Ground Waves',
  },
  3: {
    imageSrc: tonguePapillaeImg,
    tagline: 'Papillae Micro-Receptors & Amylase',
    telemetry: 'BIO-CHEMISTRY',
    frequency: '9,000+ Gustatory Cones',
  },
  4: {
    imageSrc: burdockVelcroImg,
    tagline: 'Micro-Hook Mechanics & Velcro Genesis',
    telemetry: 'BIOMIMETIC HOOKS',
    frequency: '450 N/m Radial Retention',
  },
};

export function Theme1Hub() {
  const navigate = useNavigate();
  const discoveries = useDiscoveryStore((state) => state.discoveries);

  const handleChapterClick = (chapterNum: number) => {
    sounds.pop();
    voiceAssistant.stop();
    navigate(`/theme/1/chapter/${chapterNum}`);
  };

  const scrollToCurriculum = () => {
    sounds.pop();
    document.getElementById('curriculum-chapters')?.scrollIntoView({ behavior: 'smooth' });
  };

  // ── Curriculum Communication Bridge with ThreeUI Sylva Iframe ──
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === 'THREEUI_EXPLORE' || e.data.type === 'THREEUI_SCROLL_DOWN') {
        scrollToCurriculum();
      } else if (e.data.type === 'THREEUI_LAUNCH_CHAPTER') {
        handleChapterClick(e.data.chapter || 1);
      } else if (e.data.type === 'THREEUI_JOURNAL') {
        sounds.pop();
        navigate('/discovery-book');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#383b34] text-white relative font-sans overflow-x-hidden selection:bg-emerald-500 selection:text-black">
      {/* ── Top Floating Navigation HUD Overlay ── */}
      <header className="fixed top-4 left-4 right-4 z-50 max-w-6xl mx-auto flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={() => {
              sounds.pop();
              voiceAssistant.stop();
              navigate('/subjects');
            }}
            className="liquid-metal-btn px-4 py-2 text-xs flex items-center gap-2 shadow-lg backdrop-blur-md"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#34D399]" />
            <span className="font-bold">All Subjects</span>
          </button>

          <div className="sylva-radar-pill shadow-lg hidden sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34D399]" />
            </span>
            <span>Living Biosphere & Super Senses</span>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <AudioNavBarControls />
        </div>
      </header>

      {/* ── Official ThreeUI Sylva Living Green Hero Stage ── */}
      <section className="w-full h-screen min-h-[640px] max-h-[1080px] relative overflow-hidden bg-[#4a4d44]">
        <SylvaHero
          className="w-full h-full"
          headingFont="lexend"
          bodyFont="lexend"
          headingWeight="300"
          bodyWeight="300"
          primaryColor="#ffffff"
          headingSize={63}
          bodySize={16.5}
          headingLetterSpacing={-0.006}
        />

        {/* Floating Scroll-Down Prompt to Curriculum */}
        <button
          onClick={scrollToCurriculum}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-[11px] font-mono tracking-widest text-emerald-200/80 hover:text-emerald-100 transition-colors uppercase cursor-pointer"
        >
          <span>Explore Living World Chapters</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </button>
      </section>

      {/* ── Living World Curriculum Chapters & Interactive Bio-Labs ── */}
      <main id="curriculum-chapters" className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-16 relative z-10 flex flex-col gap-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <span className="px-3.5 py-1 rounded-full bg-[#10B981]/15 border border-[#34D399]/30 text-[#6EE7B7] text-[11px] font-mono font-bold tracking-wider uppercase inline-flex items-center gap-2 mb-3">
              <Compass className="w-3.5 h-3.5 text-[#34D399]" />
              <span>NCERT Class 5 EVS • Living Systems</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white sylva-glow-text">
              Super Senses & Living Systems
            </h2>
            <p className="text-sm font-medium text-[#B6BFB0] mt-2 max-w-2xl leading-relaxed">
              Explore 4 interactive chapters spanning ant scent trails, snake seismic hearing, 
              taste papillae biochemistry, and burdock seed biomimicry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.pop();
                navigate('/discovery-book');
              }}
              className="liquid-metal-btn px-5 py-3 text-xs uppercase tracking-wider font-bold flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-[#34D399]" />
              <span>Field Journal ({discoveries.length} Notes)</span>
            </button>
          </div>
        </div>

        {/* 4 Specimen Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {THEME_1_CHAPTERS.map((ch) => {
            const art = CHAPTER_ARTWORK[ch.chapterNumber] || CHAPTER_ARTWORK[1];
            return (
              <motion.div
                key={ch.id}
                whileHover={{ scale: 1.015, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChapterClick(ch.chapterNumber)}
                className="sylva-glass-card p-0 overflow-hidden cursor-pointer group flex flex-col justify-between hover:border-[#34D399]/50 transition-all shadow-2xl"
              >
                {/* ── Specimen Optical Viewport ── */}
                <div className="w-full h-52 relative overflow-hidden bg-[#040806]">
                  <img
                    src={art.imageSrc}
                    alt={ch.title}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1812] via-transparent to-black/40" />

                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                    <span className="px-3 py-1 bg-black/75 backdrop-blur-md text-[#34D399] text-[11px] font-mono font-extrabold rounded-full border border-[#34D399]/35 uppercase tracking-wider shadow-md">
                      Chapter {ch.chapterNumber} • {art.telemetry}
                    </span>

                    <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-mono font-bold rounded-full border border-white/20">
                      {ch.curriculumCode}
                    </span>
                  </div>

                  {/* Frequency Overlay */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between">
                    <span className="text-xs font-mono font-extrabold text-[#A7F3D0] drop-shadow-md">
                      {art.frequency}
                    </span>
                    <span className="text-2xl filter drop-shadow-md">{ch.icon}</span>
                  </div>
                </div>

                {/* ── Card Content ── */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-xl font-extrabold text-white leading-snug group-hover:text-[#34D399] transition-colors">
                      {ch.title}
                    </h3>
                    <p className="text-xs font-medium text-[#B6BFB0] mt-2 line-clamp-2 leading-relaxed">
                      {ch.subtitle}
                    </p>

                    {/* Scientific Concept Pills */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {ch.concepts.map((concept) => (
                        <span
                          key={concept}
                          className="px-2.5 py-0.5 rounded-full bg-[#10B981]/12 border border-[#34D399]/25 text-[#6EE7B7] text-[10px] font-mono font-bold"
                        >
                          #{concept}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Launch Bar */}
                  <div className="mt-6 pt-4 border-t border-emerald-900/30 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#34D399] flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                      <span>Enter Interactive Lab</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>

                    <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-[#0d2216] text-[#A7F3D0] border border-[#34D399]/25">
                      5 Lab Stages 🔬
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}


