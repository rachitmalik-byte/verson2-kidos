import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Gauge, Flag, Sparkles, RefreshCw, Sliders, AlertTriangle, ShieldCheck, Mountain } from 'lucide-react';
import everestBgImg from '@/assets/images/theme-shelter/everest_summit_mountaineer.jpg';

interface Props {
  onCompleted?: () => void;
}

export const ThreeEverestClimbLab: React.FC<Props> = ({ onCompleted }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [altitudeMeters, setAltitudeMeters] = useState<number>(5364);

  const progressRatio = altitudeMeters / 8848;
  const oxygenPercent = Math.max(33, Math.round(100 - progressRatio * 67));
  const pressureHpa = Math.max(330, Math.round(1013 - progressRatio * 683));
  const isDeathZone = altitudeMeters >= 7900;
  const isSummit = altitudeMeters >= 8800;

  const stateRef = useRef({
    altitude: 5364,
    isDeathZone: false,
    isSummit: false,
  });

  useEffect(() => {
    stateRef.current.altitude = altitudeMeters;
    stateRef.current.isDeathZone = isDeathZone;
    stateRef.current.isSummit = isSummit;
  }, [altitudeMeters, isDeathZone, isSummit]);

  const handleAltitudeChange = (val: number) => {
    setAltitudeMeters(val);
    if (val >= 8800) {
      sounds.fanfare();
      voiceAssistant.speak(
        'Sagarmatha Everest Summit reached at 8,848 meters! Bachendri Pal hoisted the Indian flag here on May 23, 1984, wearing high-altitude oxygen gear and steel crampons!'
      );
      if (onCompleted) onCompleted();
    } else if (val >= 7900) {
      sounds.tensionSnap();
      voiceAssistant.speak(
        'Entering the Death Zone! At 7,900m altitude, atmospheric pressure is only 380 hPa. Oxygen cylinder is required to prevent hypoxia!'
      );
    } else {
      sounds.pop();
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 440;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a192f);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.8, 9.5);
    camera.lookAt(0, 0.6, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);

    // 2. High-Altitude Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.8);
    sunLight.position.set(8, 14, 8);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const skyGlow = new THREE.PointLight(0x38bdf8, 2.5, 15);
    skyGlow.position.set(-5, 4, 3);
    scene.add(skyGlow);

    // 3. Photorealistic Himalayan Panorama Backdrop
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(everestBgImg, (texture) => {
      const bgGeo = new THREE.PlaneGeometry(24, 14);
      const bgMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.85,
      });
      const bgMesh = new THREE.Mesh(bgGeo, bgMat);
      bgMesh.position.set(0, 2.5, -6);
      scene.add(bgMesh);
    });

    // 4. 3D Mount Everest Pyramid Peak & Glacial Ice Slope
    const mountainGroup = new THREE.Group();
    scene.add(mountainGroup);

    // Glacial Ice Material
    const glacierMat = new THREE.MeshStandardMaterial({
      color: 0xf0f9ff,
      roughness: 0.25,
      metalness: 0.1,
    });

    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.9,
    });

    // Main Mountain Mass
    const mountainGeo = new THREE.ConeGeometry(7.5, 8.5, 4);
    const mountainMesh = new THREE.Mesh(mountainGeo, rockMat);
    mountainMesh.position.set(0, 2.0, -2.5);
    mountainMesh.rotation.y = Math.PI / 4;
    mountainGroup.add(mountainMesh);

    // Snow Cap
    const snowCapGeo = new THREE.ConeGeometry(4.0, 4.5, 4);
    const snowCapMesh = new THREE.Mesh(snowCapGeo, glacierMat);
    snowCapMesh.position.set(0, 4.0, -2.5);
    snowCapMesh.rotation.y = Math.PI / 4;
    mountainGroup.add(snowCapMesh);

    // 3D Climbing Ridge Path Spline
    const ridgeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4.6, -1.2, 1.4), // 0m Valley
      new THREE.Vector3(-2.2, 0.3, 0.8),  // 5,364m Base Camp
      new THREE.Vector3(0.0, 1.9, 0.1),   // 7,900m Death Zone
      new THREE.Vector3(0.8, 3.6, -1.1),  // 8,848m Summit
    ]);

    const ridgeGeo = new THREE.TubeGeometry(ridgeCurve, 32, 0.32, 12, false);
    const ridgeMesh = new THREE.Mesh(ridgeGeo, glacierMat);
    mountainGroup.add(ridgeMesh);

    // Base Camp Expedition Tent (At 5,364m)
    const tentGroup = new THREE.Group();
    tentGroup.position.set(-2.2, 0.5, 0.9);
    scene.add(tentGroup);

    const tentGeo = new THREE.ConeGeometry(0.6, 0.7, 4);
    const tentMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.7 });
    const tentMesh = new THREE.Mesh(tentGeo, tentMat);
    tentMesh.rotation.y = Math.PI / 4;
    tentGroup.add(tentMesh);

    // Summit Flagpole & Indian Tricolor (At 8,848m Summit)
    const poleGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.5, 12);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.set(0.8, 4.4, -1.1);
    mountainGroup.add(pole);

    const flagGeo = new THREE.PlaneGeometry(0.65, 0.42);
    const flagMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      side: THREE.DoubleSide,
    });
    const flagMesh = new THREE.Mesh(flagGeo, flagMat);
    flagMesh.position.set(1.18, 4.8, -1.1);
    mountainGroup.add(flagMesh);

    // 5. Detailed 3D Mountaineer Model (Climbing along Ridge)
    const climberGroup = new THREE.Group();
    scene.add(climberGroup);

    // Red Thermal Down Suit
    const suitMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.8 });
    const torsoGeo = new THREE.BoxGeometry(0.5, 0.7, 0.4);
    const torso = new THREE.Mesh(torsoGeo, suitMat);
    torso.position.y = 0.5;
    climberGroup.add(torso);

    // Mountaineer Hood & Head
    const headGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const head = new THREE.Mesh(headGeo, suitMat);
    head.position.y = 1.0;
    climberGroup.add(head);

    // Alpine Snow Goggles
    const goggleGeo = new THREE.BoxGeometry(0.26, 0.08, 0.1);
    const goggleMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.1 });
    const goggles = new THREE.Mesh(goggleGeo, goggleMat);
    goggles.position.set(0, 1.02, 0.22);
    climberGroup.add(goggles);

    // 3D Yellow High-Altitude Oxygen Tank (Visible in Death Zone)
    const tankGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.65, 16);
    const tankMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.2 });
    const oxygenTank = new THREE.Mesh(tankGeo, tankMat);
    oxygenTank.position.set(0, 0.5, -0.28);
    oxygenTank.visible = false;
    climberGroup.add(oxygenTank);

    // Steel Spiked Ice Crampons on Boots
    const bootGeo = new THREE.BoxGeometry(0.16, 0.18, 0.32);
    const bootMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
    const spikeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95 });

    const leftBoot = new THREE.Mesh(bootGeo, bootMat);
    leftBoot.position.set(-0.16, 0.08, 0.05);
    climberGroup.add(leftBoot);

    const rightBoot = new THREE.Mesh(bootGeo, bootMat);
    rightBoot.position.set(0.16, 0.08, 0.05);
    climberGroup.add(rightBoot);

    const cramponSpikes = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.04, 0.34), spikeMat);
    cramponSpikes.position.set(0, -0.02, 0.05);
    climberGroup.add(cramponSpikes);

    // Ice Axe in Hand
    const axeMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9 });
    const axeShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8, 8), axeMat);
    axeShaft.rotation.z = 0.5;
    axeShaft.position.set(0.4, 0.4, 0.2);
    climberGroup.add(axeShaft);

    // 6. Dynamic Blizzard Snow Particles in Death Zone
    const snowCount = 160;
    const snowGeo = new THREE.BufferGeometry();
    const snowPositions = new Float32Array(snowCount * 3);
    const snowVels: THREE.Vector3[] = [];

    for (let i = 0; i < snowCount; i++) {
      snowPositions[i * 3] = (Math.random() - 0.5) * 16;
      snowPositions[i * 3 + 1] = Math.random() * 8;
      snowPositions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      snowVels.push(
        new THREE.Vector3(
          -4.5 - Math.random() * 4.0, // Hurricane winds
          -1.0 - Math.random() * 1.5,
          (Math.random() - 0.5) * 2.0
        )
      );
    }
    snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));
    const snowMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.16,
      transparent: true,
      opacity: 0.8,
    });
    const snowParticles = new THREE.Points(snowGeo, snowMat);
    scene.add(snowParticles);

    // 7. 60FPS Fluid Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      const time = clock.getElapsedTime();
      const { altitude, isDeathZone: deathZone, isSummit: summit } = stateRef.current;

      // Calculate Climber Position on Ridge Curve
      const u = Math.min(1.0, Math.max(0, altitude / 8848));
      const pos = ridgeCurve.getPoint(u);
      climberGroup.position.copy(pos);

      // Orient Climber toward Slope
      const tangent = ridgeCurve.getTangent(u);
      climberGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);

      // Handle Oxygen Tank & Weather in Death Zone
      if (deathZone) {
        oxygenTank.visible = true;
        snowMat.opacity = 0.9;
      } else {
        oxygenTank.visible = false;
        snowMat.opacity = 0.3;
      }

      // Flag Wave at Summit
      flagMesh.rotation.y = Math.sin(time * 6) * 0.3;

      // Animate Blizzard Snow
      const posAttr = snowGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < snowCount; i++) {
        let x = posAttr.getX(i) + snowVels[i].x * delta;
        let y = posAttr.getY(i) + snowVels[i].y * delta;
        let z = posAttr.getZ(i) + snowVels[i].z * delta;

        if (x < -8 || y < -1.5) {
          x = 8.0;
          y = 7.0;
          z = (Math.random() - 0.5) * 12;
        }
        posAttr.setXYZ(i, x, y, z);
      }
      posAttr.needsUpdate = true;

      // Camera Follows Climber smoothly
      camera.position.x = Math.sin(time * 0.2) * 0.3;
      camera.lookAt(pos.x, pos.y + 0.5, pos.z);

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
            🧗 3D Mount Everest Altitude & Barometer Lab
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Bachendri Pal 8,848m Summit Expedition
          </h3>
        </div>

        {/* Live Altitude & Barometer HUD Badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-2xl border border-slate-200 text-xs font-black">
            <Gauge className="w-4 h-4 text-sky-500" />
            <span>Pressure: {pressureHpa} hPa</span>
          </div>

          <span className={`px-3.5 py-1.5 rounded-full text-xs font-black shadow-sm ${
            isDeathZone ? 'bg-rose-500 text-white animate-bounce' : 'bg-amber-400 text-slate-950'
          }`}>
            {isDeathZone ? '⚠️ DEATH ZONE (O₂: 33%)' : `🏔️ O₂ LEVEL: ${oxygenPercent}%`}
          </span>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div className="w-full h-72 sm:h-84 rounded-3xl overflow-hidden shadow-inner border-3 border-slate-800 relative bg-slate-950 flex items-center justify-center mb-4">
        <div ref={mountRef} className="w-full h-full" />

        {/* Altitude Marker HUD */}
        <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-2 shadow-sm">
          <span>Elevation: {altitudeMeters}m / 8,848m</span>
        </div>

        {/* Bottom Banner */}
        <div className="absolute bottom-3 bg-slate-950/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-700 text-xs font-bold text-white shadow-md">
          {isSummit
            ? '🚩 8,848m SUMMIT REACHED! Bachendri Pal hoisted the Indian flag on May 23, 1984!'
            : isDeathZone
            ? '⚠️ High-altitude hypoxia! Oxygen cylinder & face mask active to survive!'
            : 'Slide the altitude control or click presets to climb Mount Everest!'}
        </div>
      </div>

      {/* Altitude Presets & Slider Controls */}
      <div className="w-full flex flex-col gap-3">
        {/* Preset Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
          {[
            { label: '1. Valley (0m)', alt: 0, o2: '100%' },
            { label: '2. Base Camp (5,364m)', alt: 5364, o2: '50%' },
            { label: '3. Camp 4 (7,900m)', alt: 7900, o2: '38%' },
            { label: '4. Summit (8,848m) 🚩', alt: 8848, o2: '33%' },
          ].map((preset) => (
            <button
              key={preset.alt}
              onClick={() => handleAltitudeChange(preset.alt)}
              className={`p-2.5 rounded-2xl text-xs font-black border-2 cursor-pointer transition-all flex flex-col items-center justify-center shadow-xs ${
                Math.abs(altitudeMeters - preset.alt) < 200
                  ? 'bg-amber-400 border-amber-500 text-slate-950 shadow-md scale-102 font-black ring-2 ring-amber-300'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-amber-50'
              }`}
            >
              <span className="font-black">{preset.label}</span>
              <span className="text-[10px] text-slate-500 font-bold">O₂: {preset.o2}</span>
            </button>
          ))}
        </div>

        {/* Altitude Slider */}
        <div className="w-full flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border-2 border-slate-200">
          <span className="text-xs font-black text-slate-700 shrink-0 flex items-center gap-1">
            <Mountain className="w-4 h-4 text-amber-500" />
            <span>Climbing Elevation:</span>
          </span>
          <input
            type="range"
            min="0"
            max="8848"
            step="100"
            value={altitudeMeters}
            onChange={(e) => handleAltitudeChange(parseInt(e.target.value, 10))}
            className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-black text-slate-900 w-20 text-right">{altitudeMeters}m</span>
        </div>

        {/* Key Takeaway */}
        <div className="text-xs font-bold text-slate-700 bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-center sm:text-left">
          💡 <strong>Mountaineering Physics Secret:</strong> As you climb higher, air molecules spread out. At the Everest summit (8,848m), air pressure drops to <strong>330 hPa</strong> and oxygen is only <strong>33% of sea level</strong>, requiring supplemental oxygen tanks and steel crampons on glacier ice!
        </div>
      </div>
    </div>
  );
};
