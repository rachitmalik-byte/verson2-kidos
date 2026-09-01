import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Flame, Sparkles, RefreshCw, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface Props {
  onTestedBoth?: () => void;
}

export const ThreeFlameBurnLab: React.FC<Props> = ({ onTestedBoth }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [fabricType, setFabricType] = useState<'cotton' | 'polyester'>('cotton');
  const [flameDistance, setFlameDistance] = useState<number>(0); // 0 (far) to 100 (in flame)
  const [testedFabrics, setTestedFabrics] = useState<{ cotton: boolean; polyester: boolean }>({
    cotton: false,
    polyester: false,
  });

  const isBurning = flameDistance >= 75;

  const stateRef = useRef({
    fabricType: 'cotton',
    distance: 0,
    isBurning: false,
    burnTime: 0,
  });

  useEffect(() => {
    stateRef.current.fabricType = fabricType;
    stateRef.current.distance = flameDistance;
    stateRef.current.isBurning = isBurning;
  }, [fabricType, flameDistance, isBurning]);

  const handleFabricSelect = (type: 'cotton' | 'polyester') => {
    sounds.pop();
    setFabricType(type);
    setFlameDistance(0);
    stateRef.current.burnTime = 0;
    if (type === 'cotton') {
      voiceAssistant.speak('Natural cotton swatch loaded. Slide the tweezers into the flame to observe how plant cellulose burns!');
    } else {
      voiceAssistant.speak('Synthetic polyester swatch loaded. Slide into the flame to observe how petroleum plastics melt!');
    }
  };

  const handleBurn = () => {
    sounds.flameIgnite();
    setFlameDistance(100);
    const updated = { ...testedFabrics, [fabricType]: true };
    setTestedFabrics(updated);

    if (fabricType === 'cotton') {
      voiceAssistant.speak(
        'Natural cotton burns like paper into soft, crumbly gray ash without melting or sticking to skin!'
      );
    } else {
      voiceAssistant.speak(
        'DANGER! Synthetic polyester melts rapidly into hot, boiling, sticky liquid plastic beads that fuse to skin!'
      );
    }

    if (updated.cotton && updated.polyester && onTestedBoth) {
      sounds.fanfare();
      onTestedBoth();
    }
  };

  const handleReset = () => {
    sounds.pop();
    setFlameDistance(0);
    stateRef.current.burnTime = 0;
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
    camera.position.set(0, 2.5, 7.8);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);

    // 2. High-Tech Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(5, 10, 8);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const flameLight = new THREE.PointLight(0xf97316, 3.5, 12);
    flameLight.position.set(-1.8, 1.2, 0);
    scene.add(flameLight);

    const blueFill = new THREE.PointLight(0x38bdf8, 2.0, 10);
    blueFill.position.set(3, 2, 4);
    scene.add(blueFill);

    // 3. Laboratory Heat-Proof Workbench
    const floorGeo = new THREE.PlaneGeometry(16, 12);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7, metalness: 0.2 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -1.6;
    scene.add(floorMesh);

    const gridHelper = new THREE.GridHelper(12, 12, 0xf97316, 0x334155);
    gridHelper.position.y = -1.59;
    scene.add(gridHelper);

    // 4. Industrial Laboratory Bunsen Burner (Left Side)
    const burnerGroup = new THREE.Group();
    burnerGroup.position.set(-1.8, -1.0, 0);
    scene.add(burnerGroup);

    const burnerBaseGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.25, 32);
    const burnerBaseMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.2 });
    const burnerBase = new THREE.Mesh(burnerBaseGeo, burnerBaseMat);
    burnerGroup.add(burnerBase);

    const burnerTubeGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.8, 24);
    const burnerTubeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.1 });
    const burnerTube = new THREE.Mesh(burnerTubeGeo, burnerTubeMat);
    burnerTube.position.set(0, 0.9, 0);
    burnerGroup.add(burnerTube);

    // 3D Realistic Animated Flame Core
    const flameCoreGeo = new THREE.ConeGeometry(0.28, 1.6, 24);
    const flameCoreMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xea580c,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.9,
    });
    const flameCore = new THREE.Mesh(flameCoreGeo, flameCoreMat);
    flameCore.position.set(-1.8, 1.5, 0);
    scene.add(flameCore);

    // Inner Blue Flame Tip
    const innerFlameGeo = new THREE.ConeGeometry(0.14, 0.7, 16);
    const innerFlameMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.0,
      transparent: true,
      opacity: 0.85,
    });
    const innerFlame = new THREE.Mesh(innerFlameGeo, innerFlameMat);
    innerFlame.position.set(-1.8, 1.1, 0);
    scene.add(innerFlame);

    // Flame Sparkle Particle Cloud
    const sparkCount = 35;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPositions = new Float32Array(sparkCount * 3);
    const sparkVels: THREE.Vector3[] = [];

    for (let i = 0; i < sparkCount; i++) {
      sparkPositions[i * 3] = -1.8 + (Math.random() - 0.5) * 0.3;
      sparkPositions[i * 3 + 1] = 1.0 + Math.random() * 1.5;
      sparkPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
      sparkVels.push(new THREE.Vector3((Math.random() - 0.5) * 0.8, 2.5 + Math.random() * 3.0, (Math.random() - 0.5) * 0.8));
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
    const sparkMat = new THREE.PointsMaterial({ color: 0xfacc15, size: 0.12, transparent: true, opacity: 0.8 });
    const flameParticles = new THREE.Points(sparkGeo, sparkMat);
    scene.add(flameParticles);

    // 5. Scientific Steel Tweezers & Fabric Swatch (Right Side)
    const tweezersGroup = new THREE.Group();
    scene.add(tweezersGroup);

    // Tweezers Handle
    const tweezerMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9, roughness: 0.2 });
    const tweezerGeo = new THREE.BoxGeometry(2.4, 0.1, 0.25);
    const tweezerMesh = new THREE.Mesh(tweezerGeo, tweezerMat);
    tweezerMesh.position.set(1.4, 1.2, 0);
    tweezersGroup.add(tweezerMesh);

    // Fabric Swatch Mesh
    const fabricGeo = new THREE.PlaneGeometry(1.4, 1.4, 16, 16);
    const cottonMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.9,
      side: THREE.DoubleSide,
    });
    const polyMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.3,
      metalness: 0.2,
      side: THREE.DoubleSide,
    });

    const fabricMesh = new THREE.Mesh(fabricGeo, cottonMat);
    fabricMesh.position.set(-0.2, 1.2, 0);
    tweezersGroup.add(fabricMesh);

    // 3D Molten Bead / Ash Debris Group
    const reactionGroup = new THREE.Group();
    tweezersGroup.add(reactionGroup);

    // Molten Beads (for Polyester)
    const beadMat = new THREE.MeshStandardMaterial({
      color: 0x0c4a6e,
      emissive: 0xea580c,
      emissiveIntensity: 0.5,
      roughness: 0.2,
    });
    const beadGeo = new THREE.SphereGeometry(0.16, 16, 16);
    for (let i = 0; i < 4; i++) {
      const bead = new THREE.Mesh(beadGeo, beadMat);
      bead.position.set(-0.4 - i * 0.15, 0.6 + i * 0.2, 0.05);
      reactionGroup.add(bead);
    }
    reactionGroup.visible = false;

    // 6. 60FPS Dynamic Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      const time = clock.getElapsedTime();
      const { fabricType: type, distance, isBurning: burning } = stateRef.current;

      // Animate Flame Flickering
      const flameScaleX = 1.0 + Math.sin(time * 20) * 0.12;
      const flameScaleY = 1.0 + Math.cos(time * 25) * 0.15;
      flameCore.scale.set(flameScaleX, flameScaleY, flameScaleX);
      flameLight.intensity = 3.0 + Math.sin(time * 30) * 0.8;

      // Animate Flame Sparks Upward
      const posAttr = sparkGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < sparkCount; i++) {
        let y = posAttr.getY(i) + sparkVels[i].y * delta;
        let x = posAttr.getX(i) + sparkVels[i].x * delta;
        let z = posAttr.getZ(i) + sparkVels[i].z * delta;

        if (y > 3.0) {
          y = 1.0;
          x = -1.8 + (Math.random() - 0.5) * 0.2;
          z = (Math.random() - 0.5) * 0.2;
        }
        posAttr.setXYZ(i, x, y, z);
      }
      posAttr.needsUpdate = true;

      // Animate Tweezers & Fabric Position based on distance slider
      const targetTweezersX = 2.4 - (distance / 100) * 3.4; // Moves towards burner
      tweezersGroup.position.x = targetTweezersX;

      // Update Fabric Material
      fabricMesh.material = type === 'cotton' ? cottonMat : polyMat;

      // Thermal Reaction Deformation
      if (burning) {
        stateRef.current.burnTime += delta;
        const bt = stateRef.current.burnTime;

        if (type === 'cotton') {
          // Turns into crumbly gray ash
          cottonMat.color.setHex(0x64748b);
          cottonMat.roughness = 1.0;
          reactionGroup.visible = false;
          fabricMesh.scale.set(1.0 - Math.min(0.3, bt * 0.2), 1.0 - Math.min(0.3, bt * 0.2), 1.0);
        } else {
          // Melts and curls into sticky dark plastic beads
          polyMat.color.setHex(0x0f172a);
          reactionGroup.visible = true;
          fabricMesh.scale.set(1.0 - Math.min(0.6, bt * 0.4), 1.0 - Math.min(0.6, bt * 0.4), 1.0);
          fabricMesh.rotation.z = Math.sin(bt * 4) * 0.2;
        }
      } else {
        cottonMat.color.setHex(0xf8fafc);
        polyMat.color.setHex(0x0284c7);
        reactionGroup.visible = false;
        fabricMesh.scale.set(1, 1, 1);
        fabricMesh.rotation.z = 0;
      }

      // Gentle Camera rotation
      camera.position.x = Math.sin(time * 0.3) * 0.2;
      camera.lookAt(0, 0.6, 0);

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
    <div className="w-full max-w-3xl bg-white p-5 sm:p-7 rounded-[36px] border-4 border-rose-400 shadow-2xl flex flex-col items-center select-none font-sans text-slate-900">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full mb-4 border-b-2 border-slate-100 pb-3">
        <div className="text-center sm:text-left">
          <span className="text-xs font-black uppercase text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-300 inline-block mb-1">
            🔥 3D Flame Burn & Melting Safety Lab
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Cotton Ash vs Synthetic Molten Plastic
          </h3>
        </div>

        {/* Material Selection Mode Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
          <button
            onClick={() => handleFabricSelect('cotton')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
              fabricType === 'cotton'
                ? 'bg-emerald-500 text-white shadow-md scale-105 font-black'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <span>🌿 1. Natural Cotton</span>
            {testedFabrics.cotton && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />}
          </button>
          <button
            onClick={() => handleFabricSelect('polyester')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
              fabricType === 'polyester'
                ? 'bg-rose-500 text-white shadow-md scale-105 font-black'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <span>👕 2. Synthetic Polyester</span>
            {testedFabrics.polyester && <CheckCircle2 className="w-3.5 h-3.5 text-rose-200" />}
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div className="w-full h-72 sm:h-80 rounded-3xl overflow-hidden shadow-inner border-3 border-slate-800 relative bg-slate-950 flex items-center justify-center mb-4">
        <div ref={mountRef} className="w-full h-full" />

        {/* Live HUD Badges */}
        <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-2 shadow-sm">
          <span>{fabricType === 'cotton' ? '🌿 100% Natural Cotton Swatch' : '👕 Synthetic Polyester Polymer Swatch'}</span>
        </div>

        {/* Bottom Reaction Banner */}
        <div className="absolute bottom-3 bg-slate-950/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-700 text-xs font-bold text-white shadow-md">
          {!isBurning
            ? 'Slide the tweezers or tap "Apply Flame" to test the thermal fire reaction!'
            : fabricType === 'cotton'
            ? '✓ Cotton burns cleanly into harmless, crumbly gray ash!'
            : '⚠️ DANGER! Polyester melts into boiling hot sticky liquid plastic beads!'}
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="w-full flex flex-col gap-3">
        {/* Tweezers Slider */}
        <div className="w-full flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border-2 border-slate-200">
          <span className="text-xs font-black text-slate-700 shrink-0 flex items-center gap-1">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>Move Tweezers to Flame:</span>
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={flameDistance}
            onChange={(e) => setFlameDistance(parseInt(e.target.value, 10))}
            className="w-full accent-rose-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-black text-slate-900 w-12 text-right">{flameDistance}%</span>
        </div>

        {/* Action Button & Key Takeaway */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleBurn}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white font-black text-sm shadow-md cursor-pointer active:scale-95 transition-all flex items-center gap-2"
            >
              <Flame className="w-4 h-4 fill-white" />
              <span>Apply Flame 🔥</span>
            </button>

            <button
              onClick={handleReset}
              className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-sm cursor-pointer border border-slate-300 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>

          <div className="text-xs font-bold text-slate-700 bg-rose-50 p-3 rounded-2xl border border-rose-200 max-w-sm text-center sm:text-right">
            {fabricType === 'cotton' ? (
              <span>
                <strong>Cotton Safety:</strong> Plant cellulose fibers burn to gray ash and don't melt, making cotton chef aprons fire-safe!
              </span>
            ) : (
              <span>
                <strong>Polyester Hazard:</strong> Synthetic plastics melt like hot wax and stick to skin. Never wear synthetic clothes near Diwali fires!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
