import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Sparkles, ZoomIn, ZoomOut, Droplets, Thermometer, RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  onCompleted?: () => void;
}

export const ThreeBreadMoldLab: React.FC<Props> = ({ onCompleted }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [day, setDay] = useState<number>(1);
  const [condition, setCondition] = useState<'moist_warm' | 'dry_warm' | 'moist_cold' | 'dry_cold'>('moist_warm');
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const CONDITIONS = {
    moist_warm: {
      title: '1. Moist + Warm (Sealed Box)',
      tag: '🔥 💧 Maximum Spoilage',
      desc: 'High moisture and 28°C warmth trigger rapid fungal germination of airborne Rhizopus spores!',
      growthCurve: [0, 15, 45, 80, 100],
      color: 'bg-rose-500 text-white',
    },
    dry_warm: {
      title: '2. Dry + Warm (Open Room)',
      tag: '☀️ Dry Staling',
      desc: 'Without water moisture, fungal spores cannot germinate. The bread only dries and turns hard/stale.',
      growthCurve: [0, 0, 0, 0, 0],
      color: 'bg-amber-500 text-slate-950',
    },
    moist_cold: {
      title: '3. Moist + Cold (Fridge 4°C)',
      tag: '❄️ Slow Dormancy',
      desc: 'Cold temperatures slow fungal enzyme metabolism, delaying spoilage significantly.',
      growthCurve: [0, 2, 6, 12, 20],
      color: 'bg-sky-500 text-white',
    },
    dry_cold: {
      title: '4. Dry + Cold (Preserved)',
      tag: '🧊 Maximum Preservation',
      desc: 'Zero moisture and cold refrigeration completely prevent fungal mold colonization!',
      growthCurve: [0, 0, 0, 0, 0],
      color: 'bg-emerald-500 text-white',
    },
  };

  const currentCondition = CONDITIONS[condition];
  const moldPercent = currentCondition.growthCurve[day - 1];

  const handleSelectCondition = (cond: 'moist_warm' | 'dry_warm' | 'moist_cold' | 'dry_cold') => {
    sounds.pop();
    setCondition(cond);
    const spec = CONDITIONS[cond];
    voiceAssistant.speak(`${spec.title}: ${spec.desc}`);
  };

  const handleDayChange = (newDay: number) => {
    sounds.pop();
    setDay(newDay);
    if (newDay === 5 && condition === 'moist_warm') {
      sounds.fanfare();
      voiceAssistant.speak(
        'Day 5 observation: Black bread mold (Rhizopus stolonifer) has completely covered the bread with fuzzy mycelium and millions of dark spore heads!'
      );
      if (onCompleted) onCompleted();
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 400;

    // 1. Scene & Scientific Laboratory Lighting
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Slate-900 Lab

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, isZoomed ? 2.5 : 5.0, isZoomed ? 4.0 : 8.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const spotlight = new THREE.DirectionalLight(0xffedd5, 3.0);
    spotlight.position.set(8, 16, 10);
    spotlight.castShadow = true;
    scene.add(spotlight);

    const rimLight = new THREE.PointLight(0x38bdf8, 2.5, 12);
    rimLight.position.set(-4, 2, 4);
    scene.add(rimLight);

    // 2. Glass Petri Dish Stage
    const petriGeo = new THREE.CylinderGeometry(3.6, 3.8, 0.4, 48);
    const petriMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.1,
    });
    const petriDish = new THREE.Mesh(petriGeo, petriMat);
    petriDish.position.y = -0.5;
    scene.add(petriDish);

    // 3. Realistic 3D Bread Slice (Baked crust rim + soft crumb core)
    const breadGroup = new THREE.Group();
    scene.add(breadGroup);

    // Crust Outer Rim (Golden Brown baked crust)
    const crustShape = new THREE.Shape();
    const w = 2.2, h = 2.2, r = 0.5;
    crustShape.moveTo(-w + r, -h);
    crustShape.lineTo(w - r, -h);
    crustShape.quadraticCurveTo(w, -h, w, -h + r);
    crustShape.lineTo(w, h * 0.4);
    // Rounded top muffin top curve
    crustShape.quadraticCurveTo(w * 0.8, h, 0, h);
    crustShape.quadraticCurveTo(-w * 0.8, h, -w, h * 0.4);
    crustShape.lineTo(-w, -h + r);
    crustShape.quadraticCurveTo(-w, -h, -w + r, -h);

    const extrudeSettings = {
      depth: 0.6,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.12,
      bevelThickness: 0.12,
    };

    const breadGeo = new THREE.ExtrudeGeometry(crustShape, extrudeSettings);
    breadGeo.center();
    breadGeo.rotateX(-Math.PI / 2); // Lay flat on petri dish

    const isStale = condition === 'dry_warm' && day >= 3;
    const breadMat = new THREE.MeshStandardMaterial({
      color: isStale ? 0xd4a373 : 0xfef08a, // Fresh cream vs stale tan
      roughness: 0.85,
    });
    const breadMesh = new THREE.Mesh(breadGeo, breadMat);
    breadMesh.position.set(0, -0.2, 0);
    breadGroup.add(breadMesh);

    // 4. Dynamic 3D Fungal Mold Patches (Rhizopus Mycelium & Spore Clusters)
    const moldGroup = new THREE.Group();
    breadGroup.add(moldGroup);

    if (moldPercent > 0) {
      const moldScale = moldPercent / 100;

      // Mold Patch Colors: Pale white fuzz at Day 2 -> Greenish fuzz at Day 3 -> Deep black spore heads at Day 4-5
      let moldColor = 0xe2e8f0; // White mycelium
      if (moldPercent > 30) moldColor = 0x064e3b; // Deep emerald/forest green
      if (moldPercent > 70) moldColor = 0x09090b; // Jet black Rhizopus spores

      const moldMat = new THREE.MeshStandardMaterial({
        color: moldColor,
        roughness: 0.95,
        metalness: 0.05,
      });

      // Central large fuzzy mold mat
      const centerMoldGeo = new THREE.SphereGeometry(1.4 * moldScale, 24, 16);
      centerMoldGeo.scale(1.2, 0.35, 1.0);
      const centerMold = new THREE.Mesh(centerMoldGeo, moldMat);
      centerMold.position.set(0, 0.18, 0);
      moldGroup.add(centerMold);

      // Peripheral secondary spore colonies
      const patchPositions = [
        { x: -0.9, z: -0.7, s: 0.6 },
        { x: 1.1, z: 0.5, s: 0.7 },
        { x: -0.8, z: 0.8, s: 0.5 },
        { x: 0.7, z: -0.9, s: 0.65 },
      ];

      patchPositions.forEach((pos) => {
        const patchGeo = new THREE.SphereGeometry(pos.s * moldScale, 16, 12);
        patchGeo.scale(1.0, 0.3, 0.9);
        const patch = new THREE.Mesh(patchGeo, moldMat);
        patch.position.set(pos.x, 0.18, pos.z);
        moldGroup.add(patch);
      });

      // 5. Individual Microscopic Spore Heads (Tiny black sporangia balls on stalks)
      if (moldPercent > 40) {
        const sporeGeo = new THREE.SphereGeometry(0.06, 8, 8);
        const sporeMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.3 });
        const numSpores = Math.floor(moldPercent * 0.6);

        for (let i = 0; i < numSpores; i++) {
          const sp = new THREE.Mesh(sporeGeo, sporeMat);
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * (1.2 * moldScale);
          sp.position.set(
            Math.cos(angle) * dist,
            0.22 + Math.random() * 0.15,
            Math.sin(angle) * dist
          );
          moldGroup.add(sp);
        }
      }
    }

    // 6. Water Condensation Droplets (For moist conditions)
    if (condition.includes('moist')) {
      const dropGeo = new THREE.SphereGeometry(0.08, 8, 8);
      const dropMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.8,
      });

      for (let d = 0; d < 8; d++) {
        const drop = new THREE.Mesh(dropGeo, dropMat);
        drop.scale.set(1.0, 0.4, 1.0);
        drop.position.set(
          (Math.random() - 0.5) * 3.0,
          -0.28,
          (Math.random() - 0.5) * 3.0
        );
        breadGroup.add(drop);
      }
    }

    // 7. 60 FPS Fluid Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle interactive floating orbit
      breadGroup.rotation.y = Math.sin(elapsed * 0.8) * 0.15;
      breadGroup.rotation.x = isZoomed ? 0.35 : 0.2 + Math.cos(elapsed * 1.0) * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [day, condition, isZoomed, moldPercent]);

  return (
    <div className="w-full bg-slate-900 text-white rounded-3xl border-3 border-lime-400 p-4 sm:p-6 shadow-2xl flex flex-col gap-4 font-sans select-none">
      {/* Header & Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-lime-400 bg-lime-400/10 border border-lime-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-lime-400" />
              <span>3D Fungal Spoilage Simulator</span>
            </span>
            <span className="text-xs font-bold text-amber-300">
              Mold Coverage: {moldPercent}% ({moldPercent === 0 ? 'Fresh' : moldPercent < 50 ? 'Colonizing' : 'Hazardous'})
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-black text-white mt-1">
            Bread Spoilage & Fungal Mold (*Rhizopus*) 5-Day Experiment 🍞
          </h4>
          <p className="text-xs font-bold text-slate-300">
            {currentCondition.desc}
          </p>
        </div>

        {/* 100x Zoom Toggle */}
        <button
          onClick={() => {
            sounds.pop();
            setIsZoomed(!isZoomed);
          }}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-lime-400 font-black text-xs rounded-2xl border border-slate-700 cursor-pointer shadow-md transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
        >
          {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          <span>{isZoomed ? 'Reset View' : '🔬 100x Spore Zoom'}</span>
        </button>
      </div>

      {/* 4 Environmental Condition Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
        {(Object.keys(CONDITIONS) as (keyof typeof CONDITIONS)[]).map((key) => {
          const isSelected = condition === key;
          const item = CONDITIONS[key];
          return (
            <button
              key={key}
              onClick={() => handleSelectCondition(key)}
              className={`p-3 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                isSelected
                  ? 'bg-lime-400 text-slate-950 border-white shadow-lg scale-102 ring-2 ring-lime-300 font-black'
                  : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <span className="text-xs font-black block">{item.title}</span>
              <span className="text-[10px] font-bold block mt-0.5 opacity-80">{item.tag}</span>
            </button>
          );
        })}
      </div>

      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden relative bg-slate-950 border border-slate-700 shadow-inner"
      />

      {/* 5-Day Timelapse Slider */}
      <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs font-black text-slate-300">
          <span>Day 1 (Fresh Baked)</span>
          <span className="px-3.5 py-1 bg-lime-400 text-slate-950 rounded-full font-black text-xs shadow-md">
            Timelapse: Day {day} of 5 • {moldPercent}% Mold
          </span>
          <span>Day 5 (Spoiled / Moldy)</span>
        </div>

        <input
          type="range"
          min="1"
          max="5"
          value={day}
          onChange={(e) => handleDayChange(Number(e.target.value))}
          className="accent-lime-400 cursor-pointer w-full h-2.5 bg-slate-800 rounded-lg"
        />

        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mt-1">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            {day === 1
              ? 'Day 1: Fresh bread is sterile and dry on the surface with high nutrients.'
              : day === 2
              ? 'Day 2: Microscopic airborne fungal spores land and germinate into white cottony hyphae.'
              : day === 3
              ? 'Day 3: Pale green mycelium networks penetrate bread crumb pores to digest starches.'
              : day === 4
              ? 'Day 4: Dark velvety spore colonies produce thousands of stalked sporangia.'
              : 'Day 5: Fully mature black bread mold (Rhizopus) releases millions of airborne spores!'}
          </span>
        </div>
      </div>
    </div>
  );
};
