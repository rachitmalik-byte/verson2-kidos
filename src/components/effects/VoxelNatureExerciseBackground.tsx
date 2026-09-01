import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { motion } from 'framer-motion';
import { Sun, Moon, Sparkles, Wind } from 'lucide-react';
import { sounds } from '@/lib/sounds';
import kaykitSampleImg from '@/assets/images/nature/kaykit_forest_biome_sample.png';

interface VoxelNatureExerciseBackgroundProps {
  opacity?: number;
  interactive?: boolean;
}

export const VoxelNatureExerciseBackground: React.FC<VoxelNatureExerciseBackgroundProps> = ({
  opacity = 0.85,
  interactive = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [canopyMode, setCanopyMode] = useState<'day' | 'twilight' | 'firefly'>('day');
  const [is3DSupported, setIs3DSupported] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. Scene, Camera, WebGL Renderer
    const scene = new THREE.Scene();
    const isNight = canopyMode === 'firefly';
    const isTwilight = canopyMode === 'twilight';

    const bgColor = isNight ? 0x091426 : isTwilight ? 0x2e1065 : 0xecfdf5;
    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.FogExp2(bgColor, 0.028);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 6, 13);
    camera.lookAt(0, 1.5, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      mountRef.current.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL init failed, using fallback render', e);
      setIs3DSupported(false);
      return;
    }

    // 2. Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(
      isNight ? 0x38bdf8 : isTwilight ? 0xfdba74 : 0xffffff,
      isNight ? 0.7 : isTwilight ? 1.2 : 1.5
    );
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(isNight ? 0x60a5fa : isTwilight ? 0xf97316 : 0xfef08a, isNight ? 1.0 : 2.2);
    sunLight.position.set(8, 14, 8);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // 3. Floating Low-Poly Voxel Nature Island Base
    const islandGeo = new THREE.CylinderGeometry(8.5, 9.5, 1.8, 10);
    const islandMat = new THREE.MeshStandardMaterial({
      color: isNight ? 0x1e293b : isTwilight ? 0x166534 : 0x15803d,
      roughness: 0.8,
      flatShading: true,
    });
    const island = new THREE.Mesh(islandGeo, islandMat);
    island.position.y = -1.2;
    island.receiveShadow = true;
    scene.add(island);

    // Dirt base
    const dirtGeo = new THREE.CylinderGeometry(9.5, 7.5, 3.2, 10);
    const dirtMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9, flatShading: true });
    const dirt = new THREE.Mesh(dirtGeo, dirtMat);
    dirt.position.y = -3.2;
    scene.add(dirt);

    // 4. Load KayKit 3D Nature GLTF Models
    const loader = new GLTFLoader();
    const treeMeshes: THREE.Object3D[] = [];

    const loadVoxelItem = (path: string, x: number, z: number, scale = 1, rotY = 0) => {
      loader.load(
        path,
        (gltf) => {
          const m = gltf.scene;
          m.position.set(x, -0.3, z);
          m.scale.set(scale, scale, scale);
          m.rotation.y = rotY;
          m.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          scene.add(m);
          treeMeshes.push(m);
        },
        undefined,
        () => {
          // Procedural Voxel fallback
          const trunk = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 2.0, 0.5),
            new THREE.MeshStandardMaterial({ color: 0x78350f })
          );
          trunk.position.set(x, 0.7, z);
          const crown = new THREE.Mesh(
            new THREE.ConeGeometry(1.4, 2.8, 6),
            new THREE.MeshStandardMaterial({ color: 0x16a34a, flatShading: true })
          );
          crown.position.set(x, 2.5, z);
          scene.add(trunk, crown);
        }
      );
    };

    // Populate Forest Island with KayKit Models
    loadVoxelItem('/models/nature/Tree_1_A_Color1.gltf', -3.8, -1.8, 2.2, 0.3);
    loadVoxelItem('/models/nature/Tree_2_A_Color1.gltf', 3.4, -2.2, 2.0, -0.6);
    loadVoxelItem('/models/nature/Tree_3_A_Color1.gltf', 0.5, -3.8, 1.9, 1.1);
    loadVoxelItem('/models/nature/Tree_1_A_Color1.gltf', -2.2, 2.4, 1.6, 0.9);
    loadVoxelItem('/models/nature/Bush_1_A_Color1.gltf', -1.5, 2.0, 1.4, 0.2);
    loadVoxelItem('/models/nature/Bush_2_A_Color1.gltf', 2.8, 1.4, 1.5, -0.4);
    loadVoxelItem('/models/nature/Rock_1_A_Color1.gltf', 0.2, 2.2, 1.8, 0.5);
    loadVoxelItem('/models/nature/Rock_2_A_Color1.gltf', -4.2, 0.5, 1.3, -0.8);
    loadVoxelItem('/models/nature/Grass_1_A_Color1.gltf', 1.2, 3.2, 1.4, 0.4);

    // 5. Mouse Parallax Tilt
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetRotY = nx * 0.15;
      targetRotX = ny * 0.08;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 6. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle continuous world rotation + mouse tilt
      island.rotation.y = elapsed * 0.04 + targetRotY;
      dirt.rotation.y = elapsed * 0.04 + targetRotY;
      camera.position.y = 6 + targetRotX * 3;

      // Foliage wind sway
      treeMeshes.forEach((mesh, i) => {
        mesh.rotation.z = Math.sin(elapsed * 2.5 + i) * 0.04;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [canopyMode]);

  const toggleCanopy = () => {
    sounds.pop();
    if (canopyMode === 'day') setCanopyMode('twilight');
    else if (canopyMode === 'twilight') setCanopyMode('firefly');
    else setCanopyMode('day');
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 3D WebGL Canvas Layer */}
      {is3DSupported ? (
        <div ref={mountRef} className="absolute inset-0 w-full h-full" style={{ opacity }} />
      ) : (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-70"
          style={{ backgroundImage: `url(${kaykitSampleImg})` }}
        />
      )}

      {/* Dynamic atmospheric overlay gradient */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          canopyMode === 'firefly'
            ? 'bg-gradient-to-b from-slate-950/60 via-emerald-950/40 to-slate-950/80'
            : canopyMode === 'twilight'
            ? 'bg-gradient-to-b from-purple-950/40 via-amber-950/30 to-emerald-950/50'
            : 'bg-gradient-to-b from-white/40 via-emerald-50/20 to-teal-50/40'
        }`}
      />

      {/* Floating 3D Nature Atmosphere Switcher */}
      {interactive && (
        <div className="absolute top-4 right-4 z-20 pointer-events-auto">
          <button
            onClick={toggleCanopy}
            className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border-2 border-emerald-300 text-emerald-950 font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer hover:bg-white active:scale-95 transition-all"
            title="Switch 3D Voxel Nature Lighting"
          >
            {canopyMode === 'firefly' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Night Glow</span>
              </>
            ) : canopyMode === 'twilight' ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Twilight</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Daylight</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
