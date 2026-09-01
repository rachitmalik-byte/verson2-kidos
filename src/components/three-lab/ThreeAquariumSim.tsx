import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Droplets, ArrowUp, ArrowDown, RotateCcw, Sparkles, Plus } from 'lucide-react';

interface Props {
  onCompleted?: () => void;
}

export const ThreeAquariumSim: React.FC<Props> = ({ onCompleted }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [saltGrams, setSaltGrams] = useState<number>(0); // 0g to 300g
  const [selectedItem, setSelectedItem] = useState<'egg' | 'wood' | 'nail' | 'plastic'>('egg');

  const density = 1.0 + (saltGrams / 300) * 0.25; // 1.00 g/cm3 to 1.25 g/cm3

  // Object Densities
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
    const height = container.clientHeight || 400;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Slate-900 background

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.5, 12);
    camera.lookAt(0, -0.2, 0);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);

    // 3. Lighting (Bright Aquarium Studio Lights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const topLight = new THREE.DirectionalLight(0xe0f2fe, 2.5);
    topLight.position.set(2, 10, 5);
    scene.add(topLight);

    const blueFill = new THREE.PointLight(0x0284c7, 3.0, 15);
    blueFill.position.set(0, 0, 3);
    scene.add(blueFill);

    // 4. Glass Aquarium Tank (Visible Beveled Frame)
    const tankWidth = 7.0;
    const tankHeight = 5.5;
    const tankDepth = 4.0;

    // Glass walls
    const tankGeo = new THREE.BoxGeometry(tankWidth, tankHeight, tankDepth);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.25,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.9,
      ior: 1.5,
      reflectivity: 0.9,
      clearcoat: 1.0,
    });
    const tankMesh = new THREE.Mesh(tankGeo, glassMat);
    scene.add(tankMesh);

    // Top Rim & Base Frame
    const rimGeo = new THREE.BoxGeometry(tankWidth + 0.3, 0.2, tankDepth + 0.3);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3 });
    const topRim = new THREE.Mesh(rimGeo, frameMat);
    topRim.position.y = tankHeight / 2;
    scene.add(topRim);

    const baseFrame = new THREE.Mesh(rimGeo, frameMat);
    baseFrame.position.y = -tankHeight / 2;
    scene.add(baseFrame);

    // 5. Crystal-Clear Glowing Water Volume
    const waterHeight = 4.2;
    const waterGeo = new THREE.BoxGeometry(tankWidth - 0.2, waterHeight, tankDepth - 0.2);
    
    // Dynamic water color shifts from cyan (fresh) to rich turquoise (Dead Sea salt)
    const waterColor = new THREE.Color().lerpColors(
      new THREE.Color(0x38bdf8), // Fresh Water Cyan
      new THREE.Color(0x0284c7), // Saline Deep Azure
      saltGrams / 300
    );

    const waterMat = new THREE.MeshStandardMaterial({
      color: waterColor,
      transparent: true,
      opacity: 0.65,
      roughness: 0.1,
      metalness: 0.2,
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.set(0, -0.5, 0);
    scene.add(waterMesh);

    // Water Surface Shimmer Plane
    const surfaceGeo = new THREE.PlaneGeometry(tankWidth - 0.3, tankDepth - 0.3, 16, 16);
    const surfaceMat = new THREE.MeshStandardMaterial({
      color: 0xbae6fd,
      transparent: true,
      opacity: 0.85,
      roughness: 0.0,
      metalness: 0.4,
      side: THREE.DoubleSide,
    });
    const surfaceMesh = new THREE.Mesh(surfaceGeo, surfaceMat);
    surfaceMesh.rotation.x = -Math.PI / 2;
    surfaceMesh.position.y = -0.5 + waterHeight / 2;
    scene.add(surfaceMesh);

    // 6. Test Specimen 3D Mesh
    let specimenMesh: THREE.Mesh;
    if (selectedItem === 'egg') {
      const eggGeo = new THREE.SphereGeometry(0.85, 32, 32);
      eggGeo.scale(0.85, 1.2, 0.85); // Natural egg shape
      const eggMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.35 });
      specimenMesh = new THREE.Mesh(eggGeo, eggMat);
    } else if (selectedItem === 'wood') {
      const woodGeo = new THREE.BoxGeometry(1.8, 1.2, 1.4);
      const woodMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.5 });
      specimenMesh = new THREE.Mesh(woodGeo, woodMat);
    } else if (selectedItem === 'plastic') {
      const bottleGeo = new THREE.CylinderGeometry(0.6, 0.6, 2.0, 24);
      const bottleMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75, roughness: 0.2 });
      specimenMesh = new THREE.Mesh(bottleGeo, bottleMat);
    } else {
      const nailGeo = new THREE.CylinderGeometry(0.18, 0.18, 2.2, 16);
      const nailMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8, roughness: 0.2 });
      specimenMesh = new THREE.Mesh(nailGeo, nailMat);
    }
    scene.add(specimenMesh);

    // Target Equilibrium Position
    let targetY = 0;
    const waterSurfaceY = surfaceMesh.position.y;
    const tankBottomY = -tankHeight / 2 + 0.6;

    if (doesFloat) {
      // Floats: Fraction submerged = object density / liquid density
      const submergedFraction = activeSpec.density / density;
      targetY = waterSurfaceY - (submergedFraction - 0.4) * 1.2;
    } else {
      // Sinks to tank bottom
      targetY = tankBottomY;
    }

    specimenMesh.position.set(0, targetY, 0);

    // 7. Ambient Bubbles Particle Stream
    const bubbleCount = 25;
    const bubbleGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const bubbleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
    const bubbles: { mesh: THREE.Mesh; speed: number; startX: number; startZ: number }[] = [];

    for (let i = 0; i < bubbleCount; i++) {
      const b = new THREE.Mesh(bubbleGeo, bubbleMat);
      const startX = (Math.random() - 0.5) * (tankWidth - 1.5);
      const startZ = (Math.random() - 0.5) * (tankDepth - 1.5);
      b.position.set(startX, tankBottomY + Math.random() * waterHeight, startZ);
      scene.add(b);
      bubbles.push({ mesh: b, speed: 0.015 + Math.random() * 0.02, startX, startZ });
    }

    // 8. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth Buoyant Physics Movement
      specimenMesh.position.y = THREE.MathUtils.lerp(specimenMesh.position.y, targetY, 0.06);

      if (doesFloat) {
        // Natural water bobbing
        specimenMesh.position.y += Math.sin(elapsed * 2.5) * 0.04;
        specimenMesh.rotation.z = Math.sin(elapsed * 1.5) * 0.05;
        specimenMesh.rotation.y += 0.005;
      } else {
        specimenMesh.rotation.z = 0;
      }

      // Water surface wave shimmer
      surfaceMesh.position.y = -0.5 + waterHeight / 2 + Math.sin(elapsed * 2.0) * 0.03;

      // Animate Rising Bubbles
      bubbles.forEach((b) => {
        b.mesh.position.y += b.speed;
        if (b.mesh.position.y > waterSurfaceY) {
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
    <div className="w-full bg-slate-900 text-white rounded-3xl border-3 border-sky-400/60 p-4 sm:p-6 shadow-2xl flex flex-col gap-4 font-sans select-none">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-sky-400 bg-sky-400/10 border border-sky-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-sky-400" />
              <span>3D Archimedes Density Tank</span>
            </span>
            <span className="text-xs font-bold text-slate-400">
              Salinity: {saltGrams} g/L (Density: {density.toFixed(2)} g/cm3)
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white mt-1">
            {activeSpec.icon} {activeSpec.name} (Density: {activeSpec.density} g/cm3)
          </h3>
          <p className="text-xs font-bold text-slate-300">
            {doesFloat
              ? '🎉 FLOATING: Liquid density is higher than the object! Buoyant upward force keeps it at the surface.'
              : '⚓ SUNK: Object density is heavier than the liquid! Gravity pulls it to the bottom.'}
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
                  ? 'bg-sky-500 text-slate-950 shadow-md scale-105'
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
        className="w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden relative bg-radial from-slate-900 to-slate-950 border border-slate-800 shadow-inner"
      />

      {/* Interactive Salt Controls & Physics Meter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {/* Add Salt Button */}
        <div className="flex items-center justify-between gap-3 bg-slate-950/90 border border-slate-800 rounded-2xl p-3">
          <div>
            <span className="text-xs font-black text-white block">Add Dead Sea Salt 🧂</span>
            <span className="text-[11px] font-bold text-slate-400">
              {saltGrams === 0 ? 'Fresh Water (0g Salt)' : saltGrams < 150 ? `${saltGrams}g Salt Added` : 'Dead Sea Saline (300g/L)'}
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
