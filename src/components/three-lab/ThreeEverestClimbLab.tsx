import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Gauge, Flag, Sparkles, RefreshCw, Sliders, AlertTriangle, ShieldCheck, Mountain, Wind, Compass, UserCheck } from 'lucide-react';

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
    isDragging: false,
    prevMouseX: 0,
    prevMouseY: 0,
    orbitTheta: 0.05,
    orbitPhi: 0.18,
    targetTheta: 0.05,
    targetPhi: 0.18,
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
        'Entering the Death Zone! At 7,900m altitude, atmospheric pressure is only 380 hPa. Oxygen cylinder is required to survive!'
      );
    } else {
      sounds.pop();
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 460;

    // 1. Scene & Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c192c);
    scene.fog = new THREE.FogExp2(0x0c192c, 0.025);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.5, 10.5);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.replaceChildren(renderer.domElement);

    // 2. High-Altitude Directional Sun & Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5ea, 3.5);
    sunLight.position.set(12, 16, 12);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const skyGlow = new THREE.PointLight(0x38bdf8, 2.8, 25);
    skyGlow.position.set(-6, 6, 6);
    scene.add(skyGlow);

    const summitLight = new THREE.PointLight(0xf59e0b, 3.0, 15);
    summitLight.position.set(3.2, 3.8, 0);
    scene.add(summitLight);

    // 3. Clear Front-Facing Mountain Ridge Geometry
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // Mountain Rock & Snow Materials
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.9,
      metalness: 0.1,
      flatShading: true,
    });

    const snowMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.4,
      metalness: 0.05,
      flatShading: true,
    });

    const glacierIceMat = new THREE.MeshStandardMaterial({
      color: 0x7dd3fc,
      roughness: 0.2,
      metalness: 0.3,
      transparent: true,
      opacity: 0.85,
    });

    // Background Mountain Peaks
    const bgPeak1 = new THREE.Mesh(new THREE.ConeGeometry(5.5, 6.5, 5), rockMat);
    bgPeak1.position.set(-5.5, 1.5, -4.5);
    worldGroup.add(bgPeak1);
    const bgSnow1 = new THREE.Mesh(new THREE.ConeGeometry(3.0, 3.5, 5), snowMat);
    bgSnow1.position.set(-5.5, 3.2, -4.5);
    worldGroup.add(bgSnow1);

    const bgPeak2 = new THREE.Mesh(new THREE.ConeGeometry(6.5, 7.5, 5), rockMat);
    bgPeak2.position.set(5.5, 2.0, -5.5);
    worldGroup.add(bgPeak2);
    const bgSnow2 = new THREE.Mesh(new THREE.ConeGeometry(3.8, 4.2, 5), snowMat);
    bgSnow2.position.set(5.5, 3.8, -5.5);
    worldGroup.add(bgSnow2);

    // Front Main Everest Mountain Slope (Ascending from bottom-left to top-right)
    const mainSlopeGeo = new THREE.BoxGeometry(14, 8, 5);
    const mainSlope = new THREE.Mesh(mainSlopeGeo, rockMat);
    mainSlope.position.set(0, -1.8, -1.5);
    mainSlope.rotation.z = -0.32;
    mainSlope.receiveShadow = true;
    worldGroup.add(mainSlope);

    // Snow Cap on Top Half of Main Slope
    const snowLayerGeo = new THREE.BoxGeometry(10, 5, 5.2);
    const snowLayer = new THREE.Mesh(snowLayerGeo, snowMat);
    snowLayer.position.set(1.8, -0.2, -1.5);
    snowLayer.rotation.z = -0.32;
    snowLayer.receiveShadow = true;
    worldGroup.add(snowLayer);

    // 4. Clearly Defined 3D Front Ridge Path Spline (Z = 0.5 to ALWAYS be in front of mountain)
    const ridgeSpline = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4.5, -1.6, 0.5), // 0m (Valley Moraine)
      new THREE.Vector3(-1.8, -0.5, 0.5), // 5,364m (Khumbu Base Camp)
      new THREE.Vector3(0.8, 0.7, 0.5),   // 7,900m (Camp 4 Death Zone)
      new THREE.Vector3(3.2, 1.8, 0.5),   // 8,848m (Everest Summit)
    ]);

    // Glowing Trail Line on Ridge
    const pathMesh = new THREE.Mesh(
      new THREE.TubeGeometry(ridgeSpline, 48, 0.08, 8, false),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    worldGroup.add(pathMesh);

    // 5. Distinct 3D Camps & Landmarks Placed Along the Front Ridge
    // A. 🌿 Valley (0m) Base
    const valleySign = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.8, 8),
      new THREE.MeshStandardMaterial({ color: 0x22c55e })
    );
    valleySign.position.set(-4.5, -1.2, 0.5);
    worldGroup.add(valleySign);

    // B. ⛺ Khumbu Base Camp (5,364m) - 3D Yellow Dome Tents & Prayer Flags
    const baseCamp = new THREE.Group();
    baseCamp.position.set(-1.8, -0.4, 0.5);
    worldGroup.add(baseCamp);

    const tentMesh1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 })
    );
    tentMesh1.position.set(-0.35, 0, 0.2);
    baseCamp.add(tentMesh1);

    const tentMesh2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 })
    );
    tentMesh2.position.set(0.35, 0, -0.1);
    baseCamp.add(tentMesh2);

    // Prayer flags line
    const pCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.6, 0.45, 0.2),
      new THREE.Vector3(0.0, 0.3, 0.0),
      new THREE.Vector3(0.6, 0.45, -0.1),
    ]);
    const pLine = new THREE.Mesh(
      new THREE.TubeGeometry(pCurve, 12, 0.012, 6, false),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    baseCamp.add(pLine);

    // C. 🚩 Sagarmatha Summit (8,848m) - Large Fluttering Indian Tricolor Flag
    const summitGroup = new THREE.Group();
    summitGroup.position.set(3.2, 1.8, 0.5);
    worldGroup.add(summitGroup);

    const summitPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 1.8, 8),
      new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9 })
    );
    summitPole.position.y = 0.9;
    summitGroup.add(summitPole);

    const flagGeo = new THREE.PlaneGeometry(0.9, 0.55, 12, 6);
    const flagMat = new THREE.MeshStandardMaterial({
      color: 0xf97316, // Saffron Top
      side: THREE.DoubleSide,
      roughness: 0.4,
    });
    const flagMesh = new THREE.Mesh(flagGeo, flagMat);
    flagMesh.position.set(0.5, 1.4, 0);
    summitGroup.add(flagMesh);

    // 6. HEROIC 3D MOUNTAINEER / TREKKER AVATAR (Large Scale 1.6x, Prominently Visible!)
    const trekkerGroup = new THREE.Group();
    trekkerGroup.scale.set(1.4, 1.4, 1.4);
    scene.add(trekkerGroup);

    // Materials
    const downSuitRed = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.7 });
    const navySuit = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 });
    const goggleGlass = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.95, roughness: 0.05 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 });
    const oxygenTankMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.2 });

    // Main Torso (Warm Red Down Jacket)
    const torsoMesh = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.65, 0.35), downSuitRed);
    torsoMesh.position.y = 0.6;
    torsoMesh.castShadow = true;
    trekkerGroup.add(torsoMesh);

    // Head with Thermal Hood
    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), downSuitRed);
    headMesh.position.set(0, 1.08, 0.02);
    trekkerGroup.add(headMesh);

    // Reflective Tinted Glacier Goggles (Wide Front Glass)
    const gogglesMesh = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.09, 0.1), goggleGlass);
    gogglesMesh.position.set(0, 1.1, 0.2);
    trekkerGroup.add(gogglesMesh);

    // Technical Backpack (Navy)
    const backpackMesh = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.58, 0.28), navySuit);
    backpackMesh.position.set(0, 0.62, -0.28);
    trekkerGroup.add(backpackMesh);

    // Dual High-Pressure Yellow Oxygen Cylinders on Backpack (Death Zone)
    const o2TankL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.55, 16), oxygenTankMat);
    o2TankL.position.set(-0.13, 0.62, -0.42);
    trekkerGroup.add(o2TankL);

    const o2TankR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.55, 16), oxygenTankMat);
    o2TankR.position.set(0.13, 0.62, -0.42);
    trekkerGroup.add(o2TankR);

    // Oxygen Face Mask & Hose (Death Zone)
    const maskMesh = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.12), navySuit);
    maskMesh.position.set(0, 0.98, 0.2);
    trekkerGroup.add(maskMesh);

    const o2HoseCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.98, 0.2),
      new THREE.Vector3(0.22, 0.8, 0.0),
      new THREE.Vector3(0.13, 0.7, -0.42),
    ]);
    const o2Hose = new THREE.Mesh(
      new THREE.TubeGeometry(o2HoseCurve, 12, 0.02, 6, false),
      new THREE.MeshBasicMaterial({ color: 0x94a3b8 })
    );
    trekkerGroup.add(o2Hose);

    // 2 Climbing Legs & Heavy Snow Boots
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.45, 0.22), navySuit);
    legL.position.set(-0.14, 0.25, 0);
    trekkerGroup.add(legL);

    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.45, 0.22), navySuit);
    legR.position.set(0.14, 0.25, 0);
    trekkerGroup.add(legR);

    // Steel-Spiked Ice Crampons on Boots
    const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.15, 0.32), navySuit);
    bootL.position.set(-0.14, 0.06, 0.04);
    trekkerGroup.add(bootL);

    const bootR = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.15, 0.32), navySuit);
    bootR.position.set(0.14, 0.06, 0.04);
    trekkerGroup.add(bootR);

    // Crampon Steel Frame & Spikes
    const cramponFrame = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.035, 0.36), steelMat);
    cramponFrame.position.set(0, -0.02, 0.04);
    trekkerGroup.add(cramponFrame);

    for (let sp = -0.18; sp <= 0.18; sp += 0.09) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.07, 4), steelMat);
      spike.rotation.x = Math.PI;
      spike.position.set(sp, -0.05, 0.04);
      trekkerGroup.add(spike);
    }

    // Ice Axe in Hand
    const axeShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.7, 8), navySuit);
    axeShaft.rotation.z = 0.55;
    axeShaft.position.set(0.38, 0.45, 0.2);
    trekkerGroup.add(axeShaft);

    const axeHead = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.05, 0.03), steelMat);
    axeHead.position.set(0.22, 0.72, 0.2);
    trekkerGroup.add(axeHead);

    // 7. Dynamic 3D Blizzard Snow Storm Particles
    const snowCount = 180;
    const snowGeo = new THREE.BufferGeometry();
    const snowPositions = new Float32Array(snowCount * 3);
    const snowVelocities: THREE.Vector3[] = [];

    for (let p = 0; p < snowCount; p++) {
      snowPositions[p * 3] = (Math.random() - 0.5) * 18;
      snowPositions[p * 3 + 1] = Math.random() * 8;
      snowPositions[p * 3 + 2] = (Math.random() - 0.5) * 14;
      snowVelocities.push(
        new THREE.Vector3(
          -3.5 - Math.random() * 4.0,
          -1.0 - Math.random() * 1.5,
          (Math.random() - 0.5) * 2.0
        )
      );
    }
    snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));

    const snowMatParticles = new THREE.PointsMaterial({
      color: 0xf8fafc,
      size: 0.15,
      transparent: true,
      opacity: 0.75,
    });
    const snowParticles = new THREE.Points(snowGeo, snowMatParticles);
    scene.add(snowParticles);

    // 8. Interactive Mouse Orbit Controls
    const handleMouseDown = (e: MouseEvent) => {
      stateRef.current.isDragging = true;
      stateRef.current.prevMouseX = e.clientX;
      stateRef.current.prevMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!stateRef.current.isDragging) return;
      const deltaX = e.clientX - stateRef.current.prevMouseX;
      const deltaY = e.clientY - stateRef.current.prevMouseY;
      stateRef.current.prevMouseX = e.clientX;
      stateRef.current.prevMouseY = e.clientY;

      stateRef.current.targetTheta += deltaX * 0.005;
      stateRef.current.targetPhi = Math.max(-0.2, Math.min(0.5, stateRef.current.targetPhi + deltaY * 0.004));
    };

    const handleMouseUp = () => {
      stateRef.current.isDragging = false;
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // 9. 60FPS Fluid Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      const time = clock.getElapsedTime();
      const { altitude, isDeathZone: deathZone, targetTheta, targetPhi } = stateRef.current;

      // Smooth Orbit Camera Interpolation
      stateRef.current.orbitTheta += (targetTheta - stateRef.current.orbitTheta) * 0.1;
      stateRef.current.orbitPhi += (targetPhi - stateRef.current.orbitPhi) * 0.1;

      // Calculate Trekker Position on Front Ridge Spline
      const u = Math.min(1.0, Math.max(0, altitude / 8848));
      const posOnRidge = ridgeSpline.getPoint(u);
      trekkerGroup.position.copy(posOnRidge);

      // Climber subtle stepping animation
      trekkerGroup.position.y += Math.sin(time * 6) * 0.03;
      legL.rotation.x = Math.sin(time * 6) * 0.2;
      legR.rotation.x = -Math.sin(time * 6) * 0.2;

      // Camera smoothly tracks trekker while orbiting
      const camDist = 8.5;
      camera.position.x = posOnRidge.x + Math.sin(stateRef.current.orbitTheta) * camDist;
      camera.position.y = posOnRidge.y + 1.2 + Math.sin(stateRef.current.orbitPhi) * 3.0;
      camera.position.z = posOnRidge.z + Math.cos(stateRef.current.orbitTheta) * camDist;
      camera.lookAt(posOnRidge.x, posOnRidge.y + 0.5, posOnRidge.z);

      // Death Zone Oxygen Gear & Weather Handling
      if (deathZone) {
        o2TankL.visible = true;
        o2TankR.visible = true;
        maskMesh.visible = true;
        o2Hose.visible = true;
        snowMatParticles.opacity = 0.95;
        scene.background.setHex(0x030a16); // Thin near-space atmosphere
      } else {
        o2TankL.visible = false;
        o2TankR.visible = false;
        maskMesh.visible = false;
        o2Hose.visible = false;
        snowMatParticles.opacity = 0.4;
        scene.background.setHex(0x0c192c);
      }

      // Fluttering Summit Flag Animation (Wave vertices)
      const flagPos = flagGeo.attributes.position;
      for (let f = 0; f < flagPos.count; f++) {
        const xVal = flagPos.getX(f);
        flagPos.setZ(f, Math.sin(time * 8 + xVal * 6) * (xVal + 0.45) * 0.2);
      }
      flagPos.needsUpdate = true;

      // Animate Blizzard Snow Particles
      const snowPosAttr = snowGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < snowCount; i++) {
        let px = snowPosAttr.getX(i) + snowVelocities[i].x * delta;
        let py = snowPosAttr.getY(i) + snowVelocities[i].y * delta;
        let pz = snowPosAttr.getZ(i) + snowVelocities[i].z * delta;

        if (px < -10 || py < -2.0) {
          px = 10.0;
          py = 7.0;
          pz = (Math.random() - 0.5) * 14;
        }
        snowPosAttr.setXYZ(i, px, py, pz);
      }
      snowPosAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="w-full max-w-4xl bg-white p-5 sm:p-7 rounded-[36px] border-4 border-amber-400 shadow-2xl flex flex-col items-center select-none font-sans text-slate-900">
      {/* Header Bar with Live Altitude & Barometer HUD */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full mb-4 border-b-2 border-slate-100 pb-3">
        <div className="text-center sm:text-left">
          <span className="text-xs font-black uppercase text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 inline-block mb-1">
            🧗 3D Mount Everest Altitude & Barometer Lab
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Bachendri Pal 8,848m Summit Expedition
          </h3>
        </div>

        {/* Live Gauges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-900 px-3.5 py-1.5 rounded-full text-white text-xs font-black shadow-sm">
            <Gauge className="w-4 h-4 text-sky-400" />
            <span>📍 {pressureHpa} hPa</span>
          </div>

          <span
            className={`px-3.5 py-1.5 rounded-full text-xs font-black shadow-sm flex items-center gap-1.5 ${
              isDeathZone
                ? 'bg-rose-500 text-white animate-bounce ring-2 ring-rose-300'
                : 'bg-amber-400 text-slate-950 font-black'
            }`}
          >
            {isDeathZone ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>DEATH ZONE (O₂: 33%)</span>
              </>
            ) : (
              <>
                <Wind className="w-3.5 h-3.5" />
                <span>O₂ LEVEL: {oxygenPercent}%</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border-3 border-slate-800 relative bg-slate-950 flex items-center justify-center mb-4 cursor-grab active:cursor-grabbing">
        <div ref={mountRef} className="w-full h-full" />

        {/* Orbit Drag Instruction Overlay */}
        <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-2 shadow-sm pointer-events-none">
          <Compass className="w-4 h-4 text-amber-400 animate-spin" />
          <span>Elevation: {altitudeMeters}m / 8,848m (Click & Drag 3D Scene to Orbit)</span>
        </div>

        {/* Dynamic Altitude Status Banner */}
        <div className="absolute bottom-3 bg-slate-950/90 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700 text-xs font-bold text-white shadow-lg text-center max-w-lg">
          {isSummit
            ? '🚩 8,848m SUMMIT REACHED! Bachendri Pal hoisted the Indian flag on May 23, 1984!'
            : isDeathZone
            ? '⚠️ High-altitude hypoxia! Dual oxygen cylinders & mask active to survive 380 hPa thin air!'
            : 'Slide the altitude control or click camp buttons to climb Mount Everest!'}
        </div>
      </div>

      {/* 4 Interactive Waypoint Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full mb-3">
        {[
          { label: '1. Valley Moraine', alt: 0, o2: '100%', pressure: '1013 hPa', icon: '🌿' },
          { label: '2. Khumbu Base Camp', alt: 5364, o2: '50%', pressure: '500 hPa', icon: '⛺' },
          { label: '3. Camp 4 Death Zone', alt: 7900, o2: '38%', pressure: '380 hPa', icon: '⚠️' },
          { label: '4. Sagarmatha Summit 🚩', alt: 8848, o2: '33%', pressure: '330 hPa', icon: '🇮🇳' },
        ].map((station) => (
          <button
            key={station.alt}
            onClick={() => handleAltitudeChange(station.alt)}
            className={`p-3 rounded-2xl text-xs font-black border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-1 shadow-sm ${
              Math.abs(altitudeMeters - station.alt) < 250
                ? 'bg-amber-400 border-amber-500 text-slate-950 shadow-md scale-102 ring-2 ring-amber-300 font-black'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-amber-50'
            }`}
          >
            <span className="text-base">{station.icon}</span>
            <span className="font-black text-center">{station.label}</span>
            <span className="text-[10px] text-slate-500 font-bold">
              {station.alt}m • {station.pressure}
            </span>
          </button>
        ))}
      </div>

      {/* Altitude Continuous Slider Control */}
      <div className="w-full flex flex-col gap-3">
        <div className="w-full flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border-2 border-slate-200">
          <span className="text-xs font-black text-slate-700 shrink-0 flex items-center gap-1.5">
            <Mountain className="w-4 h-4 text-amber-500" />
            <span>Climb Height:</span>
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
          <span className="text-xs font-black text-slate-900 w-20 text-right bg-white px-2 py-1 rounded-md border border-slate-300">
            {altitudeMeters}m
          </span>
        </div>

        {/* 5th Grade Key Scientific Takeaway */}
        <div className="text-xs font-bold text-slate-700 bg-amber-50 p-3.5 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            💡 <strong>Why Do Climbers Need Oxygen Tanks & Steel Crampons?</strong>
            <p className="text-[11px] text-slate-600 mt-0.5">
              At 8,848m, atmospheric air pressure is <strong>3x lower (330 hPa)</strong> than sea level. Mountaineers use steel crampon spikes to grip solid blue glacier ice and breathe supplemental oxygen to prevent hypoxia!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
