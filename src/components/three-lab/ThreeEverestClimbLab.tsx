import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Gauge, Flag, Sparkles, RefreshCw, Sliders, AlertTriangle, ShieldCheck, Mountain, Wind, Info, Compass } from 'lucide-react';

interface Props {
  onCompleted?: () => void;
}

export const ThreeEverestClimbLab: React.FC<Props> = ({ onCompleted }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [altitudeMeters, setAltitudeMeters] = useState<number>(5364);
  const [activeGearModal, setActiveGearModal] = useState<string | null>(null);

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
    orbitTheta: 0.1,
    orbitPhi: 0.25,
    targetTheta: 0.1,
    targetPhi: 0.25,
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

    // 1. 3D Scene & Perspective Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1628);
    scene.fog = new THREE.FogExp2(0x0a1628, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3.5, 11.5);
    camera.lookAt(0, 1.0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.replaceChildren(renderer.domElement);

    // 2. High-Altitude Directional Sun & Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 3.2);
    sunLight.position.set(10, 18, 12);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.001;
    scene.add(sunLight);

    // Blue Stratospheric Ambient Glow
    const skyGlow = new THREE.PointLight(0x38bdf8, 3.0, 25);
    skyGlow.position.set(-8, 8, 4);
    scene.add(skyGlow);

    // Warm Summit Golden Hour Light
    const summitGlow = new THREE.PointLight(0xf59e0b, 2.5, 12);
    summitGlow.position.set(1.5, 5.5, -0.5);
    scene.add(summitGlow);

    // 3. Realistic Sculpted Mountain Terrain Geometry
    const terrainGroup = new THREE.Group();
    scene.add(terrainGroup);

    // Mountain Rock Material
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x243044,
      roughness: 0.88,
      metalness: 0.15,
      flatShading: true,
    });

    // Crystalline Snow & Glacier Ice Material
    const snowMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.35,
      metalness: 0.1,
      flatShading: true,
    });

    const glacierMat = new THREE.MeshStandardMaterial({
      color: 0xbae6fd,
      roughness: 0.2,
      metalness: 0.25,
      transparent: true,
      opacity: 0.92,
    });

    // Main Everest Ridge Pyramid Mesh (High-Detail Displaced Plane Mesh)
    const terrainWidth = 26;
    const terrainHeight = 20;
    const segmentsX = 48;
    const segmentsY = 40;
    const mountainGeo = new THREE.PlaneGeometry(terrainWidth, terrainHeight, segmentsX, segmentsY);

    // Displace vertices to form organic Himalayan ridgelines and Everest pyramid peak
    const pos = mountainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      // Distance to summit peak located around (x: 1.5, y: 3.5)
      const distToSummit = Math.sqrt((x - 1.5) * (x - 1.5) + (y - 3.5) * (y - 3.5));
      const summitFactor = Math.max(0, 1 - distToSummit / 8.5);

      // Ridge spine running diagonally
      const ridgeDist = Math.abs(y - (0.8 * x + 1.2));
      const ridgeFactor = Math.max(0, 1 - ridgeDist / 4.0);

      // Procedural fractal peaks
      const noise =
        Math.sin(x * 0.8) * Math.cos(y * 0.8) * 0.9 +
        Math.sin(x * 1.8 + y * 1.2) * 0.4 +
        Math.cos(x * 3.2 - y * 2.0) * 0.2;

      let zVal = -1.2 + summitFactor * 6.5 + ridgeFactor * 2.2 + noise * 0.8;
      if (y < -6) zVal -= (Math.abs(y) - 6) * 0.4; // Valley dip

      pos.setZ(i, zVal);
    }
    mountainGeo.computeVertexNormals();

    const mountainMesh = new THREE.Mesh(mountainGeo, rockMat);
    mountainMesh.rotation.x = -Math.PI / 2.3;
    mountainMesh.position.set(0, -1.0, -1.5);
    mountainMesh.receiveShadow = true;
    terrainGroup.add(mountainMesh);

    // Snow-Capped Upper Peak Overlay
    const snowCapGeo = new THREE.ConeGeometry(4.5, 4.8, 8, 4);
    const snowCap = new THREE.Mesh(snowCapGeo, snowMat);
    snowCap.position.set(1.5, 3.8, -2.8);
    snowCap.rotation.y = 0.4;
    snowCap.castShadow = true;
    snowCap.receiveShadow = true;
    terrainGroup.add(snowCap);

    // Secondary Nuptse/Lhotse Peaks in background
    const peak2Geo = new THREE.ConeGeometry(5.2, 5.5, 6);
    const peak2 = new THREE.Mesh(peak2Geo, rockMat);
    peak2.position.set(-6.5, 2.2, -6.0);
    terrainGroup.add(peak2);

    const peak2Snow = new THREE.Mesh(new THREE.ConeGeometry(2.8, 3.0, 6), snowMat);
    peak2Snow.position.set(-6.5, 3.8, -6.0);
    terrainGroup.add(peak2Snow);

    // 4. Smooth 3D Spline Path for Mountaineer Climbing Route
    const climbPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-5.2, -1.5, 2.2), // 0m (Valley Moraine)
      new THREE.Vector3(-2.8, 0.1, 1.4),  // 5,364m (Khumbu Base Camp)
      new THREE.Vector3(-0.4, 1.8, 0.4),  // 7,900m (Camp 4 Death Zone / South Col)
      new THREE.Vector3(1.4, 3.9, -1.2),  // 8,848m (Everest Summit)
    ]);

    // Luminous Trail Path Line
    const pathGeo = new THREE.TubeGeometry(climbPath, 64, 0.07, 8, false);
    const pathMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
    });
    const pathMesh = new THREE.Mesh(pathGeo, pathMat);
    scene.add(pathMesh);

    // 5. Elevation Camp Markers & Props Along Path
    // A. Khumbu Base Camp (5,364m) - Yellow Expedition Tents & Prayer Flags
    const baseCampGroup = new THREE.Group();
    baseCampGroup.position.set(-2.8, 0.15, 1.4);
    scene.add(baseCampGroup);

    // Dome Tents
    const tentGeo = new THREE.SphereGeometry(0.55, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const tentMat1 = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6 });
    const tentMat2 = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.6 });

    const tent1 = new THREE.Mesh(tentGeo, tentMat1);
    tent1.position.set(-0.4, 0, 0.2);
    baseCampGroup.add(tent1);

    const tent2 = new THREE.Mesh(tentGeo, tentMat2);
    tent2.position.set(0.4, 0, -0.2);
    tent2.scale.set(0.85, 0.85, 0.85);
    baseCampGroup.add(tent2);

    // Fluttering Prayer Flags String
    const prayerFlagCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.9, 0.6, 0.4),
      new THREE.Vector3(-0.1, 0.35, 0.1),
      new THREE.Vector3(0.8, 0.6, -0.4),
    ]);
    const prayerString = new THREE.Mesh(
      new THREE.TubeGeometry(prayerFlagCurve, 16, 0.015, 6, false),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    baseCampGroup.add(prayerString);

    const flagColors = [0x3b82f6, 0xf8fafc, 0xef4444, 0x22c55e, 0xeab308];
    for (let f = 0; f < 5; f++) {
      const u = (f + 0.5) / 5;
      const pt = prayerFlagCurve.getPoint(u);
      const flagPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(0.18, 0.14),
        new THREE.MeshStandardMaterial({ color: flagColors[f], side: THREE.DoubleSide })
      );
      flagPlane.position.copy(pt);
      flagPlane.position.y -= 0.08;
      baseCampGroup.add(flagPlane);
    }

    // B. Everest Summit (8,848m) - Flagpole & Indian Tricolor Flag (Bachendri Pal 1984)
    const summitGroup = new THREE.Group();
    summitGroup.position.set(1.4, 3.9, -1.2);
    scene.add(summitGroup);

    const poleMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 1.4, 8),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 })
    );
    poleMesh.position.y = 0.7;
    summitGroup.add(poleMesh);

    // Detailed 3D Fluttering Flag
    const flagGeo = new THREE.PlaneGeometry(0.7, 0.45, 12, 6);
    const flagMat = new THREE.MeshStandardMaterial({
      color: 0xf97316, // Saffron Top
      side: THREE.DoubleSide,
      roughness: 0.5,
    });
    const flagMesh = new THREE.Mesh(flagGeo, flagMat);
    flagMesh.position.set(0.38, 1.05, 0);
    summitGroup.add(flagMesh);

    // 6. High-Fidelity 3D Mountaineer Avatar (Bachendri Pal 1984)
    const climberGroup = new THREE.Group();
    scene.add(climberGroup);

    // Realistic Proportioned Body Parts
    const suitRedMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.8 });
    const suitNavyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.1 });
    const goggleGlassMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.95, roughness: 0.05 });

    // Torso (Puffy Down Suit)
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.75, 0.42), suitRedMat);
    torso.position.y = 0.55;
    torso.castShadow = true;
    climberGroup.add(torso);

    // Climbing Harness Belts
    const harness = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.12, 0.45), suitNavyMat);
    harness.position.y = 0.28;
    climberGroup.add(harness);

    // Head with Insulated Down Hood
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), suitRedMat);
    head.position.set(0, 1.08, 0.05);
    climberGroup.add(head);

    // Reflective Tinted Glacier Goggles
    const goggles = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.09, 0.12), goggleGlassMat);
    goggles.position.set(0, 1.1, 0.24);
    climberGroup.add(goggles);

    // Technical Backpack
    const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.65, 0.3), suitNavyMat);
    backpack.position.set(0, 0.58, -0.32);
    climberGroup.add(backpack);

    // Dual High-Pressure Yellow Oxygen Cylinders (Equipped in Death Zone)
    const tankGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.6, 16);
    const tankMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.2 });

    const tankL = new THREE.Mesh(tankGeo, tankMat);
    tankL.position.set(-0.14, 0.58, -0.48);
    climberGroup.add(tankL);

    const tankR = new THREE.Mesh(tankGeo, tankMat);
    tankR.position.set(0.14, 0.58, -0.48);
    climberGroup.add(tankR);

    // Oxygen Face Mask & Corrugated Hose
    const mask = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.15), suitNavyMat);
    mask.position.set(0, 0.98, 0.22);
    climberGroup.add(mask);

    const hoseCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.98, 0.22),
      new THREE.Vector3(0.25, 0.8, 0.0),
      new THREE.Vector3(0.14, 0.7, -0.48),
    ]);
    const oxygenHose = new THREE.Mesh(
      new THREE.TubeGeometry(hoseCurve, 12, 0.025, 6, false),
      new THREE.MeshBasicMaterial({ color: 0x64748b })
    );
    climberGroup.add(oxygenHose);

    // Climbing Boots with Realistic 10-Point Steel Ice Crampons
    const bootGeo = new THREE.BoxGeometry(0.18, 0.2, 0.35);
    const bootL = new THREE.Mesh(bootGeo, suitNavyMat);
    bootL.position.set(-0.18, 0.1, 0.05);
    climberGroup.add(bootL);

    const bootR = new THREE.Mesh(bootGeo, suitNavyMat);
    bootR.position.set(0.18, 0.1, 0.05);
    climberGroup.add(bootR);

    // Sharp Steel Crampon Frame & Spikes digging into ice
    const cramponGeo = new THREE.BoxGeometry(0.48, 0.04, 0.38);
    const cramponMesh = new THREE.Mesh(cramponGeo, chromeMat);
    cramponMesh.position.set(0, -0.01, 0.05);
    climberGroup.add(cramponMesh);

    // Spikes sticking down
    for (let sp = -0.2; sp <= 0.2; sp += 0.1) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.08, 4), chromeMat);
      spike.rotation.x = Math.PI;
      spike.position.set(sp, -0.05, 0.05);
      climberGroup.add(spike);
    }

    // Ice Axe in Hand
    const axeGroup = new THREE.Group();
    axeGroup.position.set(0.42, 0.45, 0.22);
    climberGroup.add(axeGroup);

    const axeShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.75, 8), suitNavyMat);
    axeShaft.rotation.z = 0.45;
    axeGroup.add(axeShaft);

    const axeHead = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.06, 0.04), chromeMat);
    axeHead.position.set(-0.15, 0.32, 0);
    axeGroup.add(axeHead);

    // 7. Dynamic 3D Blizzard Snow Storm Particle System
    const particleCount = 220;
    const snowGeo = new THREE.BufferGeometry();
    const snowPositions = new Float32Array(particleCount * 3);
    const snowVelocities: THREE.Vector3[] = [];

    for (let p = 0; p < particleCount; p++) {
      snowPositions[p * 3] = (Math.random() - 0.5) * 22;
      snowPositions[p * 3 + 1] = Math.random() * 10;
      snowPositions[p * 3 + 2] = (Math.random() - 0.5) * 16;
      snowVelocities.push(
        new THREE.Vector3(
          -4.0 - Math.random() * 5.0, // High-altitude jetstream
          -1.2 - Math.random() * 2.0,
          (Math.random() - 0.5) * 2.5
        )
      );
    }
    snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));

    const snowParticlesMat = new THREE.PointsMaterial({
      color: 0xf8fafc,
      size: 0.18,
      transparent: true,
      opacity: 0.75,
    });
    const snowParticles = new THREE.Points(snowGeo, snowParticlesMat);
    scene.add(snowParticles);

    // 8. Interactive Mouse Orbit Drag Controls
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

      stateRef.current.targetTheta += deltaX * 0.006;
      stateRef.current.targetPhi = Math.max(0.05, Math.min(0.6, stateRef.current.targetPhi + deltaY * 0.005));
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

      // Calculate Climber Position on Climbing Path Spline
      const u = Math.min(1.0, Math.max(0, altitude / 8848));
      const posAtAltitude = climbPath.getPoint(u);
      climberGroup.position.copy(posAtAltitude);

      // Orient Climber toward Slope
      const tangent = climbPath.getTangent(u);
      climberGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);

      // Camera smoothly follows climber
      const camDist = 9.5;
      camera.position.x = posAtAltitude.x + Math.sin(stateRef.current.orbitTheta) * camDist;
      camera.position.y = posAtAltitude.y + 2.0 + Math.sin(stateRef.current.orbitPhi) * 3.5;
      camera.position.z = posAtAltitude.z + Math.cos(stateRef.current.orbitTheta) * camDist;
      camera.lookAt(posAtAltitude.x, posAtAltitude.y + 0.6, posAtAltitude.z);

      // Death Zone Oxygen Gear & Weather Handling
      if (deathZone) {
        tankL.visible = true;
        tankR.visible = true;
        mask.visible = true;
        oxygenHose.visible = true;
        snowParticlesMat.opacity = 0.95;
        scene.background.setHex(0x020617); // Stratosphere Dark Thin Sky
      } else {
        tankL.visible = false;
        tankR.visible = false;
        mask.visible = false;
        oxygenHose.visible = false;
        snowParticlesMat.opacity = 0.4;
        scene.background.setHex(0x0a1628);
      }

      // Fluttering Summit Flag Animation (Wave vertices)
      const flagPos = flagGeo.attributes.position;
      for (let f = 0; f < flagPos.count; f++) {
        const xVal = flagPos.getX(f);
        flagPos.setZ(f, Math.sin(time * 8 + xVal * 6) * (xVal + 0.35) * 0.25);
      }
      flagPos.needsUpdate = true;

      // Animate Blizzard Snow Particles
      const snowPosAttr = snowGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        let px = snowPosAttr.getX(i) + snowVelocities[i].x * delta;
        let py = snowPosAttr.getY(i) + snowVelocities[i].y * delta;
        let pz = snowPosAttr.getZ(i) + snowVelocities[i].z * delta;

        if (px < -12 || py < -2.0) {
          px = 12.0;
          py = 8.0;
          pz = (Math.random() - 0.5) * 16;
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
