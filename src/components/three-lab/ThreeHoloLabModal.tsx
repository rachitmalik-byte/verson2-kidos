import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThreeMoleculeLab } from './ThreeMoleculeLab';
import { ThreeBuoyancyLab } from './ThreeBuoyancyLab';
import { ThreeScienceGlobe } from './ThreeScienceGlobe';
import { ThreeVelcroLab } from './ThreeVelcroLab';
import { sounds } from '@/lib/sounds';
import { Sparkles, X, Box, Droplets, Globe, Layers } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'molecule' | 'buoyancy' | 'globe' | 'velcro';
}

export const ThreeHoloLabModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialTab = 'molecule',
}) => {
  const [activeTab, setActiveTab] = useState<'molecule' | 'buoyancy' | 'globe' | 'velcro'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md select-none font-sans">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="w-full max-w-5xl bg-slate-950 rounded-[36px] border-4 border-indigo-500/50 shadow-2xl p-4 sm:p-6 flex flex-col gap-4 max-h-[92vh] overflow-y-auto"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Box className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-xl font-black text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>
                PolyQuest 3D Science Holo-Lab ⚛️
              </h2>
              <span className="text-[11px] font-bold text-slate-400">
                Interactive WebGL 3D Physics & Molecular Simulations (Powered by Three.js)
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.pop();
              onClose();
            }}
            className="p-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Lab Switcher Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'molecule', label: '3D Molecule Builder', icon: <Box className="w-4 h-4" /> },
            { id: 'buoyancy', label: '3D Buoyancy & Density Tank', icon: <Droplets className="w-4 h-4" /> },
            { id: 'globe', label: '3D Science Planet', icon: <Globe className="w-4 h-4" /> },
            { id: 'velcro', label: '3D Velcro Hook Lab', icon: <Layers className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.pop();
                setActiveTab(tab.id as any);
              }}
              className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Active 3D Experience */}
        <div className="w-full">
          {activeTab === 'molecule' && <ThreeMoleculeLab />}
          {activeTab === 'buoyancy' && <ThreeBuoyancyLab />}
          {activeTab === 'globe' && <ThreeScienceGlobe />}
          {activeTab === 'velcro' && <ThreeVelcroLab />}
        </div>
      </motion.div>
    </div>
  );
};
