import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Droplets, ArrowUp, ArrowDown, RotateCcw, Plus, Sparkles } from 'lucide-react';

interface Props {
  onCompleted?: () => void;
}

export const ThreeAquariumSim: React.FC<Props> = ({ onCompleted }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [saltGrams, setSaltGrams] = useState<number>(0); // 0 to 300
  const [selectedItem, setSelectedItem] = useState<'egg' | 'wood' | 'nail' | 'plastic'>('egg');

  const density = 1.0 + (saltGrams / 300) * 0.25; // 1.00 g/cm3 to 1.25 g/cm3

  const ITEM_SPECS = {
    egg: { name: 'Fresh Chicken Egg', density: 1.08, color: 0xfffbeb, icon: '🥚' },
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
        'Density Law Discovered! Adding salt makes the water denser than the egg. The buoyant force lifts the egg right to the surface!'
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

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617); // Dark rich slate

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 10.5);
    camera.lookAt(0, -0.2, 0);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);

    // 3. Bright Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(5, 12, 8);
    scene.add(sunLight);

    const aquaLight = new THREE.PointLight(0x38bdf8, 3.0, 10);
    aquaLight.position.set(0, 0, 4);
    scene.add(aquaLight);

    // 4. Tank Dimensions
    const tankW = 6.4;
    const tankH = 5.2;
    const tankD = 3.8;
    const waterH = 3.8;

    // 5. SOLID OPAQUE VIBRANT BLUE WATER (No transparency bugs!)
    const waterGroup = new THREE.Group();
    scene.add(waterGroup);

    // Dynamic water color: Bright Cyan (Fresh) to Deep Saline Blue (Dead Sea)
    const waterColorHex = saltGrams > 150 ? 0x0284c7 : 0x0ea5e9;

    // Solid Back Wall of Water
    const waterBackGeo = new THREE.PlaneGeometry(tankW, waterH);
    const waterBackMat = new THREE.MeshStandardMaterial({
      color: waterColorHex,
      roughness: 0.1,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    const waterBack = new THREE.Mesh(waterBackGeo, waterBackMat);
    waterBack.position.set(0, -tankH / 2 + waterH / 2, -tankD / 2 + 0.05);
    waterGroup.add(waterBack);

    // Solid Left & Right Sides of Water
    const waterSideGeo = new THREE.PlaneGeometry(tankD, waterH);
    const waterSideMat = new THREE.MeshStandardMaterial({ color: 0x0369a1, side: THREE.DoubleSide });

    const waterLeft = new THREE.Mesh(waterSideGeo, waterSideMat);
    waterLeft.rotation.y = Math.PI / 2;
    waterLeft.position.set(-tankW / 2 + 0.05, -tankH / 2 + waterH / 2, 0);
    waterGroup.add(waterLeft);

    const waterRight = new THREE.Mesh(waterSideGeo, waterSideMat);
    waterRight.rotation.y = -Math.PI / 2;
    waterRight.position.set(tankW / 2 - 0.05, -tankH / 2 + waterH / 2, 0);
    waterGroup.add(waterRight);

    // Golden Sand Tank Floor
    const sandGeo = new THREE.PlaneGeometry(tankW, tankD);
    const sandMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8 });
    const sand = new THREE.Mesh(sandGeo, sandMat);
    sand.rotation.x = -Math.PI / 2;
    sand.position.set(0, -tankH / 2 + 0.02, 0);
    waterGroup.add(sand);

    // Animated Solid Water Surface Waves (Top Plane)
    const waveGeo = new THREE.PlaneGeometry(tankW, tankD, 16, 16);
    const waveMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4,
      roughness: 0.2,
      metalness: 0.3,
      side: THREE.DoubleSide,
    });
    const waveMesh = new THREE.Mesh(waveGeo, waveMat);
    waveMesh.rotation.x = -Math.PI / 2;
    waveMesh.position.set(0, -tankH / 2 + waterH, 0);
    waterGroup.add(waveMesh);

    // White Wave Foam Line at the Surface
    const foamGeo = new THREE.BoxGeometry(tankW + 0.1, 0.15, 0.1);
    const foamMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const foamMesh = new THREE.Mesh(foamGeo, foamMat);
    foamMesh.position.set(0, waveMesh.position.y, tankD / 2);
    waterGroup.add(foamMesh);

    // Rich Blue Front Fluid Tint (Vibrant & fully visible)
    const fluidFrontGeo = new THREE.PlaneGeometry(tankW, waterH);
    const fluidFrontMat = new THREE.MeshBasicMaterial({
      color: waterColorHex,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    });
    const fluidFront = new THREE.Mesh(fluidFrontGeo, fluidFrontMat);
    fluidFront.position.set(0, -tankH / 2 + waterH / 2, tankD / 2 - 0.02);
    waterGroup.add(fluidFront);

    // 6. Realistic Aquarium Outer Frame (Solid Black Borders)
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2 });

    // Top Rim
    const topRim = new THREE.Mesh(new THREE.BoxGeometry(tankW + 0.4, 0.25, tankD + 0.4), frameMat);
    topRim.position.y = tankH / 2;
    scene.add(topRim);

    // Bottom Base
    const baseFrame = new THREE.Mesh(new THREE.BoxGeometry(tankW + 0.4, 0.3, tankD + 0.4), frameMat);
    baseFrame.position.y = -tankH / 2;
    scene.add(baseFrame);

    // 4 Corner Pillars
    for (let x of [-tankW / 2, tankW / 2]) {
      for (let z of [-tankD / 2, tankD / 2]) {
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.2, tankH, 0.2), frameMat);
        pillar.position.set(x, 0, z);
        scene.add(pillar);
      }
    }

    // 7. Test Specimen
    let specimenMesh: THREE.Mesh;
    if (selectedItem === 'egg') {
      const eggGeo = new THREE.SphereGeometry(0.85, 32, 32);
      eggGeo.scale(0.85, 1.25, 0.85);
      const eggMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.3 });
      specimenMesh = new THREE.Mesh(eggGeo, eggMat);
    } else if (selectedItem === 'wood') {
      const woodGeo = new THREE.BoxGeometry(1.8, 1.2, 1.4);
      const woodMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6 });
      specimenMesh = new THREE.Mesh(woodGeo, woodMat);
    } else if (selectedItem === 'plastic') {
      const bottleGeo = new THREE.CylinderGeometry(0.6, 0.6, 2.0, 24);
      const bottleMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2 });
      specimenMesh = new THREE.Mesh(bottleGeo, bottleMat);
    } else {
      const nailGeo = new THREE.CylinderGeometry(0.18, 0.18, 2.2, 16);
      const nailMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.1 });
      specimenMesh = new THREE.Mesh(nailGeo, nailMat);
    }
    scene.add(specimenMesh);

    // Target Physics Float / Sink
    let targetY = 0;
    const waterSurfaceY = waveMesh.position.y;
    const tankBottomY = -tankH / 2 + 0.8;

    if (doesFloat) {
      const submergedFraction = activeSpec.density / density;
      targetY = waterSurfaceY - (submergedFraction - 0.4) * 1.1;
    } else {
      targetY = tankBottomY;
    }

    specimenMesh.position.set(0, targetY, 0);

    // 8. Rising Bubbles
    const bubbleGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const bubbleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const bubbles: { mesh: THREE.Mesh; speed: number }[] = [];

    for (let i = 0; i < 15; i++) {
      const b = new THREE.Mesh(bubbleGeo, bubbleMat);
      b.position.set(
        (Math.random() - 0.5) * (tankW - 1.2),
        tankBottomY + Math.random() * waterH,
        (Math.random() - 0.5) * (tankD - 1.2)
      );
      scene.add(b);
      bubbles.push({ mesh: b, speed: 0.02 + Math.random() * 0.02 });
    }

    // 9. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth Physics Movement
      specimenMesh.position.y = THREE.MathUtils.lerp(specimenMesh.position.y, targetY, 0.08);

      if (doesFloat) {
        specimenMesh.position.y += Math.sin(elapsed * 3.0) * 0.04;
        specimenMesh.rotation.z = Math.sin(elapsed * 2.0) * 0.05;
        specimenMesh.rotation.y += 0.005;
      } else {
        specimenMesh.rotation.z = 0;
      }

      // Water surface wave motion
      waveMesh.position.y = -tankH / 2 + waterH + Math.sin(elapsed * 2.5) * 0.04;
      foamMesh.position.y = waveMesh.position.y;

      // Rising bubbles
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
              ? '🎉 FLOATING: Liquid density exceeds object density! Strong buoyant upward force keeps it afloat.'
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

      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden relative bg-slate-950 border border-slate-800 shadow-inner"
      />

      {/* Interactive Controls & Physics Meter */}
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
