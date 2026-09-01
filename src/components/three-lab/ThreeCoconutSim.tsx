import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Waves, Play, RotateCcw } from 'lucide-react';

interface Props {
  onCompleted?: () => void;
}

export const ThreeCoconutSim: React.FC<Props> = ({ onCompleted }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [voyageProgress, setVoyageProgress] = useState(0);
  const [isDrifting, setIsDrifting] = useState(false);

  const handleLaunchVoyage = () => {
    sounds.bubble();
    setIsDrifting(true);
    setVoyageProgress(0);

    const interval = setInterval(() => {
      setVoyageProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          sounds.fanfare();
          voiceAssistant.speak(
            'Ocean voyage complete! The buoyant fibrous husk carried the coconut across 800 kilometers of saltwater to colonize a new tropical island!'
          );
          if (onCompleted) onCompleted();
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 380;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0284c7); // Deep Tropical Ocean

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3.2, 11);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffedd5, 2.5);
    sunLight.position.set(8, 15, 10);
    scene.add(sunLight);

    // 1. Solid Ocean Water Surface with Waves
    const waterGeo = new THREE.PlaneGeometry(30, 20, 32, 32);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.2,
      side: THREE.DoubleSide,
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.y = -0.5;
    scene.add(waterMesh);

    // 2. Left Island (Home)
    const island1Geo = new THREE.CylinderGeometry(2.5, 3.5, 1.2, 24);
    const islandMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.9 });
    const island1 = new THREE.Mesh(island1Geo, islandMat);
    island1.position.set(-6.5, -0.6, -1);
    scene.add(island1);

    // 3. Right Island (Target Atoll)
    const island2 = new THREE.Mesh(island1Geo, islandMat);
    island2.position.set(6.5, -0.6, -1);
    scene.add(island2);

    // 4. Palm Trees
    const createPalmTree = (x: number, z: number) => {
      const g = new THREE.Group();
      const trunkGeo = new THREE.CylinderGeometry(0.12, 0.2, 2.2, 8);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1.1;
      trunk.rotation.z = -0.15;
      g.add(trunk);

      const leafMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, side: THREE.DoubleSide });
      for (let a = 0; a < 360; a += 60) {
        const rad = THREE.MathUtils.degToRad(a);
        const leafGeo = new THREE.ConeGeometry(0.6, 1.8, 4);
        const leaf = new THREE.Mesh(leafGeo, leafMat);
        leaf.position.set(Math.cos(rad) * 0.6, 2.1, Math.sin(rad) * 0.6);
        leaf.rotation.z = Math.cos(rad) * 1.1;
        leaf.rotation.x = Math.sin(rad) * 1.1;
        g.add(leaf);
      }
      g.position.set(x, 0, z);
      return g;
    };

    scene.add(createPalmTree(-6.5, -1));
    scene.add(createPalmTree(6.5, -1));

    // 5. 3D Floating Coconut with Fibrous Husk
    const coconutGroup = new THREE.Group();
    scene.add(coconutGroup);

    const huskGeo = new THREE.SphereGeometry(0.75, 24, 24);
    huskGeo.scale(0.85, 1.15, 0.85);
    const huskMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.7 });
    const huskMesh = new THREE.Mesh(huskGeo, huskMat);
    coconutGroup.add(huskMesh);

    // Green Sprout
    const sproutGeo = new THREE.ConeGeometry(0.15, 0.8, 8);
    const sproutMat = new THREE.MeshStandardMaterial({ color: 0x22c55e });
    const sprout = new THREE.Mesh(sproutGeo, sproutMat);
    sprout.position.set(0, 0.9, 0);
    sprout.rotation.z = 0.2;
    coconutGroup.add(sprout);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Ocean Wave Ripple Animation
      const pos = waterGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const v = pos.getY(i);
        pos.setZ(i, Math.sin(u * 0.8 + elapsed * 2.5) * 0.12 + Math.cos(v * 0.8 + elapsed * 2) * 0.08);
      }
      waterGeo.computeVertexNormals();
      waterGeo.attributes.position.needsUpdate = true;

      // Coconut Buoyant Drift across Islands
      const targetX = -4.5 + (voyageProgress / 100) * 9.0;
      coconutGroup.position.x = THREE.MathUtils.lerp(coconutGroup.position.x, targetX, 0.08);
      coconutGroup.position.y = -0.25 + Math.sin(elapsed * 3.0) * 0.12;
      coconutGroup.rotation.z = Math.sin(elapsed * 2.0) * 0.15;
      coconutGroup.rotation.y += 0.008;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [voyageProgress]);

  return (
    <div className="w-full bg-slate-900 text-white rounded-3xl border-3 border-teal-400 p-4 sm:p-6 shadow-2xl flex flex-col gap-4 font-sans select-none">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-teal-400 bg-teal-400/10 border border-teal-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Waves className="w-3.5 h-3.5 text-teal-400" />
              <span>3D Ocean Buoyancy Simulator</span>
            </span>
            <span className="text-xs font-bold text-teal-300">
              Voyage: {voyageProgress}% Complete
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-black text-white mt-1">
            Fibrous Waterproof Husk Buoyancy 🥥
          </h4>
          <p className="text-xs font-bold text-slate-300">
            Air-filled fibrous husk traps thousands of micro air pockets, keeping the seed floating across 800+ km of salt water!
          </p>
        </div>

        <button
          onClick={handleLaunchVoyage}
          disabled={isDrifting && voyageProgress < 100}
          className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Launch Ocean Drift</span>
        </button>
      </div>

      <div
        ref={mountRef}
        className="w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden relative bg-teal-950 border border-slate-700 shadow-inner"
      />
    </div>
  );
};
