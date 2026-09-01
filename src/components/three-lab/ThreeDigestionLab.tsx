import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Sparkles, Thermometer, RotateCcw, Play, Utensils, Droplets } from 'lucide-react';

interface Props {
  onCompleted?: () => void;
}

export const ThreeDigestionLab: React.FC<Props> = ({ onCompleted }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedFood, setSelectedFood] = useState<'roti' | 'egg' | 'carrot'>('roti');
  const [tempC, setTempC] = useState<number>(37); // 37 C (Body temperature)
  const [digestionProgress, setDigestionProgress] = useState<number>(0);
  const [isDigestActive, setIsDigestActive] = useState<boolean>(false);

  const FOOD_TYPES = {
    roti: { name: 'Plain Roti (Carbohydrates)', icon: '🍞', colorHex: 0xd97706, digestRate: 1.0 },
    egg: { name: 'Boiled Egg (Proteins)', icon: '🥚', colorHex: 0xffedd5, digestRate: 0.9 },
    carrot: { name: 'Fresh Carrot (Fibers)', icon: '🥕', colorHex: 0xf97316, digestRate: 1.1 },
  };

  const handleStartDigestion = () => {
    sounds.bubble();
    setIsDigestActive(true);
    setDigestionProgress(0);

    // If cold (0-15C) or boiling (80-100C), enzymes are denatured/slowed
    let speed = 15;
    if (tempC < 20 || tempC > 60) {
      speed = 4; // Slow/denatured
    }

    const interval = setInterval(() => {
      setDigestionProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          sounds.fanfare();
          if (tempC >= 35 && tempC <= 40) {
            voiceAssistant.speak(
              'Dr. Beaumont 1822 Discovery: At optimal 37°C body temperature, gastric acid and enzymes completely liquefy solid food into nutrient-rich chyme within 2 hours!'
            );
          } else {
            voiceAssistant.speak(
              'Notice how digestion slows outside 37°C! Enzymes work best at human core body temperature.'
            );
          }
          if (onCompleted) onCompleted();
          return 100;
        }
        return Math.min(100, prev + speed);
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
    const height = container.clientHeight || 380;

    // 1. Scene & Warm Studio Lighting
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Deep Slate Lab

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.2, 9.0);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffbeb, 2.8);
    keyLight.position.set(8, 14, 10);
    scene.add(keyLight);

    const aquaLight = new THREE.PointLight(0x38bdf8, 3.0, 15);
    aquaLight.position.set(-4, 2, 4);
    scene.add(aquaLight);

    // 2. Dr. William Beaumont 3D Glass Flask
    const flaskGroup = new THREE.Group();
    scene.add(flaskGroup);

    // Glass Erlenmeyer Flask Body
    const flaskGeo = new THREE.CylinderGeometry(0.8, 2.8, 4.4, 32);
    const flaskMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.2,
    });
    const flaskMesh = new THREE.Mesh(flaskGeo, flaskMat);
    flaskGroup.add(flaskMesh);

    // Gastric Fluid Volume (Hydrochloric Acid pH 1.5 + Pepsin)
    const acidGeo = new THREE.CylinderGeometry(1.2, 2.6, 2.4, 32);
    const acidMat = new THREE.MeshStandardMaterial({
      color: 0x10b981, // Emerald green gastric enzyme juice
      emissive: 0x059669,
      emissiveIntensity: 0.35,
      roughness: 0.2,
    });
    const acidMesh = new THREE.Mesh(acidGeo, acidMat);
    acidMesh.position.y = -1.0;
    flaskGroup.add(acidMesh);

    // Dissolving Solid Food Specimen
    const activeFood = FOOD_TYPES[selectedFood];
    const scaleFactor = Math.max(0.18, 1.0 - (digestionProgress / 100) * 0.82);
    const foodGeo = new THREE.DodecahedronGeometry(0.75);
    foodGeo.scale(scaleFactor, scaleFactor, scaleFactor);
    const foodMat = new THREE.MeshStandardMaterial({
      color: digestionProgress > 50 ? 0xa3e635 : activeFood.colorHex,
      roughness: 0.75,
    });
    const foodMesh = new THREE.Mesh(foodGeo, foodMat);
    foodMesh.position.set(0, -0.9, 0);
    flaskGroup.add(foodMesh);

    // Rising Chemical Enzyme Micro-Bubbles
    const bubbleGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const bubbleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const bubbles: { mesh: THREE.Mesh; speed: number }[] = [];

    for (let b = 0; b < 16; b++) {
      const bm = new THREE.Mesh(bubbleGeo, bubbleMat);
      bm.position.set(
        (Math.random() - 0.5) * 1.8,
        -2.0 + Math.random() * 2.0,
        (Math.random() - 0.5) * 1.8
      );
      flaskGroup.add(bm);
      bubbles.push({ mesh: bm, speed: 0.02 + Math.random() * 0.03 });
    }

    // 3. 60 FPS Fluid Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle flask rotation
      flaskGroup.rotation.y = elapsed * 0.3;

      // Floating food bobbing inside stomach juice
      foodMesh.position.y = -0.9 + Math.sin(elapsed * 2.5) * 0.06;
      foodMesh.rotation.x = elapsed * 0.5;
      foodMesh.rotation.z = elapsed * 0.4;

      // Rising bubbling action
      bubbles.forEach((b) => {
        b.mesh.position.y += b.speed * (isDigestActive ? 1.5 : 0.8);
        if (b.mesh.position.y > 0.2) {
          b.mesh.position.y = -2.0;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [selectedFood, digestionProgress, isDigestActive, tempC]);

  return (
    <div className="w-full bg-slate-900 text-white rounded-3xl border-3 border-emerald-400 p-4 sm:p-6 shadow-2xl flex flex-col gap-4 font-sans select-none">
      {/* Header & Specs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>3D Gastric Chemistry Simulator</span>
            </span>
            <span className="text-xs font-bold text-amber-300">
              Gastric Juice pH: 1.5 (Optimal: 37°C)
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-black text-white mt-1">
            Dr. William Beaumont’s Stomach Digestion Flask (1822)
          </h4>
          <p className="text-xs font-bold text-slate-300">
            Hydrochloric acid and enzymes break complex proteins and starches into smooth liquid chyme.
          </p>
        </div>

        {/* Food Specimen Switcher */}
        <div className="flex gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
          {(Object.keys(FOOD_TYPES) as (keyof typeof FOOD_TYPES)[]).map((key) => {
            const isSelected = selectedFood === key;
            const food = FOOD_TYPES[key];
            return (
              <button
                key={key}
                onClick={() => {
                  sounds.pop();
                  setSelectedFood(key);
                  setDigestionProgress(0);
                  setIsDigestActive(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-md scale-105'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{food.icon}</span>
                <span>{food.name.split(' ')[1]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden relative bg-slate-950 border border-slate-700 shadow-inner"
      />

      {/* Controls & Temperature Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Temperature Controller */}
        <div className="bg-slate-950/90 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-xs font-black text-white block">Flask Temp: {tempC}°C</span>
              <span className="text-[10px] text-slate-400 font-bold">
                {tempC === 37 ? '🔥 Ideal Human Body Heat (37°C)' : tempC < 20 ? '❄️ Cold (Enzymes Inactive)' : '🔥 Too Hot (Enzymes Denatured)'}
              </span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="80"
            value={tempC}
            onChange={(e) => setTempC(Number(e.target.value))}
            className="accent-emerald-400 cursor-pointer w-28"
          />
        </div>

        {/* Start / Reset Digestion Button */}
        <div className="bg-slate-950/90 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs font-black text-white block">Digestion Progress</span>
            <span className="text-[10px] text-slate-400 font-bold">
              Liquefied Chyme: {digestionProgress}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStartDigestion}
              disabled={isDigestActive && digestionProgress < 100}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate</span>
            </button>

            {digestionProgress > 0 && (
              <button
                onClick={handleReset}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl cursor-pointer"
                title="Reset simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
