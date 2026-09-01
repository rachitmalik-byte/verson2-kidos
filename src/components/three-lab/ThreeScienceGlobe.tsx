import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { sounds } from '@/lib/sounds';
import { Globe, Sparkles, ArrowRight } from 'lucide-react';

interface BiomePin {
  id: string;
  name: string;
  emoji: string;
  color: number;
  lat: number;
  lon: number;
  route: string;
  desc: string;
}

const BIOMES: BiomePin[] = [
  { id: 'materials', name: 'Materials Science Lab', emoji: '🧪', color: 0xf59e0b, lat: 25, lon: 45, route: '/intro/materials', desc: 'Synthetic Polymers & Fibres' },
  { id: 'senses', name: 'Living World Forest', emoji: '🦋', color: 0x10b981, lat: 10, lon: -60, route: '/intro/senses', desc: 'Animal Super Senses & Adaptations' },
  { id: 'water', name: 'Aquatic Ocean Realm', emoji: '🌊', color: 0x0ea5e9, lat: -20, lon: 110, route: '/intro/water', desc: 'Buoyancy, Stepwells & Rain' },
  { id: 'shelter', name: 'Ladakh High Mountains', emoji: '🏔️', color: 0x6366f1, lat: 50, lon: 80, route: '/intro/shelter', desc: 'Nomadic Rebo & Pashmina Physics' },
];

function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export const ThreeScienceGlobe: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [activeBiome, setActiveBiome] = useState<BiomePin>(BIOMES[0]);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050811);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.replaceChildren(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.5);
    sunLight.position.set(10, 10, 10);
    scene.add(sunLight);

    // Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Base Sphere
    const globeGeo = new THREE.SphereGeometry(3, 48, 48);
    const globeMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.6,
      metalness: 0.1,
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globeMesh);

    // Atmosphere Glow Halo
    const haloGeo = new THREE.SphereGeometry(3.18, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    globeGroup.add(haloMesh);

    // Biome Landmark Pins
    BIOMES.forEach((b) => {
      const pos = latLonToVector3(b.lat, b.lon, 3.05);
      const pinGeo = new THREE.SphereGeometry(0.22, 16, 16);
      const pinMat = new THREE.MeshStandardMaterial({
        color: b.color,
        emissive: b.color,
        emissiveIntensity: 0.6,
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      globeGroup.add(pinMesh);
    });

    // Touch Drag Rotation
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const handleDown = (e: PointerEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMousePos.x;
      const dy = e.clientY - prevMousePos.y;
      globeGroup.rotation.y += dx * 0.008;
      globeGroup.rotation.x += dy * 0.008;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointerdown', handleDown);
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);

    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging) {
        globeGroup.rotation.y += 0.003;
      }
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="w-full bg-slate-950 text-white rounded-3xl border-2 border-emerald-500/40 p-4 sm:p-6 shadow-2xl flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-2.5 py-0.5 rounded-full">
              3D Science Planet Explorer
            </span>
            <span className="text-xs font-bold text-slate-400">Spin the globe & choose a biome</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white mt-1">
            {activeBiome.emoji} {activeBiome.name}
          </h3>
          <p className="text-xs text-slate-400">
            {activeBiome.desc}
          </p>
        </div>

        <button
          onClick={() => {
            sounds.fanfare();
            navigate(activeBiome.route);
          }}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95 transition-all"
        >
          <span>Enter Biome</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div
        ref={mountRef}
        className="w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing relative bg-radial from-slate-900 to-slate-950 border border-slate-800 shadow-inner"
      />

      {/* Biome Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {BIOMES.map((b) => (
          <button
            key={b.id}
            onClick={() => {
              sounds.pop();
              setActiveBiome(b);
            }}
            className={`p-2.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col gap-1 ${
              activeBiome.id === b.id
                ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span className="text-xl">{b.emoji}</span>
            <span className="text-xs font-black truncate">{b.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
