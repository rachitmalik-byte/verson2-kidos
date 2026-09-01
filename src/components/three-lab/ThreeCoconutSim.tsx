import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Waves, Play, RotateCcw, Sparkles } from 'lucide-react';

interface Props {
  onCompleted?: () => void;
}

export const ThreeCoconutSim: React.FC<Props> = ({ onCompleted }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isDrifting, setIsDrifting] = useState(false);
  const [voyageProgress, setVoyageProgress] = useState(0); // 0 to 100

  const handleLaunchVoyage = () => {
    sounds.bubble();
    setIsDrifting(true);
  };

  const handleReset = () => {
    sounds.pop();
    setIsDrifting(false);
    setVoyageProgress(0);
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 400;

    // 1. Scene & Atmosphere
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x38bdf8); // Sunny Tropical Sky
    scene.fog = new THREE.FogExp2(0xbae6fd, 0.02);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 4.5, 13);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);

    // 2. Tropical Sunlight & Ambient
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 3.0);
    sunLight.position.set(12, 25, 15);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // 3. Fluid Ocean Surface Plane with Smooth Continuous Waves
    const oceanWidth = 36;
    const oceanDepth = 24;
    const oceanGeo = new THREE.PlaneGeometry(oceanWidth, oceanDepth, 64, 48);
    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Vibrant tropical azure
      roughness: 0.15,
      metalness: 0.25,
      side: THREE.DoubleSide,
    });
    const oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
    oceanMesh.rotation.x = -Math.PI / 2;
    oceanMesh.position.y = -0.6;
    scene.add(oceanMesh);

    // 4. Tropical Islands & Palm Trees
    const islandMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.9 }); // Golden Sand
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.8 });

    // Home Island (Left)
    const homeIsland = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 4.5, 1.4, 32), islandMat);
    homeIsland.position.set(-8.5, -0.8, -1.5);
    scene.add(homeIsland);

    // Destination Island (Right)
    const destIsland = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 4.8, 1.4, 32), islandMat);
    destIsland.position.set(8.5, -0.8, -1.5);
    scene.add(destIsland);

    // Realistic Palm Tree Generator
    const createPalmTree = (x: number, z: number) => {
      const group = new THREE.Group();
      // Curved Trunk
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.2, 1.2, 0.1),
        new THREE.Vector3(0.5, 2.6, 0.2),
      ]);
      const trunkGeo = new THREE.TubeGeometry(curve, 16, 0.18, 8, false);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      group.add(trunk);

      // Fronds (Leaves)
      const leafMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, side: THREE.DoubleSide });
      for (let a = 0; a < 360; a += 45) {
        const rad = THREE.MathUtils.degToRad(a);
        const frondGeo = new THREE.ConeGeometry(0.7, 2.2, 4);
        const frond = new THREE.Mesh(frondGeo, leafMat);
        frond.position.set(0.5 + Math.cos(rad) * 0.8, 2.6, 0.2 + Math.sin(rad) * 0.8);
        frond.rotation.z = Math.cos(rad) * 1.2;
        frond.rotation.x = Math.sin(rad) * 1.2;
        group.add(frond);
      }
      group.position.set(x, 0, z);
      return group;
    };

    scene.add(createPalmTree(-8.5, -1.5));
    scene.add(createPalmTree(8.5, -1.5));

    // 5. 3D Floating Coconut Model
    const coconutGroup = new THREE.Group();
    scene.add(coconutGroup);

    // Textured Brown Husk (Fibrous Outer Shell)
    const huskGeo = new THREE.SphereGeometry(0.7, 24, 24);
    huskGeo.scale(0.85, 1.15, 0.85);
    const huskMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.75 });
    const huskMesh = new THREE.Mesh(huskGeo, huskMat);
    coconutGroup.add(huskMesh);

    // Green Sprout shoot
    const sproutGeo = new THREE.ConeGeometry(0.12, 0.75, 8);
    const sproutMat = new THREE.MeshStandardMaterial({ color: 0x4ade80 });
    const sprout = new THREE.Mesh(sproutGeo, sproutMat);
    sprout.position.set(0, 0.8, 0);
    sprout.rotation.z = 0.25;
    coconutGroup.add(sprout);

    // Foam Wake Ring around Coconut
    const foamRingGeo = new THREE.RingGeometry(0.75, 1.05, 24);
    const foamRingMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6, side: THREE.DoubleSide });
    const foamRing = new THREE.Mesh(foamRingGeo, foamRingMat);
    foamRing.rotation.x = -Math.PI / 2;
    foamRing.position.y = 0.05;
    coconutGroup.add(foamRing);

    // 6. Smooth Physics Variables
    let coconutProgress = 0;
    let completedTriggered = false;
    const startX = -6.5;
    const endX = 6.5;

    // 7. 60 FPS Fluid Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Fluid Wave Vertex Dynamics (Smooth continuous Sine & Cosine superposition)
      const positions = oceanGeo.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const u = positions.getX(i);
        const v = positions.getY(i);
        const waveH =
          Math.sin(u * 0.6 + elapsed * 2.2) * 0.14 +
          Math.cos(v * 0.6 + elapsed * 1.8) * 0.1 +
          Math.sin((u + v) * 0.4 + elapsed * 3.0) * 0.05;
        positions.setZ(i, waveH);
      }
      oceanGeo.computeVertexNormals();
      oceanGeo.attributes.position.needsUpdate = true;

      // Continuous Fluid Voyage Movement
      if (isDrifting && coconutProgress < 1.0) {
        coconutProgress += delta * 0.12; // Smooth 8-second realistic oceanic voyage
        if (coconutProgress >= 1.0) {
          coconutProgress = 1.0;
          if (!completedTriggered) {
            completedTriggered = true;
            sounds.fanfare();
            voiceAssistant.speak(
              'Ocean current voyage complete! The buoyant fibrous husk kept the coconut afloat across 800 kilometers of saltwater to colonize a new tropical island!'
            );
            if (onCompleted) onCompleted();
          }
        }
        setVoyageProgress(Math.round(coconutProgress * 100));
      }

      // Smooth Hydrodynamic Position & Wave Following
      const currentX = THREE.MathUtils.lerp(startX, endX, coconutProgress);
      const waveAtCoconut = Math.sin(currentX * 0.6 + elapsed * 2.2) * 0.14 - 0.55;

      coconutGroup.position.x = currentX;
      coconutGroup.position.y = waveAtCoconut + 0.25;
      coconutGroup.rotation.z = Math.sin(elapsed * 2.5) * 0.12;
      coconutGroup.rotation.y = elapsed * 0.4;
      coconutGroup.rotation.x = Math.cos(elapsed * 2.0) * 0.08;

      // Camera smoothly tracks coconut horizontally
      camera.position.x = currentX * 0.4;
      camera.lookAt(currentX * 0.6, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [isDrifting]);

  return (
    <div className="w-full bg-slate-900 text-white rounded-3xl border-3 border-teal-400 p-4 sm:p-6 shadow-2xl flex flex-col gap-4 font-sans select-none">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-teal-400 bg-teal-400/10 border border-teal-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Waves className="w-3.5 h-3.5 text-teal-400" />
              <span>3D Fluid Ocean Hydrodynamics</span>
            </span>
            <span className="text-xs font-bold text-teal-300">
              Voyage: {voyageProgress}% Across Ocean Current
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-black text-white mt-1">
            Fibrous Waterproof Husk Buoyancy 🥥
          </h4>
          <p className="text-xs font-bold text-slate-300">
            Air-filled fibrous husk traps thousands of buoyant micro air pockets, keeping the seed floating across 800+ km of salt water!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLaunchVoyage}
            disabled={isDrifting && voyageProgress < 100}
            className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Ocean Drift</span>
          </button>

          {voyageProgress > 0 && (
            <button
              onClick={handleReset}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl cursor-pointer"
              title="Reset voyage"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="w-full h-[340px] sm:h-[400px] rounded-2xl overflow-hidden relative bg-sky-300 border border-slate-700 shadow-inner"
      />
    </div>
  );
};
