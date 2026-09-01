import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Lock, Unlock, Sparkles, Sliders } from 'lucide-react';

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
        'Mechanical Latch Engaged! Thousands of flexible micro-hooks bend, slip inside the woven loops, and grip securely under tension!'
      );
      if (onCompleted) onCompleted();
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 400;

    // 1. Scene & Modern Laboratory Lighting
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Slate-900 Lab

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.0, 10.5);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);

    // Bright Lab Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(8, 14, 10);
    scene.add(keyLight);

    const blueLight = new THREE.PointLight(0x38bdf8, 3.0, 15);
    blueLight.position.set(3, 1, 4);
    scene.add(blueLight);

    const greenLight = new THREE.PointLight(0x4ade80, 2.0, 12);
    greenLight.position.set(-4, 2, 3);
    scene.add(greenLight);

    // 2. Left Side: Authentic Botanical Burdock Plant Branch & Seed Pod
    const plantGroup = new THREE.Group();
    scene.add(plantGroup);

    // Green Botanical Stem
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.8, -3.0, 0),
      new THREE.Vector3(-1.6, -1.0, 0.2),
      new THREE.Vector3(-1.4, 0.8, 0),
    ]);
    const stemGeo = new THREE.TubeGeometry(stemCurve, 24, 0.14, 12, false);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.7 });
    const stemMesh = new THREE.Mesh(stemGeo, stemMat);
    plantGroup.add(stemMesh);

    // Green Botanical Leaves
    const leafGeo = new THREE.ConeGeometry(0.5, 1.8, 4);
    leafGeo.scale(0.8, 1.0, 0.2);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x15803d, side: THREE.DoubleSide });

    const leaf1 = new THREE.Mesh(leafGeo, leafMat);
    leaf1.position.set(-1.6, -0.8, 0.3);
    leaf1.rotation.z = 0.8;
    leaf1.rotation.y = 0.3;
    plantGroup.add(leaf1);

    const leaf2 = new THREE.Mesh(leafGeo, leafMat);
    leaf2.position.set(-1.4, 0.2, -0.2);
    leaf2.rotation.z = -0.7;
    leaf2.rotation.y = -0.4;
    plantGroup.add(leaf2);

    // Natural Burdock Flower / Seed Burr Cluster
    const burdockBurr = new THREE.Group();
    burdockBurr.position.set(-1.4, 0.8, 0);
    plantGroup.add(burdockBurr);

    // Green/Tan Calyx base
    const calyxGeo = new THREE.SphereGeometry(0.85, 20, 20);
    calyxGeo.scale(0.9, 1.1, 0.9);
    const calyxMat = new THREE.MeshStandardMaterial({ color: 0x65a30d, roughness: 0.8 });
    const calyxMesh = new THREE.Mesh(calyxGeo, calyxMat);
    burdockBurr.add(calyxMesh);

    // Realistic Prickly Micro-Hook Spines (Golden/Brown flexible hooks)
    const spineMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 });
    for (let i = 0; i < 28; i++) {
      const phi = Math.acos(-1 + (2 * i) / 28);
      const theta = Math.sqrt(28 * Math.PI) * phi;

      const sx = Math.cos(theta) * Math.sin(phi) * 0.85;
      const sy = Math.cos(phi) * 0.95;
      const sz = Math.sin(theta) * Math.sin(phi) * 0.85;

      const hookCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0.6, 0),
        new THREE.Vector3(0.25, 0.45, 0) // Gentle natural hook curl
      );
      const hookGeo = new THREE.TubeGeometry(hookCurve, 10, 0.04, 6, false);
      const hookMesh = new THREE.Mesh(hookGeo, spineMat);

      hookMesh.position.set(sx, sy, sz);
      hookMesh.rotation.z = Math.atan2(sy, sx) - Math.PI / 2;
      hookMesh.rotation.y = theta;

      burdockBurr.add(hookMesh);
    }

    // 3. Right Side: Synthetic Nylon Velcro Shoe / Backpack Fastener Strap
    const strapGroup = new THREE.Group();
    scene.add(strapGroup);

    // Modern Textile Fastener Strap Body (Textured Blue Weave)
    const strapBodyGeo = new THREE.BoxGeometry(0.35, 4.2, 2.8);
    const strapBodyMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.5 });
    const strapBody = new THREE.Mesh(strapBodyGeo, strapBodyMat);
    strapGroup.add(strapBody);

    // Nylon Loop Bed (Facing the plant hooks)
    const loopMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.25 });
    for (let y = -1.5; y <= 1.5; y += 0.5) {
      for (let z = -1.0; z <= 1.0; z += 0.5) {
        const loopCurve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(0, y - 0.18, z),
          new THREE.Vector3(-0.7, y, z),
          new THREE.Vector3(0, y + 0.18, z)
        );
        const loopGeo = new THREE.TubeGeometry(loopCurve, 12, 0.045, 6, false);
        const loopMesh = new THREE.Mesh(loopGeo, loopMat);
        strapGroup.add(loopMesh);
      }
    }

    // 4. Smooth 60 FPS Latching Physics Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (isLatched) {
        // Locked contact: Strap closes onto burdock seed hooks
        plantGroup.position.x = THREE.MathUtils.lerp(plantGroup.position.x, 0.2, 0.1);
        strapGroup.position.x = THREE.MathUtils.lerp(strapGroup.position.x, 0.8, 0.1);

        // Tensile pull tension strain & micro-vibration
        const strain = Math.sin(elapsed * 24) * (pullForce * 0.002);
        plantGroup.position.x += strain;
        strapGroup.position.x -= strain;

        burdockBurr.rotation.z = Math.sin(elapsed * 2) * 0.03;
      } else {
        // Open separated preview
        plantGroup.position.x = THREE.MathUtils.lerp(plantGroup.position.x, -2.2, 0.08);
        strapGroup.position.x = THREE.MathUtils.lerp(strapGroup.position.x, 2.6, 0.08);

        plantGroup.position.y = Math.sin(elapsed * 1.5) * 0.05;
        strapGroup.position.y = Math.cos(elapsed * 1.5) * 0.05;

        burdockBurr.rotation.y = elapsed * 0.4;
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
              <span>3D Biomimicry Fastener Lab</span>
            </span>
            <span className="text-xs font-bold text-amber-300">
              {isLatched ? '🔒 Interlocked Latch' : '🔓 Open Surfaces'}
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-black text-white mt-1">
            Natural Burdock Seed Burr 🌿 vs Synthetic Nylon Velcro Strap 🧵
          </h4>
          <p className="text-xs font-bold text-slate-300">
            Swiss engineer George de Mestral copied burdock seed hooks to create Velcro hook-and-loop fasteners in 1948!
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

      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="w-full h-[340px] sm:h-[400px] rounded-2xl overflow-hidden relative bg-slate-950 border border-slate-700 shadow-inner"
      />

      {isLatched && (
        <div className="flex items-center justify-between gap-4 bg-slate-950/90 p-3.5 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-xs font-black text-white block">Tensile Holding Force: {pullForce} N</span>
              <span className="text-[10px] font-bold text-slate-400">
                Thousands of microscopic hooks resist detachment until peeled at an angle!
              </span>
            </div>
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
