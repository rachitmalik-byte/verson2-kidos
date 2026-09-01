import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Dumbbell, Sparkles, RefreshCw, Zap, Sliders, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

interface RopeData {
  id: string;
  name: string;
  icon: string;
  category: string;
  limitKg: number;
  color: number;
  roughness: number;
  metalness: number;
  explain: string;
}

const ROPES_DATA: RopeData[] = [
  {
    id: 'cotton',
    name: 'Natural Cotton Rope',
    icon: '🧵',
    category: 'Natural Plant',
    limitKg: 2,
    color: 0xfef08a,
    roughness: 0.9,
    metalness: 0.0,
    explain: 'Short cotton plant fibers pull apart and unravel at only 2 KG!',
  },
  {
    id: 'wool',
    name: 'Natural Wool Cord',
    icon: '🧶',
    category: 'Natural Animal',
    limitKg: 3,
    color: 0xd97706,
    roughness: 0.95,
    metalness: 0.0,
    explain: 'Curly sheep fleece hairs stretch out and snap at 3 KG!',
  },
  {
    id: 'silk',
    name: 'Natural Silk Thread',
    icon: '🐛',
    category: 'Natural Insect',
    limitKg: 5,
    color: 0xa855f7,
    roughness: 0.3,
    metalness: 0.1,
    explain: 'Fine silkworm protein filaments hold up to 5 KG before snapping!',
  },
  {
    id: 'nylon',
    name: 'Synthetic Nylon Climbing Rope',
    icon: '🪢',
    category: 'Synthetic Polymer',
    limitKg: 25,
    color: 0x0ea5e9,
    roughness: 0.4,
    metalness: 0.1,
    explain: 'Continuous synthetic polymer chains hold an amazing 25 KG without breaking!',
  },
  {
    id: 'steel',
    name: 'Braided Steel Cable',
    icon: '⛓️',
    category: 'Metal Alloy',
    limitKg: 50,
    color: 0x94a3b8,
    roughness: 0.2,
    metalness: 0.9,
    explain: 'Braided metal wires hold 50+ KG under extreme industrial tension!',
  },
];

interface Props {
  onTested?: (ropeId: string) => void;
}

export const ThreeTensileRigLab: React.FC<Props> = ({ onTested }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedRopeId, setSelectedRopeId] = useState<string>('cotton');
  const [appliedWeightKg, setAppliedWeightKg] = useState<number>(0);
  const [testedRopes, setTestedRopes] = useState<Record<string, boolean>>({});

  const currentRope = ROPES_DATA.find((r) => r.id === selectedRopeId) || ROPES_DATA[0];
  const isSnapped = appliedWeightKg > currentRope.limitKg;

  const stateRef = useRef({
    ropeId: 'cotton',
    appliedWeight: 0,
    limitKg: 2,
    isSnapped: false,
    snapTime: 0,
    snapProgress: 0,
  });

  useEffect(() => {
    stateRef.current.ropeId = selectedRopeId;
    stateRef.current.appliedWeight = appliedWeightKg;
    stateRef.current.limitKg = currentRope.limitKg;
    stateRef.current.isSnapped = isSnapped;
  }, [selectedRopeId, appliedWeightKg, isSnapped, currentRope]);

  const handleSelectRope = (id: string) => {
    sounds.pop();
    setSelectedRopeId(id);
    setAppliedWeightKg(0);
    stateRef.current.snapTime = 0;
    const rope = ROPES_DATA.find((r) => r.id === id);
    if (rope) {
      voiceAssistant.speak(`${rope.name} loaded into the tensile clamps. Add weights to test breaking strength!`);
    }
  };

  const handleAddWeight = (amount: number) => {
    sounds.pop();
    const nextWeight = Math.min(50, appliedWeightKg + amount);
    setAppliedWeightKg(nextWeight);

    if (nextWeight > currentRope.limitKg) {
      sounds.bubble();
      voiceAssistant.speak(
        `SNAP! ${currentRope.name} exceeded its breaking limit of ${currentRope.limitKg} KG and snapped in two!`
      );
      const updated = { ...testedRopes, [selectedRopeId]: true };
      setTestedRopes(updated);
      if (onTested) onTested(selectedRopeId);
    } else {
      sounds.sparkle();
      if (selectedRopeId === 'nylon' && nextWeight >= 20) {
        sounds.fanfare();
        voiceAssistant.speak('Incredible! Nylon holds 25 KG with elastic flexibility!');
        const updated = { ...testedRopes, [selectedRopeId]: true };
        setTestedRopes(updated);
        if (onTested) onTested(selectedRopeId);
      }
    }
  };

  const handleReset = () => {
    sounds.pop();
    setAppliedWeightKg(0);
    stateRef.current.snapTime = 0;
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
    camera.position.set(0, 2.8, 8.5);
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

    const cyanRim = new THREE.PointLight(0x38bdf8, 2.5, 12);
    cyanRim.position.set(-4, 2, 4);
    scene.add(cyanRim);

    const amberFill = new THREE.PointLight(0xf59e0b, 2.0, 12);
    amberFill.position.set(4, 2, 4);
    scene.add(amberFill);

    // 3. Laboratory Table & Measurement Frame
    const floorGeo = new THREE.PlaneGeometry(18, 12);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6, metalness: 0.2 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -1.8;
    scene.add(floorMesh);

    const gridHelper = new THREE.GridHelper(14, 14, 0x38bdf8, 0x334155);
    gridHelper.position.y = -1.79;
    scene.add(gridHelper);

    // 4. Industrial Steel Tensile Gantry Frame
    const gantryGroup = new THREE.Group();
    scene.add(gantryGroup);

    const steelMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.85, roughness: 0.2 });
    const postGeo = new THREE.CylinderGeometry(0.18, 0.18, 5.0, 24);

    const leftPost = new THREE.Mesh(postGeo, steelMat);
    leftPost.position.set(-2.0, 0.6, 0);
    gantryGroup.add(leftPost);

    const rightPost = new THREE.Mesh(postGeo, steelMat);
    rightPost.position.set(2.0, 0.6, 0);
    gantryGroup.add(rightPost);

    // Top Crossbeam
    const beamGeo = new THREE.BoxGeometry(4.4, 0.35, 0.6);
    const beamMesh = new THREE.Mesh(beamGeo, steelMat);
    beamMesh.position.set(0, 3.0, 0);
    gantryGroup.add(beamMesh);

    // Top Hydraulic Clamp
    const clampMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, metalness: 0.8, roughness: 0.3 });
    const topClampGeo = new THREE.BoxGeometry(0.6, 0.4, 0.5);
    const topClamp = new THREE.Mesh(topClampGeo, clampMat);
    topClamp.position.set(0, 2.7, 0);
    gantryGroup.add(topClamp);

    // 5. Dynamic Rope Meshes (Top Half & Bottom Half)
    let topRopeMesh: THREE.Mesh | null = null;
    let btmRopeMesh: THREE.Mesh | null = null;

    // 6. Bottom Weighted Pull Platform & Weight Discs
    const platformGroup = new THREE.Group();
    scene.add(platformGroup);

    const btmClamp = new THREE.Mesh(topClampGeo, clampMat);
    btmClamp.position.set(0, 0.2, 0);
    platformGroup.add(btmClamp);

    const weightRodGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.8, 16);
    const weightRodMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 });
    const weightRod = new THREE.Mesh(weightRodGeo, weightRodMat);
    weightRod.position.set(0, -0.8, 0);
    platformGroup.add(weightRod);

    // Dynamic Stack of Iron Weight Discs
    const weightsGroup = new THREE.Group();
    platformGroup.add(weightsGroup);

    // Snap Sparkle Burst
    const burstCount = 40;
    const burstGeo = new THREE.BufferGeometry();
    const burstPositions = new Float32Array(burstCount * 3);
    const burstVels: THREE.Vector3[] = [];

    for (let i = 0; i < burstCount; i++) {
      burstPositions[i * 3] = 0;
      burstPositions[i * 3 + 1] = 1.3;
      burstPositions[i * 3 + 2] = 0;
      burstVels.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.2) * 5,
          (Math.random() - 0.5) * 6
        )
      );
    }
    burstGeo.setAttribute('position', new THREE.BufferAttribute(burstPositions, 3));
    const burstMat = new THREE.PointsMaterial({
      color: 0xf43f5e,
      size: 0.16,
      transparent: true,
      opacity: 0,
    });
    const burstParticles = new THREE.Points(burstGeo, burstMat);
    scene.add(burstParticles);

    // 7. 60FPS Dynamic Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      const time = clock.getElapsedTime();
      const { ropeId, appliedWeight: weight, limitKg: limit, isSnapped: snapped } = stateRef.current;
      const ropeInfo = ROPES_DATA.find((r) => r.id === ropeId) || ROPES_DATA[0];

      // Update Weight Discs in Stack
      weightsGroup.clear();
      const numPlates = Math.min(10, Math.ceil(weight / 5));
      const plateMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });

      for (let i = 0; i < numPlates; i++) {
        const pGeo = new THREE.CylinderGeometry(0.55 - i * 0.02, 0.55 - i * 0.02, 0.12, 24);
        const pMesh = new THREE.Mesh(pGeo, plateMat);
        pMesh.position.set(0, -0.6 - i * 0.14, 0);
        weightsGroup.add(pMesh);
      }

      // Calculate Stretch Tension
      const stretchAmount = (weight / 50) * 0.5; // up to 0.5m sag
      let targetBtmY = 0.8 - stretchAmount;

      if (snapped) {
        stateRef.current.snapTime += delta;
        const t = stateRef.current.snapTime;

        // Weights crash downward onto table
        targetBtmY = Math.max(-0.6, 0.8 - t * 8.0);

        // Particle burst
        if (t < 1.0) {
          burstMat.opacity = Math.max(0, 1 - t);
          const posAttr = burstGeo.attributes.position as THREE.BufferAttribute;
          for (let i = 0; i < burstCount; i++) {
            posAttr.setXYZ(
              i,
              posAttr.getX(i) + burstVels[i].x * delta,
              posAttr.getY(i) + burstVels[i].y * delta,
              posAttr.getZ(i) + burstVels[i].z * delta
            );
          }
          posAttr.needsUpdate = true;
        }
      } else {
        burstMat.opacity = 0;
        const posAttr = burstGeo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < burstCount; i++) {
          posAttr.setXYZ(i, 0, 1.3, 0);
        }
        posAttr.needsUpdate = true;
      }

      platformGroup.position.set(0, targetBtmY, 0);

      // Rebuild 3D Rope Splines
      if (topRopeMesh) scene.remove(topRopeMesh);
      if (btmRopeMesh) scene.remove(btmRopeMesh);

      const ropeMat = new THREE.MeshStandardMaterial({
        color: ropeInfo.color,
        roughness: ropeInfo.roughness,
        metalness: ropeInfo.metalness,
      });

      const thickness = Math.max(0.04, 0.09 - (weight / 50) * 0.03);

      if (!snapped) {
        // Continuous Intact Rope
        const topY = 2.5;
        const btmY = targetBtmY + 0.2;
        const ropeCurve = new THREE.LineCurve3(
          new THREE.Vector3(0, topY, 0),
          new THREE.Vector3(0, btmY, 0)
        );
        const rGeo = new THREE.TubeGeometry(ropeCurve, 16, thickness, 10, false);
        topRopeMesh = new THREE.Mesh(rGeo, ropeMat);
        topRopeMesh.castShadow = true;
        scene.add(topRopeMesh);
      } else {
        // Snapped Frayed Top & Bottom halves
        const t = stateRef.current.snapTime;
        const topCurlingY = 2.5 - Math.min(0.6, 0.6 * Math.exp(-t * 3));
        const topCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 2.5, 0),
          new THREE.Vector3(Math.sin(time * 15) * 0.1, 2.0, 0.1),
          new THREE.Vector3(0.2, topCurlingY, 0),
        ]);
        const rGeoTop = new THREE.TubeGeometry(topCurve, 12, thickness, 8, false);
        topRopeMesh = new THREE.Mesh(rGeoTop, ropeMat);
        scene.add(topRopeMesh);

        const btmY = targetBtmY + 0.2;
        const btmCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, btmY, 0),
          new THREE.Vector3(-0.15, btmY + 0.4, -0.1),
          new THREE.Vector3(0.1, btmY + 0.6, 0),
        ]);
        const rGeoBtm = new THREE.TubeGeometry(btmCurve, 12, thickness, 8, false);
        btmRopeMesh = new THREE.Mesh(rGeoBtm, ropeMat);
        scene.add(btmRopeMesh);
      }

      // Gentle Camera rotation
      camera.position.x = Math.sin(time * 0.3) * 0.3;
      camera.lookAt(0, 0.8, 0);

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
    <div className="w-full max-w-3xl bg-white p-5 sm:p-7 rounded-[36px] border-4 border-sky-400 shadow-2xl flex flex-col items-center select-none font-sans text-slate-900">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full mb-4 border-b-2 border-slate-100 pb-3">
        <div className="text-center sm:text-left">
          <span className="text-xs font-black uppercase text-sky-700 bg-sky-100 px-3 py-1 rounded-full border border-sky-300 inline-block mb-1">
            🏋️ 3D Industrial Tensile Testing Rig
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {currentRope.name} Breaking Championship
          </h3>
        </div>

        {/* Live Weight & Status Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200 text-xs font-black">
            <Dumbbell className="w-4 h-4 text-amber-500" />
            <span>Load: {appliedWeightKg} KG</span>
          </div>

          <span className={`px-3 py-1.5 rounded-full text-xs font-black shadow-sm ${
            isSnapped ? 'bg-rose-500 text-white animate-bounce' : 'bg-emerald-500 text-white'
          }`}>
            {isSnapped ? '💥 SNAPPED!' : '✓ INTACT'}
          </span>
        </div>
      </div>

      {/* Specimen Selector Tabs */}
      <div className="flex items-center gap-1.5 flex-wrap justify-center w-full mb-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
        {ROPES_DATA.map((rope) => {
          const isSelected = rope.id === selectedRopeId;
          const isDone = testedRopes[rope.id];
          return (
            <button
              key={rope.id}
              onClick={() => handleSelectRope(rope.id)}
              className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                isSelected
                  ? 'bg-sky-500 text-white shadow-md scale-105 font-black'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{rope.icon}</span>
              <span>{rope.name.split(' ')[1] || rope.name}</span>
              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          );
        })}
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div className="w-full h-72 sm:h-80 rounded-3xl overflow-hidden shadow-inner border-3 border-slate-800 relative bg-slate-950 flex items-center justify-center mb-4">
        <div ref={mountRef} className="w-full h-full" />

        {/* Live HUD Badges */}
        <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-2 shadow-sm">
          <span>Breaking Limit: {currentRope.limitKg} KG</span>
        </div>

        {/* Bottom Banner */}
        <div className="absolute bottom-3 bg-slate-950/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-700 text-xs font-bold text-white shadow-md">
          {!isSnapped
            ? `Add weights below to test if ${currentRope.name} can hold up to ${currentRope.limitKg} KG!`
            : `💥 SNAPPED! Exceeded ${currentRope.limitKg} KG limit! ${currentRope.explain}`}
        </div>
      </div>

      {/* Interactive Weight Controls */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleAddWeight(1)}
            disabled={isSnapped || appliedWeightKg >= 50}
            className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-sm cursor-pointer active:scale-95 disabled:opacity-40 transition-all flex items-center gap-1"
          >
            <span>+1 KG Plate</span>
          </button>

          <button
            onClick={() => handleAddWeight(5)}
            disabled={isSnapped || appliedWeightKg >= 50}
            className="px-4 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-black text-xs shadow-sm cursor-pointer active:scale-95 disabled:opacity-40 transition-all flex items-center gap-1"
          >
            <span>+5 KG Plate</span>
          </button>

          <button
            onClick={() => handleAddWeight(10)}
            disabled={isSnapped || appliedWeightKg >= 50}
            className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-sm cursor-pointer active:scale-95 disabled:opacity-40 transition-all flex items-center gap-1"
          >
            <span>+10 KG Plate</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs cursor-pointer border border-slate-300 active:scale-95 transition-all"
            title="Reset Load"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Kid-Friendly Science Explanation */}
        <div className="text-xs font-bold text-slate-700 bg-sky-50 p-3 rounded-2xl border border-sky-200 max-w-sm text-center sm:text-right">
          {currentRope.id === 'nylon' ? (
            <span>
              💡 <strong>Why Nylon is King:</strong> Cotton and wool pull apart easily, but <strong>Nylon</strong> is made of continuous plastic chains that hold mountain climbers safe!
            </span>
          ) : (
            <span>
              💡 <strong>Observation:</strong> {currentRope.explain}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
