import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { createVoxelMesh, VoxelBlock } from './VoxelEngine';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Sparkles, ArrowRight } from 'lucide-react';

export const VoxelScienceWorldMap: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 22, 28);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 1.5);
    dirLight.position.set(15, 30, 20);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const worldGroup = new THREE.Group();

    // 1. Materials Science Island (Top Left)
    const matVoxels: VoxelBlock[] = [];
    for (let x = -3; x <= 3; x++) {
      for (let z = -3; z <= 3; z++) {
        if (Math.abs(x) + Math.abs(z) <= 4) {
          matVoxels.push({ x, y: 0, z, color: 0xf59e0b });
          matVoxels.push({ x, y: -1, z, color: 0x78350f });
        }
      }
    }
    matVoxels.push({ x: 0, y: 1, z: 0, color: 0x38bdf8, transparent: true, opacity: 0.8 });
    matVoxels.push({ x: 0, y: 2, z: 0, color: 0x38bdf8, transparent: true, opacity: 0.8 });
    matVoxels.push({ x: -1, y: 1, z: 0, color: 0xef4444 });
    matVoxels.push({ x: 1, y: 1, z: 0, color: 0x10b981 });

    const matMesh = createVoxelMesh(matVoxels, 0.85);
    const matGroup = new THREE.Group();
    matGroup.position.set(-9, 0, -4);
    matGroup.add(matMesh);
    worldGroup.add(matGroup);

    // 2. Super Senses Island (Top Right)
    const sensesVoxels: VoxelBlock[] = [];
    for (let x = -3; x <= 3; x++) {
      for (let z = -3; z <= 3; z++) {
        if (Math.abs(x) + Math.abs(z) <= 4) {
          sensesVoxels.push({ x, y: 0, z, color: 0x10b981 });
          sensesVoxels.push({ x, y: -1, z, color: 0x064e3b });
        }
      }
    }
    sensesVoxels.push({ x: -1, y: 1, z: -1, color: 0x92400e });
    sensesVoxels.push({ x: 1, y: 1, z: 1, color: 0x78350f });
    sensesVoxels.push({ x: 1, y: 2, z: 1, color: 0x047857 });

    const sensesMesh = createVoxelMesh(sensesVoxels, 0.85);
    const sensesGroup = new THREE.Group();
    sensesGroup.position.set(9, 0, -4);
    sensesGroup.add(sensesMesh);
    worldGroup.add(sensesGroup);

    // 3. Water Island (Bottom Left)
    const waterVoxels: VoxelBlock[] = [];
    for (let x = -3; x <= 3; x++) {
      for (let z = -3; z <= 3; z++) {
        if (Math.abs(x) + Math.abs(z) <= 4) {
          waterVoxels.push({ x, y: 0, z, color: 0x0284c7, transparent: true, opacity: 0.85 });
          waterVoxels.push({ x, y: -1, z, color: 0x0c4a6e });
        }
      }
    }
    waterVoxels.push({ x: 0, y: 1, z: 0, color: 0xffffff });
    waterVoxels.push({ x: 1, y: 1, z: 1, color: 0xfde047 });

    const waterMesh = createVoxelMesh(waterVoxels, 0.85);
    const waterGroup = new THREE.Group();
    waterGroup.position.set(-9, 0, 6);
    waterGroup.add(waterMesh);
    worldGroup.add(waterGroup);

    // 4. Shelter Island (Bottom Right)
    const shelterVoxels: VoxelBlock[] = [];
    for (let x = -3; x <= 3; x++) {
      for (let z = -3; z <= 3; z++) {
        if (Math.abs(x) + Math.abs(z) <= 4) {
          shelterVoxels.push({ x, y: 0, z, color: 0x6366f1 });
          shelterVoxels.push({ x, y: -1, z, color: 0x312e81 });
        }
      }
    }
    shelterVoxels.push({ x: 0, y: 1, z: -1, color: 0x64748b });
    shelterVoxels.push({ x: 0, y: 2, z: -1, color: 0xffffff });
    shelterVoxels.push({ x: 1, y: 1, z: 1, color: 0xf43f5e });

    const shelterMesh = createVoxelMesh(shelterVoxels, 0.85);
    const shelterGroup = new THREE.Group();
    shelterGroup.position.set(9, 0, 6);
    shelterGroup.add(shelterMesh);
    worldGroup.add(shelterGroup);

    scene.add(worldGroup);

    let isDragging = false;
    let prevMouseX = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      worldGroup.rotation.y += deltaX * 0.006;
      prevMouseX = e.clientX;
    };
    const onMouseUp = () => (isDragging = false);

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      matGroup.position.y = Math.sin(t * 1.5) * 0.35;
      sensesGroup.position.y = Math.sin(t * 1.5 + 1.2) * 0.35;
      waterGroup.position.y = Math.sin(t * 1.5 + 2.4) * 0.35;
      shelterGroup.position.y = Math.sin(t * 1.5 + 3.6) * 0.35;

      if (!isDragging) {
        worldGroup.rotation.y += 0.0015;
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

  const BIOMES = [
    {
      id: 'materials',
      name: 'Materials Lab Island 🧪',
      syllabus: 'Theme 6 • Materials Science',
      route: '/intro/materials',
      btnColor: 'bg-amber-400 text-slate-950',
      description: 'Polymers, Natural vs Synthetic, Thermal Insulation & 450-Yr Biodegradability',
    },
    {
      id: 'senses',
      name: 'Super Senses Jungle 🐾',
      syllabus: 'Theme 1 • Living World',
      route: '/intro/senses',
      btnColor: 'bg-emerald-400 text-slate-950',
      description: 'Ant Pheromones, Eagle 4x Zoom Eyes, Snake Vibrations & Velcro Biomimicry',
    },
    {
      id: 'water',
      name: 'Water & Ocean Island 🌊',
      syllabus: 'Theme 2 & 4 • Aquatic Science',
      route: '/intro/water',
      btnColor: 'bg-sky-400 text-slate-950',
      description: 'Water Cycle Simulation, Jaisalmer Stepwells, Dead Sea Density & Mosquitoes',
    },
    {
      id: 'shelter',
      name: 'Himalayan Mountain Peak 🏔️',
      syllabus: 'Theme 3 & 5 • Earth & Shelter',
      route: '/intro/shelter',
      btnColor: 'bg-indigo-500 text-white',
      description: 'Ladakh Pashmina Physics, Mt. Everest Hypoxia, Golconda Acoustics & Bhunga Huts',
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden border-4 border-indigo-400 shadow-2xl relative bg-slate-950">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white px-3 py-1.5 rounded-2xl text-xs font-black border border-indigo-400/50 flex items-center gap-1.5 shadow-lg">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Interactive 3D Voxel World Map (Drag to Spin 360°)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {BIOMES.map((b) => (
          <button
            key={b.id}
            onClick={() => {
              sounds.fanfare();
              voiceAssistant.stop();
              navigate(b.route);
            }}
            className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border-3 border-slate-200 hover:border-indigo-500 shadow-md text-left transition-all cursor-pointer flex flex-col justify-between gap-2 hover:-translate-y-1"
          >
            <div>
              <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md inline-block mb-1">
                {b.syllabus}
              </span>
              <h3 className="text-sm font-black text-slate-900 leading-snug">
                {b.name}
              </h3>
              <p className="text-[11px] font-bold text-slate-500 mt-1 leading-snug">
                {b.description}
              </p>
            </div>

            <div className={`mt-2 py-2 px-3 rounded-xl font-black text-xs flex items-center justify-between ${b.btnColor}`}>
              <span>Enter Island</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
