import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Sparkles, Thermometer, Droplets, Utensils, RotateCcw, Play } from 'lucide-react';

interface Props {
  onCompleted?: () => void;
}

export const ThreeDigestionLab: React.FC<Props> = ({ onCompleted }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'tongue' | 'stomach'>('tongue');
  const [selectedTaste, setSelectedTaste] = useState<'sweet' | 'salty' | 'sour' | 'bitter'>('sweet');

  // Dr. Beaumont Stomach State
  const [temperature, setTemperature] = useState<number>(37); // 37 C
  const [digestionProgress, setDigestionProgress] = useState<number>(0);
  const [isDigestActive, setIsDigestActive] = useState<boolean>(false);

  const TASTE_ZONES = {
    sweet: { name: 'Sweet (Tip)', food: '🍯 Honey & Ripe Mango', colorHex: 0xf43f5e, glowColor: 0xff758f, desc: 'Sweet receptors at the tip respond to energy-rich simple sugars and glucose.' },
    salty: { name: 'Salty (Front Sides)', food: '🥨 Salt Crystals & Pretzels', colorHex: 0x0ea5e9, glowColor: 0x38bdf8, desc: 'Salty receptors detect essential mineral electrolytes like sodium chloride.' },
    sour: { name: 'Sour (Back Sides)', food: '🍋 Fresh Lemon & Raw Mango', colorHex: 0xeab308, glowColor: 0xfacc15, desc: 'Sour receptors detect hydrogen ions (acidity) to judge food freshness.' },
    bitter: { name: 'Bitter (Deep Posterior)', food: '☕ Neem Leaves & Dark Cocoa', colorHex: 0x10b981, glowColor: 0x34d399, desc: 'Bitter receptors deep at the back warn against toxic natural poisons.' },
  };

  const handleSelectTaste = (taste: 'sweet' | 'salty' | 'sour' | 'bitter') => {
    sounds.pop();
    setSelectedTaste(taste);
    const spec = TASTE_ZONES[taste];
    voiceAssistant.speak(`${spec.name}: Sensitive to ${spec.food}. ${spec.desc}`);
  };

  const handleStartDigestion = () => {
    sounds.bubble();
    setIsDigestActive(true);
    setDigestionProgress(0);

    const interval = setInterval(() => {
      setDigestionProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          sounds.fanfare();
          voiceAssistant.speak(
            'Dr. Beaumont Discovery: At 37°C, hydrochloric acid and digestive enzymes chemically liquefy solid food into nutrient-rich chyme within 2 hours!'
          );
          if (onCompleted) onCompleted();
          return 100;
        }
        return prev + 15;
      });
    }, 400);
  };

  const handleReset = () => {
    sounds.pop();
    setIsDigestActive(false);
    setDigestionProgress(0);
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 400;

    // 1. Scene & Studio Lighting
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Deep Slate Lab

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.5, 9.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    const topLight = new THREE.DirectionalLight(0xfffbeb, 2.5);
    topLight.position.set(6, 12, 8);
    scene.add(topLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 2.5, 12);
    rimLight.position.set(-4, 2, 4);
    scene.add(rimLight);

    // ═════════════════════════════════════════════════════════════════════════
    // MODE 1: 3D ANATOMICAL TONGUE WITH TASTE PAPILLAE
    // ═════════════════════════════════════════════════════════════════════════
    const tongueGroup = new THREE.Group();
    if (activeTab === 'tongue') {
      scene.add(tongueGroup);

      // Anatomical Tongue Shape (Subtle curved organic form)
      const tongueGeo = new THREE.CylinderGeometry(2.0, 2.4, 4.0, 32, 16);
      tongueGeo.scale(1.2, 0.35, 1.4);
      tongueGeo.rotateX(Math.PI / 8);

      const tongueMat = new THREE.MeshStandardMaterial({
        color: 0xf472b6, // Healthy pink tongue
        roughness: 0.5,
        metalness: 0.1,
      });
      const tongueMesh = new THREE.Mesh(tongueGeo, tongueMat);
      tongueGroup.add(tongueMesh);

      // Central Median Sulcus Groove
      const grooveGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.2, 8);
      const grooveMat = new THREE.MeshStandardMaterial({ color: 0xdb2777 });
      const groove = new THREE.Mesh(grooveGeo, grooveMat);
      groove.rotation.x = Math.PI / 2.3;
      groove.position.set(0, 0.38, 0);
      tongueGroup.add(groove);

      // Glowing Taste Receptor Zone Highlight
      const activeZoneGeo = new THREE.SphereGeometry(0.7, 16, 16);
      const activeZoneMat = new THREE.MeshStandardMaterial({
        color: TASTE_ZONES[selectedTaste].colorHex,
        emissive: TASTE_ZONES[selectedTaste].glowColor,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.85,
      });

      // Position zone based on taste biology
      let zx = 0, zy = 0.4, zz = 1.4;
      if (selectedTaste === 'sweet') {
        zx = 0; zz = 1.6; // Tip
      } else if (selectedTaste === 'salty') {
        zx = 1.3; zz = 0.8; // Front Sides
      } else if (selectedTaste === 'sour') {
        zx = 1.4; zz = -0.5; // Back Sides
      } else {
        zx = 0; zz = -1.2; // Posterior Bitter
      }

      const zoneMesh1 = new THREE.Mesh(activeZoneGeo, activeZoneMat);
      zoneMesh1.scale.set(1.0, 0.3, 0.8);
      zoneMesh1.position.set(zx, zy, zz);
      tongueGroup.add(zoneMesh1);

      if (selectedTaste === 'salty' || selectedTaste === 'sour') {
        const zoneMesh2 = new THREE.Mesh(activeZoneGeo, activeZoneMat);
        zoneMesh2.scale.set(1.0, 0.3, 0.8);
        zoneMesh2.position.set(-zx, zy, zz);
        tongueGroup.add(zoneMesh2);
      }

      // 40+ Individual Microscopic Papillae Bumps
      const papillaGeo = new THREE.SphereGeometry(0.06, 8, 8);
      const papillaMat = new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.3 });
      for (let i = 0; i < 45; i++) {
        const p = new THREE.Mesh(papillaGeo, papillaMat);
        const px = (Math.random() - 0.5) * 2.8;
        const pz = (Math.random() - 0.5) * 2.6;
        p.position.set(px, 0.42, pz);
        tongueGroup.add(p);
      }
    }

    // ═════════════════════════════════════════════════════════════════════════
    // MODE 2: DR. WILLIAM BEAUMONT'S 3D GASTRIC FLASK LAB (1822)
    // ═════════════════════════════════════════════════════════════════════════
    const stomachGroup = new THREE.Group();
    if (activeTab === 'stomach') {
      scene.add(stomachGroup);

      // Glass Erlenmeyer Digestion Flask
      const flaskGeo = new THREE.CylinderGeometry(0.8, 2.6, 4.2, 24);
      const flaskMat = new THREE.MeshStandardMaterial({
        color: 0x93c5fd,
        transparent: true,
        opacity: 0.4,
        roughness: 0.1,
        metalness: 0.1,
      });
      const flaskMesh = new THREE.Mesh(flaskGeo, flaskMat);
      stomachGroup.add(flaskMesh);

      // Liquid Gastric Acid Volume (Hydrochloric Acid pH 1.5)
      const fluidGeo = new THREE.CylinderGeometry(1.2, 2.4, 2.2, 24);
      const fluidMat = new THREE.MeshStandardMaterial({
        color: 0x10b981, // Emerald green stomach enzyme juice
        emissive: 0x059669,
        emissiveIntensity: 0.3,
        roughness: 0.2,
      });
      const fluidMesh = new THREE.Mesh(fluidGeo, fluidMat);
      fluidMesh.position.y = -1.0;
      stomachGroup.add(fluidMesh);

      // Floating Solid Food Chunk (Dissolving / Liquefying Chyme)
      const scaleFactor = Math.max(0.2, 1.0 - (digestionProgress / 100) * 0.75);
      const foodGeo = new THREE.DodecahedronGeometry(0.75);
      foodGeo.scale(scaleFactor, scaleFactor, scaleFactor);
      const foodMat = new THREE.MeshStandardMaterial({
        color: digestionProgress > 60 ? 0x84cc16 : 0xd97706, // Roti turning to soft chyme
        roughness: 0.7,
      });
      const foodMesh = new THREE.Mesh(foodGeo, foodMat);
      foodMesh.position.set(0, -0.9, 0);
      stomachGroup.add(foodMesh);

      // Rising Chemical Acid Micro-Bubbles
      const bubbleGeo = new THREE.SphereGeometry(0.08, 8, 8);
      const bubbleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      for (let b = 0; b < 12; b++) {
        const bm = new THREE.Mesh(bubbleGeo, bubbleMat);
        bm.position.set(
          (Math.random() - 0.5) * 1.6,
          -1.8 + Math.random() * 1.6,
          (Math.random() - 0.5) * 1.6
        );
        stomachGroup.add(bm);
      }
    }

    // 60 FPS Fluid Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (activeTab === 'tongue') {
        tongueGroup.rotation.y = Math.sin(elapsed * 1.2) * 0.15;
        tongueGroup.position.y = Math.sin(elapsed * 2.0) * 0.05;
      } else {
        stomachGroup.rotation.y = elapsed * 0.4;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [activeTab, selectedTaste, digestionProgress]);

  return (
    <div className="w-full bg-slate-900 text-white rounded-3xl border-3 border-orange-400 p-4 sm:p-6 shadow-2xl flex flex-col gap-4 font-sans select-none">
      {/* Tab Switcher: 3D Tongue vs Dr. Beaumont Stomach */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-orange-400 bg-orange-400/10 border border-orange-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>3D Digestive Physiology Lab</span>
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-black text-white mt-1">
            {activeTab === 'tongue'
              ? '👅 Anatomical Tongue 4-Zone Taste Papillae Map'
              : '🧪 Dr. William Beaumont 37°C Gastric Digestion Flask (1822)'}
          </h4>
        </div>

        <div className="flex gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => {
              sounds.pop();
              setActiveTab('tongue');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'tongue'
                ? 'bg-orange-500 text-white shadow-md scale-105'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            👅 3D Tongue Taste Map
          </button>
          <button
            onClick={() => {
              sounds.pop();
              setActiveTab('stomach');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'stomach'
                ? 'bg-emerald-500 text-white shadow-md scale-105'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🧪 Dr. Beaumont Stomach Flask
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden relative bg-slate-950 border border-slate-700 shadow-inner"
      />

      {/* Interactive Controls per Mode */}
      {activeTab === 'tongue' ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full pt-1">
          {(Object.keys(TASTE_ZONES) as (keyof typeof TASTE_ZONES)[]).map((key) => {
            const isSelected = selectedTaste === key;
            return (
              <button
                key={key}
                onClick={() => handleSelectTaste(key)}
                className={`p-3 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-white text-slate-950 border-orange-400 shadow-lg scale-102 ring-2 ring-orange-300'
                    : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span className="text-xs font-black block">{TASTE_ZONES[key].name}</span>
                <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{TASTE_ZONES[key].food}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/90 p-4 rounded-2xl border border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-black text-white">Body Core Temperature: 37°C (98.6°F)</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
              Gastric Hydrochloric Acid (pH 1.5) + Salivary Amylase Enzyme Liquefaction: {digestionProgress}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStartDigestion}
              disabled={isDigestActive && digestionProgress < 100}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Simulate Gastric Digestion</span>
            </button>

            {digestionProgress > 0 && (
              <button
                onClick={handleReset}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl cursor-pointer"
                title="Reset experiment"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
