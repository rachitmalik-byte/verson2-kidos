import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { materials } from '@/data/materials';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { AudioNavBarControls } from '@/components/navigation/AudioNavBarControls';
import {
  CottonIllustration,
  WoolIllustration,
  SilkIllustration,
  WoodIllustration,
  NylonIllustration,
  PolyesterIllustration,
  PlasticIllustration,
  RubberIllustration,
  RaincoatSyntheticIllustration,
} from '@/components/illustrations/MaterialIllustrations';
import { ArrowLeft, BookOpen, Sparkles, CheckCircle2, Lock, Tag, Volume2, Star, Home } from 'lucide-react';

const renderMaterialIcon = (id: string, className = 'w-full h-full') => {
  switch (id) {
    case 'cotton':
      return <CottonIllustration className={className} />;
    case 'wool':
      return <WoolIllustration className={className} />;
    case 'silk':
      return <SilkIllustration className={className} />;
    case 'wood':
      return <WoodIllustration className={className} />;
    case 'nylon':
      return <NylonIllustration className={className} />;
    case 'polyester':
      return <PolyesterIllustration className={className} />;
    case 'plastic':
      return <PlasticIllustration className={className} />;
    case 'synthetic-rubber':
    case 'natural-rubber':
      return <RubberIllustration className={className} />;
    case 'acrylic':
      return <WoolIllustration className={className} />;
    case 'rayon':
      return <SilkIllustration className={className} />;
    default:
      return <RaincoatSyntheticIllustration className={className} />;
  }
};

export const DiscoveryBook = () => {
  const navigate = useNavigate();
  const discoveries = useDiscoveryStore((state) => state.discoveries);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(materials[0].id);
  const [activeTab, setActiveTab] = useState<'all' | 'natural' | 'synthetic'>('all');

  const filteredMaterials = materials.filter((m) => {
    if (activeTab === 'all') return true;
    return m.type === activeTab;
  });

  const selectedMaterial = materials.find((m) => m.id === selectedMaterialId) || materials[0];
  const isDiscovered = discoveries.some((d) => d.materialId === selectedMaterial.id);

  const handlePronounce = () => {
    sounds.pop();
    voiceAssistant.speak(`${selectedMaterial.name}. ${selectedMaterial.type} material. ${selectedMaterial.funFact || ''}`);
  };

  const handleHomeClick = () => {
    sounds.pop();
    voiceAssistant.stop();
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-indigo-200 via-sky-100 to-amber-100 p-3 sm:p-6 md:p-8 flex flex-col items-center font-sans relative overflow-x-hidden">
      {/* ── Top Header ── */}
      <header className="w-full max-w-6xl bg-white/95 backdrop-blur-md rounded-3xl border-4 border-slate-200/80 p-4 sm:p-5 md:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 sm:mb-8 z-20">
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={handleHomeClick}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 rounded-2xl text-slate-700 shadow-xs cursor-pointer active:scale-95 transition-all"
            title="Return to Main Home Screen"
          >
            <Home className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sounds.pop();
              voiceAssistant.stop();
              navigate('/chapter-hub');
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-400 border-2 border-amber-600 shadow-[0_4px_0_#D97706] active:translate-y-1 text-slate-950 font-black text-xs sm:text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Adventure Map</span>
          </button>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Materials Field Journal 📖
            </h1>
          </div>
          <p className="text-[11px] sm:text-xs font-bold text-slate-500">
            Collectible Specimen Cards & Superpower Properties
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-center">
          <AudioNavBarControls showProfile={false} />
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 border-2 border-indigo-300 rounded-2xl text-indigo-900 font-black text-xs shadow-xs">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>{discoveries.length} / {materials.length} Discovered</span>
          </div>
        </div>
      </header>

      {/* ── Main Journal Bento Grid ── */}
      <main className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-6 z-20 mb-12">
        {/* Left: Specimen Index Shelf (5 cols) */}
        <div className="md:col-span-5 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-3xl border-4 border-slate-200 shadow-xl flex flex-col h-[320px] md:h-[580px]">
          {/* Filter Pills */}
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-3 text-xs font-black gap-1 border border-slate-200">
            {(['all', 'natural', 'synthetic'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  sounds.pop();
                  setActiveTab(tab);
                }}
                className={`flex-1 py-1.5 rounded-xl capitalize transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab === 'all' ? 'All' : tab}
              </button>
            ))}
          </div>

          {/* List of Specimens */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredMaterials.map((mat) => {
              const unlocked = discoveries.some((d) => d.materialId === mat.id);
              const isSelected = selectedMaterialId === mat.id;

              return (
                <motion.button
                  key={mat.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    sounds.pop();
                    setSelectedMaterialId(mat.id);
                  }}
                  className={`w-full p-2.5 sm:p-3.5 rounded-2xl border-3 text-left flex items-center gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-100 border-sky-500 shadow-md ring-3 ring-sky-200'
                      : unlocked
                      ? 'bg-white border-emerald-200 hover:bg-emerald-50/40'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-slate-100 flex items-center justify-center p-1.5 flex-shrink-0 shadow-inner">
                    {renderMaterialIcon(mat.id, 'w-full h-full')}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-black text-xs sm:text-sm text-slate-800 truncate">{mat.name}</h3>
                      {unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />}
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {mat.type} • {mat.category}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right: Specimen Showcase Card (7 cols) */}
        <div className="md:col-span-7 bg-white p-5 sm:p-8 rounded-3xl border-4 border-slate-200 shadow-2xl flex flex-col justify-between min-h-[460px] md:h-[580px] overflow-y-auto">
          <div>
            {/* Header with big vector illustration */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-slate-100 mb-5">
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-100 to-sky-100 border-3 border-slate-200 flex items-center justify-center p-2.5 shadow-md flex-shrink-0">
                  {renderMaterialIcon(selectedMaterial.id, 'w-full h-full')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        selectedMaterial.type === 'natural'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {selectedMaterial.type} Material
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 capitalize hidden sm:inline">
                      ({selectedMaterial.category})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <h2
                      className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight"
                      style={{ fontFamily: 'Nunito, sans-serif' }}
                    >
                      {selectedMaterial.name}
                    </h2>
                    <button
                      onClick={handlePronounce}
                      className="p-1.5 rounded-full bg-slate-100 hover:bg-sky-100 text-sky-600 transition-colors cursor-pointer"
                      title="Hear pronunciation"
                    >
                      <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Superpower Properties Grid */}
            <div className="mb-5">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                <span>Superpower Properties</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedMaterial.properties.map((prop, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-50 rounded-2xl border-2 border-slate-200/80 flex items-start gap-2.5 shadow-xs"
                  >
                    <span className="text-xl flex-shrink-0">{prop.icon}</span>
                    <div>
                      <h4 className="text-xs font-black text-slate-800">{prop.name}</h4>
                      <p className="text-[11px] font-bold text-slate-500 leading-snug mt-0.5">
                        {prop.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Everyday Real-World Uses */}
            <div className="mb-4">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Everyday Real-World Uses
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {selectedMaterial.uses.map((use, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-amber-100 border border-amber-300 text-amber-950 text-xs font-black rounded-xl shadow-xs"
                  >
                    {use}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Science Fun Fact Footer */}
          {selectedMaterial.funFact && (
            <div className="p-3.5 bg-emerald-50 rounded-2xl border-2 border-emerald-300 flex items-center gap-2.5 mt-3 shadow-sm">
              <span className="text-2xl">💡</span>
              <p className="text-xs font-bold text-emerald-900 leading-relaxed">
                <span className="font-black">Science Fun Fact:</span> {selectedMaterial.funFact}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
