import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Gauge, Sparkles, RefreshCw, AlertTriangle, CheckCircle2, Droplet, ShieldCheck } from 'lucide-react';

interface Props {
  onSealed?: () => void;
}

export const ThreePipeLeakLab: React.FC<Props> = ({ onSealed }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [adhesiveType, setAdhesiveType] = useState<'none' | 'pine' | 'epoxy'>('none');
  const [pressurePsi, setPressurePsi] = useState<number>(80);
  const [isApplying, setIsApplying] = useState<boolean>(false);

  const isSealed = adhesiveType === 'epoxy';

  const stateRef = useRef({
    adhesiveType: 'none',
    pressurePsi: 80,
    isSealed: false,
    pineBlowTime: 0,
    epoxyCureProgress: 0,
  });

  useEffect(() => {
    stateRef.current.adhesiveType = adhesiveType;
    stateRef.current.pressurePsi = pressurePsi;
    stateRef.current.isSealed = isSealed;
  }, [adhesiveType, pressurePsi, isSealed]);

  const handleApply = (type: 'pine' | 'epoxy') => {
    if (isApplying) return;
    sounds.pop();
    setIsApplying(true);

    if (type === 'pine') {
      sounds.bubble();
      setAdhesiveType('pine');
      stateRef.current.adhesiveType = 'pine';
      stateRef.current.pineBlowTime = 0.01;
      voiceAssistant.speak(
        'Oh no! Natural pine sap is water-soluble. The 80 PSI water jet blows the pine resin right off the pipe!'
      );
      setTimeout(() => {
        setIsApplying(false);
      }, 1200);
    } else {
      sounds.sparkle();
      setAdhesiveType('epoxy');
      stateRef.current.adhesiveType = 'epoxy';
      stateRef.current.epoxyCureProgress = 0.01;
      setPressurePsi(0);
      sounds.fanfare();
      voiceAssistant.speak(
        'Success! 2-Part synthetic epoxy undergoes chemical cross-linking, curing underwater into an indestructible rock-hard seal!'
      );
      setTimeout(() => {
        setIsApplying(false);
        if (onSealed) onSealed();
      }, 800);
    }
  };

  const handleReset = () => {
    sounds.pop();
    setAdhesiveType('none');
    setPressurePsi(80);
    stateRef.current.adhesiveType = 'none';
    stateRef.current.pressurePsi = 80;
    stateRef.current.isSealed = false;
    stateRef.current.pineBlowTime = 0;
    stateRef.current.epoxyCureProgress = 0;
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090d16); // Deep Navy Industrial Studio

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.8, 8.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);

    // 2. High-Tech Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainLight.position.set(5, 10, 8);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const cyanRim = new THREE.PointLight(0x06b6d4, 3.0, 15);
    cyanRim.position.set(0, 3, 3);
    scene.add(cyanRim);

    const blueBack = new THREE.PointLight(0x3b82f6, 2.0, 12);
    blueBack.position.set(-4, -1, -3);
    scene.add(blueBack);

    // 3. Industrial Floor Grid
    const floorGeo = new THREE.PlaneGeometry(20, 14);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.7,
      metalness: 0.2,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -1.8;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const gridHelper = new THREE.GridHelper(16, 16, 0x06b6d4, 0x334155);
    gridHelper.position.y = -1.79;
    scene.add(gridHelper);

    // 4. Main Steel Galvanized Water Pipe
    const pipeGroup = new THREE.Group();
    scene.add(pipeGroup);

    // Galvanized Metallic Pipe Tube
    const pipeGeo = new THREE.CylinderGeometry(0.55, 0.55, 10, 32);
    const pipeMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.85,
      roughness: 0.25,
    });
    const pipeMesh = new THREE.Mesh(pipeGeo, pipeMat);
    pipeMesh.rotation.z = Math.PI / 2;
    pipeMesh.castShadow = true;
    pipeGroup.add(pipeMesh);

    // Chrome Flange Collars on Left and Right
    const flangeGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.35, 32);
    const flangeMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9, roughness: 0.2 });

    const flange1 = new THREE.Mesh(flangeGeo, flangeMat);
    flange1.rotation.z = Math.PI / 2;
    flange1.position.x = -3.8;
    pipeGroup.add(flange1);

    const flange2 = new THREE.Mesh(flangeGeo, flangeMat);
    flange2.rotation.z = Math.PI / 2;
    flange2.position.x = 3.8;
    pipeGroup.add(flange2);

    // Central Crack Collar
    const collarGeo = new THREE.CylinderGeometry(0.62, 0.62, 0.8, 32);
    const collarMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.4 });
    const collarMesh = new THREE.Mesh(collarGeo, collarMat);
    collarMesh.rotation.z = Math.PI / 2;
    pipeGroup.add(collarMesh);

    // Pipe Pressure Gauge Dial on Left
    const gaugeStemGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.0, 16);
    const gaugeStemMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8 });
    const gaugeStem = new THREE.Mesh(gaugeStemGeo, gaugeStemMat);
    gaugeStem.position.set(-2.5, 0.9, 0);
    pipeGroup.add(gaugeStem);

    const gaugeDialGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.15, 32);
    const gaugeDialMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
    const gaugeDial = new THREE.Mesh(gaugeDialGeo, gaugeDialMat);
    gaugeDial.position.set(-2.5, 1.4, 0);
    gaugeDial.rotation.x = Math.PI / 4;
    pipeGroup.add(gaugeDial);

    // 5. 3D Hydrodynamic High-Pressure Water Jet Geyser
    const waterJetGeo = new THREE.ConeGeometry(0.35, 3.8, 24, 1, true);
    const waterJetMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.75,
      roughness: 0.1,
    });
    const waterJetMesh = new THREE.Mesh(waterJetGeo, waterJetMat);
    waterJetMesh.position.set(0, 2.2, 0);
    scene.add(waterJetMesh);

    // High-Pressure Water Spray Particle Droplet Cloud
    const dropCount = 120;
    const dropGeo = new THREE.BufferGeometry();
    const dropPositions = new Float32Array(dropCount * 3);
    const dropVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < dropCount; i++) {
      dropPositions[i * 3] = (Math.random() - 0.5) * 0.4;
      dropPositions[i * 3 + 1] = 0.5 + Math.random() * 3.5;
      dropPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
      dropVelocities.push({
        x: (Math.random() - 0.5) * 2.5,
        y: 4 + Math.random() * 6,
        z: (Math.random() - 0.5) * 2.5,
      });
    }

    dropGeo.setAttribute('position', new THREE.BufferAttribute(dropPositions, 3));
    const dropMat = new THREE.PointsMaterial({
      color: 0x7dd3fc,
      size: 0.12,
      transparent: true,
      opacity: 0.85,
    });
    const dropParticles = new THREE.Points(dropGeo, dropMat);
    scene.add(dropParticles);

    // 6. Natural Pine Resin Blob (Water Soluble - Gets blown away)
    const pineGeo = new THREE.SphereGeometry(0.4, 16, 16);
    pineGeo.scale(1.4, 0.7, 1.2);
    const pineMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.3,
      metalness: 0.1,
      transparent: true,
      opacity: 0.9,
    });
    const pineMesh = new THREE.Mesh(pineGeo, pineMat);
    pineMesh.position.set(0, 0.6, 0);
    pineMesh.visible = false;
    scene.add(pineMesh);

    // 7. Synthetic 2-Part Epoxy Solid Ring Collar (Waterproof Seal)
    const epoxyGeo = new THREE.CylinderGeometry(0.72, 0.72, 1.1, 32);
    const epoxyMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.4,
      metalness: 0.4,
      roughness: 0.2,
    });
    const epoxyMesh = new THREE.Mesh(epoxyGeo, epoxyMat);
    epoxyMesh.rotation.z = Math.PI / 2;
    epoxyMesh.visible = false;
    scene.add(epoxyMesh);

    // Glowing Success Sparkle Particles around Epoxy Seal
    const sparkleCount = 30;
    const sparkleGeo = new THREE.BufferGeometry();
    const sparklePositions = new Float32Array(sparkleCount * 3);
    for (let i = 0; i < sparkleCount; i++) {
      const angle = (i / sparkleCount) * Math.PI * 2;
      sparklePositions[i * 3] = Math.cos(angle) * 0.9;
      sparklePositions[i * 3 + 1] = Math.sin(angle) * 0.9;
      sparklePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
    const sparkleMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.16,
      transparent: true,
      opacity: 0,
    });
    const sparkleParticles = new THREE.Points(sparkleGeo, sparkleMat);
    scene.add(sparkleParticles);

    // 8. 60FPS Fluid Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      const time = clock.getElapsedTime();
      const { adhesiveType: curType, isSealed: sealed } = stateRef.current;

      // Handle Water Spray Animation
      if (!sealed) {
        waterJetMesh.visible = true;
        dropParticles.visible = true;

        // Oscillate water jet height & turbulence
        const sprayScale = 1.0 + Math.sin(time * 25) * 0.08;
        waterJetMesh.scale.set(sprayScale, sprayScale, sprayScale);

        // Animate Spray Droplets upward
        const posAttr = dropGeo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < dropCount; i++) {
          let y = posAttr.getY(i) + dropVelocities[i].y * delta;
          let x = posAttr.getX(i) + dropVelocities[i].x * delta;
          let z = posAttr.getZ(i) + dropVelocities[i].z * delta;

          if (y > 4.2 || Math.abs(x) > 2.0) {
            y = 0.5;
            x = (Math.random() - 0.5) * 0.3;
            z = (Math.random() - 0.5) * 0.3;
          }
          posAttr.setXYZ(i, x, y, z);
        }
        posAttr.needsUpdate = true;
      } else {
        // Sealed by Epoxy! Water jet turns off completely
        waterJetMesh.visible = false;
        dropParticles.visible = false;
      }

      // Handle Pine Resin Blow-off animation
      if (curType === 'pine') {
        pineMesh.visible = true;
        stateRef.current.pineBlowTime += delta;
        const t = stateRef.current.pineBlowTime;

        if (t < 0.3) {
          pineMesh.position.set(0, 0.6, 0);
          pineMesh.scale.set(1.4, 0.7, 1.2);
        } else {
          // Blasted away by water jet!
          const blastT = t - 0.3;
          pineMesh.position.set(blastT * 3.5, 0.6 + blastT * 6.0, blastT * 2.0);
          pineMesh.rotation.z += delta * 12;
          pineMesh.rotation.x += delta * 8;
          pineMesh.scale.multiplyScalar(Math.max(0.01, 1 - delta * 2));
        }
      } else {
        pineMesh.visible = false;
      }

      // Handle Epoxy Seal Mesh
      if (curType === 'epoxy') {
        epoxyMesh.visible = true;
        epoxyMesh.scale.set(1, 1, 1);
        sparkleParticles.visible = true;
        sparkleMat.opacity = 0.8 + Math.sin(time * 6) * 0.2;
        sparkleParticles.rotation.x = time * 0.5;
      } else {
        epoxyMesh.visible = false;
        sparkleParticles.visible = false;
      }

      // Gentle camera sway
      camera.position.x = Math.sin(time * 0.4) * 0.3;
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
    <div className="w-full max-w-3xl bg-white p-5 sm:p-7 rounded-[36px] border-4 border-cyan-400 shadow-2xl flex flex-col items-center select-none font-sans text-slate-900">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full mb-4 border-b-2 border-slate-100 pb-3">
        <div className="text-center sm:text-left">
          <span className="text-xs font-black uppercase text-cyan-700 bg-cyan-100 px-3 py-1 rounded-full border border-cyan-300 inline-block mb-1">
            ⚡ 3D High-Pressure Pipe Burst & Epoxy Seal Lab
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Mission 12: Emergency Hydrodynamic Repair
          </h3>
        </div>

        {/* Live Pressure Gauge HUD Badge */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-black shadow-sm ${
            isSealed ? 'bg-emerald-100 border-emerald-300 text-emerald-950' : 'bg-rose-100 border-rose-300 text-rose-950 animate-pulse'
          }`}>
            <Gauge className="w-4 h-4" />
            <span>Pipe Pressure: {pressurePsi} PSI</span>
          </div>

          <span className={`px-3 py-1.5 rounded-full text-xs font-black ${
            isSealed ? 'bg-emerald-500 text-white shadow-md' : 'bg-rose-500 text-white animate-bounce'
          }`}>
            {isSealed ? '✓ SEALED' : '⚠️ BURSTING'}
          </span>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div className="w-full h-72 sm:h-80 rounded-3xl overflow-hidden shadow-inner border-3 border-slate-800 relative bg-slate-950 flex items-center justify-center mb-4">
        <div ref={mountRef} className="w-full h-full" />

        {/* Live Status Overlay */}
        <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-2 shadow-sm">
          <span>{isSealed ? '🛡️ Permanent Cross-Linked Epoxy Seal Active' : '🌊 High-Velocity 80 PSI Water Jet Spraying!'}</span>
        </div>

        {/* Bottom Banner */}
        <div className="absolute bottom-3 bg-slate-950/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-700 text-xs font-bold text-white shadow-md">
          {adhesiveType === 'none'
            ? 'Select an adhesive below to patch the 80 PSI high-pressure burst crack!'
            : adhesiveType === 'pine'
            ? '❌ Water-soluble pine resin dissolved & got blasted away!'
            : '✨ Epoxy cross-linked underwater into an unbreakable rock-solid seal!'}
        </div>
      </div>

      {/* Interactive Tool Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full mb-3">
        <button
          onClick={() => handleApply('pine')}
          disabled={isApplying || isSealed}
          className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 hover:bg-amber-100 text-slate-900 font-black text-xs sm:text-sm flex items-center gap-3 cursor-pointer transition-all active:scale-95 disabled:opacity-50 shadow-xs"
        >
          <span className="text-3xl">🌲</span>
          <div className="text-left">
            <span className="block text-amber-950 font-black">1. Apply Natural Pine Resin</span>
            <span className="text-[11px] text-amber-700 font-bold">Natural plant sap (Water-Soluble ❌)</span>
          </div>
        </button>

        <button
          onClick={() => handleApply('epoxy')}
          disabled={isApplying || isSealed}
          className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs sm:text-sm flex items-center gap-3 cursor-pointer transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
          <span className="text-3xl">🧪</span>
          <div className="text-left">
            <span className="block text-white font-black">2. Apply 2-Part Synthetic Epoxy</span>
            <span className="text-[11px] text-emerald-100 font-bold">Cures underwater (Waterproof 3D Matrix ✅)</span>
          </div>
        </button>
      </div>

      {/* Reset & Scientific Key Takeaway */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        {isSealed && (
          <button
            onClick={handleReset}
            className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center gap-1.5 cursor-pointer border border-slate-300 active:scale-95 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Test Pine Resin Again</span>
          </button>
        )}

        <div className="text-xs font-bold text-slate-700 bg-cyan-50 p-3 rounded-2xl border border-cyan-200 max-w-lg text-center sm:text-right ml-auto">
          💡 <strong>Science Secret:</strong> Natural glues dissolve in water. Synthetic <strong>2-Part Epoxy</strong> undergoes chemical polymerization, linking molecules into an unbreakable waterproof net!
        </div>
      </div>
    </div>
  );
};
