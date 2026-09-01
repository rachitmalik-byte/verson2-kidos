import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Sparkles, RefreshCw, Zap, Sliders } from 'lucide-react';

interface Props {
  onCompleted?: () => void;
}

export const ThreeRubberStretchLab: React.FC<Props> = ({ onCompleted }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [rubberType, setRubberType] = useState<'raw' | 'vulcanized'>('raw');
  const [tensionPercent, setTensionPercent] = useState<number>(0);
  const [isReleased, setIsReleased] = useState<boolean>(false);

  // Refs for 3D animation loop
  const stateRef = useRef({
    rubberType: 'raw',
    tension: 0,
    isReleased: false,
    releaseTime: 0,
    ballX: 0,
    ballY: 0,
    ballZ: 0,
    ballVx: 0,
    ballVy: 0,
    recoilOsc: 0,
    droopAmount: 0,
  });

  useEffect(() => {
    stateRef.current.rubberType = rubberType;
    stateRef.current.tension = tensionPercent;
    stateRef.current.isReleased = isReleased;
  }, [rubberType, tensionPercent, isReleased]);

  const handleTypeChange = (type: 'raw' | 'vulcanized') => {
    sounds.pop();
    setRubberType(type);
    setTensionPercent(0);
    setIsReleased(false);
    stateRef.current.tension = 0;
    stateRef.current.isReleased = false;
    stateRef.current.droopAmount = 0;
    stateRef.current.ballX = 0;
    stateRef.current.ballY = 0;

    if (type === 'vulcanized') {
      sounds.sparkle();
      voiceAssistant.speak(
        'Vulcanized Tyre Rubber selected! Notice the glowing sulfur cross-link bridges connecting the polymer chains together into a tough 3D trampoline net!'
      );
      if (onCompleted) onCompleted();
    } else {
      voiceAssistant.speak(
        'Raw Tree Latex selected! The long polymer chains are loose and unconnected, like slippery cooked spaghetti.'
      );
    }
  };

  const handleRelease = () => {
    if (tensionPercent === 0) return;
    setIsReleased(true);
    stateRef.current.isReleased = true;
    stateRef.current.releaseTime = 0;

    if (rubberType === 'vulcanized') {
      sounds.fanfare();
      stateRef.current.ballVx = 12 + (tensionPercent / 100) * 16;
      stateRef.current.ballVy = 4;
      voiceAssistant.speak(
        'BOING! 🚀 The sulfur cross-links snapped the rubber instantly back into shape and launched the ball!'
      );
      if (onCompleted) onCompleted();
    } else {
      sounds.bubble();
      stateRef.current.droopAmount = 1.2;
      voiceAssistant.speak(
        'Oh no! Raw tree rubber has no cross-links. The molecules slipped past each other, so it stayed permanently saggy and droopy!'
      );
    }
  };

  const handleReset = () => {
    sounds.pop();
    setTensionPercent(0);
    setIsReleased(false);
    stateRef.current.tension = 0;
    stateRef.current.isReleased = false;
    stateRef.current.droopAmount = 0;
    stateRef.current.ballX = 0;
    stateRef.current.ballY = 0;
    stateRef.current.ballVx = 0;
    stateRef.current.ballVy = 0;
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Slate-900 Modern Lab

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3.5, 9.5);
    camera.lookAt(1.0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);

    // 2. High-Tech Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(8, 12, 10);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const goldFill = new THREE.PointLight(0xf59e0b, 2.5, 15);
    goldFill.position.set(-4, 2, 4);
    scene.add(goldFill);

    const blueRim = new THREE.PointLight(0x38bdf8, 2.0, 15);
    blueRim.position.set(5, 3, -3);
    scene.add(blueRim);

    // 3. Lab Workbench Floor & Measurement Grid
    const floorGeo = new THREE.PlaneGeometry(24, 16);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.6,
      metalness: 0.2,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -1.5;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Grid lines on floor
    const gridHelper = new THREE.GridHelper(20, 20, 0x38bdf8, 0x334155);
    gridHelper.position.y = -1.49;
    scene.add(gridHelper);

    // 4. Sturdy Steel Anchor Posts (Left Slingshot Uprights)
    const postMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.85,
      roughness: 0.2,
    });
    const postGeo = new THREE.CylinderGeometry(0.18, 0.22, 3.2, 24);

    const post1 = new THREE.Mesh(postGeo, postMat);
    post1.position.set(-3.2, 0.1, 0.9);
    post1.castShadow = true;
    scene.add(post1);

    const post2 = new THREE.Mesh(postGeo, postMat);
    post2.position.set(-3.2, 0.1, -0.9);
    post2.castShadow = true;
    scene.add(post2);

    // Top chrome caps on posts
    const capGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.9, roughness: 0.1 });
    const cap1 = new THREE.Mesh(capGeo, capMat);
    cap1.position.set(-3.2, 1.7, 0.9);
    scene.add(cap1);
    const cap2 = new THREE.Mesh(capGeo, capMat);
    cap2.position.set(-3.2, 1.7, -0.9);
    scene.add(cap2);

    // 5. 3D Dynamic Rubber Band Meshes
    // Top & Bottom Rubber Ribbon Tubes
    const rawMat = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      roughness: 0.2,
      transmission: 0.3,
      thickness: 0.5,
      ior: 1.4,
    });

    const vulcanMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.7,
      metalness: 0.1,
    });

    let topBandMesh: THREE.Mesh | null = null;
    let btmBandMesh: THREE.Mesh | null = null;

    // Cross-link bridges group
    const crossLinksGroup = new THREE.Group();
    scene.add(crossLinksGroup);

    // 6. Launch Payload: 3D Glossy Bouncy Ball
    const ballGeo = new THREE.SphereGeometry(0.42, 32, 32);
    const ballMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.15,
      metalness: 0.1,
    });
    const ballMesh = new THREE.Mesh(ballGeo, ballMat);
    ballMesh.castShadow = true;
    scene.add(ballMesh);

    // Leather Slingshot Pouch cradle around ball
    const pouchGeo = new THREE.BoxGeometry(0.3, 0.9, 0.8);
    const pouchMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const pouchMesh = new THREE.Mesh(pouchGeo, pouchMat);
    scene.add(pouchMesh);

    // Sparkle Particle Burst for launch
    const particleCount = 40;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVels: THREE.Vector3[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = 0;
      particlePositions[i * 3 + 1] = 0;
      particlePositions[i * 3 + 2] = 0;
      particleVels.push(
        new THREE.Vector3(
          (Math.random() - 0.2) * 8,
          (Math.random() + 0.5) * 6,
          (Math.random() - 0.5) * 6
        )
      );
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xfacc15,
      size: 0.18,
      transparent: true,
      opacity: 0,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 7. Render & 60fps Dynamic Physics Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      const { rubberType: type, tension, isReleased: released } = stateRef.current;

      // Calculate Pull Cart Position
      let targetX = -1.2 + (tension / 100) * 4.2; // -1.2m to +3.0m
      let curPouchX = targetX;
      let curPouchY = 0.5;

      if (released) {
        stateRef.current.releaseTime += delta;
        const t = stateRef.current.releaseTime;

        if (type === 'vulcanized') {
          // Snap-back damped harmonic oscillation
          const decay = Math.exp(-t * 8);
          const osc = Math.cos(t * 35) * decay;
          curPouchX = -1.2 + osc * 1.5;

          // Ball launches forward along physics trajectory
          stateRef.current.ballX += stateRef.current.ballVx * delta;
          stateRef.current.ballY += stateRef.current.ballVy * delta;
          stateRef.current.ballVy -= 9.8 * delta; // Gravity

          // Floor bounce
          if (stateRef.current.ballY < -1.08) {
            stateRef.current.ballY = -1.08;
            stateRef.current.ballVy = -stateRef.current.ballVy * 0.75;
          }

          ballMesh.position.set(
            -1.2 + stateRef.current.ballX,
            0.5 + stateRef.current.ballY,
            0
          );
          ballMesh.rotation.z -= stateRef.current.ballVx * delta * 2;

          // Activate launch sparkles
          if (t < 1.2) {
            particleMat.opacity = Math.max(0, 1 - t);
            const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
            for (let i = 0; i < particleCount; i++) {
              posAttr.setXYZ(
                i,
                posAttr.getX(i) + particleVels[i].x * delta,
                posAttr.getY(i) + particleVels[i].y * delta,
                posAttr.getZ(i) + particleVels[i].z * delta
              );
            }
            posAttr.needsUpdate = true;
          }
        } else {
          // Raw rubber permanently sags and droops
          curPouchX = targetX; // Stays pulled out!
          curPouchY = 0.5 - Math.min(1.0, stateRef.current.releaseTime * 1.5);
          ballMesh.position.set(curPouchX + 0.1, curPouchY, 0);
        }
      } else {
        // Tension pull state
        ballMesh.position.set(curPouchX, curPouchY, 0);
        particleMat.opacity = 0;
        const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < particleCount; i++) {
          posAttr.setXYZ(i, curPouchX, curPouchY, 0);
        }
        posAttr.needsUpdate = true;
      }

      pouchMesh.position.set(curPouchX - 0.1, curPouchY, 0);

      // Rebuild Dynamic Rubber Ribbons
      if (topBandMesh) scene.remove(topBandMesh);
      if (btmBandMesh) scene.remove(btmBandMesh);

      const activeBandMat = type === 'raw' ? rawMat : vulcanMat;
      const thickness = Math.max(0.06, 0.14 - (tension / 100) * 0.06);

      // Top Curve from Top Post to Pouch
      const topCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-3.2, 1.2, 0.9),
        new THREE.Vector3((-3.2 + curPouchX) * 0.5, (1.2 + curPouchY) * 0.5, 0.45),
        new THREE.Vector3(curPouchX - 0.2, curPouchY + 0.2, 0),
      ]);
      const topGeo = new THREE.TubeGeometry(topCurve, 24, thickness, 10, false);
      topBandMesh = new THREE.Mesh(topGeo, activeBandMat);
      topBandMesh.castShadow = true;
      scene.add(topBandMesh);

      // Bottom Curve from Bottom Post to Pouch
      const btmCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-3.2, 1.2, -0.9),
        new THREE.Vector3((-3.2 + curPouchX) * 0.5, (1.2 + curPouchY) * 0.5, -0.45),
        new THREE.Vector3(curPouchX - 0.2, curPouchY - 0.2, 0),
      ]);
      const btmGeo = new THREE.TubeGeometry(btmCurve, 24, thickness, 10, false);
      btmBandMesh = new THREE.Mesh(btmGeo, activeBandMat);
      btmBandMesh.castShadow = true;
      scene.add(btmBandMesh);

      // Dynamic Sulfur Cross-Link Ladders (Only for Vulcanized Rubber)
      crossLinksGroup.clear();
      if (type === 'vulcanized') {
        const linkMat = new THREE.MeshStandardMaterial({
          color: 0xfacc15,
          emissive: 0xfacc15,
          emissiveIntensity: 0.6,
          roughness: 0.2,
        });

        for (let i = 1; i <= 6; i++) {
          const u = i / 7;
          const ptTop = topCurve.getPoint(u);
          const ptBtm = btmCurve.getPoint(u);

          const linkCurve = new THREE.LineCurve3(ptTop, ptBtm);
          const linkGeo = new THREE.TubeGeometry(linkCurve, 8, 0.035, 8, false);
          const linkMesh = new THREE.Mesh(linkGeo, linkMat);
          crossLinksGroup.add(linkMesh);
        }
      }

      // Gentle camera breath
      camera.position.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.4;
      camera.lookAt(curPouchX * 0.5, 0.5, 0);

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
            ⚡ 3D Physics Elasticity & Slingshot Simulator
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Why Do Tyres & Rubber Bands Snap Back?
          </h3>
        </div>

        {/* Material Selection Mode Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
          <button
            onClick={() => handleTypeChange('raw')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              rubberType === 'raw'
                ? 'bg-amber-400 text-slate-950 shadow-md scale-105 font-black'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            🌳 Raw Tree Latex
          </button>
          <button
            onClick={() => handleTypeChange('vulcanized')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              rubberType === 'vulcanized'
                ? 'bg-emerald-500 text-white shadow-md scale-105 font-black'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            🛞 Tough Tyre Rubber
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div className="w-full h-72 sm:h-80 rounded-3xl overflow-hidden shadow-inner border-3 border-slate-800 relative bg-slate-950 flex items-center justify-center mb-4">
        <div ref={mountRef} className="w-full h-full" />

        {/* Live HUD Badges */}
        <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-2 shadow-sm">
          <span>{rubberType === 'raw' ? '🌳 Natural Latex (No Cross-Links)' : '🛞 Vulcanized Rubber (Cross-Linked Mesh)'}</span>
        </div>

        <div className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-400 text-xs font-black text-amber-300 shadow-sm">
          Tension: {tensionPercent}%
        </div>

        {/* Real-time State Banner */}
        <div className="absolute bottom-3 bg-slate-950/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-700 text-xs font-bold text-white shadow-md">
          {rubberType === 'raw'
            ? isReleased
              ? '❌ Molecules slid apart permanently & sagged!'
              : 'Pull the handle to stretch the unlinked strands...'
            : isReleased
            ? '⚡ BOING! Sulfur cross-links snapped the band & launched the ball!'
            : 'Pull the handle to build up elastic trampoline spring tension!'}
        </div>
      </div>

      {/* Interactive Stretch Controls */}
      <div className="w-full flex flex-col gap-3">
        {/* Tension Slider */}
        <div className="w-full flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border-2 border-slate-200">
          <span className="text-xs font-black text-slate-700 shrink-0 flex items-center gap-1">
            <Sliders className="w-4 h-4 text-amber-500" />
            <span>Pull Handle:</span>
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={tensionPercent}
            disabled={isReleased}
            onChange={(e) => {
              sounds.pop();
              setTensionPercent(parseInt(e.target.value, 10));
            }}
            className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-black text-slate-900 w-12 text-right">{tensionPercent}%</span>
        </div>

        {/* Action Button Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {!isReleased ? (
              <button
                onClick={handleRelease}
                disabled={tensionPercent === 0}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm shadow-md cursor-pointer disabled:opacity-40 active:scale-95 transition-all flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>🚀 Release & Snap Back!</span>
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-sm shadow-xs cursor-pointer active:scale-95 transition-all flex items-center gap-2 border border-slate-300"
              >
                <RefreshCw className="w-4 h-4" />
                <span>🔄 Reset & Try Again</span>
              </button>
            )}
          </div>

          {/* Kid-Friendly Science Takeaway */}
          <div className="text-xs font-bold text-slate-700 bg-amber-50 p-3 rounded-2xl border border-amber-200 max-w-sm text-center sm:text-right">
            {rubberType === 'raw' ? (
              <span>
                <strong>Natural Sap:</strong> Long chains slip past each other like cooked spaghetti and deform forever!
              </span>
            ) : (
              <span>
                <strong>Vulcanized Rubber:</strong> Sulfur bridges connect the chains like a <strong>trampoline net</strong>, pulling everything right back!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
