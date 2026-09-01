import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Droplets, ArrowUp, ArrowDown, RotateCcw, Plus } from 'lucide-react';

interface Props {
  onCompleted?: () => void;
}

export const ThreeAquariumSim: React.FC<Props> = ({ onCompleted }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [saltGrams, setSaltGrams] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<'egg' | 'wood' | 'nail' | 'plastic'>('egg');

  const density = 1.0 + (saltGrams / 300) * 0.25; // 1.00 g/cm3 to 1.25 g/cm3

  const ITEM_SPECS = {
    egg: { name: 'Fresh Chicken Egg', density: 1.08, color: 0xffedd5, icon: '🥚' },
    wood: { name: 'Pine Wood Block', density: 0.55, color: 0xb45309, icon: '🪵' },
    plastic: { name: 'Polyester Bottle', density: 0.95, color: 0x38bdf8, icon: '🫙' },
    nail: { name: 'Solid Iron Nail', density: 7.85, color: 0x64748b, icon: '🔩' },
  };

  const activeSpec = ITEM_SPECS[selectedItem];
  const doesFloat = activeSpec.density < density;

  const handleAddSaltSpoon = () => {
    sounds.pop();
    const newGrams = Math.min(300, saltGrams + 50);
    setSaltGrams(newGrams);

    if (selectedItem === 'egg' && newGrams >= 150) {
      sounds.fanfare();
      voiceAssistant.speak(
        'Density Law Discovered! Adding salt makes the water denser than the egg (1.08 g/cm3). The buoyant upward force lifts the egg right to the surface!'
      );
      if (onCompleted) onCompleted();
    }
  };

  const handleReset = () => {
    sounds.pop();
    setSaltGrams(0);
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    // Warm clean laboratory backdrop
    scene.background = new THREE.Color(0x0a1628);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 11);
    camera.lookAt(0, -0.2, 0);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);

    // 3. Bright Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const topSun = new THREE.DirectionalLight(0xffffff, 2.5);
    topSun.position.set(4, 12, 8);
    scene.add(topSun);

    // Underwater Aqua Spotlights
    const aquaGlow1 = new THREE.PointLight(0x00d2ff, 4.0, 15);
    aquaGlow1.position.set(0, -1, 4);
    scene.add(aquaGlow1);

    const aquaGlow2 = new THREE.PointLight(0x0ea5e9, 3.0, 12);
    aquaGlow2.position.set(-3, -2, -2);
    scene.add(aquaGlow2);

    // 4. Tank Dimensions
    const tankWidth = 6.8;
    const tankHeight = 5.6;
    const tankDepth = 4.2;
    const waterHeight = 4.4;

    // 5. VIBRANT GLOWING BLUE WATER VOLUME (100% Visible & Beautiful)
    const waterGeo = new THREE.BoxGeometry(tankWidth - 0.15, waterHeight, tankDepth - 0.15);
    
    // Dynamic salinity shift from radiant cyan to deep saline ocean blue
    const waterColor = new THREE.Color().lerpColors(
      new THREE.Color(0x00b4d8), // Pure Cyan Water
      new THREE.Color(0x0077b6), // Deep Saline Blue
      saltGrams / 300
    );

    const waterMat = new THREE.MeshStandardMaterial({
      color: waterColor,
      emissive: waterColor,
      emissiveIntensity: 0.35, // Internal light emission so water is vividly bright blue!
      transparent: true,
      opacity: 0.82,
      roughness: 0.15,
      metalness: 0.1,
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.set(0, -tankHeight / 2 + waterHeight / 2 + 0.1, 0);
    scene.add(waterMesh);

    // Glowing Water Surface Plane with Waves
    const surfaceGeo = new THREE.PlaneGeometry(tankWidth - 0.2, tankDepth - 0.2, 24, 24);
    const surfaceMat = new THREE.MeshStandardMaterial({
      color: 0x90e0ef,
      emissive: 0x00b4d8,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.95,
      roughness: 0.1,
      metalness: 0.3,
      side: THREE.DoubleSide,
    });
    const surfaceMesh = new THREE.Mesh(surfaceGeo, surfaceMat);
    surfaceMesh.rotation.x = -Math.PI / 2;
    surfaceMesh.position.y = waterMesh.position.y + waterHeight / 2;
    scene.add(surfaceMesh);

    // Bright White Waterline Foam Border
    const waterlineGeo = new THREE.BoxGeometry(tankWidth - 0.1, 0.12, tankDepth - 0.1);
    const waterlineMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe });
    const waterlineMesh = new THREE.Mesh(waterlineGeo, waterlineMat);
    waterlineMesh.position.y = surfaceMesh.position.y;
    scene.add(waterlineMesh);

    // 6. Glass Aquarium Tank Frame
    const glassGeo = new THREE.BoxGeometry(tankWidth, tankHeight, tankDepth);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.95,
      ior: 1.5,
      clearcoat: 1.0,
    });
    const tankMesh = new THREE.Mesh(glassGeo, glassMat);
    scene.add(tankMesh);

    // Top Rim & Sturdy Base
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 });
    const rimGeo = new THREE.BoxGeometry(tankWidth + 0.3, 0.25, tankDepth + 0.3);

    const topRim = new THREE.Mesh(rimGeo, rimMat);
    topRim.position.y = tankHeight / 2;
    scene.add(topRim);

    const baseFrame = new THREE.Mesh(rimGeo, rimMat);
    baseFrame.position.y = -tankHeight / 2;
    scene.add(baseFrame);

    // 7. Measurement Markings on Glass (100ml to 500ml)
    const marksGroup = new THREE.Group();
    scene.add(marksGroup);

    for (let i = 1; i <= 4; i++) {
      const lineGeo = new THREE.BoxGeometry(0.8, 0.03, 0.02);
      const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const markMesh = new THREE.Mesh(lineGeo, lineMat);
      markMesh.position.set(-tankWidth / 2 + 0.5, -tankHeight / 2 + i * 1.0, tankDepth / 2 + 0.01);
      marksGroup.add(markMesh);
    }

    // 8. 3D Specimen Mesh
    let specimenMesh: THREE.Mesh;
    if (selectedItem === 'egg') {
      const eggGeo = new THREE.SphereGeometry(0.85, 32, 32);
      eggGeo.scale(0.85, 1.25, 0.85);
      const eggMat = new THREE.MeshStandardMaterial({
        color: 0xffedd5,
        roughness: 0.3,
        emissive: 0x332211,
        emissiveIntensity: 0.1,
      });
      specimenMesh = new THREE.Mesh(eggGeo, eggMat);
    } else if (selectedItem === 'wood') {
      const woodGeo = new THREE.BoxGeometry(1.8, 1.2, 1.4);
      const woodMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6 });
      specimenMesh = new THREE.Mesh(woodGeo, woodMat);
    } else if (selectedItem === 'plastic') {
      const bottleGeo = new THREE.CylinderGeometry(0.6, 0.6, 2.0, 24);
      const bottleMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85, roughness: 0.2 });
      specimenMesh = new THREE.Mesh(bottleGeo, bottleMat);
    } else {
      const nailGeo = new THREE.CylinderGeometry(0.18, 0.18, 2.2, 16);
      const nailMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.1 });
      specimenMesh = new THREE.Mesh(nailGeo, nailMat);
    }
    scene.add(specimenMesh);

    // Target Physics Level
    let targetY = 0;
    const waterSurfaceY = surfaceMesh.position.y;
    const tankBottomY = -tankHeight / 2 + 0.7;

    if (doesFloat) {
      const submergedFraction = activeSpec.density / density;
      targetY = waterSurfaceY - (submergedFraction - 0.45) * 1.3;
    } else {
      targetY = tankBottomY;
    }

    specimenMesh.position.set(0, targetY, 0);

    // 9. Rising Bubbles
    const bubbleCount = 20;
    const bubbleGeo = new THREE.SphereGeometry(0.09, 8, 8);
    const bubbleMat = new THREE.MeshStandardMaterial({
      color: 0xe0f2fe,
      emissive: 0xbae6fd,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.8,
    });
    const bubbles: { mesh: THREE.Mesh; speed: number }[] = [];

    for (let i = 0; i < bubbleCount; i++) {
      const b = new THREE.Mesh(bubbleGeo, bubbleMat);
      b.position.set(
        (Math.random() - 0.5) * (tankWidth - 1.2),
        tankBottomY + Math.random() * waterHeight,
        (Math.random() - 0.5) * (tankDepth - 1.2)
      );
      scene.add(b);
      bubbles.push({ mesh: b, speed: 0.02 + Math.random() * 0.025 });
    }

    // 10. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth Physics Float / Sink
      specimenMesh.position.y = THREE.MathUtils.lerp(specimenMesh.position.y, targetY, 0.08);

      if (doesFloat) {
        specimenMesh.position.y += Math.sin(elapsed * 3.0) * 0.04;
        specimenMesh.rotation.z = Math.sin(elapsed * 2.0) * 0.05;
        specimenMesh.rotation.y += 0.005;
      } else {
        specimenMesh.rotation.z = 0;
      }

      // Water Surface Shimmer Oscillations
      surfaceMesh.position.y = waterMesh.position.y + waterHeight / 2 + Math.sin(elapsed * 2.5) * 0.03;
      waterlineMesh.position.y = surfaceMesh.position.y;

      // Ascending Air Bubbles
      bubbles.forEach((b) => {
        b.mesh.position.y += b.speed;
        if (b.mesh.position.y > surfaceMesh.position.y) {
          b.mesh.position.y = tankBottomY;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [selectedItem, saltGrams, doesFloat, density]);

  return (
    <div className="w-full bg-slate-900 text-white rounded-3xl border-3 border-sky-400/80 p-4 sm:p-6 shadow-2xl flex flex-col gap-4 font-sans select-none">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-sky-400 bg-sky-400/10 border border-sky-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-sky-400" />
              <span>3D Archimedes Density Tank</span>
            </span>
            <span className="text-xs font-bold text-slate-300">
              Salinity: {saltGrams} g/L (Density: {density.toFixed(2)} g/cm³)
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white mt-1">
            {activeSpec.icon} {activeSpec.name} (Density: {activeSpec.density} g/cm³)
          </h3>
          <p className="text-xs font-bold text-slate-300">
            {doesFloat
              ? '🎉 FLOATING: Water density exceeds object density! Strong upward buoyant force keeps it afloat.'
              : '⚓ SUNK: Object is heavier than the liquid! Gravity pulls it to the bottom.'}
          </p>
        </div>

        {/* Object Switchers */}
        <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          {(Object.keys(ITEM_SPECS) as (keyof typeof ITEM_SPECS)[]).map((key) => (
            <button
              key={key}
              onClick={() => {
                sounds.pop();
                setSelectedItem(key);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedItem === key
                  ? 'bg-sky-400 text-slate-950 shadow-md scale-105'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{ITEM_SPECS[key].icon}</span>
              <span>{ITEM_SPECS[key].name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3D WebGL Aquarium Canvas */}
      <div
        ref={mountRef}
        className="w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden relative bg-radial from-slate-900 to-slate-950 border border-slate-800 shadow-inner"
      />

      {/* Interactive Salt Controls & Physics Meter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {/* Add Salt Button */}
        <div className="flex items-center justify-between gap-3 bg-slate-950/90 border border-slate-800 rounded-2xl p-3">
          <div>
            <span className="text-xs font-black text-white block">Add Dead Sea Salt 🧂</span>
            <span className="text-[11px] font-bold text-slate-400">
              {saltGrams === 0 ? 'Fresh Tap Water (0g Salt)' : saltGrams < 150 ? `${saltGrams}g Salt Added` : 'Dead Sea Saline (300g/L)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddSaltSpoon}
              disabled={saltGrams >= 300}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-40 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add Salt Spoon</span>
            </button>

            {saltGrams > 0 && (
              <button
                onClick={handleReset}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl cursor-pointer"
                title="Reset to fresh water"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Physics Force Vector Readout */}
        <div className="flex items-center justify-around bg-slate-950/90 border border-slate-800 rounded-2xl p-3">
          <div className={`flex items-center gap-1.5 text-xs font-black ${doesFloat ? 'text-emerald-400' : 'text-slate-500'}`}>
            <ArrowUp className="w-4 h-4 stroke-[3]" />
            <span>Buoyant Force: {(density * 10).toFixed(1)} N (Up)</span>
          </div>
          <div className={`flex items-center gap-1.5 text-xs font-black ${!doesFloat ? 'text-rose-400' : 'text-slate-500'}`}>
            <ArrowDown className="w-4 h-4 stroke-[3]" />
            <span>Gravity: {(activeSpec.density * 10).toFixed(1)} N (Down)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
