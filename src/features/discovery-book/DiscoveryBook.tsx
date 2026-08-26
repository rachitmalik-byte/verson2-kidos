import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { materials } from '@/data/materials';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { sounds } from '@/lib/sounds';
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
import { ArrowLeft, BookOpen, Sparkles, CheckCircle2, Lock, Tag, Volume2, Star } from 'lucide-react';

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
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(selectedMaterial.name);
      utterance.pitch = 1.3;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-indigo-200 via-sky-100 to-amber-100 p-4 md:p-8 flex flex-col items-center font-sans relative overflow-x-hidden">
      {/* ── Top Header ── */}
      <header className="w-full max-w-6xl bg-white/95 backdrop-blur-md rounded-3xl border-4 border-slate-200/80 p-4 md:p-6 shadow-xl flex items-center justify-between mb-8 z-20">
        <button
          onClick={() => {
            sounds.pop();
            navigate('/chapter-hub');
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-400 border-2 border-amber-600 shadow-[0_4px_0_#D97706] active:translate-y-1 text-slate-950 font-black text-xs md:text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Adventure Map</span>
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl md:text-3xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Materials Field Journal 📖
            </h1>
          </div>
          <p className="text-xs font-bold text-slate-500">
            Collectible Specimen Cards & Superpower Properties
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-4 py-2 bg-indigo-100 border-2 border-indigo-300 rounded-2xl text-indigo-900 font-black text-xs md:text-sm shadow-xs">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>{discoveries.length} / {materials.length} Discovered</span>
        </div>
      </header>

      {/* ── Main Journal Bento Grid ── */}
      <main className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-6 z-20 mb-12">
        {/* Left: Specimen Index Shelf (5 cols) */}
        <div className="md:col-span-5 bg-white/95 backdrop-blur-md p-5 rounded-3xl border-4 border-slate-200 shadow-xl flex flex-col h-[580px]">
          {/* Filter Pills */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-4 text-xs font-black gap-1 border border-slate-200">
            {(['all', 'natural', 'synthetic'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  sounds.pop();
                  setActiveTab(tab);
                }}
                className={`flex-1 py-2 rounded-xl capitalize transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab === 'all' ? 'All Items' : tab}
              </button>
            ))}
          </div>

          {/* List of Specimens */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {filteredMaterials.map((mat) => {
              const unlocked = discoveries.some((d) => d.materialId === mat.id);
              const isSelected = selectedMaterialId === mat.id;

              return (
                <motion.button
                  key={mat.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    sounds.pop();
                    setSelectedMaterialId(mat.id);
                  }}
                  className={`w-full p-3.5 rounded-2xl border-3 text-left flex items-center gap-3.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-100 border-sky-500 shadow-md ring-4 ring-sky-200'
                      : unlocked
                      ? 'bg-white border-emerald-200 hover:bg-emerald-50/40'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center p-1.5 flex-shrink-0 shadow-inner">
                    {renderMaterialIcon(mat.id, 'w-full h-full')}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-black text-sm text-slate-800 truncate">{mat.name}</h3>
                      {unlocked && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {mat.type} • {mat.category}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right: Specimen Showcase Card (7 cols) */}
        <div className="md:col-span-7 bg-white p-6 md:p-8 rounded-3xl border-4 border-slate-200 shadow-2xl flex flex-col justify-between h-[580px] overflow-y-auto">
          <div>
            {/* Header with big vector illustration */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-slate-100 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-100 to-sky-100 border-3 border-slate-200 flex items-center justify-center p-2.5 shadow-md">
                  {renderMaterialIcon(selectedMaterial.id, 'w-full h-full')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                        selectedMaterial.type === 'natural'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {selectedMaterial.type} Material
                    </span>
                    <span className="text-xs font-bold text-slate-500 capitalize">
                      ({selectedMaterial.category})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <h2
                      className="text-3xl font-black text-slate-900 tracking-tight"
                      style={{ fontFamily: 'Nunito, sans-serif' }}
                    >
                      {selectedMaterial.name}
                    </h2>
                    <button
                      onClick={handlePronounce}
                      className="p-1.5 rounded-full bg-slate-100 hover:bg-sky-100 text-sky-600 transition-colors cursor-pointer"
                      title="Hear pronunciation"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Superpower Properties Grid */}
            <div className="mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                <span>Superpower Properties</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedMaterial.properties.map((prop, i) => (
                  <div
                    key={i}
                    className="p-3.5 bg-slate-50 rounded-2xl border-2 border-slate-200/80 flex items-start gap-3 shadow-xs"
                  >
                    <span className="text-2xl flex-shrink-0">{prop.icon}</span>
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
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2.5">
                Everyday Real-World Uses
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedMaterial.uses.map((use, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 bg-amber-100 border border-amber-300 text-amber-950 text-xs font-black rounded-xl shadow-xs"
                  >
                    {use}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Science Fun Fact Footer */}
          {selectedMaterial.funFact && (
            <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 flex items-center gap-3 mt-4 shadow-sm">
              <span className="text-3xl">💡</span>
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
