import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createVoxelMesh, VoxelBlock } from './VoxelEngine';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Sun, CloudRain, Wind, Play, RotateCcw, Sparkles } from 'lucide-react';

export const VoxelWaterCycleDiorama: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState<'idle' | 'evaporating' | 'condensing' | 'raining'>('idle');
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const rainParticlesRef = useRef<THREE.Points | null>(null);
  const cloudGroupRef = useRef<THREE.Group | null>(null);
  const sunMeshRef = useRef<THREE.Mesh | null>(null);
  const islandGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x87ceeb);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(18, 14, 22);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 1.3);
    dirLight.position.set(15, 25, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Island Voxels
    const voxels: VoxelBlock[] = [];
    for (let x = -7; x <= 7; x++) {
      for (let z = -7; z <= 7; z++) {
        const distFromCenter = Math.sqrt(x * x + z * z);
        if (distFromCenter > 7.5) continue;

        voxels.push({ x, y: -2, z, color: 0x4a3c31 });
        voxels.push({ x, y: -1, z, color: 0x6e5843 });

        if (x < 0 && distFromCenter < 6) {
          const mtnHeight = Math.floor((6 - distFromCenter) * 1.5 + (x < -2 ? 2 : 0));
          for (let y = 0; y <= mtnHeight; y++) {
            if (y >= 4) {
              voxels.push({ x, y, z, color: 0xffffff });
            } else if (y >= 2) {
              voxels.push({ x, y, z, color: 0x7a7f85 });
            } else {
              voxels.push({ x, y, z, color: 0x4d8c2f });
            }
          }
        } else if (x >= 0 && x <= 2 && z >= -2 && z <= 2) {
          voxels.push({ x, y: 0, z, color: 0x228be6, transparent: true, opacity: 0.85 });
        } else if (x > 3 && distFromCenter > 4.5) {
          voxels.push({ x, y: 0, z, color: 0xe9d08e });
        } else {
          voxels.push({ x, y: 0, z, color: 0x5c9c34 });
        }
      }
    }

    // Trees
    [{ x: -2, z: 3 }, { x: 2, z: -4 }, { x: 4, z: 2 }].forEach((tp) => {
      voxels.push({ x: tp.x, y: 1, z: tp.z, color: 0x5c4033 });
      voxels.push({ x: tp.x, y: 2, z: tp.z, color: 0x5c4033 });
      for (let tx = -1; tx <= 1; tx++) {
        for (let tz = -1; tz <= 1; tz++) {
          voxels.push({ x: tp.x + tx, y: 3, z: tp.z + tz, color: 0x2f7a1f });
        }
      }
      voxels.push({ x: tp.x, y: 4, z: tp.z, color: 0x2f7a1f });
    });

    const islandMesh = createVoxelMesh(voxels, 0.9);
    const islandGroup = new THREE.Group();
    islandGroup.add(islandMesh);
    scene.add(islandGroup);
    islandGroupRef.current = islandGroup;

    // Voxel Cloud
    const cloudVoxels: VoxelBlock[] = [];
    for (let cx = -2; cx <= 2; cx++) {
      for (let cz = -2; cz <= 2; cz++) {
        if (Math.abs(cx) + Math.abs(cz) <= 3) {
          cloudVoxels.push({ x: cx, y: 0, z: cz, color: 0xffffff, roughness: 0.9 });
          cloudVoxels.push({ x: cx, y: 1, z: cz, color: 0xffffff, roughness: 0.9 });
        }
      }
    }
    const cloudMesh = createVoxelMesh(cloudVoxels, 0.7);
    const cloudGroup = new THREE.Group();
    cloudGroup.position.set(-1, 8, 0);
    cloudGroup.add(cloudMesh);
    scene.add(cloudGroup);
    cloudGroupRef.current = cloudGroup;

    // Voxel Sun
    const sunGeom = new THREE.BoxGeometry(2.5, 2.5, 2.5);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffb703 });
    const sunMesh = new THREE.Mesh(sunGeom, sunMat);
    sunMesh.position.set(10, 12, -8);
    scene.add(sunMesh);
    sunMeshRef.current = sunMesh;

    // Steam Particles
    const steamCount = 120;
    const steamGeom = new THREE.BufferGeometry();
    const steamPos = new Float32Array(steamCount * 3);
    for (let i = 0; i < steamCount; i++) {
      steamPos[i * 3] = (Math.random() - 0.5) * 6 + 1;
      steamPos[i * 3 + 1] = Math.random() * 7;
      steamPos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    steamGeom.setAttribute('position', new THREE.BufferAttribute(steamPos, 3));
    const steamMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.35, transparent: true, opacity: 0.0 });
    const steamPoints = new THREE.Points(steamGeom, steamMat);
    scene.add(steamPoints);
    particlesRef.current = steamPoints;

    // Rain Particles
    const rainCount = 180;
    const rainGeom = new THREE.BufferGeometry();
    const rainPos = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount; i++) {
      rainPos[i * 3] = (Math.random() - 0.5) * 4 - 1;
      rainPos[i * 3 + 1] = Math.random() * 7 + 1;
      rainPos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    rainGeom.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
    const rainMat = new THREE.PointsMaterial({ color: 0x4dabf7, size: 0.3, transparent: true, opacity: 0.0 });
    const rainPoints = new THREE.Points(rainGeom, rainMat);
    scene.add(rainPoints);
    rainParticlesRef.current = rainPoints;

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !islandGroupRef.current) return;
      const deltaX = e.clientX - prevMouseX;
      islandGroupRef.current.rotation.y += deltaX * 0.008;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onMouseUp = () => (isDragging = false);

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (!isDragging && islandGroupRef.current) {
        islandGroupRef.current.rotation.y += 0.002;
      }
      if (cloudGroupRef.current) {
        cloudGroupRef.current.position.y = 8 + Math.sin(elapsedTime * 1.5) * 0.4;
      }
      if (sunMeshRef.current) {
        sunMeshRef.current.rotation.y += 0.01;
      }

      if (particlesRef.current && (particlesRef.current.material as THREE.PointsMaterial).opacity > 0) {
        const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < steamCount; i++) {
          pos[i * 3 + 1] += 0.06;
          if (pos[i * 3 + 1] > 8) pos[i * 3 + 1] = 0;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      if (rainParticlesRef.current && (rainParticlesRef.current.material as THREE.PointsMaterial).opacity > 0) {
        const pos = rainParticlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < rainCount; i++) {
          pos[i * 3 + 1] -= 0.15;
          if (pos[i * 3 + 1] < 0.5) pos[i * 3 + 1] = 8;
        }
        rainParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const triggerEvaporation = () => {
    sounds.sparkle();
    setActiveStage('evaporating');
    voiceAssistant.speak('Step 1: Solar heat warms the ocean, causing liquid water to evaporate into rising water vapor gas!');
    if (particlesRef.current) (particlesRef.current.material as THREE.PointsMaterial).opacity = 0.85;
    if (rainParticlesRef.current) (rainParticlesRef.current.material as THREE.PointsMaterial).opacity = 0.0;
  };

  const triggerCondensation = () => {
    sounds.pop();
    setActiveStage('condensing');
    voiceAssistant.speak('Step 2: Warm vapor climbs into the cold sky, condensing onto dust particles to create fluffy clouds!');
    if (particlesRef.current) (particlesRef.current.material as THREE.PointsMaterial).opacity = 0.3;
    if (cloudGroupRef.current) cloudGroupRef.current.scale.set(1.3, 1.3, 1.3);
  };

  const triggerPrecipitation = () => {
    sounds.fanfare();
    setActiveStage('raining');
    voiceAssistant.speak('Step 3: When water droplets in the cloud become too heavy, gravity pulls them down as rain onto mountains and rivers!');
    if (particlesRef.current) (particlesRef.current.material as THREE.PointsMaterial).opacity = 0.0;
    if (rainParticlesRef.current) (rainParticlesRef.current.material as THREE.PointsMaterial).opacity = 0.9;
    if (onComplete) onComplete();
  };

  const handleAutoPlay = () => {
    setIsAutoPlaying(true);
    triggerEvaporation();
    setTimeout(() => {
      triggerCondensation();
      setTimeout(() => {
        triggerPrecipitation();
        setTimeout(() => {
          setIsAutoPlaying(false);
        }, 4000);
      }, 4000);
    }, 4000);
  };

  const handleReset = () => {
    sounds.boing();
    setActiveStage('idle');
    if (particlesRef.current) (particlesRef.current.material as THREE.PointsMaterial).opacity = 0.0;
    if (rainParticlesRef.current) (rainParticlesRef.current.material as THREE.PointsMaterial).opacity = 0.0;
    if (cloudGroupRef.current) cloudGroupRef.current.scale.set(1.0, 1.0, 1.0);
    voiceAssistant.stop();
  };

  return (
    <div className="w-full bg-slate-950 rounded-3xl border-4 border-sky-400 overflow-hidden shadow-2xl flex flex-col relative select-none">
      <div className="p-3.5 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏝️</span>
          <div>
            <h3 className="text-sm sm:text-base font-black text-sky-300">
              3D Voxel Water Cycle Island Diorama
            </h3>
            <p className="text-[10px] font-bold text-slate-400">
              Hold & drag with mouse to spin island in 360°
            </p>
          </div>
        </div>

        <button
          onClick={handleAutoPlay}
          disabled={isAutoPlaying}
          className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 text-white rounded-xl font-black text-xs cursor-pointer active:scale-95 transition-all flex items-center gap-1.5 shadow-md"
        >
          <Play className="w-3.5 h-3.5" />
          <span>{isAutoPlaying ? 'Running Cycle...' : 'Auto-Play 3D Cycle'}</span>
        </button>
      </div>

      <div ref={mountRef} className="w-full h-80 sm:h-96 relative cursor-grab active:cursor-grabbing bg-sky-200">
        <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-xs text-white px-3 py-1.5 rounded-full text-xs font-bold pointer-events-none border border-white/20 shadow-lg flex items-center gap-1.5">
          <span>🖐️ Drag to rotate 3D Voxel Island</span>
        </div>
      </div>

      <div className="p-4 bg-slate-900 flex flex-wrap items-center justify-between gap-2 z-20">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={triggerEvaporation}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeStage === 'evaporating'
                ? 'bg-amber-400 text-slate-950 shadow-lg ring-2 ring-amber-200'
                : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-400" />
            <span>1. Sun Evaporate (Steam)</span>
          </button>

          <button
            onClick={triggerCondensation}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeStage === 'condensing'
                ? 'bg-indigo-500 text-white shadow-lg ring-2 ring-indigo-300'
                : 'bg-slate-800 text-indigo-300 hover:bg-slate-700'
            }`}
          >
            <Wind className="w-4 h-4 text-indigo-400" />
            <span>2. Cloud Condense</span>
          </button>

          <button
            onClick={triggerPrecipitation}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeStage === 'raining'
                ? 'bg-sky-500 text-white shadow-lg ring-2 ring-sky-300'
                : 'bg-slate-800 text-sky-300 hover:bg-slate-700'
            }`}
          >
            <CloudRain className="w-4 h-4 text-sky-400" />
            <span>3. Precipitate (Rain)</span>
          </button>
        </div>

        <button
          onClick={handleReset}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 cursor-pointer"
          title="Reset Diorama"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
