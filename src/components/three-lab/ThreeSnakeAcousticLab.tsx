import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Volume2, Footprints, Music, Sparkles } from 'lucide-react';

interface Props {
  onCompleted?: () => void;
}

export const ThreeSnakeAcousticLab: React.FC<Props> = ({ onCompleted }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeStimulus, setActiveStimulus] = useState<'none' | 'footsteps' | 'flute'>('none');
  const [selectedSnake, setSelectedSnake] = useState<'cobra' | 'krait' | 'viper' | 'saw'>('cobra');

  const SNAKES = {
    cobra: { name: 'Spectacled Cobra (Nag)', hood: true, colorHex: 0x451a03, desc: 'Expands iconic defensive hood when detecting ground seismic shockwaves!' },
    krait: { name: 'Common Krait', hood: false, colorHex: 0x18181b, desc: 'Steel-black with thin white crossbands; feels vibrations resting in dark corners.' },
    viper: { name: 'Russell’s Viper (Duboia)', hood: false, colorHex: 0x78350f, desc: 'Emits a loud pressure cooker hiss when jawbone detects approaching footsteps.' },
    saw: { name: 'Saw-scaled Viper (Afai)', hood: false, colorHex: 0xa16207, desc: 'Rubs serrated side scales together to make a buzzing warning sound.' },
  };

  const handleTriggerStimulus = (type: 'footsteps' | 'flute') => {
    sounds.pop();
    setActiveStimulus(type);

    if (type === 'footsteps') {
      sounds.sparkle();
      voiceAssistant.speak(
        'Footstep shockwaves compress the soil substrate! The snake feels seismic ground vibrations through its lower jawbone (quadrate bone) and raises its head in alert defense!'
      );
      if (onCompleted) onCompleted();
    } else {
      sounds.bubble();
      voiceAssistant.speak(
        'Snakes have NO external ear canals! Airborne flute music is completely inaudible to the snake. It only sways by visually tracking the charmer’s moving pipe!'
      );
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 380;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Deep Slate Lab

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 3.5, 9.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffedd5, 2.8);
    sunLight.position.set(6, 12, 8);
    scene.add(sunLight);

    const alertLight = new THREE.PointLight(activeStimulus === 'footsteps' ? 0xef4444 : 0x38bdf8, 3.0, 12);
    alertLight.position.set(0, 2, 3);
    scene.add(alertLight);

    // 1. Soil Ground Substrate
    const groundGeo = new THREE.PlaneGeometry(20, 14, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.95 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    scene.add(ground);

    // 2. 3D Snake Model (Coiled body with raised head)
    const snakeGroup = new THREE.Group();
    scene.add(snakeGroup);

    const snakeSpec = SNAKES[selectedSnake];
    const snakeMat = new THREE.MeshStandardMaterial({ color: snakeSpec.colorHex, roughness: 0.6 });

    // Coiled base curves
    const coilCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.2, -0.35, 0.8),
      new THREE.Vector3(0.0, -0.35, 1.4),
      new THREE.Vector3(1.2, -0.35, 0.6),
      new THREE.Vector3(0.8, -0.35, -0.8),
      new THREE.Vector3(-0.6, -0.35, -0.6),
      new THREE.Vector3(0.0, 0.2, 0.0), // Ascending neck
      new THREE.Vector3(0.0, 1.4, 0.2), // Raised head
    ]);

    const snakeGeo = new THREE.TubeGeometry(coilCurve, 40, 0.22, 12, false);
    const snakeMesh = new THREE.Mesh(snakeGeo, snakeMat);
    snakeGroup.add(snakeMesh);

    // Snake Head & Quadrate Jawbone
    const headGeo = new THREE.SphereGeometry(0.3, 16, 16);
    headGeo.scale(1.2, 0.7, 1.4);
    const head = new THREE.Mesh(headGeo, snakeMat);
    head.position.set(0, 1.4, 0.3);
    snakeGroup.add(head);

    // If Cobra: Defensive Hood
    let hoodMesh: THREE.Mesh | null = null;
    if (snakeSpec.hood) {
      const hoodGeo = new THREE.ConeGeometry(0.7, 1.1, 4);
      hoodGeo.scale(1.2, 1.0, 0.15);
      const hoodMat = new THREE.MeshStandardMaterial({ color: 0x271306, roughness: 0.5 });
      hoodMesh = new THREE.Mesh(hoodGeo, hoodMat);
      hoodMesh.position.set(0, 0.9, 0.1);
      hoodMesh.rotation.z = Math.PI;
      snakeGroup.add(hoodMesh);
    }

    // 3. Ground Compression Shockwaves (Active on Footsteps)
    const waveRings: THREE.Mesh[] = [];
    const ringGeo = new THREE.RingGeometry(0.3, 0.5, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.7, side: THREE.DoubleSide });

    for (let r = 0; r < 5; r++) {
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(-3.5, -0.48, 0);
      scene.add(ring);
      waveRings.push(ring);
    }

    // 4. Airborne Flute Soundwaves (Active on Flute)
    const airArcs: THREE.Mesh[] = [];
    const arcGeo = new THREE.TorusGeometry(0.8, 0.04, 8, 24, Math.PI);
    const arcMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 });

    for (let a = 0; a < 4; a++) {
      const arc = new THREE.Mesh(arcGeo, arcMat);
      arc.position.set(3.5, 2.5, 0);
      arc.rotation.y = -Math.PI / 2;
      scene.add(arc);
      airArcs.push(arc);
    }

    // 5. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Snake head alert tracking movement
      if (activeStimulus === 'footsteps') {
        head.rotation.y = Math.sin(elapsed * 4) * 0.15 - 0.2; // Alert turning to footsteps
        head.position.y = 1.4 + Math.sin(elapsed * 8) * 0.04;
      } else if (activeStimulus === 'flute') {
        head.rotation.y = Math.sin(elapsed * 2) * 0.3 + 0.2; // Visual swaying to moving pipe
        head.position.y = 1.4 + Math.sin(elapsed * 3) * 0.02;
      } else {
        head.rotation.y = Math.sin(elapsed * 1) * 0.05;
      }

      // Animate ground compression rings
      waveRings.forEach((ring, idx) => {
        if (activeStimulus === 'footsteps') {
          const scale = 1.0 + ((elapsed * 2 + idx * 0.6) % 3.0) * 2.5;
          ring.scale.set(scale, scale, 1);
          ring.visible = true;
        } else {
          ring.visible = false;
        }
      });

      // Animate airborne flute soundwaves
      airArcs.forEach((arc, idx) => {
        if (activeStimulus === 'flute') {
          const xOffset = -((elapsed * 2 + idx * 0.8) % 4.0) * 1.5;
          arc.position.x = 3.5 + xOffset;
          arc.visible = true;
        } else {
          arc.visible = false;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [activeStimulus, selectedSnake]);

  return (
    <div className="w-full bg-slate-900 text-white rounded-3xl border-3 border-emerald-400 p-4 sm:p-6 shadow-2xl flex flex-col gap-4 font-sans select-none">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>3D Reptilian Acoustic Vibration Lab</span>
            </span>
            <span className="text-xs font-bold text-amber-300">
              {activeStimulus === 'footsteps' ? '⚡ GROUND SEISMIC WAVES DETECTED' : activeStimulus === 'flute' ? '❌ AIRBORNE MUSIC INAUDIBLE (NO EARDRUM)' : 'Select Acoustic Stimulus'}
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-black text-white mt-1">
            Seismic Jawbone Sound Transmission vs Airborne Music 🐍
          </h4>
          <p className="text-xs font-bold text-slate-300">
            Snakes have NO external ear canal. They hear footstep vibrations through their resting jawbone!
          </p>
        </div>

        {/* Stimulus Triggers */}
        <div className="flex gap-2">
          <button
            onClick={() => handleTriggerStimulus('footsteps')}
            className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition-all flex items-center gap-1.5 ${
              activeStimulus === 'footsteps'
                ? 'bg-rose-500 text-white shadow-md scale-105'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Footprints className="w-3.5 h-3.5" />
            <span>1. Heavy Footsteps</span>
          </button>
          <button
            onClick={() => handleTriggerStimulus('flute')}
            className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition-all flex items-center gap-1.5 ${
              activeStimulus === 'flute'
                ? 'bg-sky-400 text-slate-950 shadow-md scale-105'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>2. Been Flute in Air</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden relative bg-slate-950 border border-slate-700 shadow-inner"
      />

      {/* Snake Species Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {(Object.keys(SNAKES) as (keyof typeof SNAKES)[]).map((key) => {
          const isSelected = selectedSnake === key;
          const s = SNAKES[key];
          return (
            <button
              key={key}
              onClick={() => {
                sounds.pop();
                setSelectedSnake(key);
              }}
              className={`p-2.5 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                isSelected
                  ? 'bg-amber-400 text-slate-950 border-white shadow-md font-black scale-102 ring-2 ring-amber-300'
                  : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <span className="text-xs font-black block">{s.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
