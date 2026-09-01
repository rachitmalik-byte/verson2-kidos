import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Sparkles, ShieldAlert, RotateCcw, Footprints, Layers } from 'lucide-react';

interface Props {
  onCompleted?: () => void;
}

export const ThreeAntPheromoneLab: React.FC<Props> = ({ onCompleted }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasBarrier, setHasBarrier] = useState(false);
  const [barrierType, setBarrierType] = useState<'pencil' | 'leaf' | 'stone'>('pencil');

  const handlePlaceBarrier = (type: 'pencil' | 'leaf' | 'stone') => {
    sounds.pop();
    setBarrierType(type);
    setHasBarrier(true);
    sounds.sparkle();
    voiceAssistant.speak(
      `Barrier placed! The ants lose the pheromone chemical scent, search around with their antennae chemoreceptors, and create a detour highway!`
    );
    if (onCompleted) onCompleted();
  };

  const handleClearBarrier = () => {
    sounds.pop();
    setHasBarrier(false);
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 380;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1c1917); // Warm earthy dark stone

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 5.5, 9.0);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfef08a, 2.5);
    sunLight.position.set(6, 12, 8);
    scene.add(sunLight);

    const greenGlow = new THREE.PointLight(0x10b981, 2.0, 10);
    greenGlow.position.set(0, 1, 0);
    scene.add(greenGlow);

    // 1. Sandy Soil Ground Plane
    const groundGeo = new THREE.PlaneGeometry(24, 16, 16, 16);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    scene.add(ground);

    // 2. Ant Mound Nest (Left)
    const nestGeo = new THREE.ConeGeometry(1.6, 1.2, 16);
    const nestMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.95 });
    const nest = new THREE.Mesh(nestGeo, nestMat);
    nest.position.set(-6.5, 0.1, 0);
    scene.add(nest);

    // Dark Entrance Hole
    const holeGeo = new THREE.CircleGeometry(0.35, 16);
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const hole = new THREE.Mesh(holeGeo, holeMat);
    hole.rotation.x = -Math.PI / 2;
    hole.position.set(-6.5, 0.72, 0);
    scene.add(hole);

    // 3. Sugar Crystals Pile (Right)
    const sugarGroup = new THREE.Group();
    sugarGroup.position.set(6.5, -0.4, 0);
    scene.add(sugarGroup);

    const sugarGeo = new THREE.DodecahedronGeometry(0.35);
    const sugarMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.1 });
    for (let s = 0; s < 6; s++) {
      const sm = new THREE.Mesh(sugarGeo, sugarMat);
      sm.position.set((s % 3) * 0.35 - 0.3, 0.2 + (s > 2 ? 0.3 : 0), (s % 2) * 0.3 - 0.15);
      sugarGroup.add(sm);
    }

    // 4. Glowing Pheromone Trail Ribbon
    const trailPointsStraight = [
      new THREE.Vector3(-6.0, -0.45, 0),
      new THREE.Vector3(-2.0, -0.45, 0),
      new THREE.Vector3(2.0, -0.45, 0),
      new THREE.Vector3(6.0, -0.45, 0),
    ];

    const trailPointsDetour = [
      new THREE.Vector3(-6.0, -0.45, 0),
      new THREE.Vector3(-2.0, -0.45, 0),
      new THREE.Vector3(0.0, -0.45, 2.2), // Detour around barrier
      new THREE.Vector3(2.0, -0.45, 0),
      new THREE.Vector3(6.0, -0.45, 0),
    ];

    const curveStraight = new THREE.CatmullRomCurve3(trailPointsStraight);
    const curveDetour = new THREE.CatmullRomCurve3(trailPointsDetour);

    const trailGeoStraight = new THREE.TubeGeometry(curveStraight, 32, 0.06, 8, false);
    const trailGeoDetour = new THREE.TubeGeometry(curveDetour, 32, 0.06, 8, false);

    const trailMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    const trailMesh = new THREE.Mesh(hasBarrier ? trailGeoDetour : trailGeoStraight, trailMat);
    scene.add(trailMesh);

    // 5. 3D Obstacle Barrier
    let barrierMesh: THREE.Mesh | null = null;
    if (hasBarrier) {
      if (barrierType === 'pencil') {
        const pGeo = new THREE.CylinderGeometry(0.18, 0.18, 3.8, 8);
        const pMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 });
        barrierMesh = new THREE.Mesh(pGeo, pMat);
        barrierMesh.rotation.x = Math.PI / 2;
        barrierMesh.position.set(0, -0.3, 0);
      } else if (barrierType === 'leaf') {
        const lGeo = new THREE.BoxGeometry(2.5, 0.1, 1.8);
        const lMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });
        barrierMesh = new THREE.Mesh(lGeo, lMat);
        barrierMesh.position.set(0, -0.4, 0);
      } else {
        const sGeo = new THREE.DodecahedronGeometry(0.8);
        const sMat = new THREE.MeshStandardMaterial({ color: 0x71717a, roughness: 0.9 });
        barrierMesh = new THREE.Mesh(sGeo, sMat);
        barrierMesh.position.set(0, -0.1, 0);
      }
      scene.add(barrierMesh);
    }

    // 6. Live 3D Ant Army
    const antMeshes: THREE.Group[] = [];
    const activeCurve = hasBarrier ? curveDetour : curveStraight;

    const createAntMesh = () => {
      const g = new THREE.Group();
      const antBodyMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.3 }); // Glossy black

      // Head
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), antBodyMat);
      head.position.x = 0.2;
      g.add(head);

      // Thorax
      const thorax = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), antBodyMat);
      g.add(thorax);

      // Abdomen (Scent gland at rear)
      const abdomen = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), antBodyMat);
      abdomen.scale.set(1.4, 0.9, 0.9);
      abdomen.position.x = -0.22;
      g.add(abdomen);

      g.scale.set(1.2, 1.2, 1.2);
      return g;
    };

    const numAnts = 14;
    for (let a = 0; a < numAnts; a++) {
      const ant = createAntMesh();
      scene.add(ant);
      antMeshes.push(ant);
    }

    // 7. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Pheromone trail subtle pulse
      trailMat.color.setHex(Math.sin(elapsed * 4) > 0 ? 0x34d399 : 0x10b981);

      // Move ants along the 3D spline curve
      antMeshes.forEach((ant, idx) => {
        const offset = (idx / numAnts + elapsed * 0.1) % 1.0;
        const pt = activeCurve.getPointAt(offset);
        const tangent = activeCurve.getTangentAt(offset);

        ant.position.set(pt.x, -0.4, pt.z);
        ant.rotation.y = Math.atan2(-tangent.z, tangent.x);
        ant.position.y += Math.sin(elapsed * 20 + idx) * 0.02; // Leg stepping bob
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [hasBarrier, barrierType]);

  return (
    <div className="w-full bg-slate-900 text-white rounded-3xl border-3 border-emerald-400 p-4 sm:p-6 shadow-2xl flex flex-col gap-4 font-sans select-none">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>3D Ant Pheromone Highway Sim</span>
            </span>
            <span className="text-xs font-bold text-amber-300">
              {hasBarrier ? '⚠️ Rerouting (Detour Trail Active)' : '⚡ Direct Pheromone Scent Line'}
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-black text-white mt-1">
            Chemical Pheromone Navigation & Antenna Chemoreceptors 🐜
          </h4>
          <p className="text-xs font-bold text-slate-300">
            Ants rub their abdominal scent gland on the soil. Place obstacles to see how antenna chemoreceptors find detours!
          </p>
        </div>

        {/* Barrier Buttons */}
        <div className="flex items-center gap-2">
          {!hasBarrier ? (
            <div className="flex gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              {[
                { id: 'pencil', label: '✏️ Pencil Line' },
                { id: 'leaf', label: '🍃 Leaf Barrier' },
                { id: 'stone', label: '🪨 Pebble Rock' },
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => handlePlaceBarrier(b.id as any)}
                  className="px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md cursor-pointer transition-all active:scale-95"
                >
                  {b.label}
                </button>
              ))}
            </div>
          ) : (
            <button
              onClick={handleClearBarrier}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Barrier</span>
            </button>
          )}
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden relative bg-stone-950 border border-slate-700 shadow-inner"
      />
    </div>
  );
};
