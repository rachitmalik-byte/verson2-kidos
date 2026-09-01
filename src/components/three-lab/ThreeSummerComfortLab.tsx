import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Sun, Wind, Droplets, Thermometer, Sparkles, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  onComplete?: () => void;
}

export const ThreeSummerComfortLab: React.FC<Props> = ({ onComplete }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [sweatSprayed, setSweatSprayed] = useState<boolean>(false);
  const [breezeActive, setBreezeActive] = useState<boolean>(false);
  const [sunHeat, setSunHeat] = useState<number>(38); // 30°C to 42°C

  const cottonTemp = breezeActive && sweatSprayed ? 26.5 : sweatSprayed ? 29.0 : 31.0;
  const polyTemp = breezeActive && sweatSprayed ? 34.5 : sweatSprayed ? 36.0 : 37.5;

  const stateRef = useRef({
    sweatSprayed: false,
    breezeActive: false,
    sunHeat: 38,
    time: 0,
  });

  useEffect(() => {
    stateRef.current.sweatSprayed = sweatSprayed;
    stateRef.current.breezeActive = breezeActive;
    stateRef.current.sunHeat = sunHeat;
  }, [sweatSprayed, breezeActive, sunHeat]);

  const handleSpraySweat = () => {
    sounds.splash();
    setSweatSprayed(true);
    voiceAssistant.speak(
      'Perspiration mist sprayed! Cotton fibers soak in moisture, while non-porous polyester traps sweat droplets on the skin surface.'
    );
  };

  const handleToggleBreeze = () => {
    sounds.pop();
    const next = !breezeActive;
    setBreezeActive(next);
    if (next) {
      sounds.success();
      voiceAssistant.speak(
        'Summer breeze turned on! Watch how wind evaporates moisture through cotton pores, cooling the body down to 26.5 degrees!'
      );
      if (onComplete) onComplete();
    }
  };

  const handleReset = () => {
    sounds.pop();
    setSweatSprayed(false);
    setBreezeActive(false);
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 440;

    // 1. Scene & Perspective Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1120); // Deep Sky Navy Lab

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3.2, 9.5);
    camera.lookAt(0, 0.6, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);

    // 2. Realistic Sunlight & Lab Illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    // ☀️ Golden Summer Sun Directional Light
    const sunLight = new THREE.DirectionalLight(0xfff7ed, 3.2);
    sunLight.position.set(6, 12, 8);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const cyanRim = new THREE.PointLight(0x38bdf8, 2.5, 12);
    cyanRim.position.set(-5, 2, 4);
    scene.add(cyanRim);

    const amberFill = new THREE.PointLight(0xf59e0b, 2.5, 12);
    amberFill.position.set(5, 2, 4);
    scene.add(amberFill);

    // 3. Outdoor Summer Deck Table
    const tableGeo = new THREE.PlaneGeometry(20, 14);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.6,
      metalness: 0.2,
    });
    const tableMesh = new THREE.Mesh(tableGeo, tableMat);
    tableMesh.rotation.x = -Math.PI / 2;
    tableMesh.position.y = -1.6;
    scene.add(tableMesh);

    const gridHelper = new THREE.GridHelper(16, 16, 0xf59e0b, 0x334155);
    gridHelper.position.y = -1.59;
    scene.add(gridHelper);

    // 4. Helper Function: Create Detailed 3D Mannequin Bust with Form-Fitted T-Shirt
    const createMannequin = (isCotton: boolean, xOffset: number) => {
      const group = new THREE.Group();
      group.position.set(xOffset, 0, 0);

      // Wooden / Chrome Display Stand Pedestal
      const standBaseGeo = new THREE.CylinderGeometry(0.7, 0.8, 0.2, 32);
      const standMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
      const standBase = new THREE.Mesh(standBaseGeo, standMat);
      standBase.position.y = -1.5;
      group.add(standBase);

      const standPoleGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.6, 16);
      const standPole = new THREE.Mesh(standPoleGeo, standMat);
      standPole.position.y = -0.7;
      group.add(standPole);

      // Anatomical Mannequin Neck & Head Finial
      const neckGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.8, 24);
      const neckMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.5 });
      const neck = new THREE.Mesh(neckGeo, neckMat);
      neck.position.y = 1.6;
      group.add(neck);

      const headGeo = new THREE.SphereGeometry(0.38, 24, 24);
      const head = new THREE.Mesh(headGeo, neckMat);
      head.position.y = 2.2;
      group.add(head);

      // Detailed 3D Torso Shape (Shoulders, Chest, Waist)
      const torsoGeo = new THREE.CylinderGeometry(0.75, 0.55, 1.8, 32);
      torsoGeo.scale(1.2, 1.0, 0.7); // Flatten for realistic human torso depth

      // Cotton vs Polyester Material Shader
      const fabricMat = isCotton
        ? new THREE.MeshStandardMaterial({
            color: 0x10b981, // Emerald Green Cotton
            roughness: 0.95, // Matte porous cotton
            metalness: 0.0,
          })
        : new THREE.MeshPhysicalMaterial({
            color: 0xf43f5e, // Coral Red Polyester
            roughness: 0.2, // Slick shiny synthetic plastic
            metalness: 0.1,
            clearcoat: 0.8,
            clearcoatRoughness: 0.1,
          });

      const torso = new THREE.Mesh(torsoGeo, fabricMat);
      torso.position.y = 0.6;
      torso.castShadow = true;
      group.add(torso);

      // Left & Right Short Sleeves
      const sleeveGeo = new THREE.CylinderGeometry(0.28, 0.32, 0.7, 24);
      sleeveGeo.scale(1.0, 1.0, 0.75);

      const leftSleeve = new THREE.Mesh(sleeveGeo, fabricMat);
      leftSleeve.position.set(-0.95, 1.1, 0);
      leftSleeve.rotation.z = 0.55;
      group.add(leftSleeve);

      const rightSleeve = new THREE.Mesh(sleeveGeo, fabricMat);
      rightSleeve.position.set(0.95, 1.1, 0);
      rightSleeve.rotation.z = -0.55;
      group.add(rightSleeve);

      // Collar Rib Trim
      const collarGeo = new THREE.TorusGeometry(0.35, 0.05, 16, 32);
      collarGeo.scale(1.0, 0.75, 1.0);
      const collarMat = new THREE.MeshStandardMaterial({
        color: isCotton ? 0x059669 : 0xbe123c,
        roughness: 0.8,
      });
      const collar = new THREE.Mesh(collarGeo, collarMat);
      collar.rotation.x = Math.PI / 2;
      collar.position.set(0, 1.45, 0);
      group.add(collar);

      return { group, fabricMat, torso };
    };

    const cottonMannequin = createMannequin(true, -2.2);
    const polyMannequin = createMannequin(false, 2.2);
    scene.add(cottonMannequin.group);
    scene.add(polyMannequin.group);

    // 5. 3D Evaporation Vapor Mist (Cotton)
    const vaporCount = 80;
    const vaporGeo = new THREE.BufferGeometry();
    const vaporPositions = new Float32Array(vaporCount * 3);
    const vaporVels: THREE.Vector3[] = [];

    for (let i = 0; i < vaporCount; i++) {
      vaporPositions[i * 3] = -2.2 + (Math.random() - 0.5) * 1.4;
      vaporPositions[i * 3 + 1] = 0.2 + Math.random() * 1.5;
      vaporPositions[i * 3 + 2] = 0.4 + (Math.random() - 0.5) * 0.4;
      vaporVels.push(
        new THREE.Vector3(
          (Math.random() - 0.2) * 1.2,
          1.5 + Math.random() * 2.0,
          (Math.random() - 0.5) * 0.8
        )
      );
    }
    vaporGeo.setAttribute('position', new THREE.BufferAttribute(vaporPositions, 3));
    const vaporMat = new THREE.PointsMaterial({
      color: 0x7dd3fc,
      size: 0.16,
      transparent: true,
      opacity: 0,
    });
    const vaporParticles = new THREE.Points(vaporGeo, vaporMat);
    scene.add(vaporParticles);

    // 6. 3D Trapped Sweat Droplets (Polyester Sauna Effect)
    const sweatDropsGroup = new THREE.Group();
    sweatDropsGroup.position.set(2.2, 0, 0);
    scene.add(sweatDropsGroup);

    const sweatDropGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const sweatDropMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      transmission: 0.9,
      thickness: 0.2,
    });

    const dropMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < 14; i++) {
      const drop = new THREE.Mesh(sweatDropGeo, sweatDropMat);
      drop.position.set(
        (Math.random() - 0.5) * 1.2,
        0.2 + Math.random() * 1.2,
        0.48
      );
      sweatDropsGroup.add(drop);
      dropMeshes.push(drop);
    }
    sweatDropsGroup.visible = false;

    // 7. 3D Wind Breeze Streamline Ribbons
    const windGroup = new THREE.Group();
    scene.add(windGroup);

    const windLines: THREE.Line[] = [];
    for (let i = 0; i < 8; i++) {
      const pts = [
        new THREE.Vector3(-6, 0.4 + i * 0.3, 0.8),
        new THREE.Vector3(0, 0.5 + i * 0.3, 0.8),
        new THREE.Vector3(6, 0.4 + i * 0.3, 0.8),
      ];
      const curve = new THREE.CatmullRomCurve3(pts);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(24));
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x67e8f9,
        transparent: true,
        opacity: 0,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      windGroup.add(line);
      windLines.push(line);
    }

    // 8. 60FPS Fluid Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      const time = clock.getElapsedTime();
      const { sweatSprayed: sprayed, breezeActive: breeze } = stateRef.current;

      // Animate Wind Lines
      windLines.forEach((line, idx) => {
        const mat = line.material as THREE.LineBasicMaterial;
        if (breeze) {
          mat.opacity = 0.5 + Math.sin(time * 8 + idx) * 0.3;
          line.position.x = ((time * 4 + idx * 0.8) % 12) - 6;
        } else {
          mat.opacity = 0;
        }
      });

      // Animate Evaporation Vapor (Cotton wicks sweat & cools)
      if (sprayed && breeze) {
        vaporMat.opacity = 0.75 + Math.sin(time * 4) * 0.2;
        const posAttr = vaporGeo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < vaporCount; i++) {
          let y = posAttr.getY(i) + vaporVels[i].y * delta;
          let x = posAttr.getX(i) + (vaporVels[i].x + 1.2) * delta; // Blown by breeze
          let z = posAttr.getZ(i) + vaporVels[i].z * delta;

          if (y > 2.8 || x > 0.5) {
            y = 0.2;
            x = -2.2 + (Math.random() - 0.5) * 1.2;
            z = 0.4 + (Math.random() - 0.5) * 0.3;
          }
          posAttr.setXYZ(i, x, y, z);
        }
        posAttr.needsUpdate = true;
      } else {
        vaporMat.opacity = 0;
      }

      // Animate Trapped Sweat Droplets (Polyester)
      if (sprayed) {
        sweatDropsGroup.visible = true;
        dropMeshes.forEach((drop, i) => {
          drop.position.y -= delta * (0.15 + (i % 3) * 0.08); // Drops slowly roll down
          if (drop.position.y < -0.2) drop.position.y = 1.3;
        });
      } else {
        sweatDropsGroup.visible = false;
      }

      // Gentle Camera rotation
      camera.position.x = Math.sin(time * 0.25) * 0.3;
      camera.lookAt(0, 0.6, 0);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 440;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="w-full max-w-4xl bg-white p-5 sm:p-7 rounded-[36px] border-4 border-amber-400 shadow-2xl flex flex-col items-center select-none font-sans text-slate-900">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full mb-4 border-b-2 border-slate-100 pb-3">
        <div className="text-center sm:text-left">
          <span className="text-xs font-black uppercase text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 inline-block mb-1">
            ☀️ 3D Summer Thermal & Evaporative Cooling Lab
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
            The 38°C Summer T-Shirt Test! 🏃‍♂️
          </h3>
        </div>

        {/* Live Temperature HUD Dials */}
        <div className="flex items-center gap-2">
          {/* Cotton Temp */}
          <div className="flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-2xl border border-emerald-300 shadow-xs">
            <span className="text-sm">🌿</span>
            <span className="text-xs font-black text-emerald-950">Cotton: {cottonTemp.toFixed(1)}°C ❄️</span>
          </div>

          {/* Polyester Temp */}
          <div className="flex items-center gap-1 bg-rose-50 px-3 py-1.5 rounded-2xl border border-rose-300 shadow-xs">
            <span className="text-sm">👕</span>
            <span className="text-xs font-black text-rose-950">Polyester: {polyTemp.toFixed(1)}°C 🔥</span>
          </div>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div className="w-full h-72 sm:h-84 rounded-3xl overflow-hidden shadow-inner border-3 border-slate-800 relative bg-slate-950 flex items-center justify-center mb-4">
        <div ref={mountRef} className="w-full h-full" />

        {/* Mannequin 3D Badges */}
        <div className="absolute top-3 left-6 bg-slate-900/85 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-400 text-xs font-black text-emerald-300 shadow-sm flex items-center gap-1">
          <span>🌿 100% Breathable Cotton</span>
        </div>

        <div className="absolute top-3 right-6 bg-slate-900/85 backdrop-blur-md px-3 py-1 rounded-full border border-rose-400 text-xs font-black text-rose-300 shadow-sm flex items-center gap-1">
          <span>👕 Synthetic Polyester</span>
        </div>

        {/* Bottom Live Action Banner */}
        <div className="absolute bottom-3 bg-slate-950/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-700 text-xs font-bold text-white shadow-md">
          {!sweatSprayed
            ? 'Step 1: Tap "Spray Perspiration" to simulate running sweat on both shirts!'
            : !breezeActive
            ? 'Step 2: Tap "Turn On Summer Breeze" to test wind evaporation & skin cooling!'
            : '✨ Cotton pores evaporate sweat, dropping temperature by 4.5°C! Polyester traps moisture like a sauna!'}
        </div>
      </div>

      {/* Interactive Tool Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full mb-3">
        <button
          onClick={handleSpraySweat}
          className={`p-4 rounded-2xl border-2 font-black text-xs sm:text-sm flex items-center gap-3 cursor-pointer transition-all active:scale-95 shadow-sm ${
            sweatSprayed
              ? 'bg-sky-100 border-sky-400 text-sky-950 shadow-md'
              : 'bg-sky-500 hover:bg-sky-400 border-sky-600 text-white'
          }`}
        >
          <Droplets className="w-6 h-6" />
          <div className="text-left">
            <span className="block font-black">1. Spray Perspiration (Sweat) 💦</span>
            <span className="text-[11px] opacity-80 font-bold">Moisturizes fabric weave</span>
          </div>
        </button>

        <button
          onClick={handleToggleBreeze}
          disabled={!sweatSprayed}
          className={`p-4 rounded-2xl border-2 font-black text-xs sm:text-sm flex items-center gap-3 cursor-pointer transition-all active:scale-95 disabled:opacity-40 shadow-sm ${
            breezeActive
              ? 'bg-emerald-500 border-emerald-600 text-white shadow-md'
              : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
          }`}
        >
          <Wind className="w-6 h-6" />
          <div className="text-left">
            <span className="block font-black">2. Turn On Summer Breeze 🍃</span>
            <span className="text-[11px] opacity-80 font-bold">Triggers evaporative cooling</span>
          </div>
        </button>
      </div>

      {/* Reset & Scientific Key Takeaway */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          onClick={handleReset}
          className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center gap-1.5 cursor-pointer border border-slate-300 active:scale-95 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset Lab</span>
        </button>

        <div className="text-xs font-bold text-slate-700 bg-amber-50 p-3 rounded-2xl border border-amber-200 max-w-lg text-center sm:text-right ml-auto">
          💡 <strong>5th Grade Science Secret:</strong> When liquid sweat evaporates into vapor, it steals heat from your skin! <strong>Cotton's open micro-pores</strong> let breeze evaporate sweat instantly, while <strong>Polyester's solid plastic threads</strong> seal moisture in like a hot greenhouse bag!
        </div>
      </div>
    </div>
  );
};
