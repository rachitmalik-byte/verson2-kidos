import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Wind, Play, RotateCcw, Sparkles } from 'lucide-react';

interface Props {
  onCompleted?: () => void;
}

export const ThreeDandelionSim: React.FC<Props> = ({ onCompleted }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [windLevel, setWindLevel] = useState<'breeze' | 'gale' | 'storm'>('breeze');
  const [distanceKm, setDistanceKm] = useState(2.4);

  const windSpeedMultiplier = windLevel === 'breeze' ? 1.0 : windLevel === 'gale' ? 2.2 : 3.8;

  const handleBlowWind = (level: 'breeze' | 'gale' | 'storm') => {
    sounds.pop();
    setWindLevel(level);

    if (level === 'breeze') {
      setDistanceKm(2.4);
      voiceAssistant.speak('A gentle summer breeze lifts feathery dandelion parachutes 2.4 kilometers across the meadow!');
    } else if (level === 'gale') {
      setDistanceKm(5.8);
      voiceAssistant.speak('Strong thermal winds carry the seeds high into the sky, traveling 5.8 kilometers!');
    } else {
      sounds.fanfare();
      setDistanceKm(12.5);
      voiceAssistant.speak('Storm updrafts lift dandelion seeds above the clouds, carrying them over 12 kilometers to new lands!');
      if (onCompleted) onCompleted();
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 380;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x38bdf8);
    scene.fog = new THREE.FogExp2(0xbae6fd, 0.025);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3.5, 14);
    camera.lookAt(0, 1.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 2.5);
    sunLight.position.set(10, 20, 10);
    scene.add(sunLight);

    const groundGeo = new THREE.PlaneGeometry(80, 80, 32, 32);
    const pos = groundGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const elevation = Math.sin(vx * 0.15) * Math.cos(vy * 0.15) * 1.5 - 2.5;
      pos.setZ(i, elevation);
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x4ade80,
      roughness: 0.8,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -2.5;
    scene.add(groundMesh);

    const plantGroup = new THREE.Group();
    plantGroup.position.set(-5, -2.5, 0);
    scene.add(plantGroup);

    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.2, 2.0, 0.1),
      new THREE.Vector3(0, 4.0, 0),
    ]);
    const stemGeo = new THREE.TubeGeometry(stemCurve, 20, 0.12, 12, false);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });
    const stemMesh = new THREE.Mesh(stemGeo, stemMat);
    plantGroup.add(stemMesh);

    const coreGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x854d0e });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.set(0, 4.0, 0);
    plantGroup.add(coreMesh);

    interface SeedParticle {
      group: THREE.Group;
      initialPos: THREE.Vector3;
      velocity: THREE.Vector3;
      timeOffset: number;
    }

    const seeds: SeedParticle[] = [];
    const seedGroup = new THREE.Group();
    scene.add(seedGroup);

    const createSeedMesh = () => {
      const g = new THREE.Group();

      const podGeo = new THREE.CylinderGeometry(0.04, 0.02, 0.45, 8);
      const podMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
      const podMesh = new THREE.Mesh(podGeo, podMat);
      podMesh.position.y = -0.4;
      g.add(podMesh);

      const beakGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.6, 6);
      const beakMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const beakMesh = new THREE.Mesh(beakGeo, beakMat);
      g.add(beakMesh);

      const pappusGroup = new THREE.Group();
      pappusGroup.position.y = 0.3;
      for (let a = 0; a < 360; a += 24) {
        const rad = THREE.MathUtils.degToRad(a);
        const bristleGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.5, 4);
        const bristleMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
        const bristle = new THREE.Mesh(bristleGeo, bristleMat);
        bristle.position.set(Math.cos(rad) * 0.2, 0.15, Math.sin(rad) * 0.2);
        bristle.rotation.z = Math.cos(rad) * 0.7;
        bristle.rotation.x = Math.sin(rad) * 0.7;
        pappusGroup.add(bristle);
      }
      g.add(pappusGroup);

      return g;
    };

    for (let i = 0; i < 24; i++) {
      const seedMesh = createSeedMesh();
      const phi = Math.acos(-1 + (2 * i) / 24);
      const theta = Math.sqrt(24 * Math.PI) * phi;

      const sx = Math.cos(theta) * Math.sin(phi) * 0.8;
      const sy = Math.cos(phi) * 0.8;
      const sz = Math.sin(theta) * Math.sin(phi) * 0.8;

      const worldPos = new THREE.Vector3(-5 + sx, 1.5 + sy, sz);
      seedMesh.position.copy(worldPos);
      seedMesh.rotation.z = Math.atan2(sy, sx) - Math.PI / 2;

      seedGroup.add(seedMesh);
      seeds.push({
        group: seedMesh,
        initialPos: worldPos.clone(),
        velocity: new THREE.Vector3(
          0.04 + Math.random() * 0.03,
          0.01 + Math.random() * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        timeOffset: i * 0.15,
      });
    }

    const streakGeo = new THREE.CylinderGeometry(0.02, 0.02, 3.5, 6);
    const streakMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.45 });
    const streaks: THREE.Mesh[] = [];

    for (let j = 0; j < 15; j++) {
      const streak = new THREE.Mesh(streakGeo, streakMat);
      streak.rotation.z = Math.PI / 2;
      streak.position.set(
        (Math.random() - 0.5) * 20,
        Math.random() * 6 - 1,
        (Math.random() - 0.5) * 10
      );
      scene.add(streak);
      streaks.push(streak);
    }

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      stemMesh.rotation.z = Math.sin(elapsed * 2.0) * 0.04 * windSpeedMultiplier;

      seeds.forEach((s) => {
        s.group.position.x += s.velocity.x * windSpeedMultiplier;
        s.group.position.y += Math.sin(elapsed * 3.0 + s.timeOffset) * 0.02 + s.velocity.y * (windSpeedMultiplier * 0.4);
        s.group.position.z += s.velocity.z;
        s.group.rotation.z = Math.sin(elapsed * 2.5 + s.timeOffset) * 0.2 + 0.3;

        if (s.group.position.x > 12) {
          s.group.position.copy(s.initialPos);
        }
      });

      streaks.forEach((st) => {
        st.position.x += 0.25 * windSpeedMultiplier;
        if (st.position.x > 14) {
          st.position.x = -14;
          st.position.y = Math.random() * 6 - 1;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [windLevel, windSpeedMultiplier]);

  return (
    <div className="w-full bg-slate-900 text-white rounded-3xl border-3 border-sky-400 p-4 sm:p-6 shadow-2xl flex flex-col gap-4 font-sans select-none">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-sky-400 bg-sky-400/10 border border-sky-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-sky-400" />
              <span>3D Dandelion Aerodynamics Sim</span>
            </span>
            <span className="text-xs font-bold text-amber-300">
              Flight Distance: {distanceKm} km
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-black text-white mt-1">
            Feathery Pappus Parachute Air-Drag Physics 🌼
          </h4>
          <p className="text-xs font-bold text-slate-300">
            Microscopic bristles catch rising thermal air drafts, keeping seeds aloft for miles without any energy!
          </p>
        </div>

        <div className="flex gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          {[
            { id: 'breeze', label: '🍃 Breeze (2.4 km)' },
            { id: 'gale', label: '🌬️ Thermal (5.8 km)' },
            { id: 'storm', label: '💨 Gale (12.5 km)' },
          ].map((w) => (
            <button
              key={w.id}
              onClick={() => handleBlowWind(w.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                windLevel === w.id
                  ? 'bg-sky-400 text-slate-950 shadow-md font-black scale-105'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={mountRef}
        className="w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden relative bg-sky-300 border border-slate-700 shadow-inner"
      />
    </div>
  );
};
