import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Sparkles, RefreshCw, Zap, Sliders, ShieldCheck, Dumbbell } from 'lucide-react';

interface Props {
  onMixed?: () => void;
}

export const ThreeEpoxyChemistryLab: React.FC<Props> = ({ onMixed }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [dispenseProgress, setDispenseProgress] = useState<number>(0); // 0 to 100%
  const [testForceKg, setTestForceKg] = useState<number>(0); // 0 to 500 kg
  const [isCured, setIsCured] = useState<boolean>(false);
  const [isTestingPull, setIsTestingPull] = useState<boolean>(false);

  const stateRef = useRef({
    dispenseProgress: 0,
    testForceKg: 0,
    isCured: false,
    isTestingPull: false,
  });

  useEffect(() => {
    stateRef.current.dispenseProgress = dispenseProgress;
    stateRef.current.testForceKg = testForceKg;
    stateRef.current.isCured = isCured;
    stateRef.current.isTestingPull = isTestingPull;
  }, [dispenseProgress, testForceKg, isCured, isTestingPull]);

  const handleDispense = () => {
    if (dispenseProgress >= 100) return;
    sounds.pop();
    const next = Math.min(100, dispenseProgress + 25);
    setDispenseProgress(next);

    if (next >= 100) {
      setIsCured(true);
      sounds.fanfare();
      voiceAssistant.speak(
        'Resin A and Hardener B swirled through the spiral nozzle! Chemical polymerization has bonded the molecules into an unbreakable 3D crystal cage!'
      );
      if (onMixed) onMixed();
    } else {
      voiceAssistant.speak(`Dispensing liquids: ${next}% mixed.`);
    }
  };

  const handlePullTest = () => {
    sounds.pop();
    setIsTestingPull(true);
    let force = 0;
    const interval = setInterval(() => {
      force += 50;
      setTestForceKg(force);
      sounds.bubble();
      if (force >= 500) {
        clearInterval(interval);
        sounds.sparkle();
        voiceAssistant.speak(
          '500 Kilograms of pulling force applied! The epoxy weld held perfectly without breaking!'
        );
      }
    }, 150);
  };

  const handleReset = () => {
    sounds.pop();
    setDispenseProgress(0);
    setTestForceKg(0);
    setIsCured(false);
    setIsTestingPull(false);
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090d16);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3.2, 8.8);
    camera.lookAt(0, 0.4, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);

    // 2. High-Tech Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(6, 12, 8);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const cyanRim = new THREE.PointLight(0x06b6d4, 2.5, 12);
    cyanRim.position.set(-4, 2, 4);
    scene.add(cyanRim);

    const amberFill = new THREE.PointLight(0xf59e0b, 2.5, 12);
    amberFill.position.set(4, 2, 4);
    scene.add(amberFill);

    // 3. Laboratory Tabletop
    const tableGeo = new THREE.PlaneGeometry(18, 12);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6, metalness: 0.2 });
    const tableMesh = new THREE.Mesh(tableGeo, tableMat);
    tableMesh.rotation.x = -Math.PI / 2;
    tableMesh.position.y = -1.6;
    scene.add(tableMesh);

    const gridHelper = new THREE.GridHelper(14, 14, 0x10b981, 0x334155);
    gridHelper.position.y = -1.59;
    scene.add(gridHelper);

    // 4. Dual-Chamber Syringe Tool Assembly (Top Left)
    const syringeGroup = new THREE.Group();
    syringeGroup.position.set(-2.2, 1.0, 0);
    scene.add(syringeGroup);

    // Barrel Body (Glass Transparent Tubes)
    const barrelMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      transmission: 0.8,
    });
    const barrelGeo = new THREE.CylinderGeometry(0.32, 0.32, 2.6, 24);

    const barrelA = new THREE.Mesh(barrelGeo, barrelMat);
    barrelA.position.set(-0.38, 0, 0);
    syringeGroup.add(barrelA);

    const barrelB = new THREE.Mesh(barrelGeo, barrelMat);
    barrelB.position.set(0.38, 0, 0);
    syringeGroup.add(barrelB);

    // Liquid Columns inside Syringes
    const liquidMatA = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.5,
      roughness: 0.2,
    });
    const liquidGeoA = new THREE.CylinderGeometry(0.3, 0.3, 2.4, 24);
    const liquidMeshA = new THREE.Mesh(liquidGeoA, liquidMatA);
    liquidMeshA.position.set(-0.38, 0, 0);
    syringeGroup.add(liquidMeshA);

    const liquidMatB = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.5,
      roughness: 0.2,
    });
    const liquidGeoB = new THREE.CylinderGeometry(0.3, 0.3, 2.4, 24);
    const liquidMeshB = new THREE.Mesh(liquidGeoB, liquidMatB);
    liquidMeshB.position.set(0.38, 0, 0);
    syringeGroup.add(liquidMeshB);

    // Plunger Bridge Handle (Pushes down together 1:1)
    const plungerMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 });
    const plungerBridgeGeo = new THREE.BoxGeometry(1.3, 0.18, 0.5);
    const plungerBridge = new THREE.Mesh(plungerBridgeGeo, plungerMat);
    plungerBridge.position.set(0, 1.4, 0);
    syringeGroup.add(plungerBridge);

    // Spiral Mixing Nozzle at Bottom
    const nozzleMat = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.3 });
    const nozzleGeo = new THREE.ConeGeometry(0.25, 1.2, 16);
    const nozzleMesh = new THREE.Mesh(nozzleGeo, nozzleMat);
    nozzleMesh.rotation.x = Math.PI;
    nozzleMesh.position.set(0, -1.8, 0);
    syringeGroup.add(nozzleMesh);

    // 5. Test Specimen: Two Heavy Steel Plates (Right Side)
    const platesGroup = new THREE.Group();
    platesGroup.position.set(1.8, 0, 0);
    scene.add(platesGroup);

    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.9,
      roughness: 0.2,
    });
    const plateGeo = new THREE.BoxGeometry(1.6, 2.2, 0.6);

    const leftPlate = new THREE.Mesh(plateGeo, steelMat);
    leftPlate.position.set(-0.9, 0, 0);
    platesGroup.add(leftPlate);

    const rightPlate = new THREE.Mesh(plateGeo, steelMat);
    rightPlate.position.set(0.9, 0, 0);
    platesGroup.add(rightPlate);

    // The Epoxy Weld Seam in Between Plates
    const weldGeo = new THREE.BoxGeometry(0.22, 2.22, 0.62);
    const weldMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x34d399,
      emissiveIntensity: 0.2,
      roughness: 0.3,
    });
    const weldMesh = new THREE.Mesh(weldGeo, weldMat);
    weldMesh.position.set(0, 0, 0);
    weldMesh.scale.set(0, 0, 0);
    platesGroup.add(weldMesh);

    // Pull Tension Clamps on Left and Right
    const clampMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, metalness: 0.8 });
    const clampGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.0, 16);

    const leftClamp = new THREE.Mesh(clampGeo, clampMat);
    leftClamp.rotation.z = Math.PI / 2;
    leftClamp.position.set(-2.0, 0, 0);
    platesGroup.add(leftClamp);

    const rightClamp = new THREE.Mesh(clampGeo, clampMat);
    rightClamp.rotation.z = Math.PI / 2;
    rightClamp.position.set(2.0, 0, 0);
    platesGroup.add(rightClamp);

    // Sparkle Particle Effect for Curing
    const sparkleCount = 30;
    const sparkleGeo = new THREE.BufferGeometry();
    const sparklePositions = new Float32Array(sparkleCount * 3);
    for (let i = 0; i < sparkleCount; i++) {
      sparklePositions[i * 3] = (Math.random() - 0.5) * 0.4;
      sparklePositions[i * 3 + 1] = (Math.random() - 0.5) * 2.0;
      sparklePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
    }
    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
    const sparkleMat = new THREE.PointsMaterial({
      color: 0x6ee7b7,
      size: 0.15,
      transparent: true,
      opacity: 0,
    });
    const sparkles = new THREE.Points(sparkleGeo, sparkleMat);
    platesGroup.add(sparkles);

    // 6. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      const { dispenseProgress: progress, isCured: cured, testForceKg: force } = stateRef.current;

      // Animate Plunger & Liquid Drop
      const plungerY = 1.4 - (progress / 100) * 1.8;
      plungerBridge.position.y = plungerY;

      const liquidScaleY = Math.max(0.01, 1 - (progress / 100) * 0.95);
      liquidMeshA.scale.y = liquidScaleY;
      liquidMeshA.position.y = -(progress / 100) * 0.9;
      liquidMeshB.scale.y = liquidScaleY;
      liquidMeshB.position.y = -(progress / 100) * 0.9;

      // Animate Weld Formation
      if (progress > 0) {
        const weldScale = Math.min(1.0, progress / 100);
        weldMesh.scale.set(weldScale, weldScale, weldScale);
      }

      if (cured) {
        sparkleMat.opacity = 0.8 + Math.sin(time * 5) * 0.2;
        weldMat.emissiveIntensity = 0.4 + Math.sin(time * 4) * 0.2;
      } else {
        sparkleMat.opacity = 0;
        weldMat.emissiveIntensity = 0.1;
      }

      // Animate Pull Force Stress Tension
      if (force > 0) {
        const jitter = (Math.random() - 0.5) * 0.01 * (force / 500);
        leftPlate.position.x = -0.9 + jitter;
        rightPlate.position.x = 0.9 - jitter;
      } else {
        leftPlate.position.x = -0.9;
        rightPlate.position.x = 0.9;
      }

      // Gentle Camera rotation
      camera.position.x = Math.sin(time * 0.3) * 0.3;
      camera.lookAt(0, 0.4, 0);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="w-full max-w-3xl bg-white p-5 sm:p-7 rounded-[36px] border-4 border-emerald-400 shadow-2xl flex flex-col items-center select-none font-sans text-slate-900">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full mb-4 border-b-2 border-slate-100 pb-3">
        <div className="text-center sm:text-left">
          <span className="text-xs font-black uppercase text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 inline-block mb-1">
            🧪 3D Two-Part Epoxy Chemistry Lab
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Why Do 2 Separate Liquids Turn Into Rock-Solid Glue?
          </h3>
        </div>

        {/* Curing Status Badge */}
        <div className="flex items-center gap-2">
          <span className={`px-3.5 py-1.5 rounded-full text-xs font-black shadow-sm ${
            isCured ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 text-slate-700 border border-slate-200'
          }`}>
            {isCured ? '✓ Polymerized Solid' : `Mixing: ${dispenseProgress}%`}
          </span>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div className="w-full h-72 sm:h-80 rounded-3xl overflow-hidden shadow-inner border-3 border-slate-800 relative bg-slate-950 flex items-center justify-center mb-4">
        <div ref={mountRef} className="w-full h-full" />

        {/* Live HUD Indicators */}
        <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-2 shadow-sm">
          <span>{dispenseProgress === 0 ? '🧪 1:1 Dual Syringe Ready (Resin + Hardener)' : isCured ? '✨ 3D Cross-Linked Polymer Matrix Formed!' : `⚡ Swirling through mixing nozzle: ${dispenseProgress}%`}</span>
        </div>

        {testForceKg > 0 && (
          <div className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-400 text-xs font-black text-emerald-300 shadow-sm flex items-center gap-1.5">
            <Dumbbell className="w-4 h-4 text-emerald-400" />
            <span>Tension Force: {testForceKg} KG (Holding Strong!)</span>
          </div>
        )}

        {/* Bottom Banner */}
        <div className="absolute bottom-3 bg-slate-950/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-700 text-xs font-bold text-white shadow-md">
          {!isCured
            ? 'Tap "Press Dual Plunger" to mix Liquid Resin (A) and Liquid Hardener (B) together!'
            : 'Epoxy fully cured! Test the unbreakable bond with 500 KG of hydraulic pulling force!'}
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {!isCured ? (
            <button
              onClick={handleDispense}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm shadow-md cursor-pointer active:scale-95 transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Press Dual Plunger (Dispense 1:1)</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePullTest}
                disabled={testForceKg > 0}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-black text-sm shadow-md cursor-pointer disabled:opacity-50 active:scale-95 transition-all flex items-center gap-2"
              >
                <Dumbbell className="w-4 h-4" />
                <span>🏗️ Test 500 KG Pull Force!</span>
              </button>

              <button
                onClick={handleReset}
                className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs cursor-pointer border border-slate-300 active:scale-95 transition-all"
                title="Reset Syringe"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* 5th Grade Key Science Takeaway */}
        <div className="text-xs font-bold text-slate-700 bg-emerald-50 p-3 rounded-2xl border border-emerald-200 max-w-sm text-center sm:text-right">
          💡 <strong>5th Grade Science Secret:</strong> Liquid A alone never dries, and Liquid B alone never dries. But when mixed 1:1, their molecular puzzle pieces lock into an <strong>unbreakable 3D crystal cage</strong>!
        </div>
      </div>
    </div>
  );
};
