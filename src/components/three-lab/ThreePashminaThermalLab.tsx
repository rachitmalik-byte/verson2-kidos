import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '@/lib/sounds';
import { voiceAssistant } from '@/lib/voiceAssistant';
import { Thermometer, Flame, Sparkles, RefreshCw, Sliders, ShieldCheck, Eye, EyeOff } from 'lucide-react';

interface Props {
  onCompleted?: () => void;
}

export const ThreePashminaThermalLab: React.FC<Props> = ({ onCompleted }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [temperatureCelsius, setTemperatureCelsius] = useState<number>(-40);
  const [isThermalVision, setIsThermalVision] = useState<boolean>(false);

  const stateRef = useRef({
    temperature: -40,
    isThermalVision: false,
  });

  useEffect(() => {
    stateRef.current.temperature = temperatureCelsius;
    stateRef.current.isThermalVision = isThermalVision;
  }, [temperatureCelsius, isThermalVision]);

  const handleTempChange = (val: number) => {
    setTemperatureCelsius(val);
    if (val <= -30) {
      sounds.sparkle();
      voiceAssistant.speak(
        'Deep sub-zero freeze! At minus forty degrees, Pashmina goats grow ultra-dense cashmere undercoats to lock in their core 38°C body warmth!'
      );
      if (onCompleted) onCompleted();
    }
  };

  const handleToggleThermal = () => {
    sounds.pop();
    const next = !isThermalVision;
    setIsThermalVision(next);
    if (next) {
      sounds.sparkle();
      voiceAssistant.speak(
        'Thermal vision activated! Notice the red 38°C core body heat trapped safely inside the insulating air pockets of the Pashmina fleece!'
      );
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 440;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1128); // Alpine Night Sky

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.5, 9.5);
    camera.lookAt(0, 0.6, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.8);
    sunLight.position.set(6, 12, 8);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const blueGlow = new THREE.PointLight(0x38bdf8, 3.0, 15);
    blueGlow.position.set(-4, 3, 4);
    scene.add(blueGlow);

    // 3. Snowy Himalayan Cold-Desert Mountain Ground
    const groundGeo = new THREE.PlaneGeometry(24, 16, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.9,
      metalness: 0.1,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -1.5;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Snow-capped Himalayan mountain peaks backdrop
    const mountainGroup = new THREE.Group();
    scene.add(mountainGroup);
    const peakGeo = new THREE.ConeGeometry(5, 7, 4);
    const peakMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.9 });
    const snowCapMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });

    const peak1 = new THREE.Mesh(peakGeo, peakMat);
    peak1.position.set(-7, 1.5, -8);
    mountainGroup.add(peak1);

    const peak2 = new THREE.Mesh(peakGeo, peakMat);
    peak2.position.set(6, 1.8, -9);
    mountainGroup.add(peak2);

    const capGeo = new THREE.ConeGeometry(2.5, 3.2, 4);
    const cap1 = new THREE.Mesh(capGeo, snowCapMat);
    cap1.position.set(-7, 3.5, -8);
    mountainGroup.add(cap1);

    const cap2 = new THREE.Mesh(capGeo, snowCapMat);
    cap2.position.set(6, 3.8, -9);
    mountainGroup.add(cap2);

    // 4. Changpa Nomad Rebo Yak-Hair Tent (Left Background)
    const reboGroup = new THREE.Group();
    reboGroup.position.set(-3.6, -1.5, -1.5);
    scene.add(reboGroup);

    const reboGeo = new THREE.ConeGeometry(1.8, 2.8, 6);
    const reboMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.95 });
    const reboMesh = new THREE.Mesh(reboGeo, reboMat);
    reboMesh.position.y = 1.4;
    reboGroup.add(reboMesh);

    // Wooden Tent Poles
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    const poleGeo = new THREE.CylinderGeometry(0.06, 0.06, 3.4, 8);
    const pole1 = new THREE.Mesh(poleGeo, poleMat);
    pole1.rotation.z = 0.2;
    pole1.position.set(-0.5, 1.4, 0);
    reboGroup.add(pole1);

    // 5. Detailed 3D Changthang Mountain Goat Model
    const goatGroup = new THREE.Group();
    goatGroup.position.set(0.6, 0, 0);
    scene.add(goatGroup);

    // Core Body
    const bodyGeo = new THREE.BoxGeometry(2.2, 1.4, 1.2);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.9,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.set(0, 0.4, 0);
    bodyMesh.castShadow = true;
    goatGroup.add(bodyMesh);

    // Fluffy Cashmere Fleece Layer (Scales with subzero cold!)
    const fleeceGeo = new THREE.SphereGeometry(1.2, 24, 24);
    fleeceGeo.scale(1.2, 0.8, 0.9);
    const fleeceMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 1.0,
    });
    const fleeceMesh = new THREE.Mesh(fleeceGeo, fleeceMat);
    fleeceMesh.position.set(0, 0.4, 0);
    goatGroup.add(fleeceMesh);

    // Thermal Core Mesh (Visible in Thermal Vision)
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xef4444, // 38°C glowing red
    });
    const thermalCore = new THREE.Mesh(new THREE.SphereGeometry(0.85, 16, 16), coreMat);
    thermalCore.position.set(0, 0.4, 0);
    thermalCore.visible = false;
    goatGroup.add(thermalCore);

    // Goat Head & Neck
    const neckGeo = new THREE.CylinderGeometry(0.35, 0.45, 0.9, 16);
    const neckMesh = new THREE.Mesh(neckGeo, bodyMat);
    neckMesh.position.set(1.1, 0.9, 0);
    neckMesh.rotation.z = -0.6;
    goatGroup.add(neckMesh);

    const headGeo = new THREE.BoxGeometry(0.8, 0.6, 0.55);
    const headMesh = new THREE.Mesh(headGeo, bodyMat);
    headMesh.position.set(1.6, 1.3, 0);
    goatGroup.add(headMesh);

    // Curved Himalayan Horns
    const hornMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.4 });
    const hornCurveL = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.4, 1.6, 0.15),
      new THREE.Vector3(1.1, 2.2, 0.3),
      new THREE.Vector3(0.6, 2.4, 0.35),
    ]);
    const hornGeoL = new THREE.TubeGeometry(hornCurveL, 16, 0.08, 8, false);
    const hornL = new THREE.Mesh(hornGeoL, hornMat);
    goatGroup.add(hornL);

    const hornCurveR = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.4, 1.6, -0.15),
      new THREE.Vector3(1.1, 2.2, -0.3),
      new THREE.Vector3(0.6, 2.4, -0.35),
    ]);
    const hornGeoR = new THREE.TubeGeometry(hornCurveR, 16, 0.08, 8, false);
    const hornR = new THREE.Mesh(hornGeoR, hornMat);
    goatGroup.add(hornR);

    // 4 Sturdy Legs
    const legGeo = new THREE.CylinderGeometry(0.12, 0.1, 1.5, 16);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.7 });

    const legPositions = [
      [-0.7, -0.7, 0.4],
      [-0.7, -0.7, -0.4],
      [0.7, -0.7, 0.4],
      [0.7, -0.7, -0.4],
    ];
    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(lx, ly, lz);
      goatGroup.add(leg);
    });

    // 6. Subzero Blizzard Snow Particles
    const snowCount = 120;
    const snowGeo = new THREE.BufferGeometry();
    const snowPositions = new Float32Array(snowCount * 3);
    const snowVels: THREE.Vector3[] = [];

    for (let i = 0; i < snowCount; i++) {
      snowPositions[i * 3] = (Math.random() - 0.5) * 18;
      snowPositions[i * 3 + 1] = Math.random() * 8;
      snowPositions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      snowVels.push(
        new THREE.Vector3(
          -2.0 - Math.random() * 3.0,
          -1.5 - Math.random() * 2.0,
          (Math.random() - 0.5) * 1.5
        )
      );
    }
    snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));
    const snowMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.14,
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
      const { temperature: temp, isThermalVision: thermal } = stateRef.current;

      // Calculate Fleece Expansion Ratio (Grows thicker at -40°C)
      const coldRatio = Math.max(0, (10 - temp) / 50); // 0 (at +10°C) to 1.0 (at -40°C)
      const fleeceScale = 1.0 + coldRatio * 0.45;
      fleeceMesh.scale.set(fleeceScale, fleeceScale, fleeceScale);

      // Handle Thermal Heat-Map Mode
      if (thermal) {
        scene.background.setHex(0x030712);
        fleeceMat.color.setHex(0x1e3a8a); // Icy blue outer fleece blocking heat
        bodyMat.color.setHex(0xf97316); // Warm orange skin
        thermalCore.visible = true;
        snowMat.opacity = 0.2;
      } else {
        scene.background.setHex(temp <= -20 ? 0x0f172a : 0x0284c7);
        fleeceMat.color.setHex(0xffffff);
        bodyMat.color.setHex(0xf8fafc);
        thermalCore.visible = false;
        snowMat.opacity = temp <= -10 ? 0.85 : 0.2;
      }

      // Animate Snow Falling
      const posAttr = snowGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < snowCount; i++) {
        let x = posAttr.getX(i) + snowVels[i].x * delta;
        let y = posAttr.getY(i) + snowVels[i].y * delta;
        let z = posAttr.getZ(i) + snowVels[i].z * delta;

        if (y < -1.5 || x < -9) {
          y = 7.0;
          x = 9.0;
          z = (Math.random() - 0.5) * 12;
        }
        posAttr.setXYZ(i, x, y, z);
      }
      posAttr.needsUpdate = true;

      // Gentle Goat Idling Animation
      goatGroup.rotation.y = Math.sin(time * 0.6) * 0.08;
      headMesh.rotation.x = Math.sin(time * 1.5) * 0.05;

      // Camera Orbit Sway
      camera.position.x = Math.sin(time * 0.2) * 0.4;
      camera.lookAt(0, 0.4, 0);

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
    <div className="w-full max-w-4xl bg-white p-5 sm:p-7 rounded-[36px] border-4 border-sky-400 shadow-2xl flex flex-col items-center select-none font-sans text-slate-900">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full mb-4 border-b-2 border-slate-100 pb-3">
        <div className="text-center sm:text-left">
          <span className="text-xs font-black uppercase text-sky-800 bg-sky-100 px-3 py-1 rounded-full border border-sky-300 inline-block mb-1">
            🏔️ 3D Ladakh Changthang Thermal Physics Lab
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
            5,000m Pashmina Goat Biological Adaptation
          </h3>
        </div>

        {/* Live HUD Badges */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleThermal}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black border cursor-pointer transition-all flex items-center gap-1.5 shadow-sm ${
              isThermalVision
                ? 'bg-rose-500 text-white border-rose-600 shadow-md ring-2 ring-rose-300'
                : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>{isThermalVision ? '🔥 Thermal Heat-Map ON' : 'Thermal Vision'}</span>
          </button>

          <span className="text-xs font-black px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-950 border border-sky-300 shadow-sm">
            ❄️ {temperatureCelsius}°C
          </span>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div className="w-full h-72 sm:h-84 rounded-3xl overflow-hidden shadow-inner border-3 border-slate-800 relative bg-slate-950 flex items-center justify-center mb-4">
        <div ref={mountRef} className="w-full h-full" />

        {/* Live HUD Badges */}
        <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-2 shadow-sm">
          <span>{temperatureCelsius <= -20 ? '❄️ Himalayan Winter Blizzard (-40°C)' : '☀️ High-Altitude Summer (+10°C)'}</span>
        </div>

        {/* Bottom Banner */}
        <div className="absolute bottom-3 bg-slate-950/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-700 text-xs font-bold text-white shadow-md">
          {isThermalVision
            ? '🔥 38°C core body heat is 100% trapped inside Pashmina air pockets!'
            : temperatureCelsius <= -30
            ? '❄️ Sub-zero freeze! Goat grew maximum cashmere undercoat to trap body heat!'
            : 'Slide the temperature control to simulate winter freezing blizzards!'}
        </div>
      </div>

      {/* Interactive Temperature Slider */}
      <div className="w-full flex flex-col gap-3">
        <div className="w-full flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border-2 border-slate-200">
          <span className="text-xs font-black text-slate-700 shrink-0 flex items-center gap-1">
            <Thermometer className="w-4 h-4 text-sky-500" />
            <span>Plateau Temp:</span>
          </span>
          <input
            type="range"
            min="-40"
            max="10"
            step="5"
            value={temperatureCelsius}
            onChange={(e) => handleTempChange(parseInt(e.target.value, 10))}
            className="w-full accent-sky-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-black text-slate-900 w-16 text-right">{temperatureCelsius}°C</span>
        </div>

        {/* Key Takeaway */}
        <div className="text-xs font-bold text-slate-700 bg-sky-50 p-3.5 rounded-2xl border border-sky-200 text-center sm:text-left">
          💡 <strong>5th Grade Science Secret:</strong> In Ladakh's -40°C winter, Pashmina goats grow hair <strong>6 times thinner than human hair</strong> (12 microns). Millions of crimped fibers trap dead air pockets, making <strong>1 Pashmina shawl as warm as 6 thick sweaters!</strong>
        </div>
      </div>
    </div>
  );
};
