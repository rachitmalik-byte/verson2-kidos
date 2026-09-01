import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Lock, Unlock, RotateCcw, Sparkles } from 'lucide-react';

interface Props {
  onCompleted?: () => void;
}

export const ThreeVelcroLab: React.FC<Props> = ({ onCompleted }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLatched, setIsLatched] = useState(false);
  const [pullForce, setPullForce] = useState(15); // 5N to 25N

  const handleToggleLatch = () => {
    sounds.pop();
    const next = !isLatched;
    setIsLatched(next);

    if (next) {
      sounds.sparkle();
      voiceAssistant.speak(
        'Elastic Hook Latch Engaged! Hundreds of microscopic curved plant hooks bend and grab onto flexible nylon loops with incredible mechanical strength!'
      );
      if (onCompleted) onCompleted();
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 380;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Slate-900 Lab

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.5, 9.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffbeb, 2.5);
    keyLight.position.set(6, 10, 8);
    scene.add(keyLight);

    const blueLight = new THREE.PointLight(0x38bdf8, 2.0, 10);
    blueLight.position.set(3, 0, 2);
    scene.add(blueLight);

    // 1. Left Side: Natural Burdock Burr Seed Body (with 24+ curved micro-hooks)
    const burdockGroup = new THREE.Group();
    scene.add(burdockGroup);

    // Core spherical seed body
    const seedGeo = new THREE.SphereGeometry(1.2, 24, 24);
    const seedMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    const seedMesh = new THREE.Mesh(seedGeo, seedMat);
    burdockGroup.add(seedMesh);

    // Radiating Curved Micro-Hook Spines
    const hookMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });
    const hookMeshes: THREE.Mesh[] = [];

    for (let i = 0; i < 20; i++) {
      const phi = Math.acos(-1 + (2 * i) / 20);
      const theta = Math.sqrt(20 * Math.PI) * phi;

      const sx = Math.cos(theta) * Math.sin(phi) * 1.1;
      const sy = Math.cos(phi) * 1.1;
      const sz = Math.sin(theta) * Math.sin(phi) * 1.1;

      // Curved Hook Tube
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0.8, 0),
        new THREE.Vector3(0.4, 0.6, 0) // Hook curl
      );
      const hookGeo = new THREE.TubeGeometry(curve, 12, 0.06, 8, false);
      const hookMesh = new THREE.Mesh(hookGeo, hookMat);

      hookMesh.position.set(sx, sy, sz);
      hookMesh.rotation.z = Math.atan2(sy, sx) - Math.PI / 2;
      hookMesh.rotation.y = theta;

      burdockGroup.add(hookMesh);
      hookMeshes.push(hookMesh);
    }

    // 2. Right Side: Synthetic Nylon Loop Strip
    const nylonGroup = new THREE.Group();
    scene.add(nylonGroup);

    // Nylon fabric backing
    const backGeo = new THREE.BoxGeometry(0.3, 4.5, 3.5);
    const backMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.5 });
    const backing = new THREE.Mesh(backGeo, backMat);
    backing.position.x = 0;
    nylonGroup.add(backing);

    // Flexible Nylon Loops
    const loopMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 });
    const loopMeshes: THREE.Mesh[] = [];

    for (let y = -1.6; y <= 1.6; y += 0.55) {
      for (let z = -1.2; z <= 1.2; z += 0.6) {
        const loopCurve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(0, y - 0.2, z),
          new THREE.Vector3(-0.9, y, z),
          new THREE.Vector3(0, y + 0.2, z)
        );
        const loopGeo = new THREE.TubeGeometry(loopCurve, 16, 0.05, 8, false);
        const loopMesh = new THREE.Mesh(loopGeo, loopMat);
        nylonGroup.add(loopMesh);
        loopMeshes.push(loopMesh);
      }
    }

    // 3. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (isLatched) {
        // Tight interlocking contact with tension vibration
        const targetBurdockX = -0.4;
        const targetNylonX = 0.8;

        burdockGroup.position.x = THREE.MathUtils.lerp(burdockGroup.position.x, targetBurdockX, 0.1);
        nylonGroup.position.x = THREE.MathUtils.lerp(nylonGroup.position.x, targetNylonX, 0.1);

        // Pull Force Vibration & Strain
        const tensionVibe = Math.sin(elapsed * 25) * (pullForce * 0.003);
        burdockGroup.position.x += tensionVibe;
        nylonGroup.position.x -= tensionVibe;
      } else {
        // Open separated preview
        burdockGroup.position.x = THREE.MathUtils.lerp(burdockGroup.position.x, -2.8, 0.08);
        nylonGroup.position.x = THREE.MathUtils.lerp(nylonGroup.position.x, 2.8, 0.08);

        burdockGroup.rotation.y += 0.008;
        burdockGroup.rotation.z = Math.sin(elapsed * 2.0) * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [isLatched, pullForce]);

  return (
    <div className="w-full bg-slate-900 text-white rounded-3xl border-3 border-lime-400 p-4 sm:p-6 shadow-2xl flex flex-col gap-4 font-sans select-none">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-lime-400 bg-lime-400/10 border border-lime-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-lime-400" />
              <span>3D Biomimicry Microscope Lab</span>
            </span>
            <span className="text-xs font-bold text-amber-300">
              {isLatched ? '🔒 Interlocked Latch' : '🔓 Open Surfaces'}
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-black text-white mt-1">
            Natural Burdock Micro-Hooks 🪝 vs Nylon Loops 🧵
          </h4>
          <p className="text-xs font-bold text-slate-300">
            Swiss engineer George de Mestral copied the elastic hooked spines of burdock seeds to invent Velcro in 1948!
          </p>
        </div>

        <button
          onClick={handleToggleLatch}
          className={`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm cursor-pointer shadow-md active:scale-95 transition-all flex items-center gap-1.5 shrink-0 ${
            isLatched
              ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 ring-2 ring-white/50'
              : 'bg-lime-500 hover:bg-lime-400 text-slate-950'
          }`}
        >
          {isLatched ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          <span>{isLatched ? 'Release Latch 🔓' : 'Press Together to Latch 🔒'}</span>
        </button>
      </div>

      <div
        ref={mountRef}
        className="w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden relative bg-slate-950 border border-slate-700 shadow-inner"
      />

      {isLatched && (
        <div className="flex items-center justify-between gap-4 bg-slate-950/90 p-3 rounded-2xl border border-slate-800">
          <div>
            <span className="text-xs font-black text-white block">Tensile Holding Strength</span>
            <span className="text-[10px] font-bold text-slate-400">
              Force resisted by hook friction: {pullForce} N
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="25"
            value={pullForce}
            onChange={(e) => setPullForce(Number(e.target.value))}
            className="accent-amber-400 cursor-pointer w-40"
          />
        </div>
      )}
    </div>
  );
};
