import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Droplets, RotateCcw, Sparkles } from 'lucide-react';

interface Props {
  onCompleted?: () => void;
}

export const ThreeFabricDropletLab: React.FC<Props> = ({ onCompleted }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedFabric, setSelectedFabric] = useState<'polyester' | 'cotton'>('polyester');
  const [sprayed, setSprayed] = useState(false);

  const handleSpray = () => {
    sounds.bubble();
    setSprayed(true);

    if (selectedFabric === 'polyester') {
      voiceAssistant.speak(
        'Observe the 3D surface! On synthetic polyester, non-porous extruded fibers make water bead up into tight spheres without penetrating.'
      );
    } else {
      voiceAssistant.speak(
        'Look closely! Natural cotton has hollow plant cellulose pores. Capillary action drinks in the droplets, soaking and wetting the fabric.'
      );
    }

    if (onCompleted) onCompleted();
  };

  const handleReset = () => {
    sounds.pop();
    setSprayed(false);
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 380;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 5, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 2.5);
    dirLight.position.set(4, 10, 6);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const blueLight = new THREE.PointLight(0x38bdf8, 2.0, 10);
    blueLight.position.set(-4, 3, 2);
    scene.add(blueLight);

    const fabricGeo = new THREE.BoxGeometry(6, 0.4, 5, 32, 2, 32);
    
    const fabricColor = selectedFabric === 'polyester' ? 0x2563eb : 0xd6c7b2;
    const fabricMat = new THREE.MeshStandardMaterial({
      color: fabricColor,
      roughness: selectedFabric === 'polyester' ? 0.3 : 0.85,
      metalness: selectedFabric === 'polyester' ? 0.2 : 0.05,
    });
    const fabricMesh = new THREE.Mesh(fabricGeo, fabricMat);
    fabricMesh.receiveShadow = true;
    scene.add(fabricMesh);

    const dropletsGroup = new THREE.Group();
    scene.add(dropletsGroup);

    const dropletCount = 18;
    const dropletMeshes: { mesh: THREE.Mesh; targetScale: THREE.Vector3; targetY: number }[] = [];

    const dropletMat = new THREE.MeshPhysicalMaterial({
      color: 0xbae6fd,
      transparent: true,
      opacity: 0.85,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.9,
      ior: 1.33,
      clearcoat: 1.0,
    });

    for (let i = 0; i < dropletCount; i++) {
      const dropGeo = new THREE.SphereGeometry(0.35, 24, 24);
      const dropMesh = new THREE.Mesh(dropGeo, dropletMat);
      dropMesh.castShadow = true;

      const posX = (Math.random() - 0.5) * 4.2;
      const posZ = (Math.random() - 0.5) * 3.4;

      if (!sprayed) {
        dropMesh.position.set(posX, 4 + Math.random() * 2, posZ);
        dropMesh.scale.set(0.01, 0.01, 0.01);
      } else {
        if (selectedFabric === 'polyester') {
          dropMesh.position.set(posX, 0.45, posZ);
          dropMesh.scale.set(1.0, 0.85, 1.0);
        } else {
          dropMesh.position.set(posX, 0.22, posZ);
          dropMesh.scale.set(2.2, 0.15, 2.2);
        }
      }

      dropletsGroup.add(dropMesh);
      dropletMeshes.push({
        mesh: dropMesh,
        targetScale: selectedFabric === 'polyester' ? new THREE.Vector3(1, 0.85, 1) : new THREE.Vector3(2.2, 0.15, 2.2),
        targetY: selectedFabric === 'polyester' ? 0.45 : 0.22,
      });
    }

    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const handleDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const handleMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      fabricMesh.rotation.y += dx * 0.006;
      fabricMesh.rotation.x += dy * 0.006;
      dropletsGroup.rotation.y += dx * 0.006;
      dropletsGroup.rotation.x += dy * 0.006;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const handleUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointerdown', handleDown);
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (!isDragging) {
        fabricMesh.rotation.y = Math.sin(elapsed * 0.5) * 0.1;
        dropletsGroup.rotation.y = fabricMesh.rotation.y;
      }

      if (sprayed) {
        dropletMeshes.forEach((d) => {
          d.mesh.position.y = THREE.MathUtils.lerp(d.mesh.position.y, d.targetY, 0.1);
          d.mesh.scale.lerp(d.targetScale, 0.1);
        });
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
  }, [selectedFabric, sprayed]);

  return (
    <div className="w-full bg-slate-900 text-white rounded-3xl border-3 border-amber-400/60 p-4 sm:p-6 shadow-2xl flex flex-col gap-4 font-sans select-none">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-amber-400" />
              <span>3D Fabric & Water Droplet Physics</span>
            </span>
            <span className="text-xs font-bold text-slate-400">Drag to tilt fabric in 3D</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white mt-1">
            {selectedFabric === 'polyester' ? '100% Synthetic Polyester Weave' : '100% Natural Cotton Plant Fibers'}
          </h3>
          <p className="text-xs font-bold text-slate-300">
            {selectedFabric === 'polyester'
              ? 'Hydrophobic: Non-porous synthetic filaments force water to bead up into spheres!'
              : 'Hydrophilic: Microscopic capillary pores absorb water droplets and soak the fabric!'}
          </p>
        </div>

        <div className="flex gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => {
              sounds.pop();
              setSelectedFabric('polyester');
              setSprayed(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              selectedFabric === 'polyester'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Polyester (Synthetic)
          </button>
          <button
            onClick={() => {
              sounds.pop();
              setSelectedFabric('cotton');
              setSprayed(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              selectedFabric === 'cotton'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cotton (Natural)
          </button>
        </div>
      </div>

      <div
        ref={mountRef}
        className="w-full h-[320px] sm:h-[360px] rounded-2xl overflow-hidden relative bg-radial from-slate-900 to-slate-950 border border-slate-800 shadow-inner"
      />

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="text-xs font-bold text-slate-400">
          {sprayed
            ? selectedFabric === 'polyester'
              ? 'Droplets beaded up into high-surface-tension spheres!'
              : 'Droplets flattened and absorbed through capillary pores!'
            : 'Tap "Spray Water Droplets" to test absorbency'}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSpray}
            className="px-6 py-2.5 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Droplets className="w-4 h-4 fill-slate-950" />
            <span>Spray Water Droplets</span>
          </button>

          {sprayed && (
            <button
              onClick={handleReset}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl cursor-pointer"
              title="Reset fabric"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
