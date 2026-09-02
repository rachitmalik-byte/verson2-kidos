import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import {
  Droplets,
  Sparkles,
  RotateCcw,
  Globe,
  Utensils,
  Moon,
  Scissors,
  CheckCircle2,
  Compass,
} from 'lucide-react';

interface Props {
  onCompleted?: () => void;
}

export const ThreeSpaceHabitatLab: React.FC<Props> = ({ onCompleted }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [stationMode, setStationMode] = useState<'water' | 'daily_life' | 'gravity'>('water');
  const [dailyLifeTopic, setDailyLifeTopic] = useState<'eating' | 'sleeping' | 'hair'>('eating');
  const [gravityMode, setGravityMode] = useState<'orbit' | 'earth'>('orbit');
  const [waterCount, setWaterCount] = useState<number>(1);

  const stateRef = useRef({
    stationMode: 'water',
    dailyLifeTopic: 'eating',
    gravityMode: 'orbit',
    waterCount: 1,
  });

  useEffect(() => {
    stateRef.current.stationMode = stationMode;
    stateRef.current.dailyLifeTopic = dailyLifeTopic;
    stateRef.current.gravityMode = gravityMode;
    stateRef.current.waterCount = waterCount;
  }, [stationMode, dailyLifeTopic, gravityMode, waterCount]);

  const handleSqueezeWater = () => {
    sounds.sparkle();
    setWaterCount((p) => Math.min(5, p + 1));
    voiceAssistant.speak(
      'Water squeezed! In orbital zero gravity, cohesive surface tension pulls liquid water into floating spheres!'
    );
    if (onCompleted) onCompleted();
  };

  const handleAbsorbWater = () => {
    sounds.pop();
    setWaterCount(0);
    sounds.success();
    voiceAssistant.speak(
      'Microfiber towel captured the floating water droplets! Astronauts use towels to capture liquid in orbit!'
    );
  };

  const handleMergeWater = () => {
    sounds.pop();
    if (waterCount > 1) {
      sounds.success();
      setWaterCount(1);
      voiceAssistant.speak('Floating water droplets collided and merged into one giant liquid sphere!');
    }
  };

  const handleGravityToggle = (mode: 'orbit' | 'earth') => {
    sounds.pop();
    setGravityMode(mode);
    if (mode === 'orbit') {
      sounds.sparkle();
      voiceAssistant.speak(
        '0g Orbital Freefall! The space station is falling continuously around Earth, so water and food float!'
      );
    } else {
      sounds.success();
      voiceAssistant.speak(
        '1g Earth Gravity! Earth’s gravity pulls water and objects straight down onto tables and floors.'
      );
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 460;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712); // Deep Cosmic Space

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 7.5);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Lighting (Earth Sunlight & Cabin Interior LEDs)
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
    sunLight.position.set(5, 8, 6);
    scene.add(sunLight);

    const earthBlueGlow = new THREE.PointLight(0x38bdf8, 2.0, 20);
    earthBlueGlow.position.set(-4, -2, -2);
    scene.add(earthBlueGlow);

    const cabinWarmLight = new THREE.PointLight(0xfef08a, 1.0, 12);
    cabinWarmLight.position.set(2, 3, 2);
    scene.add(cabinWarmLight);

    // 4. Background Starfield (350 Stars)
    const starGeo = new THREE.BufferGeometry();
    const starCount = 350;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 80;
      starPos[i + 1] = (Math.random() - 0.5) * 80;
      starPos[i + 2] = -25 - Math.random() * 40;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.35, transparent: true, opacity: 0.85 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // 5. 3D Planet Earth (Visible in Cupola Window)
    const earthGroup = new THREE.Group();
    earthGroup.position.set(-3.2, -1.8, -7);

    const earthGeo = new THREE.SphereGeometry(3.6, 32, 32);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.6,
      metalness: 0.1,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    // Earth Continents (Green/Brown patches)
    const continentMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
    for (let i = 0; i < 7; i++) {
      const cGeo = new THREE.SphereGeometry(1.2 + (i % 3) * 0.4, 16, 16);
      const cMesh = new THREE.Mesh(cGeo, continentMat);
      const theta = (i * Math.PI) / 3.5;
      const phi = (i * Math.PI) / 5;
      cMesh.position.set(
        Math.sin(theta) * Math.cos(phi) * 3.4,
        Math.sin(phi) * 3.4,
        Math.cos(theta) * Math.cos(phi) * 3.4
      );
      earthGroup.add(cMesh);
    }

    // Atmosphere Glow Shell
    const atmoGeo = new THREE.SphereGeometry(3.8, 32, 32);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.25,
      side: THREE.BackSide,
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    earthGroup.add(atmoMesh);
    scene.add(earthGroup);

    // 6. 3D ISS Habitat Module Interior (Curved Walls & Window Frame)
    const moduleGroup = new THREE.Group();

    // Module Walls & Frame
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.6,
      roughness: 0.4,
      side: THREE.BackSide,
    });
    const moduleHull = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.2, 10, 24, 1, true), wallMat);
    moduleHull.rotation.z = Math.PI / 2;
    moduleHull.position.set(0, 0, 0);
    moduleGroup.add(moduleHull);

    // Large Cupola Window Ring
    const windowFrameMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.2 });
    const windowRing = new THREE.Mesh(new THREE.TorusGeometry(3.4, 0.18, 16, 32), windowFrameMat);
    windowRing.position.set(-2.8, -0.8, -4.5);
    moduleGroup.add(windowRing);

    // Yellow Safety Handrails inside cabin
    const railMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.7, roughness: 0.3 });
    const rail1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 4, 12), railMat);
    rail1.position.set(2.2, 1.8, 0);
    rail1.rotation.x = Math.PI / 2;
    moduleGroup.add(rail1);

    const rail2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 4, 12), railMat);
    rail2.position.set(2.2, -1.8, 0);
    rail2.rotation.x = Math.PI / 2;
    moduleGroup.add(rail2);

    // Work Table (For 1g vs 0g gravity demonstration)
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.5, roughness: 0.5 });
    const tableMesh = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 1.4), tableMat);
    tableMesh.position.set(0, -1.6, 0);
    moduleGroup.add(tableMesh);

    scene.add(moduleGroup);

    // 7. 3D Astronaut Sunita Williams Character Model
    const astronautGroup = new THREE.Group();
    astronautGroup.position.set(-1.4, 0.4, 0);

    // Blue Flight Suit Torso
    const torsoMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.6 }); // NASA Blue
    const torsoMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.32, 0.9, 16), torsoMat);
    astronautGroup.add(torsoMesh);

    // NASA Mission Patch Badge on Chest
    const patchMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
    const patchMesh = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 0.02), patchMat);
    patchMesh.position.set(0.12, 0.25, 0.36);
    astronautGroup.add(patchMesh);

    // Head / Face
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.7 });
    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), skinMat);
    headMesh.position.set(0, 0.68, 0);
    astronautGroup.add(headMesh);

    // Floating Hair (Defying Gravity in 0g)
    const hairGroup = new THREE.Group();
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 });
    for (let i = 0; i < 8; i++) {
      const strand = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.32, 8), hairMat);
      const angle = (i * Math.PI * 2) / 8;
      strand.position.set(Math.cos(angle) * 0.14, 0.88 + Math.sin(angle) * 0.05, Math.sin(angle) * 0.14);
      strand.rotation.x = -Math.PI / 2 + Math.sin(angle) * 0.4;
      strand.rotation.z = Math.cos(angle) * 0.4;
      hairGroup.add(strand);
    }
    astronautGroup.add(hairGroup);

    // Left Arm & Right Arm (Floating Relaxed in Microgravity)
    const limbMat = new THREE.MeshStandardMaterial({ color: 0x1e40af, roughness: 0.6 });
    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.65, 12), limbMat);
    leftArm.position.set(-0.48, 0.2, 0);
    leftArm.rotation.z = Math.PI / 4;
    astronautGroup.add(leftArm);

    const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.65, 12), limbMat);
    rightArm.position.set(0.48, 0.2, 0);
    rightArm.rotation.z = -Math.PI / 4;
    astronautGroup.add(rightArm);

    // Legs
    const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.8, 12), limbMat);
    leftLeg.position.set(-0.2, -0.75, 0.1);
    leftLeg.rotation.x = -Math.PI / 8;
    astronautGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.8, 12), limbMat);
    rightLeg.position.set(0.2, -0.75, -0.1);
    rightLeg.rotation.x = Math.PI / 8;
    astronautGroup.add(rightLeg);

    scene.add(astronautGroup);

    // 8. 3D Floating Water Spheres Group (High-Refraction Shimmering Water)
    const waterGroup = new THREE.Group();
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transmission: 0.92,
      roughness: 0.05,
      ior: 1.333,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transparent: true,
      opacity: 0.88,
    });

    const waterMeshes: THREE.Mesh[] = [];
    const spherePositions = [
      [0.6, 0.2, 0],
      [1.1, 0.7, -0.2],
      [0.3, 0.8, 0.3],
      [1.4, -0.1, 0.2],
      [0.8, -0.5, -0.3],
    ];

    for (let i = 0; i < 5; i++) {
      const radius = i === 0 ? 0.38 : 0.24;
      const wMesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 24), waterMat);
      wMesh.position.set(spherePositions[i][0], spherePositions[i][1], spherePositions[i][2]);
      waterGroup.add(wMesh);
      waterMeshes.push(wMesh);
    }
    scene.add(waterGroup);

    // 9. 3D Daily Life Props (Floating Sandwich, Drink Pouch, Sleeping Bag)
    const dailyLifeGroup = new THREE.Group();

    // Floating Sandwich (Bread, Lettuce, Tomato, Cheese Slices)
    const sandwichGroup = new THREE.Group();
    sandwichGroup.position.set(0.8, 0.2, 0);

    const breadMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8 });
    const topBread = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.08, 0.48), breadMat);
    topBread.position.set(0, 0.16, 0);
    sandwichGroup.add(topBread);

    const lettuceMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.6 });
    const lettuce = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.04, 0.52), lettuceMat);
    lettuce.position.set(0, 0.08, 0);
    sandwichGroup.add(lettuce);

    const tomatoMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 });
    const tomato = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.04, 16), tomatoMat);
    tomato.position.set(0, 0.02, 0);
    sandwichGroup.add(tomato);

    const cheeseMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
    const cheese = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.03, 0.46), cheeseMat);
    cheese.position.set(0, -0.04, 0);
    sandwichGroup.add(cheese);

    const botBread = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.08, 0.48), breadMat);
    botBread.position.set(0, -0.12, 0);
    sandwichGroup.add(botBread);

    dailyLifeGroup.add(sandwichGroup);

    // Sleeping Bag (Wall Tied)
    const sleepingBagGroup = new THREE.Group();
    sleepingBagGroup.position.set(1.6, 0, -1.2);
    const bagMat = new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.7 });
    const bagMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.4, 2.2, 16), bagMat);
    sleepingBagGroup.add(bagMesh);

    // Tension Wall Straps
    const strapMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8 });
    const strap1 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.04), strapMat);
    strap1.position.set(0, 0.6, 0);
    sleepingBagGroup.add(strap1);

    const strap2 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.04), strapMat);
    strap2.position.set(0, -0.6, 0);
    sleepingBagGroup.add(strap2);

    dailyLifeGroup.add(sleepingBagGroup);
    scene.add(dailyLifeGroup);

    // 10. Mouse Drag Orbit Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      targetRotY += dx * 0.005;
      targetRotX += dy * 0.005;
      targetRotX = Math.max(-0.5, Math.min(0.5, targetRotX));
    };
    const onMouseUp = () => (isDragging = false);

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 11. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Camera Orbit Damping
      camera.position.x += (Math.sin(targetRotY) * 7.5 - camera.position.x) * 0.08;
      camera.position.y += (1.2 + targetRotX * 3 - camera.position.y) * 0.08;
      camera.position.z += (Math.cos(targetRotY) * 7.5 - camera.position.z) * 0.08;
      camera.lookAt(0, 0.2, 0);

      // Earth Slow Orbital Rotation
      earthGroup.rotation.y += 0.0015;

      // Floating Astronaut Weightless Dynamics
      const is0g = stateRef.current.gravityMode === 'orbit';
      if (is0g) {
        astronautGroup.position.y = 0.4 + Math.sin(elapsed * 0.8) * 0.15;
        astronautGroup.rotation.z = Math.sin(elapsed * 0.5) * 0.08;
        astronautGroup.rotation.y = Math.cos(elapsed * 0.4) * 0.12;
      } else {
        // 1g Earth Mode: Standing on floor
        astronautGroup.position.y = -0.9;
        astronautGroup.position.x = -1.2;
        astronautGroup.rotation.z = 0;
        astronautGroup.rotation.y = 0.2;
      }

      // Visibility & Physics based on Mode
      const currentMode = stateRef.current.stationMode;
      const currentCount = stateRef.current.waterCount;
      const lifeTopic = stateRef.current.dailyLifeTopic;

      // Water Mode Visibility & Wobble
      if (currentMode === 'water' || currentMode === 'gravity') {
        waterGroup.visible = currentCount > 0;
        dailyLifeGroup.visible = false;

        waterMeshes.forEach((mesh, idx) => {
          mesh.visible = idx < currentCount;
          if (is0g) {
            // Floating & Wobbling Liquid Sphere in 0g
            mesh.position.y = spherePositions[idx][1] + Math.sin(elapsed * 1.5 + idx) * 0.1;
            mesh.scale.set(
              1 + Math.sin(elapsed * 2 + idx) * 0.06,
              1 + Math.cos(elapsed * 2.2 + idx) * 0.06,
              1 + Math.sin(elapsed * 1.8 + idx) * 0.06
            );
          } else {
            // 1g Earth: Splashed down on Table!
            mesh.position.y = -1.5;
            mesh.position.x = 0.2 + idx * 0.3;
            mesh.position.z = 0;
            mesh.scale.set(1.4, 0.3, 1.4); // Flattened puddle
          }
        });
      } else if (currentMode === 'daily_life') {
        waterGroup.visible = false;
        dailyLifeGroup.visible = true;

        if (lifeTopic === 'eating') {
          sandwichGroup.visible = true;
          sleepingBagGroup.visible = false;

          // Floating Slices in 0g
          topBread.position.y = 0.24 + Math.sin(elapsed * 1.2) * 0.08;
          lettuce.position.y = 0.12 + Math.sin(elapsed * 1.4) * 0.06;
          tomato.position.y = 0.0 + Math.sin(elapsed * 1.6) * 0.06;
          cheese.position.y = -0.1 + Math.sin(elapsed * 1.3) * 0.07;
          botBread.position.y = -0.22 + Math.sin(elapsed * 1.1) * 0.08;
          sandwichGroup.rotation.y = elapsed * 0.3;
        } else if (lifeTopic === 'sleeping') {
          sandwichGroup.visible = false;
          sleepingBagGroup.visible = true;
        } else {
          // Hair floating
          sandwichGroup.visible = false;
          sleepingBagGroup.visible = false;
        }
      }

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
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="w-full max-w-4xl bg-white p-5 sm:p-7 rounded-[36px] border-4 border-indigo-500 shadow-2xl flex flex-col items-center select-none font-sans text-slate-900">
      {/* Top Header HUD */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full mb-4 border-b-2 border-slate-100 pb-3">
        <div className="text-center sm:text-left">
          <span className="text-xs font-black uppercase text-indigo-800 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-300 inline-block mb-1 shadow-xs">
            🚀 3D WebGL ISS Microgravity Physics Lab
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Sunita Williams: 3D Orbital Habitat & Water Lab
          </h3>
        </div>

        {/* 3 Main Station Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          {[
            { id: 'water', label: '1. 3D Floating Water Spheres 💧' },
            { id: 'daily_life', label: '2. 3D Daily Life in Orbit 👩‍🚀' },
            { id: 'gravity', label: '3. 1g Earth vs 0g Orbit 🌍' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.pop();
                setStationMode(tab.id as any);
              }}
              className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                stationMode === tab.id
                  ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3D THREE.JS WEBGL VIEWPORT ── */}
      <div className="relative w-full h-84 sm:h-96 rounded-3xl overflow-hidden border-4 border-indigo-700 shadow-2xl bg-slate-950">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* 3D Orbit Camera Drag Hint */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-indigo-400 text-[10px] font-black text-indigo-200 shadow-md flex items-center gap-1.5 pointer-events-none">
          <Compass className="w-3.5 h-3.5 text-sky-400 animate-spin" />
          <span>Click & Drag to Orbit 3D Space Station</span>
        </div>

        {/* Station Mode On-Screen Overlay */}
        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-indigo-400 text-[10px] font-black text-white shadow-md pointer-events-none">
          {stationMode === 'water' && `💧 ${waterCount} Liquid Spheres Floating`}
          {stationMode === 'daily_life' && `🥪 Topic: ${dailyLifeTopic.toUpperCase()}`}
          {stationMode === 'gravity' && `🌍 Physics: ${gravityMode.toUpperCase()} (${gravityMode === 'orbit' ? '0g' : '1g'})`}
        </div>

        {/* Bottom Banner Status */}
        <div className="absolute bottom-3 left-4 right-4 bg-slate-950/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-indigo-400 text-xs font-bold text-white shadow-lg text-center z-10 pointer-events-none">
          {stationMode === 'water' &&
            (waterCount > 0
              ? '💧 3D Liquid Cohesion: Hydrogen bonds pull water molecules into floating optical spheres!'
              : 'Microfiber towel dried the water! Squeeze the drink pouch below to dispense 3D water!')}
          {stationMode === 'daily_life' &&
            (dailyLifeTopic === 'eating'
              ? '🥪 Microgravity Eating: Food slices float in the air unless anchored by velcro trays!'
              : dailyLifeTopic === 'sleeping'
              ? '🛌 Microgravity Sleeping: Astronauts tie sleeping bags to walls so they do not drift into air fans!'
              : '💇‍♀️ Floating Hair: Without gravity pulling hair down, strands float straight up in all directions!')}
          {stationMode === 'gravity' &&
            (gravityMode === 'orbit'
              ? '🚀 0g Orbital Freefall: Space Station is falling around Earth, so water floats weightlessly!'
              : '🌍 1g Earth Gravity: Downward gravity pulls water down into flat puddles and cups on tables!')}
        </div>
      </div>

      {/* ── INTERACTIVE CONTROLS FOR ACTIVE STATION ── */}
      <div className="w-full flex flex-col items-center gap-3 mt-4">
        {/* Mode 1: Water Controls */}
        {stationMode === 'water' && (
          <div className="flex flex-wrap items-center justify-center gap-3 w-full">
            <button
              onClick={handleSqueezeWater}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 to-blue-600 hover:brightness-110 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer active:scale-95 transition-all flex items-center gap-2"
            >
              <Droplets className="w-5 h-5 text-sky-100" />
              <span>🧃 Squeeze 3D Drink Pouch (+Water)</span>
            </button>

            {waterCount > 1 && (
              <button
                onClick={handleMergeWater}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:brightness-110 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer active:scale-95 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>✨ Merge Into Giant Sphere</span>
              </button>
            )}

            {waterCount > 0 && (
              <button
                onClick={handleAbsorbWater}
                className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs border border-slate-300 cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Catch with Microfiber Towel</span>
              </button>
            )}
          </div>
        )}

        {/* Mode 2: Daily Life Topic Buttons */}
        {stationMode === 'daily_life' && (
          <div className="grid grid-cols-3 gap-2.5 w-full max-w-lg">
            {[
              { id: 'eating', label: '🥪 Floating Food', icon: Utensils },
              { id: 'sleeping', label: '🛌 Tied Sleeping Bag', icon: Moon },
              { id: 'hair', label: '💇‍♀️ Floating Hair', icon: Scissors },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  sounds.pop();
                  setDailyLifeTopic(t.id as any);
                }}
                className={`p-3 rounded-2xl text-xs font-black border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-1 shadow-xs ${
                  dailyLifeTopic === t.id
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-102 ring-2 ring-indigo-300 font-black'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-indigo-50'
                }`}
              >
                <t.icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Mode 3: 1g Earth vs 0g Orbit Toggle */}
        {stationMode === 'gravity' && (
          <div className="flex items-center justify-center gap-3 w-full max-w-md">
            <button
              onClick={() => handleGravityToggle('earth')}
              className={`flex-1 p-3.5 rounded-2xl text-xs font-black border-2 cursor-pointer transition-all flex items-center justify-center gap-2 shadow-sm ${
                gravityMode === 'earth'
                  ? 'bg-sky-500 text-slate-950 border-sky-600 ring-2 ring-sky-300 font-black scale-102'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-sky-50'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>🌍 1. Earth Gravity (1g)</span>
            </button>

            <button
              onClick={() => handleGravityToggle('orbit')}
              className={`flex-1 p-3.5 rounded-2xl text-xs font-black border-2 cursor-pointer transition-all flex items-center justify-center gap-2 shadow-sm ${
                gravityMode === 'orbit'
                  ? 'bg-indigo-600 text-white border-indigo-700 ring-2 ring-indigo-300 font-black scale-102'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-indigo-50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>🚀 2. ISS Freefall (0g)</span>
            </button>
          </div>
        )}

        {/* 5th Grade Key Teaching Secret */}
        <div className="w-full bg-indigo-50 p-4 rounded-2xl border-2 border-indigo-200 text-center sm:text-left text-xs font-bold text-indigo-950">
          🌍 <strong>5th Grade Science Law (Microgravity & Surface Tension):</strong> Because the International Space Station orbits Earth in constant freefall, gravity cannot pull water down into cups. Water molecules stick tightly to each other (<strong>cohesion</strong>), creating <strong>floating optical liquid spheres</strong>!
        </div>
      </div>
    </div>
  );
};
