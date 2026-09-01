import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Gauge, Flame, Sparkles, RefreshCw, Zap, Sliders, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Props {
  onTested?: () => void;
}

export const ThreeTireFrictionLab: React.FC<Props> = ({ onTested }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [rubberType, setRubberType] = useState<'natural' | 'vulcanized'>('vulcanized');
  const [speedRpm, setSpeedRpm] = useState<number>(6000);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  const speedRatio = speedRpm / 12000;
  const frictionTemp = 25 + Math.round(speedRatio * (rubberType === 'natural' ? 145 : 120));
  const isOverheated = rubberType === 'natural' && frictionTemp >= 120;

  const stateRef = useRef({
    rubberType: 'vulcanized',
    speedRpm: 6000,
    isSpinning: false,
    isOverheated: false,
    tireRotation: 0,
    smokeTime: 0,
  });

  useEffect(() => {
    stateRef.current.rubberType = rubberType;
    stateRef.current.speedRpm = speedRpm;
    stateRef.current.isSpinning = isSpinning;
    stateRef.current.isOverheated = isOverheated;
  }, [rubberType, speedRpm, isSpinning, isOverheated]);

  const handleTypeSelect = (type: 'natural' | 'vulcanized') => {
    sounds.pop();
    setRubberType(type);
    setIsSpinning(false);
    stateRef.current.isSpinning = false;
    if (type === 'natural') {
      voiceAssistant.speak('Raw Natural Rubber selected. Without sulfur cross-links, it melts into sticky goo under high-speed friction heat!');
    } else {
      voiceAssistant.speak('Vulcanized Tyre Rubber selected. Sulfur bridges hold polymer chains together even at 150 degrees Celsius!');
    }
  };

  const handleTestRun = () => {
    sounds.tensionSnap();
    setIsSpinning(true);
    stateRef.current.isSpinning = true;

    if (rubberType === 'natural') {
      sounds.bubble();
      voiceAssistant.speak('Warning! Raw rubber wheel melted and shredded apart at high RPM friction heat!');
    } else {
      sounds.fanfare();
      voiceAssistant.speak('Success! The vulcanized tire maintained high-speed grip without deforming or melting!');
      if (onTested) onTested();
    }
  };

  const handleStop = () => {
    sounds.pop();
    setIsSpinning(false);
    stateRef.current.isSpinning = false;
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    // 1. Scene & Perspective Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090d16);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.0, 7.8);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);

    // 2. High-Tech Dynamic Track Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(6, 10, 8);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const amberGlow = new THREE.PointLight(0xf59e0b, 2.5, 12);
    amberGlow.position.set(0, -0.5, 2);
    scene.add(amberGlow);

    const rimLight = new THREE.PointLight(0x38bdf8, 2.0, 10);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    // 3. 3D High-Speed Asphalt Road Track
    const roadGeo = new THREE.PlaneGeometry(16, 10);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.85,
      metalness: 0.1,
    });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.position.y = -1.2;
    roadMesh.receiveShadow = true;
    scene.add(roadMesh);

    // Animated Moving Dashed Road Stripes
    const roadStripesGroup = new THREE.Group();
    roadStripesGroup.position.set(0, -1.19, 0);
    scene.add(roadStripesGroup);

    const stripeGeo = new THREE.PlaneGeometry(0.8, 0.16);
    const stripeMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xeab308,
      emissiveIntensity: 0.4,
    });
    const stripes: THREE.Mesh[] = [];
    for (let i = -6; i <= 6; i += 1.5) {
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(i, 0, 0);
      roadStripesGroup.add(stripe);
      stripes.push(stripe);
    }

    // 4. Detailed 3D Wheel Assembly (Alloy Rim + Brake Rotor + Tire)
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(0, 0.4, 0);
    scene.add(wheelGroup);

    // Disc Brake Rotor (Metallic with ventilation holes)
    const rotorGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.08, 32);
    const rotorMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.15 });
    const rotorMesh = new THREE.Mesh(rotorGeo, rotorMat);
    rotorMesh.rotation.x = Math.PI / 2;
    rotorMesh.position.z = -0.25;
    wheelGroup.add(rotorMesh);

    // Red Brembo Brake Caliper
    const caliperGeo = new THREE.BoxGeometry(0.4, 0.7, 0.3);
    const caliperMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
    const caliperMesh = new THREE.Mesh(caliperGeo, caliperMat);
    caliperMesh.position.set(0.7, 0.6, -0.25);
    scene.add(caliperMesh); // Fixed to chassis, doesn't spin

    // Alloy Rim Hub (Center Hub + 8 Radial Spokes)
    const rimGroup = new THREE.Group();
    wheelGroup.add(rimGroup);

    const hubMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 });
    const hubCenterGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.4, 24);
    const hubCenter = new THREE.Mesh(hubCenterGeo, hubMat);
    hubCenter.rotation.x = Math.PI / 2;
    rimGroup.add(hubCenter);

    // Chrome Spokes
    const spokeGeo = new THREE.BoxGeometry(0.12, 1.2, 0.18);
    for (let i = 0; i < 8; i++) {
      const spoke = new THREE.Mesh(spokeGeo, hubMat);
      spoke.rotation.z = (i * Math.PI) / 4;
      rimGroup.add(spoke);
    }

    // Outer Chrome Rim Barrel
    const rimBarrelGeo = new THREE.TorusGeometry(1.2, 0.08, 16, 48);
    const rimBarrel = new THREE.Mesh(rimBarrelGeo, hubMat);
    rimGroup.add(rimBarrel);

    // 5. 3D Rubber Tire Tread Ring
    const tireGeo = new THREE.TorusGeometry(1.5, 0.42, 24, 64);

    const vulcanMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.85,
      metalness: 0.1,
    });

    const naturalMat = new THREE.MeshPhysicalMaterial({
      color: 0xd97706, // Amber Raw Latex
      roughness: 0.3,
      metalness: 0.0,
      transmission: 0.3,
      thickness: 0.6,
    });

    const tireMesh = new THREE.Mesh(tireGeo, vulcanMat);
    tireMesh.castShadow = true;
    wheelGroup.add(tireMesh);

    // Tread Grooves Details around Circumference
    const treadGroup = new THREE.Group();
    wheelGroup.add(treadGroup);
    const treadBlockGeo = new THREE.BoxGeometry(0.2, 0.08, 0.82);
    const treadBlockMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });

    for (let i = 0; i < 36; i++) {
      const angle = (i / 36) * Math.PI * 2;
      const block = new THREE.Mesh(treadBlockGeo, treadBlockMat);
      block.position.set(Math.cos(angle) * 1.88, Math.sin(angle) * 1.88, 0);
      block.rotation.z = angle + Math.PI / 2;
      treadGroup.add(block);
    }

    // 6. Dynamic Friction Smoke & Fire Sparks at Contact Patch
    const smokeCount = 60;
    const smokeGeo = new THREE.BufferGeometry();
    const smokePositions = new Float32Array(smokeCount * 3);
    const smokeVels: THREE.Vector3[] = [];

    for (let i = 0; i < smokeCount; i++) {
      smokePositions[i * 3] = (Math.random() - 0.5) * 0.4;
      smokePositions[i * 3 + 1] = -1.1 + Math.random() * 0.2;
      smokePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
      smokeVels.push(
        new THREE.Vector3(
          3.0 + Math.random() * 4.0, // Blown backward by speed
          1.0 + Math.random() * 2.5,
          (Math.random() - 0.5) * 1.5
        )
      );
    }
    smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePositions, 3));
    const smokeMat = new THREE.PointsMaterial({
      color: 0xf97316,
      size: 0.18,
      transparent: true,
      opacity: 0,
    });
    const smokeParticles = new THREE.Points(smokeGeo, smokeMat);
    scene.add(smokeParticles);

    // 7. 60FPS Fluid Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      const time = clock.getElapsedTime();
      const { rubberType: type, speedRpm: rpm, isSpinning: spinning, isOverheated: overheated } = stateRef.current;

      // Update Tire Material
      tireMesh.material = type === 'natural' ? naturalMat : vulcanMat;

      if (spinning) {
        const spinSpeed = (rpm / 60) * Math.PI * 2 * delta * 0.4;
        wheelGroup.rotation.z -= spinSpeed;

        // Animate Road Track Moving
        stripes.forEach((stripe) => {
          stripe.position.x -= spinSpeed * 0.8;
          if (stripe.position.x < -6.5) stripe.position.x = 6.5;
        });

        // Contact Patch Friction Smoke Particles
        smokeMat.opacity = overheated ? 0.9 : 0.4;
        smokeMat.color.setHex(overheated ? 0xef4444 : 0x94a3b8);

        const posAttr = smokeGeo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < smokeCount; i++) {
          let x = posAttr.getX(i) + smokeVels[i].x * delta;
          let y = posAttr.getY(i) + smokeVels[i].y * delta;
          let z = posAttr.getZ(i) + smokeVels[i].z * delta;

          if (x > 5.0 || y > 2.5) {
            x = (Math.random() - 0.5) * 0.3;
            y = -1.1;
            z = (Math.random() - 0.5) * 0.3;
          }
          posAttr.setXYZ(i, x, y, z);
        }
        posAttr.needsUpdate = true;

        // Severe melting distortion for natural rubber
        if (overheated) {
          tireMesh.scale.set(1.0 + Math.sin(time * 20) * 0.1, 0.85, 1.1);
        } else {
          tireMesh.scale.set(1, 1, 1);
        }
      } else {
        smokeMat.opacity = 0;
        tireMesh.scale.set(1, 1, 1);
      }

      // Gentle Camera sway
      camera.position.x = Math.sin(time * 0.25) * 0.2;
      camera.lookAt(0, 0.2, 0);

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
    <div className="w-full max-w-3xl bg-white p-5 sm:p-7 rounded-[36px] border-4 border-amber-400 shadow-2xl flex flex-col items-center select-none font-sans text-slate-900">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full mb-4 border-b-2 border-slate-100 pb-3">
        <div className="text-center sm:text-left">
          <span className="text-xs font-black uppercase text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 inline-block mb-1">
            🏎️ 3D High-Speed Race Track Friction Lab
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Why Don't Car Tires Melt on the Highway?
          </h3>
        </div>

        {/* Live Friction Heat HUD Badges */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-black shadow-sm ${
            isOverheated ? 'bg-rose-100 border-rose-300 text-rose-950 animate-pulse' : 'bg-slate-100 border-slate-200 text-slate-800'
          }`}>
            <Flame className={`w-4 h-4 ${isOverheated ? 'text-rose-500 animate-bounce' : 'text-amber-500'}`} />
            <span>Friction Heat: {frictionTemp}°C</span>
          </div>

          <span className={`px-3 py-1.5 rounded-full text-xs font-black shadow-sm ${
            isOverheated ? 'bg-rose-500 text-white animate-bounce' : 'bg-emerald-500 text-white'
          }`}>
            {isOverheated ? '🔥 MELTING!' : '⚡ GRIP STABLE'}
          </span>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div className="w-full h-72 sm:h-80 rounded-3xl overflow-hidden shadow-inner border-3 border-slate-800 relative bg-slate-950 flex items-center justify-center mb-4">
        <div ref={mountRef} className="w-full h-full" />

        {/* Live Speed Overlay Badge */}
        <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-2 shadow-sm">
          <span>Speed: {speedRpm} RPM ({(speedRpm / 60).toFixed(0)} km/h)</span>
        </div>

        {/* Bottom Status Banner */}
        <div className="absolute bottom-3 bg-slate-950/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-700 text-xs font-bold text-white shadow-md">
          {!isSpinning
            ? 'Adjust RPM slider and tap "Spin Race Track Test" to simulate highway friction heat!'
            : isOverheated
            ? '🔥 DANGER! Raw natural rubber melted into sticky goo at 120°C!'
            : '⚡ Vulcanized rubber sulfur bridges held molecular structure perfectly at 12,000 RPM!'}
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="w-full flex flex-col gap-3">
        {/* Speed Slider */}
        <div className="w-full flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border-2 border-slate-200">
          <span className="text-xs font-black text-slate-700 shrink-0 flex items-center gap-1">
            <Sliders className="w-4 h-4 text-amber-500" />
            <span>Tire Speed:</span>
          </span>
          <input
            type="range"
            min="1000"
            max="12000"
            step="500"
            value={speedRpm}
            onChange={(e) => setSpeedRpm(parseInt(e.target.value, 10))}
            className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-black text-slate-900 w-16 text-right">{speedRpm} RPM</span>
        </div>

        {/* Material Selection Mode Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => handleTypeSelect('natural')}
            className={`p-3.5 rounded-2xl border-2 font-black text-xs cursor-pointer transition-all flex items-center gap-3 ${
              rubberType === 'natural'
                ? 'bg-amber-100 border-amber-400 text-slate-950 shadow-md scale-102 font-black'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="text-2xl">🌳</span>
            <div className="text-left">
              <span className="block font-black">1. Raw Natural Rubber Wheel</span>
              <span className="text-[10px] text-slate-500 font-bold">Uncrosslinked (Melts at 120°C ❌)</span>
            </div>
          </button>

          <button
            onClick={() => handleTypeSelect('vulcanized')}
            className={`p-3.5 rounded-2xl border-2 font-black text-xs cursor-pointer transition-all flex items-center gap-3 ${
              rubberType === 'vulcanized'
                ? 'bg-emerald-100 border-emerald-400 text-slate-950 shadow-md scale-102 font-black'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="text-2xl">🛞</span>
            <div className="text-left">
              <span className="block font-black">2. Vulcanized Tire Wheel</span>
              <span className="text-[10px] text-emerald-700 font-bold">Sulfur Bridges (Resists 160°C ✅)</span>
            </div>
          </button>
        </div>

        {/* Action Button & Key Takeaway */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          {!isSpinning ? (
            <button
              onClick={handleTestRun}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:brightness-110 text-slate-950 font-black text-sm shadow-md cursor-pointer active:scale-95 transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>🏁 Spin Race Track Test at {speedRpm} RPM!</span>
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-sm shadow-xs cursor-pointer active:scale-95 transition-all flex items-center gap-2 border border-slate-300"
            >
              <RefreshCw className="w-4 h-4" />
              <span>🛑 Stop Spin Test</span>
            </button>
          )}

          <div className="text-xs font-bold text-slate-700 bg-amber-50 p-3 rounded-2xl border border-amber-200 max-w-sm text-center sm:text-right">
            💡 <strong>Charles Goodyear (1839):</strong> Adding sulfur cross-links locks rubber molecules into a 3D trampoline net, so tires never melt even at 200 km/h!
          </div>
        </div>
      </div>
    </div>
  );
};
