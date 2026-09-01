import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Sparkles, Thermometer, RotateCcw, Play, Utensils } from 'lucide-react';

interface Props {
  onCompleted?: () => void;
}

export const ThreeDigestionLab: React.FC<Props> = ({ onCompleted }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'tongue' | 'stomach'>('tongue');
  const [selectedTaste, setSelectedTaste] = useState<'sweet' | 'salty' | 'sour' | 'bitter'>('sweet');

  // Stomach state
  const [digestionProgress, setDigestionProgress] = useState<number>(0);
  const [isDigestActive, setIsDigestActive] = useState<boolean>(false);

  const TASTE_ZONES = {
    sweet: {
      name: '1. Sweet Zone (Tip)',
      food: '🍯 Honey & Sugar',
      colorHex: 0xf43f5e,
      glowHex: 0xfb7185,
      desc: 'The tip of the tongue is packed with fungiform papillae that detect carbohydrates & quick energy sugars!',
    },
    salty: {
      name: '2. Salty Zone (Front Sides)',
      food: '🥨 Salt Crystals',
      colorHex: 0x0284c7,
      glowHex: 0x38bdf8,
      desc: 'Front lateral borders detect sodium and essential electrolyte minerals needed for nerve signals!',
    },
    sour: {
      name: '3. Sour Zone (Back Sides)',
      food: '🍋 Lemon & Tamarind',
      colorHex: 0xeab308,
      glowHex: 0xfde047,
      desc: 'Rear lateral edges detect acidity and hydrogen ions to evaluate food freshness and vitamin C!',
    },
    bitter: {
      name: '4. Bitter Zone (Deep Back)',
      food: '☕ Neem & Cocoa',
      colorHex: 0x10b981,
      glowHex: 0x4ade80,
      desc: 'The posterior base contains circumvallate papillae that detect natural plant alkaloids and toxins to prevent poisoning!',
    },
  };

  const handleSelectTaste = (taste: 'sweet' | 'salty' | 'sour' | 'bitter') => {
    sounds.pop();
    setSelectedTaste(taste);
    const spec = TASTE_ZONES[taste];
    voiceAssistant.speak(`${spec.name}: ${spec.food}. ${spec.desc}`);
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
            'Dr. Beaumont 1822 Discovery: At body temperature (37°C), gastric acid and enzymes dissolve solid bread and meat into liquid chyme in 2 hours!'
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
    const height = container.clientHeight || 420;

    // 1. Scene & Warm Laboratory Lighting
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1329); // Dark rich scientific slate

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 4.2, 8.5);
    camera.lookAt(0, -0.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);

    // Warm directional & ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffedd5, 2.8);
    sunLight.position.set(8, 14, 10);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const blueLight = new THREE.PointLight(0x38bdf8, 2.5, 12);
    blueLight.position.set(-4, 2, 4);
    scene.add(blueLight);

    // ═════════════════════════════════════════════════════════════════════════
    // MODE 1: SCULPTED 3D ANATOMICAL TONGUE & LOWER JAW
    // ═════════════════════════════════════════════════════════════════════════
    const mouthGroup = new THREE.Group();
    if (activeTab === 'tongue') {
      scene.add(mouthGroup);

      // 1. Lower Jaw Oral Cavity Base (Dark red mouth floor)
      const mouthFloorGeo = new THREE.CylinderGeometry(2.8, 3.2, 0.6, 32);
      const mouthFloorMat = new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.6 });
      const mouthFloor = new THREE.Mesh(mouthFloorGeo, mouthFloorMat);
      mouthFloor.position.set(0, -0.8, -0.5);
      mouthGroup.add(mouthFloor);

      // 2. White Teeth Dental Arch (U-shaped white teeth row along the front & sides)
      const toothMat = new THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.2, metalness: 0.1 });
      for (let angle = -120; angle <= 120; angle += 16) {
        const rad = THREE.MathUtils.degToRad(angle);
        const tx = Math.sin(rad) * 2.3;
        const tz = Math.cos(rad) * 2.1 - 0.5;
        if (tz > -0.8) {
          const toothGeo = new THREE.BoxGeometry(0.24, 0.45, 0.28);
          const tooth = new THREE.Mesh(toothGeo, toothMat);
          tooth.position.set(tx, -0.3, tz);
          tooth.rotation.y = -rad;
          mouthGroup.add(tooth);
        }
      }

      // 3. Realistic Anatomical Sculpted Tongue (Parametric Loft / Extrusion)
      // Custom shape for the human tongue: narrow at back, broad in middle, rounded tapered tip at front!
      const tongueShape = new THREE.Shape();
      tongueShape.moveTo(-0.9, -1.8); // Back left
      tongueShape.quadraticCurveTo(-1.5, 0.0, -1.3, 1.2); // Mid left bulge
      tongueShape.quadraticCurveTo(-0.8, 2.3, 0.0, 2.5); // Tip apex
      tongueShape.quadraticCurveTo(0.8, 2.3, 1.3, 1.2); // Mid right bulge
      tongueShape.quadraticCurveTo(1.5, 0.0, 0.9, -1.8); // Back right
      tongueShape.quadraticCurveTo(0.0, -2.0, -0.9, -1.8); // Back root

      const extrudeSettings = {
        depth: 0.45,
        bevelEnabled: true,
        bevelSegments: 8,
        steps: 2,
        bevelSize: 0.2,
        bevelThickness: 0.18,
      };

      const tongueGeo = new THREE.ExtrudeGeometry(tongueShape, extrudeSettings);
      tongueGeo.rotateX(-Math.PI / 2); // Lay flat on horizontal plane
      tongueGeo.center();

      const tongueMat = new THREE.MeshStandardMaterial({
        color: 0xf472b6, // Soft healthy pink
        roughness: 0.45,
        metalness: 0.05,
      });
      const tongueMesh = new THREE.Mesh(tongueGeo, tongueMat);
      tongueMesh.position.set(0, -0.35, 0.2);
      mouthGroup.add(tongueMesh);

      // 4. Central Median Sulcus Groove (Cleft down center of tongue)
      const grooveCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.15, -1.4),
        new THREE.Vector3(0, -0.12, 0.2),
        new THREE.Vector3(0, -0.16, 1.2),
      ]);
      const grooveGeo = new THREE.TubeGeometry(grooveCurve, 20, 0.05, 8, false);
      const grooveMat = new THREE.MeshStandardMaterial({ color: 0xbe185d, roughness: 0.8 });
      const groove = new THREE.Mesh(grooveGeo, grooveMat);
      mouthGroup.add(groove);

      // 5. 60+ Microscopic Taste Papillae (Tiny textured taste buds)
      const papillaGeo = new THREE.SphereGeometry(0.05, 6, 6);
      const papillaMat = new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.3 });
      for (let i = 0; i < 50; i++) {
        const p = new THREE.Mesh(papillaGeo, papillaMat);
        const px = (Math.random() - 0.5) * 1.8;
        const pz = (Math.random() - 0.5) * 2.6 + 0.2;
        p.position.set(px, -0.12, pz);
        mouthGroup.add(p);
      }

      // 6. Glowing Active Taste Receptor Zones
      const currentZone = TASTE_ZONES[selectedTaste];
      const zoneGeo = new THREE.SphereGeometry(0.45, 16, 16);
      zoneGeo.scale(1.0, 0.25, 1.0);
      const zoneMat = new THREE.MeshStandardMaterial({
        color: currentZone.colorHex,
        emissive: currentZone.glowHex,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.88,
      });

      if (selectedTaste === 'sweet') {
        // Tip of the tongue
        const zTip = new THREE.Mesh(zoneGeo, zoneMat);
        zTip.position.set(0, -0.1, 1.3);
        zTip.scale.set(1.4, 0.3, 0.8);
        mouthGroup.add(zTip);
      } else if (selectedTaste === 'salty') {
        // Front lateral edges
        const zLeft = new THREE.Mesh(zoneGeo, zoneMat);
        zLeft.position.set(-0.85, -0.1, 0.6);
        zLeft.scale.set(0.7, 0.3, 1.1);
        mouthGroup.add(zLeft);

        const zRight = new THREE.Mesh(zoneGeo, zoneMat);
        zRight.position.set(0.85, -0.1, 0.6);
        zRight.scale.set(0.7, 0.3, 1.1);
        mouthGroup.add(zRight);
      } else if (selectedTaste === 'sour') {
        // Rear lateral edges
        const zLeft = new THREE.Mesh(zoneGeo, zoneMat);
        zLeft.position.set(-0.95, -0.1, -0.4);
        zLeft.scale.set(0.7, 0.3, 1.1);
        mouthGroup.add(zLeft);

        const zRight = new THREE.Mesh(zoneGeo, zoneMat);
        zRight.position.set(0.95, -0.1, -0.4);
        zRight.scale.set(0.7, 0.3, 1.1);
        mouthGroup.add(zRight);
      } else {
        // Bitter deep posterior (back of tongue)
        const zBack = new THREE.Mesh(zoneGeo, zoneMat);
        zBack.position.set(0, -0.1, -1.1);
        zBack.scale.set(1.6, 0.3, 0.9);
        mouthGroup.add(zBack);
      }
    }

    // ═════════════════════════════════════════════════════════════════════════
    // MODE 2: DR. WILLIAM BEAUMONT 37°C GASTRIC FLASK
    // ═════════════════════════════════════════════════════════════════════════
    const stomachGroup = new THREE.Group();
    if (activeTab === 'stomach') {
      scene.add(stomachGroup);

      // Glass Erlenmeyer Flask
      const flaskGeo = new THREE.CylinderGeometry(0.8, 2.6, 4.2, 32);
      const flaskMat = new THREE.MeshStandardMaterial({
        color: 0x93c5fd,
        transparent: true,
        opacity: 0.35,
        roughness: 0.1,
        metalness: 0.2,
      });
      const flaskMesh = new THREE.Mesh(flaskGeo, flaskMat);
      stomachGroup.add(flaskMesh);

      // Gastric Digestive Acid (pH 1.5)
      const acidGeo = new THREE.CylinderGeometry(1.1, 2.4, 2.2, 32);
      const acidMat = new THREE.MeshStandardMaterial({
        color: 0x10b981, // Emerald green stomach juices
        emissive: 0x059669,
        emissiveIntensity: 0.3,
        roughness: 0.2,
      });
      const acidMesh = new THREE.Mesh(acidGeo, acidMat);
      acidMesh.position.y = -1.0;
      stomachGroup.add(acidMesh);

      // Dissolving Solid Food Chunk (Roti bread / meat)
      const scaleFactor = Math.max(0.2, 1.0 - (digestionProgress / 100) * 0.8);
      const foodGeo = new THREE.DodecahedronGeometry(0.7);
      foodGeo.scale(scaleFactor, scaleFactor, scaleFactor);
      const foodMat = new THREE.MeshStandardMaterial({
        color: digestionProgress > 50 ? 0xa3e635 : 0xd97706,
        roughness: 0.8,
      });
      const foodMesh = new THREE.Mesh(foodGeo, foodMat);
      foodMesh.position.set(0, -0.9, 0);
      stomachGroup.add(foodMesh);

      // Rising Chemical Acid Bubbles
      const bubbleGeo = new THREE.SphereGeometry(0.07, 8, 8);
      const bubbleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      for (let b = 0; b < 14; b++) {
        const bm = new THREE.Mesh(bubbleGeo, bubbleMat);
        bm.position.set(
          (Math.random() - 0.5) * 1.6,
          -1.8 + Math.random() * 1.6,
          (Math.random() - 0.5) * 1.6
        );
        stomachGroup.add(bm);
      }
    }

    // 60 FPS Smooth Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (activeTab === 'tongue') {
        // Gentle breathing movement & subtle tilt so the full tongue is crystal clear
        mouthGroup.rotation.y = Math.sin(elapsed * 1.2) * 0.12;
        mouthGroup.rotation.x = 0.25 + Math.sin(elapsed * 1.5) * 0.04;
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
      {/* Header & Mode Switchers */}
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
              ? '👅 Anatomical Human Tongue & 4-Zone Taste Map'
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
        className="w-full h-[340px] sm:h-[400px] rounded-2xl overflow-hidden relative bg-slate-950 border border-slate-700 shadow-inner"
      />

      {/* Interactive Controls */}
      {activeTab === 'tongue' ? (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
            Tap a Flavor to Illuminate its Exact Taste Receptor Zone:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
            {(Object.keys(TASTE_ZONES) as (keyof typeof TASTE_ZONES)[]).map((key) => {
              const isSelected = selectedTaste === key;
              const zone = TASTE_ZONES[key];
              return (
                <button
                  key={key}
                  onClick={() => handleSelectTaste(key)}
                  className={`p-3 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white text-slate-950 border-orange-400 shadow-lg scale-102 ring-2 ring-orange-300 font-black'
                      : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xs font-black block">{zone.name}</span>
                  <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{zone.food}</span>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-slate-950/90 rounded-2xl border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-2 mt-1">
            <span className="text-lg">🧠</span>
            <span>{TASTE_ZONES[selectedTaste].desc}</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/90 p-4 rounded-2xl border border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-black text-white">Body Core Temperature: 37°C (98.6°F)</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
              Gastric Hydrochloric Acid (pH 1.5) + Enzymes Chemical Liquefaction: {digestionProgress}%
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
