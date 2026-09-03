import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Props {
  className?: string;
  enableButterfly?: boolean;
}

export const SylvaLivingGreenCanvas: React.FC<Props> = ({
  className = '',
  enableButterfly = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Three.js Scene Setup ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 42);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // ── Procedural Glow Sprite for Pollen Particles ──
    const createPollenTexture = () => {
      const size = 64;
      const offscreen = document.createElement('canvas');
      offscreen.width = size;
      offscreen.height = size;
      const ctx = offscreen.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(110, 231, 183, 0.9)');
        gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.5)');
        gradient.addColorStop(0.8, 'rgba(5, 150, 105, 0.15)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
      }
      return new THREE.CanvasTexture(offscreen);
    };

    const pollenTexture = createPollenTexture();

    // ── 400+ Bioluminescent Pollen & Forest Spores ──
    const particleCount = 420;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const basePositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);

    const palette = [
      new THREE.Color('#34D399'), // Emerald
      new THREE.Color('#6EE7B7'), // Light mint
      new THREE.Color('#10B981'), // Deep forest emerald
      new THREE.Color('#FDE047'), // Golden pollen
      new THREE.Color('#A7F3D0'), // Pale bio-luminescence
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const x = (Math.random() - 0.5) * 70;
      const y = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 35;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      basePositions[i3] = x;
      basePositions[i3 + 1] = y;
      basePositions[i3 + 2] = z;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i3] = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;

      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.4 + Math.random() * 0.8;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 1.6,
      map: pollenTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      depthWrite: false,
      opacity: 0.85,
    });

    const particleSystem = new THREE.Points(geometry, particlesMaterial);
    scene.add(particleSystem);

    // ── Animated 3D Butterfly ──
    const butterflyGroup = new THREE.Group();
    let leftWing: THREE.Mesh | null = null;
    let rightWing: THREE.Mesh | null = null;

    if (enableButterfly) {
      // Body
      const bodyGeo = new THREE.CylinderGeometry(0.12, 0.08, 1.4, 12);
      const bodyMat = new THREE.MeshBasicMaterial({ color: 0x06150b });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.rotation.x = Math.PI / 2;
      butterflyGroup.add(body);

      // Wing Texture (Emerald & Gold Veins)
      const createWingTexture = (isRight: boolean) => {
        const w = 128;
        const h = 128;
        const cv = document.createElement('canvas');
        cv.width = w;
        cv.height = h;
        const ctx = cv.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#061a11';
          ctx.fillRect(0, 0, w, h);

          const grad = ctx.createRadialGradient(
            isRight ? 20 : 108,
            64,
            10,
            64,
            64,
            70
          );
          grad.addColorStop(0, '#6ee7b7');
          grad.addColorStop(0.35, '#10b981');
          grad.addColorStop(0.75, '#047857');
          grad.addColorStop(1, '#022312');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.ellipse(64, 64, 56, 50, 0, 0, Math.PI * 2);
          ctx.fill();

          // Delicate Golden Spots
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(isRight ? 96 : 32, 40, 6, 0, Math.PI * 2);
          ctx.arc(isRight ? 85 : 43, 78, 5, 0, Math.PI * 2);
          ctx.fill();
        }
        return new THREE.CanvasTexture(cv);
      };

      // Wing Shape
      const wingShape = new THREE.Shape();
      wingShape.moveTo(0, 0);
      wingShape.bezierCurveTo(0.6, 1.2, 1.8, 1.4, 2.2, 0.4);
      wingShape.bezierCurveTo(2.4, -0.4, 1.5, -1.2, 0.8, -1.4);
      wingShape.bezierCurveTo(0.2, -1.2, 0, -0.4, 0, 0);

      const wingGeo = new THREE.ShapeGeometry(wingShape);
      wingGeo.center();

      const leftWingMat = new THREE.MeshBasicMaterial({
        map: createWingTexture(false),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.92,
      });

      const rightWingMat = new THREE.MeshBasicMaterial({
        map: createWingTexture(true),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.92,
      });

      // Left Wing Anchor
      const leftAnchor = new THREE.Group();
      leftAnchor.position.set(-0.1, 0, 0);
      leftWing = new THREE.Mesh(wingGeo, leftWingMat);
      leftWing.position.set(-1.1, 0, 0);
      leftWing.scale.set(0.9, 0.9, 0.9);
      leftAnchor.add(leftWing);

      // Right Wing Anchor
      const rightAnchor = new THREE.Group();
      rightAnchor.position.set(0.1, 0, 0);
      rightWing = new THREE.Mesh(wingGeo, rightWingMat);
      rightWing.position.set(1.1, 0, 0);
      rightWing.scale.set(0.9, 0.9, 0.9);
      rightWing.rotation.y = Math.PI;
      rightAnchor.add(rightWing);

      butterflyGroup.add(leftAnchor);
      butterflyGroup.add(rightAnchor);

      // Scale & initial position
      butterflyGroup.scale.set(1.4, 1.4, 1.4);
      butterflyGroup.position.set(-15, 6, 10);
      scene.add(butterflyGroup);
    }

    // ── Atmospheric Volumetric Canopy Light Beam ──
    const beamGeo = new THREE.PlaneGeometry(18, 90);
    const beamCanvas = document.createElement('canvas');
    beamCanvas.width = 128;
    beamCanvas.height = 256;
    const bCtx = beamCanvas.getContext('2d');
    if (bCtx) {
      const bGrad = bCtx.createLinearGradient(0, 0, 128, 256);
      bGrad.addColorStop(0, 'rgba(52, 211, 153, 0.12)');
      bGrad.addColorStop(0.4, 'rgba(16, 185, 129, 0.05)');
      bGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      bCtx.fillStyle = bGrad;
      bCtx.fillRect(0, 0, 128, 256);
    }
    const beamTex = new THREE.CanvasTexture(beamCanvas);
    const beamMat = new THREE.MeshBasicMaterial({
      map: beamTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const lightBeam = new THREE.Mesh(beamGeo, beamMat);
    lightBeam.position.set(-14, 12, -8);
    lightBeam.rotation.z = -Math.PI / 4.5;
    scene.add(lightBeam);

    // ── Mouse & Pointer Interaction ──
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 50;
      mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 35;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // ── Resize Listener ──
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // ── Animation Loop ──
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Particle Drift & Mouse Proximity Deflection
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const phase = phases[i];
        const spd = speeds[i];

        // Natural organic drift
        const bx = basePositions[i3];
        const by = basePositions[i3 + 1];
        const bz = basePositions[i3 + 2];

        let targetX = bx + Math.sin(time * spd * 0.6 + phase) * 3.5;
        let targetY = by + Math.cos(time * spd * 0.5 + phase) * 3.0;
        let targetZ = bz + Math.sin(time * 0.4 + phase) * 2.0;

        // Repel from cursor position
        const dx = targetX - mouse.x;
        const dy = targetY - mouse.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < 120) {
          const dist = Math.sqrt(distSq) || 1;
          const force = (1 - dist / 11) * 6;
          targetX += (dx / dist) * force;
          targetY += (dy / dist) * force;
        }

        posArray[i3] = targetX;
        posArray[i3 + 1] = targetY;
        posArray[i3 + 2] = targetZ;
      }
      posAttr.needsUpdate = true;

      // Subtle light beam breath
      lightBeam.material.opacity = 0.6 + Math.sin(time * 0.8) * 0.2;

      // ── Butterfly Flight Simulation ──
      if (enableButterfly && leftWing && rightWing) {
        // Wing Flapping Kinematics
        const flapFrequency = 18;
        const flapAngle = Math.sin(time * flapFrequency) * 0.8;
        leftWing.parent!.rotation.y = flapAngle;
        rightWing.parent!.rotation.y = -flapAngle;

        // Smooth 3D Lissajous Flight Path
        const bT = time * 0.38;
        const nextX = Math.sin(bT) * 20 + Math.sin(bT * 2.3) * 5;
        const nextY = Math.cos(bT * 0.8) * 11 + Math.sin(bT * 1.7) * 3 + 2;
        const nextZ = Math.sin(bT * 1.2) * 8 + 6;

        // Compute velocity for orientation/banking
        const vx = nextX - butterflyGroup.position.x;
        const vy = nextY - butterflyGroup.position.y;
        const vz = nextZ - butterflyGroup.position.z;

        butterflyGroup.position.set(nextX, nextY, nextZ);

        // Turn towards movement
        if (Math.abs(vx) > 0.001 || Math.abs(vy) > 0.001) {
          const targetHeading = Math.atan2(vy, vx) - Math.PI / 2;
          butterflyGroup.rotation.z += (targetHeading - butterflyGroup.rotation.z) * 0.08;
          butterflyGroup.rotation.x = Math.PI / 2 - vz * 0.15;
          butterflyGroup.rotation.y = -vx * 0.2; // Bank into turns
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      geometry.dispose();
      particlesMaterial.dispose();
      pollenTexture.dispose();
      beamGeo.dispose();
      beamMat.dispose();
      beamTex.dispose();
      renderer.dispose();
    };
  }, [enableButterfly]);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
      {/* Deep Obsidian-Moss Sylva Radial Ambient Canopy */}
      <div className="absolute inset-0 bg-[#050806] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.18),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_80%,rgba(5,150,105,0.1),transparent_65%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_60%,rgba(52,211,153,0.06),transparent_50%)] pointer-events-none" />

      {/* WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none"
      />
    </div>
  );
};
