import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '@/stores/progressStore';
import { Pip } from '@/components/pip/Pip';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  X,
  Sparkles,
  Shirt,
  Crown,
  Coins,
  Check,
  Lock,
  ShoppingBag,
  RotateCcw,
  Palette,
} from 'lucide-react';

export interface PipOutfitItem {
  id: string;
  name: string;
  category: 'outfit' | 'headwear';
  icon: string;
  cost: number;
  description: string;
  tag: string;
}

export const PIP_OUTFITS: PipOutfitItem[] = [
  { id: 'lab-coat', name: 'Master Science Coat', category: 'outfit', icon: '🥼', cost: 0, description: 'Classic lab coat with test tube & red pen pocket!', tag: 'Free Starter' },
  { id: 'astronaut', name: 'Zero-G Space Habitat Suit', category: 'outfit', icon: '👨‍🚀', cost: 50, description: 'Sunita Williams space suit with live telemetry computer!', tag: 'Space Science' },
  { id: 'winter-parka', name: '5,000m Ladakh Sherpa Puffer', category: 'outfit', icon: '🧥', cost: 60, description: 'Insulated yak-wool fleece coat for freezing altitudes!', tag: 'Mountains' },
  { id: 'gold-champion', name: 'Champion Gold Tunic', category: 'outfit', icon: '🏆', cost: 100, description: 'Gleaming gold medals for master experimenters!', tag: 'Rare Reward' },
  { id: 'detective', name: 'Mystery Sleuth Trenchcoat', category: 'outfit', icon: '🕵️‍♂️', cost: 60, description: 'Tweed double-breasted coat with brass buckle!', tag: 'Investigation' },
  { id: 'safari-vest', name: 'Dino Safari Explorer Vest', category: 'outfit', icon: '🦕', cost: 50, description: 'Field pockets for fossils and specimen tools!', tag: 'Living World' },
  { id: 'scuba-suit', name: 'Aquatic Deep-Sea Neoprene', category: 'outfit', icon: '🤿', cost: 70, description: 'Waterproof diving wet suit with neon oxygen strip!', tag: 'Water Science' },
  { id: 'royal-cape', name: 'Golconda Royal Velvet Cape', category: 'outfit', icon: '👑', cost: 80, description: 'Gold trim cape with royal ruby crest!', tag: 'Fort Architect' },
  { id: 'superhero', name: 'Polymer Hero Lightning Suit', category: 'outfit', icon: '⚡', cost: 90, description: 'Super-tensile synthetic fiber cape with lightning power!', tag: 'Superpowers' },
  { id: 'raincoat-yellow', name: 'Waterproof Yellow Slicker', category: 'outfit', icon: '🌧️', cost: 40, description: 'Water-repellent polyester raincoat for heavy downpours!', tag: 'Waterproof' },
  { id: 'cyber-armor', name: 'Neo-Cyber Tech Suit', category: 'outfit', icon: '🤖', cost: 120, description: 'Glowing cybernetic arc reactor with tech plating!', tag: 'AI Future' },
  { id: 'ninja-gi', name: 'Shadow Science Karate Gi', category: 'outfit', icon: '🥋', cost: 60, description: 'Stealth black gi with dragon red sash!', tag: 'Precision' },
];

export const PIP_HEADWEAR: PipOutfitItem[] = [
  { id: 'goggles', name: 'Cyan Safety Goggles', category: 'headwear', icon: '🥽', cost: 0, description: 'Anti-chemical splash tinted safety spectacles!', tag: 'Free Starter' },
  { id: 'visor', name: 'Cyber Hologram Visor', category: 'headwear', icon: '⚡', cost: 40, description: 'HUD display for analyzing molecular chains!', tag: 'Cyber' },
  { id: 'grad-cap', name: 'Young Scholar Mortarboard', category: 'headwear', icon: '🎓', cost: 50, description: 'Gold tassel cap for graduation excellence!', tag: 'Academic' },
  { id: 'crown', name: 'Emerald & Ruby Gem Crown', category: 'headwear', icon: '👑', cost: 90, description: 'Fit for a royal science explorer!', tag: 'Royal' },
  { id: 'party-hat', name: 'Celebration Birthday Cone', category: 'headwear', icon: '🎉', cost: 30, description: 'Party stripes with golden pom-pom!', tag: 'Party' },
  { id: 'fedora', name: 'Vintage Detective Fedora', category: 'headwear', icon: '🕵️', cost: 40, description: 'Tweed hat for mystery deductions!', tag: 'Detective' },
  { id: 'headphones', name: 'Noise-Canceling DJ Headset', category: 'headwear', icon: '🎧', cost: 40, description: 'Ultra-bass sound listening gear!', tag: 'Audio' },
  { id: 'snorkel', name: 'Scuba Mask & Snorkel Tube', category: 'headwear', icon: '🤿', cost: 50, description: 'Breathe underwater while watching fish!', tag: 'Water' },
  { id: 'astronaut-helmet', name: 'Gold Reflective Space Visor', category: 'headwear', icon: '🚀', cost: 70, description: 'Sealed bubble helmet for spacewalks!', tag: 'Space' },
  { id: 'fur-hat', name: 'Ladakh Fur Ushanka Hat', category: 'headwear', icon: '🏔️', cost: 50, description: 'Fluffy ear flaps to protect from -40°C mountain winds!', tag: 'Ladakh' },
  { id: 'ninja-headband', name: 'Crimson Dragon Headband', category: 'headwear', icon: '🥋', cost: 40, description: 'Flying ties for rapid scientific reflexes!', tag: 'Ninja' },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PipWardrobeShopModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'outfits' | 'headwear'>('outfits');
  const [previewOutfit, setPreviewOutfit] = useState<string | null>(null);
  const [previewHeadwear, setPreviewHeadwear] = useState<string | null>(null);

  const {
    credits,
    equippedOutfit,
    equippedHeadwear,
    unlockedOutfits,
    unlockedHeadwear,
    equipOutfit,
    equipHeadwear,
    unlockItem,
    addCredits,
  } = useProgressStore();

  const currentActiveOutfit = previewOutfit || equippedOutfit || 'lab-coat';
  const currentActiveHeadwear = previewHeadwear || equippedHeadwear || 'goggles';

  const handleSelectItem = (item: PipOutfitItem) => {
    sounds.pop();
    if (item.category === 'outfit') {
      setPreviewOutfit(item.id);
    } else {
      setPreviewHeadwear(item.id);
    }
  };

  const handleEquipOrBuy = (item: PipOutfitItem) => {
    const isOutfit = item.category === 'outfit';
    const isUnlocked = isOutfit
      ? unlockedOutfits.includes(item.id) || item.cost === 0
      : unlockedHeadwear.includes(item.id) || item.cost === 0;

    if (isUnlocked) {
      // Equip directly
      sounds.sparkle();
      if (isOutfit) {
        equipOutfit(item.id);
        setPreviewOutfit(item.id);
      } else {
        equipHeadwear(item.id);
        setPreviewHeadwear(item.id);
      }
      voiceAssistant.speak(`Equipped ${item.name}! Looking brilliant!`);
    } else {
      // Buy
      if (credits >= item.cost) {
        const success = unlockItem(isOutfit ? 'outfit' : 'headwear', item.id, item.cost);
        if (success) {
          sounds.fanfare();
          if (isOutfit) {
            equipOutfit(item.id);
            setPreviewOutfit(item.id);
          } else {
            equipHeadwear(item.id);
            setPreviewHeadwear(item.id);
          }
          voiceAssistant.speak(`Unlocked and equipped ${item.name}! Amazing style!`);
        }
      } else {
        sounds.boing();
        voiceAssistant.speak(`You need ${item.cost - credits} more science coins! Complete missions to earn more!`);
      }
    }
  };

  if (!isOpen) return null;

  const itemsToShow = activeTab === 'outfits' ? PIP_OUTFITS : PIP_HEADWEAR;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm font-sans select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="w-full max-w-4xl bg-white rounded-3xl sm:rounded-[36px] border-4 border-pink-400 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Top Bar */}
          <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 p-4 sm:p-6 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
                <Shirt className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-pink-300 text-pink-950 px-2.5 py-0.5 rounded-full">
                  Mascot Dressing Room & Shop
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Pip's Wardrobe & Skins 🥼👑✨
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 bg-amber-400 text-slate-950 rounded-2xl font-black text-xs flex items-center gap-1.5 shadow-md">
                <Coins className="w-4 h-4 text-amber-900 fill-amber-700" />
                <span>{credits} Coins</span>
              </div>

              <button
                onClick={onClose}
                className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-2xl cursor-pointer transition-all active:scale-95"
              >
                <X className="w-5 h-5 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Body Content (Split View: Left Mascot Stage, Right Wardrobe Shelf) */}
          <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
            {/* ── Left Preview Stage (5 Cols) ── */}
            <div className="md:col-span-5 bg-gradient-to-b from-purple-50 via-pink-50 to-amber-50 p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r-2 border-slate-200">
              <span className="text-xs font-black uppercase tracking-wider text-purple-900 bg-purple-100 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                Live Mascot Preview
              </span>

              {/* Pip Avatar Stage */}
              <div className="my-4 relative flex items-center justify-center p-4 bg-white/80 rounded-3xl border-2 border-purple-200 shadow-inner w-56 h-56">
                <Pip
                  size="xl"
                  outfitOverride={currentActiveOutfit}
                  headwearOverride={currentActiveHeadwear}
                  interactive={true}
                />
              </div>

              {/* Active Style Labels */}
              <div className="w-full text-center space-y-1">
                <div className="text-xs font-black text-slate-800">
                  Outfit: <span className="text-purple-700 font-extrabold">{PIP_OUTFITS.find((o) => o.id === currentActiveOutfit)?.name || 'Default'}</span>
                </div>
                <div className="text-xs font-black text-slate-800">
                  Headwear: <span className="text-pink-600 font-extrabold">{PIP_HEADWEAR.find((h) => h.id === currentActiveHeadwear)?.name || 'Default'}</span>
                </div>
              </div>

              {/* Reset to Equipped */}
              {(previewOutfit || previewHeadwear) && (
                <button
                  onClick={() => {
                    sounds.pop();
                    setPreviewOutfit(null);
                    setPreviewHeadwear(null);
                  }}
                  className="mt-3 text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Preview</span>
                </button>
              )}
            </div>

            {/* ── Right Shelf & Grid (7 Cols) ── */}
            <div className="md:col-span-7 p-4 sm:p-6 flex flex-col overflow-hidden bg-slate-50">
              {/* Category Tabs */}
              <div className="flex items-center gap-2 mb-4 bg-slate-200/80 p-1.5 rounded-2xl">
                <button
                  onClick={() => {
                    sounds.pop();
                    setActiveTab('outfits');
                  }}
                  className={`flex-1 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    activeTab === 'outfits'
                      ? 'bg-white text-pink-600 shadow-md ring-2 ring-pink-300'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Shirt className="w-4 h-4" />
                  <span>Outfits ({PIP_OUTFITS.length})</span>
                </button>

                <button
                  onClick={() => {
                    sounds.pop();
                    setActiveTab('headwear');
                  }}
                  className={`flex-1 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    activeTab === 'headwear'
                      ? 'bg-white text-pink-600 shadow-md ring-2 ring-pink-300'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Crown className="w-4 h-4" />
                  <span>Hats & Gear ({PIP_HEADWEAR.length})</span>
                </button>
              </div>

              {/* Item Cards Grid */}
              <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 pr-1">
                {itemsToShow.map((item) => {
                  const isOutfit = item.category === 'outfit';
                  const isUnlocked = isOutfit
                    ? unlockedOutfits.includes(item.id) || item.cost === 0
                    : unlockedHeadwear.includes(item.id) || item.cost === 0;

                  const isEquipped = isOutfit ? equippedOutfit === item.id : equippedHeadwear === item.id;
                  const isPreviewing = isOutfit ? currentActiveOutfit === item.id : currentActiveHeadwear === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        isPreviewing
                          ? 'bg-pink-50 border-pink-500 ring-2 ring-pink-300 shadow-md'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-2xl">{item.icon}</span>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            {item.tag}
                          </span>
                        </div>

                        <h4 className="font-black text-xs sm:text-sm text-slate-900 leading-tight">
                          {item.name}
                        </h4>
                        <p className="text-[11px] font-bold text-slate-500 mt-1 line-clamp-2 leading-snug">
                          {item.description}
                        </p>
                      </div>

                      {/* Bottom Action Button */}
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                        {isEquipped ? (
                          <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Equipped</span>
                          </span>
                        ) : isUnlocked ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEquipOrBuy(item);
                            }}
                            className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer active:scale-95"
                          >
                            Equip 🪄
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEquipOrBuy(item);
                            }}
                            className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs ${
                              credits >= item.cost
                                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            <Coins className="w-3.5 h-3.5" />
                            <span>{item.cost} Coins</span>
                          </button>
                        )}

                        <span className="text-[10px] font-bold text-slate-400">
                          {isUnlocked ? 'Unlocked ✓' : `Cost: ${item.cost} 🪙`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
