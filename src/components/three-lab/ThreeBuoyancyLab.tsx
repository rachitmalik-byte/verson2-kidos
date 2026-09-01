import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '@/lib/sounds';
import { Droplets, ArrowUp, ArrowDown, RotateCcw, Sparkles } from 'lucide-react';

interface FloatingObject {
  id: string;
  name: string;
  density: number; // g/cm3
  color: number;
  shape: 'box' | 'cylinder' | 'sphere';
  size: [number, number, number];
  icon: string;
}

const OBJECTS: FloatingObject[] = [
  { id: 'wood', name: 'Pine Wood Block', density: 0.5, color: 0xb45309, shape: 'box', size: [2, 1.2, 1.5], icon: '🪵' },
  { id: 'plastic', name: 'Plastic Bottle', density: 0.92, color: 0x38bdf8, shape: 'cylinder', size: [0.8, 2.2, 16], icon: '🫙' },
  { id: 'ship', name: 'Hollow Cargo Hull', density: 0.25, color: 0x475569, shape: 'box', size: [3.5, 1.0, 2.0], icon: '🚢' },
  { id: 'iron', name: 'Solid Iron Nail', density: 7.85, color: 0x64748b, shape: 'cylinder', size: [0.25, 2.5, 12], icon: '🔩' },
];

export const ThreeBuoyancyLab: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedObjectId, setSelectedObjectId] = useState<string>('wood');
  const [salinity, setSalinity] = useState<number>(1.0); // 1.0 = Fresh Water, 1.3 = Dead Sea
  const [inWater, setInWater] = useState<boolean>(true);

  const activeObj = OBJECTS.find((o) => o.id === selectedObjectId) || OBJECTS[0];

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x061325);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3, 14);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.replaceChildren(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xe0f2fe, 2.0);
    dirLight.position.set(6, 12, 8);
    scene.add(dirLight);

    // Glass Tank Mesh
    const tankGeo = new THREE.BoxGeometry(8, 7, 5);
    const tankMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.18,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.8,
      ior: 1.5,
    });
    const tankMesh = new THREE.Mesh(tankGeo, tankMat);
    scene.add(tankMesh);

    // Water Volume Mesh
    const waterLevel = 0.5; // Y position of surface
    const waterHeight = 4.5;
    const waterGeo = new THREE.BoxGeometry(7.8, waterHeight, 4.8);
    const waterMat = new THREE.MeshStandardMaterial({
      color: salinity > 1.15 ? 0x0284c7 : 0x38bdf8,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.set(0, -1.2, 0);
    scene.add(waterMesh);

    // Dynamic Test Object
    let testMesh: THREE.Mesh;
    if (activeObj.shape === 'box') {
      const geo = new THREE.BoxGeometry(...activeObj.size);
      const mat = new THREE.MeshStandardMaterial({ color: activeObj.color, roughness: 0.3 });
      testMesh = new THREE.Mesh(geo, mat);
    } else {
      const geo = new THREE.CylinderGeometry(activeObj.size[0], activeObj.size[0], activeObj.size[1], activeObj.size[2]);
      const mat = new THREE.MeshStandardMaterial({ color: activeObj.color, roughness: 0.3 });
      testMesh = new THREE.Mesh(geo, mat);
    }
    scene.add(testMesh);

    // Physics calculation: Density vs Water Salinity
    // Submerged equilibrium Y level
    let targetY = 0;
    const liquidDensity = salinity; // 1.0 to 1.3
    if (activeObj.density < liquidDensity) {
      // Floats: fraction submerged = object.density / liquidDensity
      const frac = activeObj.density / liquidDensity;
      targetY = waterLevel - (frac - 0.5) * 1.5;
    } else {
      // Sinks to bottom of tank (-3.0)
      targetY = -2.8;
    }

    testMesh.position.set(0, inWater ? targetY : 4.0, 0);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Bobbing in water if floating
      if (inWater && activeObj.density < liquidDensity) {
        testMesh.position.y = targetY + Math.sin(elapsed * 2.5) * 0.08;
        testMesh.rotation.z = Math.sin(elapsed * 1.8) * 0.03;
      } else if (inWater) {
        testMesh.position.y = THREE.MathUtils.lerp(testMesh.position.y, targetY, 0.08);
      }

      // Gentle water ripple rotation
      waterMesh.position.y = -1.2 + Math.sin(elapsed * 1.5) * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [selectedObjectId, salinity, inWater]);

  const doesFloat = activeObj.density < salinity;

  return (
    <div className="w-full bg-slate-950 text-white rounded-3xl border-2 border-sky-500/40 p-4 sm:p-6 shadow-2xl flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-sky-400 bg-sky-400/10 border border-sky-400/30 px-2.5 py-0.5 rounded-full">
              Archimedes 3D Buoyancy Tank
            </span>
            <span className="text-xs font-bold text-slate-400">Fluid Physics Lab</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white mt-1">
            {activeObj.icon} {activeObj.name} (Density: {activeObj.density} g/cm3)
          </h3>
          <p className="text-xs text-slate-400">
            {doesFloat ? 'Upward buoyant force exceeds object weight -> FLOATS!' : 'Object weight exceeds liquid buoyant force -> SINKS!'}
          </p>
        </div>

        {/* Object Selectors */}
        <div className="flex flex-wrap gap-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-800">
          {OBJECTS.map((obj) => (
            <button
              key={obj.id}
              onClick={() => {
                sounds.pop();
                setSelectedObjectId(obj.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedObjectId === obj.id
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{obj.icon}</span>
              <span>{obj.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      <div
        ref={mountRef}
        className="w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden relative bg-radial from-slate-900 to-slate-950 border border-slate-800 shadow-inner"
      />

      {/* Controls & Salinity Slider */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div className="flex items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-sky-400" />
            <div>
              <span className="text-xs font-black text-white block">Water Salinity / Density</span>
              <span className="text-[10px] text-slate-400">
                {salinity <= 1.05 ? 'Fresh Tap Water (1.00 g/cm3)' : salinity <= 1.15 ? 'Ocean Sea Water (1.03 g/cm3)' : 'Dead Sea Saline (1.25 g/cm3)'}
              </span>
            </div>
          </div>
          <input
            type="range"
            min="1.0"
            max="1.25"
            step="0.05"
            value={salinity}
            onChange={(e) => setSalinity(Number(e.target.value))}
            className="accent-sky-400 cursor-pointer w-28"
          />
        </div>

        <div className="flex items-center justify-around bg-slate-900/90 border border-slate-800 rounded-2xl p-3">
          <div className={`flex items-center gap-1.5 text-xs font-black ${doesFloat ? 'text-emerald-400' : 'text-slate-500'}`}>
            <ArrowUp className="w-4 h-4 stroke-[3]" />
            <span>Buoyant Force (Up)</span>
          </div>
          <div className={`flex items-center gap-1.5 text-xs font-black ${!doesFloat ? 'text-rose-400' : 'text-slate-500'}`}>
            <ArrowDown className="w-4 h-4 stroke-[3]" />
            <span>Gravity Force (Down)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
