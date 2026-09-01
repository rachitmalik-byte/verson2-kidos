import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sounds } from '@/lib/sounds';
import { Flame, RotateCcw, Sparkles } from 'lucide-react';

type MoleculeType = 'nylon' | 'cotton' | 'bakelite' | 'water';

interface AtomData {
  element: 'C' | 'H' | 'O' | 'N';
  position: [number, number, number];
  name: string;
}

interface BondData {
  from: number;
  to: number;
}

const MOLECULES: Record<MoleculeType, { name: string; subtitle: string; desc: string; atoms: AtomData[]; bonds: BondData[] }> = {
  nylon: {
    name: 'Synthetic Nylon-6,6 Polymer Chain',
    subtitle: 'Amide Linkage with High Tensile Backbone',
    desc: 'Linear repeating polymer chains that align tightly to give climbing ropes extreme tensile strength.',
    atoms: [
      { element: 'C', position: [-4, 0, 0], name: 'Carbon Backbone' },
      { element: 'C', position: [-2.5, 1, 0], name: 'Carbon Backbone' },
      { element: 'O', position: [-2.5, 2.3, 0], name: 'Carbonyl Oxygen (Polar)' },
      { element: 'N', position: [-1, 0, 0], name: 'Amide Nitrogen' },
      { element: 'H', position: [-1, -1.2, 0], name: 'Hydrogen Bond Donor' },
      { element: 'C', position: [0.5, 1, 0], name: 'Carbon Backbone' },
      { element: 'C', position: [2, 0, 0], name: 'Carbon Backbone' },
      { element: 'C', position: [3.5, 1, 0], name: 'Carbon Backbone' },
      { element: 'N', position: [5, 0, 0], name: 'Amide Nitrogen' },
    ],
    bonds: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 3, to: 4 },
      { from: 3, to: 5 },
      { from: 5, to: 6 },
      { from: 6, to: 7 },
      { from: 7, to: 8 },
    ],
  },
  cotton: {
    name: 'Natural Cellulose (Cotton) Chain',
    subtitle: 'Glucose Rings with Hydrogen-Bonding Pores',
    desc: 'Natural glucose rings linked by beta-1,4 glycosidic bonds with hollow capillary pores that soak up water.',
    atoms: [
      { element: 'C', position: [-3.5, -0.5, 0], name: 'Glucose Ring Carbon' },
      { element: 'C', position: [-2.5, 0.8, 0], name: 'Glucose Ring Carbon' },
      { element: 'O', position: [-1.2, 1.2, 0], name: 'Ring Oxygen' },
      { element: 'C', position: [-0.2, 0.5, 0], name: 'Glucose Ring Carbon' },
      { element: 'C', position: [-0.5, -0.8, 0], name: 'Glucose Ring Carbon' },
      { element: 'C', position: [-2, -1.2, 0], name: 'Glucose Ring Carbon' },
      { element: 'O', position: [1, 1, 0], name: 'Glycosidic Oxygen Bridge' },
      { element: 'C', position: [2.2, 0.5, 0], name: 'Next Glucose Ring Carbon' },
      { element: 'C', position: [3.2, 1.5, 0], name: 'Next Glucose Ring Carbon' },
      { element: 'O', position: [4.4, 1.2, 0], name: 'Hydroxyl (-OH) Hydrophilic Group' },
    ],
    bonds: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 0 },
      { from: 3, to: 6 },
      { from: 6, to: 7 },
      { from: 7, to: 8 },
      { from: 8, to: 9 },
    ],
  },
  bakelite: {
    name: '3D Cross-Linked Bakelite Thermoset',
    subtitle: 'Rigid Phenol-Formaldehyde 3D Matrix',
    desc: 'Permanent covalent cross-links lock molecules into an un-meltable rigid network for heat-proof handles.',
    atoms: [
      { element: 'C', position: [-2, -1.5, -1], name: 'Phenolic Ring' },
      { element: 'C', position: [0, -1.5, 0], name: 'Phenolic Ring' },
      { element: 'C', position: [2, -1.5, 1], name: 'Phenolic Ring' },
      { element: 'C', position: [-1, 0.5, -0.5], name: 'Methylene Cross-Link Bridge' },
      { element: 'C', position: [1, 0.5, 0.5], name: 'Methylene Cross-Link Bridge' },
      { element: 'C', position: [-2, 2.5, -1], name: 'Upper Phenolic Ring' },
      { element: 'C', position: [0, 2.5, 0], name: 'Upper Phenolic Ring' },
      { element: 'C', position: [2, 2.5, 1], name: 'Upper Phenolic Ring' },
      { element: 'O', position: [0, 3.8, 0], name: 'Hydroxyl Group' },
    ],
    bonds: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 0, to: 3 },
      { from: 1, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 4 },
      { from: 3, to: 5 },
      { from: 3, to: 6 },
      { from: 4, to: 6 },
      { from: 4, to: 7 },
      { from: 5, to: 6 },
      { from: 6, to: 7 },
      { from: 6, to: 8 },
    ],
  },
  water: {
    name: 'Water Dipole Molecule (H2O)',
    subtitle: 'Polar Hydrogen Bonds & Surface Tension',
    desc: 'The 104.5 degree bent geometry creates positive and negative poles, allowing water molecules to stick to each other and bead up.',
    atoms: [
      { element: 'O', position: [0, 0.6, 0], name: 'Oxygen Atom (Electronegative)' },
      { element: 'H', position: [-1.8, -1, 0], name: 'Hydrogen Atom (Positive)' },
      { element: 'H', position: [1.8, -1, 0], name: 'Hydrogen Atom (Positive)' },
    ],
    bonds: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
    ],
  },
};

const ATOM_COLORS = {
  C: 0x334155,
  H: 0xf8fafc,
  O: 0xef4444,
  N: 0x3b82f6,
};

const ATOM_SIZES = {
  C: 0.55,
  H: 0.35,
  O: 0.5,
  N: 0.52,
};

export const ThreeMoleculeLab: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedMolecule, setSelectedMolecule] = useState<MoleculeType>('nylon');
  const [heatLevel, setHeatLevel] = useState(1);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090d16);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfffbeb, 2.0);
    dirLight1.position.set(8, 12, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.0);
    dirLight2.position.set(-8, -6, -5);
    scene.add(dirLight2);

    const molGroup = new THREE.Group();
    scene.add(molGroup);

    const molData = MOLECULES[selectedMolecule];
    const atomMeshes: { mesh: THREE.Mesh; basePos: THREE.Vector3; name: string }[] = [];

    molData.atoms.forEach((atom) => {
      const radius = ATOM_SIZES[atom.element] || 0.45;
      const geo = new THREE.SphereGeometry(radius, 32, 32);
      const mat = new THREE.MeshStandardMaterial({
        color: ATOM_COLORS[atom.element] || 0xcccccc,
        roughness: 0.25,
        metalness: 0.1,
      });
      const mesh = new THREE.Mesh(geo, mat);
      const basePos = new THREE.Vector3(...atom.position);
      mesh.position.copy(basePos);
      molGroup.add(mesh);
      atomMeshes.push({ mesh, basePos, name: `${atom.element} - ${atom.name}` });
    });

    const bondMeshes: { mesh: THREE.Mesh; fromIdx: number; toIdx: number }[] = [];
    const bondMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.4,
      metalness: 0.2,
    });

    molData.bonds.forEach((bond) => {
      const p1 = new THREE.Vector3(...molData.atoms[bond.from].position);
      const p2 = new THREE.Vector3(...molData.atoms[bond.to].position);
      const distance = p1.distanceTo(p2);

      const bondGeo = new THREE.CylinderGeometry(0.12, 0.12, distance, 16);
      const bondMesh = new THREE.Mesh(bondGeo, bondMat);

      const midpoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      bondMesh.position.copy(midpoint);
      bondMesh.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3().subVectors(p2, p1).normalize()
      );

      molGroup.add(bondMesh);
      bondMeshes.push({ mesh: bondMesh, fromIdx: bond.from, toIdx: bond.to });
    });

    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      molGroup.rotation.y += deltaX * 0.008;
      molGroup.rotation.x += deltaY * 0.008;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (autoRotate && !isDragging) {
        molGroup.rotation.y += 0.005;
      }

      const vibrationAmp = (heatLevel - 1) * 0.05;
      atomMeshes.forEach((item, idx) => {
        item.mesh.position.x = item.basePos.x + Math.sin(elapsedTime * 15 + idx) * vibrationAmp;
        item.mesh.position.y = item.basePos.y + Math.cos(elapsedTime * 18 + idx * 2) * vibrationAmp;
        item.mesh.position.z = item.basePos.z + Math.sin(elapsedTime * 12 + idx * 3) * vibrationAmp;
      });

      bondMeshes.forEach((b) => {
        const p1 = atomMeshes[b.fromIdx].mesh.position;
        const p2 = atomMeshes[b.toIdx].mesh.position;
        const midpoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        b.mesh.position.copy(midpoint);
        b.mesh.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3().subVectors(p2, p1).normalize()
        );
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      renderer.dispose();
    };
  }, [selectedMolecule, heatLevel, autoRotate]);

  return (
    <div className="w-full bg-slate-950 text-white rounded-3xl border-2 border-indigo-500/40 p-4 sm:p-6 shadow-2xl flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
              Interactive 3D Three.js Lab
            </span>
            <span className="text-xs font-bold text-slate-400">Drag to rotate 360 degrees</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white mt-1">
            {MOLECULES[selectedMolecule].name}
          </h3>
          <p className="text-xs text-slate-400">
            {MOLECULES[selectedMolecule].desc}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-800">
          {(Object.keys(MOLECULES) as MoleculeType[]).map((mKey) => (
            <button
              key={mKey}
              onClick={() => {
                sounds.pop();
                setSelectedMolecule(mKey);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black capitalize transition-all cursor-pointer ${
                selectedMolecule === mKey
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {mKey}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={mountRef}
        className="w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing relative bg-radial from-slate-900 to-slate-950 border border-slate-800/80 shadow-inner"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div className="flex items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-3">
          <div className="flex items-center gap-2">
            <Flame className={`w-4 h-4 ${heatLevel > 2 ? 'text-rose-500 animate-pulse' : 'text-amber-400'}`} />
            <div>
              <span className="text-xs font-black text-white block">Thermal Vibration</span>
              <span className="text-[10px] text-slate-400">
                {heatLevel === 1 ? 'Cold Solid (20 C)' : heatLevel === 2 ? 'Warm (80 C)' : 'High Heat (250 C)'}
              </span>
            </div>
          </div>
          <input
            type="range"
            min="1"
            max="3"
            step="1"
            value={heatLevel}
            onChange={(e) => setHeatLevel(Number(e.target.value))}
            className="accent-amber-400 cursor-pointer w-28"
          />
        </div>

        <div className="flex items-center justify-around bg-slate-900/90 border border-slate-800 rounded-2xl p-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <span className="w-3 h-3 rounded-full bg-slate-600 inline-block" />
            <span>Carbon (C)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
            <span>Oxygen (O)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
            <span>Nitrogen (N)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <span className="w-3 h-3 rounded-full bg-white border border-slate-400 inline-block" />
            <span>Hydrogen (H)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
