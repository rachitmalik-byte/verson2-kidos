import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '@/lib/sounds';
import { Sparkles, Eye, RotateCcw } from 'lucide-react';

export const ThreeVelcroLab: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLatched, setIsLatched] = useState(false);
  const [pullForce, setPullForce] = useState(0);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0f1d);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2, 11);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.replaceChildren(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfef08a, 2.0);
    dirLight.position.set(8, 12, 10);
    scene.add(dirLight);

    // Natural Burdock Hook (Torus Knot / Curved Curve)
    const hookCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-1.5, -2, 0),
      new THREE.Vector3(-1.5, 2.5, 0),
      new THREE.Vector3(0.5, 1.5, 0)
    );
    const hookGeo = new THREE.TubeGeometry(hookCurve, 32, 0.35, 16, false);
    const hookMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.4 }); // Burdock Brown
    const hookMesh = new THREE.Mesh(hookGeo, hookMat);
    scene.add(hookMesh);

    // Synthetic Nylon Loop
    const loopCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(2.5, 2.5, 0),
      new THREE.Vector3(0.2, 0.8, 0),
      new THREE.Vector3(2.5, -2, 0)
    );
    const loopGeo = new THREE.TubeGeometry(loopCurve, 32, 0.25, 16, false);
    const loopMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2 }); // Nylon Blue
    const loopMesh = new THREE.Mesh(loopGeo, loopMat);
    scene.add(loopMesh);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (isLatched) {
        // Tight interlocking vibration under pull force
        const offset = Math.min(0.8, pullForce * 0.15);
        loopMesh.position.x = offset + Math.sin(elapsed * 20) * (pullForce * 0.02);
      } else {
        loopMesh.position.x = 1.2 + Math.sin(elapsed * 2) * 0.3;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [isLatched, pullForce]);

  return (
    <div className="w-full bg-slate-950 text-white rounded-3xl border-2 border-amber-500/40 p-4 sm:p-6 shadow-2xl flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
              Burdock Hook & Loop Microscopic 3D Lab
            </span>
            <span className="text-xs font-bold text-slate-400">Nature to Velcro Invention</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white mt-1">
            Natural Burdock Seed Hook (Brown) vs Synthetic Nylon Loop (Blue)
          </h3>
          <p className="text-xs text-slate-400">
            Swiss engineer George de Mestral inspected Burdock seeds under a microscope and invented Velcro!
          </p>
        </div>

        <button
          onClick={() => {
            sounds.pop();
            setIsLatched(!isLatched);
          }}
          className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm cursor-pointer shadow-lg active:scale-95 transition-all ${
            isLatched ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
          }`}
        >
          {isLatched ? 'Release Interlock 🔓' : 'Latch Hook & Loop 🔒'}
        </button>
      </div>

      <div
        ref={mountRef}
        className="w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden relative bg-radial from-slate-900 to-slate-950 border border-slate-800 shadow-inner"
      />

      {isLatched && (
        <div className="flex items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-3">
          <div>
            <span className="text-xs font-black text-white block">Tensile Pull Force Test</span>
            <span className="text-[10px] text-slate-400">Notice how thousands of flexible micro-hooks resist separation!</span>
          </div>
          <input
            type="range"
            min="0"
            max="5"
            value={pullForce}
            onChange={(e) => setPullForce(Number(e.target.value))}
            className="accent-amber-400 cursor-pointer w-36"
          />
        </div>
      )}
    </div>
  );
};
