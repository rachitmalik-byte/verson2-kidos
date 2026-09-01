import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThreeMoleculeLab } from '@/components/three-lab/ThreeMoleculeLab';
import { ThreeBuoyancyLab } from '@/components/three-lab/ThreeBuoyancyLab';
import { ThreeScienceGlobe } from '@/components/three-lab/ThreeScienceGlobe';
import { ThreeVelcroLab } from '@/components/three-lab/ThreeVelcroLab';
import { sounds } from '@/lib/sounds';
import { Box, Droplets, Globe, Layers, Home, Sparkles } from 'lucide-react';

export const ThreeLabPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'molecule' | 'buoyancy' | 'globe' | 'velcro'>('molecule');

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white font-sans flex flex-col p-4 sm:p-6 select-none">
      {/* Top Header */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <button
          onClick={() => {
            sounds.pop();
            navigate('/subjects');
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-black text-xs sm:text-sm border border-slate-800 cursor-pointer transition-all"
        >
          <Home className="w-4 h-4" />
          <span>All Subjects</span>
        </button>

        <div className="text-center">
          <h1 className="text-base sm:text-xl font-black text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>
            PolyQuest 3D Science Holo-Lab ⚛️
          </h1>
          <span className="text-[11px] font-bold text-slate-400">
            Interactive Three.js 3D Physics, Chemistry & Biology Simulators
          </span>
        </div>

        <div className="w-20" />
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl mx-auto flex flex-col gap-5 my-auto py-6">
        {/* Lab Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: 'molecule', label: '3D Molecular & Polymer Builder', icon: <Box className="w-4 h-4" /> },
            { id: 'buoyancy', label: '3D Archimedes Density Tank', icon: <Droplets className="w-4 h-4" /> },
            { id: 'globe', label: '3D Science Discovery Globe', icon: <Globe className="w-4 h-4" /> },
            { id: 'velcro', label: '3D Velcro Micro-Hook Lab', icon: <Layers className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.pop();
                setActiveTab(tab.id as any);
              }}
              className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 border border-indigo-400 scale-105'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Active Lab Component */}
        <div className="w-full">
          {activeTab === 'molecule' && <ThreeMoleculeLab />}
          {activeTab === 'buoyancy' && <ThreeBuoyancyLab />}
          {activeTab === 'globe' && <ThreeScienceGlobe />}
          {activeTab === 'velcro' && <ThreeVelcroLab />}
        </div>
      </main>
    </div>
  );
};
