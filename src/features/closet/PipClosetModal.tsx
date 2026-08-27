import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Pip } from '@/components/pip/Pip';
import { useProgressStore } from '@/stores/progressStore';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Sparkles, Shirt, Crown, X, Check, Lock, Coins } from 'lucide-react';

interface OutfitItem {
  id: string;
  name: string;
  category: 'outfit' | 'headwear';
  cost: number;
  icon: string;
  desc: string;
}

const OUTFITS: OutfitItem[] = [
  { id: 'lab-coat', name: 'Classic Scientist Coat', category: 'outfit', cost: 0, icon: '🥼', desc: 'Pip’s official white laboratory jacket with pipette pocket!' },
  { id: 'detective', name: 'Detective Trenchcoat', category: 'outfit', cost: 40, icon: '🕵️', desc: 'Double-breasted mystery coat with gold buttons and belt!' },
  { id: 'safari-vest', name: 'Dino Safari Explorer Vest', category: 'outfit', cost: 50, icon: '🦕', desc: 'Khaki field vest with cargo utility pockets and compass!' },
  { id: 'astronaut', name: 'Cosmic Spacesuit', category: 'outfit', cost: 60, icon: '👨‍🚀', desc: 'Polymer-sealed spacesuit built for zero-gravity moonwalks!' },
  { id: 'winter-parka', name: 'Winter Scientist Parka', category: 'outfit', cost: 70, icon: '🧥', desc: 'Acrylic-insulated cozy crimson jacket with fluffy fur collar!' },
  { id: 'gold-champion', name: 'Champion Gold Robe', category: 'outfit', cost: 100, icon: '🏆', desc: 'Pure gleaming gold coat awarded to master materials scientists!' },
];

const HEADWEAR: OutfitItem[] = [
  { id: 'goggles', name: 'Safety Goggles', category: 'headwear', cost: 0, icon: '🥽', desc: 'Impact-resistant polycarbonate laboratory goggles!' },
  { id: 'fedora', name: 'Detective Fedora', category: 'headwear', cost: 30, icon: '🎩', desc: 'Classic mystery investigator fedora with dark ribbon!' },
  { id: 'headphones', name: 'Studio Audio Headset', category: 'headwear', cost: 40, icon: '🎧', desc: 'Cozy cushioned headphones perfect for listening tasks!' },
  { id: 'party-hat', name: 'Festive Carnival Hat', category: 'headwear', cost: 25, icon: '🥳', desc: 'Colorful celebration cone with fluffy golden pompom!' },
  { id: 'visor', name: 'Cyber Neon Visor', category: 'headwear', cost: 45, icon: '🥽✨', desc: 'Glowing digital heads-up display scanning molecules!' },
  { id: 'grad-cap', name: 'Scholar Mortarboard', category: 'headwear', cost: 50, icon: '🎓', desc: 'Prestigious academic cap with golden tassel!' },
  { id: 'crown', name: 'Royal Gold Crown', category: 'headwear', cost: 80, icon: '👑', desc: 'Sparkling royal crown for science royalty!' },
];

export const PipClosetModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const credits = useProgressStore((state) => state.credits);
  const equippedOutfit = useProgressStore((state) => state.equippedOutfit);
  const equippedHeadwear = useProgressStore((state) => state.equippedHeadwear);
  const unlockedOutfits = useProgressStore((state) => state.unlockedOutfits);
  const unlockedHeadwear = useProgressStore((state) => state.unlockedHeadwear);
  const unlockItem = useProgressStore((state) => state.unlockItem);
  const equipOutfit = useProgressStore((state) => state.equipOutfit);
  const equipHeadwear = useProgressStore((state) => state.equipHeadwear);

  const [activeTab, setActiveTab] = useState<'outfits' | 'headwear'>('outfits');
  const [previewOutfit, setPreviewOutfit] = useState<string>(equippedOutfit);
  const [previewHeadwear, setPreviewHeadwear] = useState<string>(equippedHeadwear);

  const items = activeTab === 'outfits' ? OUTFITS : HEADWEAR;

  const handleSelect = (item: OutfitItem) => {
    sounds.pop();
    if (item.category === 'outfit') {
      setPreviewOutfit(item.id);
      if (unlockedOutfits.includes(item.id)) {
        equipOutfit(item.id);
        sounds.sparkle();
        voiceAssistant.speak(`Pip is wearing the ${item.name}!`);
      }
    } else {
      setPreviewHeadwear(item.id);
      if (unlockedHeadwear.includes(item.id)) {
        equipHeadwear(item.id);
        sounds.sparkle();
        voiceAssistant.speak(`Pip equipped ${item.name}!`);
      }
    }
  };

  const handleBuy = (item: OutfitItem) => {
    const success = unlockItem(item.category, item.id, item.cost);
    if (success) {
      sounds.fanfare();
      if (item.category === 'outfit') {
        setPreviewOutfit(item.id);
        equipOutfit(item.id);
      } else {
        setPreviewHeadwear(item.id);
        equipHeadwear(item.id);
      }
      voiceAssistant.speak(`Yay! You unlocked the ${item.name} for Pip!`);
    } else {
      sounds.boing();
      voiceAssistant.speak("You need more PolyCredits! Complete more missions to earn coins!");
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative z-10 bg-white rounded-3xl md:rounded-[36px] border-4 md:border-6 border-pink-400 shadow-2xl flex flex-col max-w-4xl w-full max-h-[90vh] overflow-hidden font-sans"
          >
            {/* Header with Balance */}
            <div className="p-4 md:p-5 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-xs">
                  <Shirt className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black tracking-tight" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Pip's Dressing Room & Wardrobe 🥼✨
                  </h3>
                  <p className="text-xs text-pink-100 font-bold">
                    Spend PolyCredits to customize Pip’s science skins!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Balance Badge */}
                <div className="px-4 py-2 bg-slate-950/40 backdrop-blur-md rounded-2xl border border-white/30 flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-300 animate-pulse" />
                  <span className="font-black text-sm md:text-base text-amber-200">{credits} Credits</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-2xl hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="w-6 h-6 stroke-[3]" />
                </button>
              </div>
            </div>

            {/* Main Content Area: Live Mascot Mirror + Wardrobe Grid */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Live Mirror Preview */}
              <div className="md:col-span-4 bg-gradient-to-b from-sky-50 to-indigo-50 p-6 rounded-3xl border-3 border-indigo-200 flex flex-col items-center justify-center text-center shadow-inner relative">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full mb-3">
                  🪞 Live Dressing Mirror
                </span>
                <div className="my-2 scale-110">
                  <Pip
                    mood="celebrating"
                    size="lg"
                    outfitOverride={previewOutfit}
                    headwearOverride={previewHeadwear}
                    interactive={true}
                  />
                </div>
                <h4 className="font-black text-base text-slate-900 mt-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Pip the Scientist
                </h4>
                <p className="text-xs font-bold text-slate-500 mt-0.5">
                  Tap Pip to test his joyful victory moves!
                </p>
              </div>

              {/* Wardrobe Selector */}
              <div className="md:col-span-8 flex flex-col h-full">
                {/* Category Switcher Tabs */}
                <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl mb-4 self-start">
                  <button
                    onClick={() => {
                      sounds.pop();
                      setActiveTab('outfits');
                    }}
                    className={`px-5 py-2 rounded-xl font-black text-xs md:text-sm flex items-center gap-2 cursor-pointer transition-all ${
                      activeTab === 'outfits'
                        ? 'bg-white text-slate-900 shadow-md scale-102'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Shirt className="w-4 h-4" />
                    <span>Outfits ({OUTFITS.length})</span>
                  </button>
                  <button
                    onClick={() => {
                      sounds.pop();
                      setActiveTab('headwear');
                    }}
                    className={`px-5 py-2 rounded-xl font-black text-xs md:text-sm flex items-center gap-2 cursor-pointer transition-all ${
                      activeTab === 'headwear'
                        ? 'bg-white text-slate-900 shadow-md scale-102'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Crown className="w-4 h-4" />
                    <span>Headwear ({HEADWEAR.length})</span>
                  </button>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto max-h-80 pr-1">
                  {items.map((item) => {
                    const isUnlocked =
                      item.category === 'outfit'
                        ? unlockedOutfits.includes(item.id)
                        : unlockedHeadwear.includes(item.id);
                    const isEquipped =
                      item.category === 'outfit'
                        ? equippedOutfit === item.id
                        : equippedHeadwear === item.id;
                    const canAfford = credits >= item.cost;

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        className={`p-3.5 rounded-2xl border-3 flex items-center justify-between gap-3 cursor-pointer transition-all ${
                          isEquipped
                            ? 'bg-emerald-50 border-emerald-400 shadow-md ring-2 ring-emerald-200'
                            : isUnlocked
                            ? 'bg-white border-slate-200 hover:border-indigo-300'
                            : 'bg-slate-50 border-slate-200 opacity-90'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl p-2 bg-slate-100 rounded-xl">{item.icon}</span>
                          <div className="text-left">
                            <span className="font-black text-xs md:text-sm text-slate-900 block">
                              {item.name}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 block leading-tight">
                              {item.desc}
                            </span>
                          </div>
                        </div>

                        <div>
                          {isEquipped ? (
                            <span className="px-3 py-1 bg-emerald-500 text-white rounded-xl text-[10px] font-black flex items-center gap-1 shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>Equipped</span>
                            </span>
                          ) : isUnlocked ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelect(item);
                              }}
                              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black cursor-pointer shadow-xs shrink-0"
                            >
                              Equip
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBuy(item);
                              }}
                              className={`px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1 cursor-pointer shadow-xs shrink-0 ${
                                canAfford
                                  ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                              }`}
                            >
                              <Lock className="w-3 h-3" />
                              <span>{item.cost} 🪙</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t-2 border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">
                💡 Tip: Complete missions & discovery challenges to earn more PolyCredits!
              </span>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-2xl cursor-pointer shadow-md"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
