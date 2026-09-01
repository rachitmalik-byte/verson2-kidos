import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { TreePine, Sparkles, Wind, Sun, Compass, RotateCcw } from 'lucide-react';
import kaykitSampleImg from '@/assets/images/nature/kaykit_forest_biome_sample.png';

interface SpecimenHotspot {
  id: string;
  name: string;
  category: 'Flora' | 'Habitat' | 'Geology';
  description: string;
  scienceTakeaway: string;
  emoji: string;
}

const SPECIMENS: SpecimenHotspot[] = [
  {
    id: 'pine',
    name: 'Ancient Conifer Pine Tree',
    category: 'Flora',
    description: 'Conifers have needle-like leaves with thick waxy cuticles that prevent water evaporation in alpine freezing temperatures.',
    scienceTakeaway: 'Adaptation: Needle geometry reduces surface area to survive snow loads and high winds.',
    emoji: '🌲',
  },
  {
    id: 'rock',
    name: 'Glacial Weathered Boulder',
    category: 'Geology',
    description: 'Granite and basalt boulders provide thermal thermal mass, warming nocturnal insects and sheltering snake burrows.',
    scienceTakeaway: 'Microhabitat: Rock crevices create localized microclimates shielding creatures from frost.',
    emoji: '🪨',
  },
  {
    id: 'bush',
    name: 'Flowering Forest Berry Bush',
    category: 'Habitat',
    description: 'Berry bushes produce nectar and bright fruits that attract birds, dispersing seeds across long distances in feces.',
    scienceTakeaway: 'Symbiosis: Animals get nutrient-rich sugar while dispersing botanical seeds miles away.',
    emoji: '🫐',
  },
  {
    id: 'trail',
    name: 'Ant Scent Highway (Soil Substrate)',
    category: 'Habitat',
    description: 'Forest soil retains volatile pheromone hydrocarbons deposited by scout ants communicating food sources.',
    scienceTakeaway: 'Pheromone Ecology: Pheromone trails remain active for hours until decomposed by soil microbes.',
    emoji: '🐜',
  },
];

export const VoxelNatureBiome: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedSpecimen, setSelectedSpecimen] = useState<SpecimenHotspot>(SPECIMENS[0]);
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'sunset' | 'night'>('day');
  const [windActive, setWindActive] = useState<boolean>(false);
  const [use3DCanvas, setUse3DCanvas] = useState<boolean>(true);

  useEffect(() => {
    if (!mountRef.current || !use3DCanvas) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 320;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(timeOfDay === 'day' ? 0xe0f2fe : timeOfDay === 'sunset' ? 0xfde047 : 0x0f172a);
    scene.fog = new THREE.FogExp2(scene.background.getHex(), 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 5, 9);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mountRef.current.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(
      timeOfDay === 'day' ? 0xffffff : timeOfDay === 'sunset' ? 0xfdba74 : 0x38bdf8,
      timeOfDay === 'night' ? 0.6 : 1.2
    );
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 2.0);
    sunLight.position.set(5, 12, 6);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // 3. Ground Island Grid
    const islandGeo = new THREE.CylinderGeometry(4.5, 5.0, 1.2, 8);
    const islandMat = new THREE.MeshStandardMaterial({
      color: timeOfDay === 'night' ? 0x1e293b : 0x15803d,
      roughness: 0.8,
      flatShading: true,
    });
    const island = new THREE.Mesh(islandGeo, islandMat);
    island.position.y = -0.6;
    island.receiveShadow = true;
    scene.add(island);

    // Soil layer underneath
    const soilGeo = new THREE.CylinderGeometry(5.0, 4.2, 1.8, 8);
    const soilMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9, flatShading: true });
    const soil = new THREE.Mesh(soilGeo, soilMat);
    soil.position.y = -2.1;
    scene.add(soil);

    // 4. Load KayKit Nature GLTF Models or Procedural Voxel Forest
    const loader = new GLTFLoader();
    const loadedObjects: THREE.Object3D[] = [];

    const loadModel = (path: string, x: number, z: number, scale = 1, rotY = 0) => {
      loader.load(
        path,
        (gltf) => {
          const model = gltf.scene;
          model.position.set(x, 0, z);
          model.scale.set(scale, scale, scale);
          model.rotation.y = rotY;
          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          scene.add(model);
          loadedObjects.push(model);
        },
        undefined,
        (err) => {
          console.warn('Fallback procedural for', path, err);
          // Procedural Voxel Tree fallback
          const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.25, 1.2, 6),
            new THREE.MeshStandardMaterial({ color: 0x78350f })
          );
          trunk.position.set(x, 0.6, z);
          const foliage = new THREE.Mesh(
            new THREE.ConeGeometry(1.0, 2.0, 6),
            new THREE.MeshStandardMaterial({ color: 0x16a34a, flatShading: true })
          );
          foliage.position.set(x, 2.0, z);
          scene.add(trunk, foliage);
        }
      );
    };

    // Load multiple Nature elements
    loadModel('/models/nature/Tree_1_A_Color1.gltf', -1.8, -0.8, 1.4, 0.4);
    loadModel('/models/nature/Tree_2_A_Color1.gltf', 1.6, -1.2, 1.3, -0.6);
    loadModel('/models/nature/Tree_3_A_Color1.gltf', 0.2, -1.9, 1.1, 1.2);
    loadModel('/models/nature/Bush_1_A_Color1.gltf', -1.2, 1.2, 1.0, 0.2);
    loadModel('/models/nature/Bush_2_A_Color1.gltf', 1.8, 1.0, 0.9, -0.4);
    loadModel('/models/nature/Rock_1_A_Color1.gltf', 0.2, 1.4, 1.2, 0.8);
    loadModel('/models/nature/Rock_2_A_Color1.gltf', -2.2, 0.6, 0.8, -0.5);

    // 5. Animation Loop with Gentle Orbit
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Slow gentle scene rotation
      island.rotation.y = elapsed * 0.05;
      soil.rotation.y = elapsed * 0.05;

      loadedObjects.forEach((obj, idx) => {
        if (windActive) {
          obj.rotation.z = Math.sin(elapsed * 4 + idx) * 0.08;
        } else {
          obj.rotation.z = 0;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 320;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [timeOfDay, windActive, use3DCanvas]);

  const handleSelectSpecimen = (s: SpecimenHotspot) => {
    sounds.pop();
    setSelectedSpecimen(s);
    voiceAssistant.speak(`${s.name}: ${s.description}`);
  };

  return (
    <div className="w-full bg-gradient-to-b from-emerald-950 to-slate-950 p-5 sm:p-7 rounded-[36px] border-4 border-emerald-400 shadow-2xl text-white flex flex-col items-center">
      {/* Header Bar */}
      <div className="flex items-center justify-between w-full mb-3 flex-wrap gap-2">
        <span className="px-3.5 py-1.5 bg-emerald-900/80 rounded-full text-xs font-black uppercase text-emerald-300 border border-emerald-500/50 flex items-center gap-1.5">
          <TreePine className="w-4 h-4 text-emerald-400" />
          <span>KayKit 3D Voxel Forest Biome</span>
        </span>

        {/* Environmental Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-700">
          <button
            onClick={() => {
              sounds.pop();
              setTimeOfDay(timeOfDay === 'day' ? 'sunset' : timeOfDay === 'sunset' ? 'night' : 'day');
            }}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-1 cursor-pointer"
          >
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span className="capitalize">{timeOfDay}</span>
          </button>

          <button
            onClick={() => {
              sounds.pop();
              setWindActive(!windActive);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              windActive ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Wind className="w-3.5 h-3.5 text-sky-300" />
            <span>Wind {windActive ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* 3D Voxel Canvas Stage */}
      <div className="w-full h-64 sm:h-72 rounded-3xl overflow-hidden bg-slate-900/80 border-2 border-emerald-500/40 relative shadow-inner flex items-center justify-center">
        {use3DCanvas ? (
          <div ref={mountRef} className="w-full h-full" />
        ) : (
          <img src={kaykitSampleImg} alt="Voxel Forest" className="w-full h-full object-cover" />
        )}

        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-400/40 text-[10px] font-mono font-black text-emerald-300">
          🌲 Real-Time 3D Forest Simulation
        </div>
      </div>

      {/* Specimen Exploration Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full mt-3">
        {SPECIMENS.map((s) => {
          const isSelected = selectedSpecimen.id === s.id;
          return (
            <button
              key={s.id}
              onClick={() => handleSelectSpecimen(s)}
              className={`p-2.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-emerald-800 border-emerald-400 text-white shadow-lg scale-102'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-emerald-500/40'
              }`}
            >
              <span className="text-2xl">{s.emoji}</span>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-black truncate">{s.name}</span>
                <span className="text-[10px] text-emerald-400 font-bold">{s.category}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Specimen Deep Dive Card */}
      <div className="w-full bg-slate-900/90 p-4 rounded-2xl border border-slate-800 mt-3 text-left">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{selectedSpecimen.emoji}</span>
          <h4 className="font-black text-sm text-emerald-300">{selectedSpecimen.name}</h4>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-400 ml-auto">
            {selectedSpecimen.category}
          </span>
        </div>

        <p className="text-xs text-slate-300 font-bold leading-relaxed mb-2">
          {selectedSpecimen.description}
        </p>

        <div className="p-2.5 bg-emerald-950/80 rounded-xl border border-emerald-500/50 text-[11px] font-black text-emerald-200 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{selectedSpecimen.scienceTakeaway}</span>
        </div>
      </div>
    </div>
  );
};
