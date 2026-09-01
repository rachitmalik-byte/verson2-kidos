import * as THREE from 'three';

export interface VoxelBlock {
  x: number;
  y: number;
  z: number;
  color?: string | number;
  roughness?: number;
  transparent?: boolean;
  opacity?: number;
}

export function createVoxelMesh(voxels: VoxelBlock[], blockSize: number = 1): THREE.Group {
  const group = new THREE.Group();
  if (!voxels || voxels.length === 0) return group;

  try {
    const materialGroups: Record<string, { color: number; transparent: boolean; opacity: number; instances: THREE.Matrix4[] }> = {};

    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3(blockSize * 0.96, blockSize * 0.96, blockSize * 0.96);

    voxels.forEach((v) => {
      let hexColor = 0x888888;
      if (typeof v.color === 'string') {
        hexColor = parseInt(v.color.replace('#', '0x'), 16) || 0x888888;
      } else if (typeof v.color === 'number') {
        hexColor = v.color;
      }

      const isTrans = !!v.transparent;
      const op = v.opacity ?? 1.0;
      const key = `${hexColor}_${isTrans}_${op}`;

      if (!materialGroups[key]) {
        materialGroups[key] = {
          color: hexColor,
          transparent: isTrans,
          opacity: op,
          instances: [],
        };
      }

      position.set(v.x * blockSize, v.y * blockSize, v.z * blockSize);
      quaternion.setFromEuler(rotation);
      matrix.compose(position, quaternion, scale);
      materialGroups[key].instances.push(matrix.clone());
    });

    const geometry = new THREE.BoxGeometry(1, 1, 1);

    Object.values(materialGroups).forEach((mg) => {
      const material = new THREE.MeshStandardMaterial({
        color: mg.color,
        roughness: 0.65,
        metalness: 0.1,
        transparent: mg.transparent,
        opacity: mg.opacity,
      });

      const instancedMesh = new THREE.InstancedMesh(geometry, material, mg.instances.length);
      instancedMesh.castShadow = true;
      instancedMesh.receiveShadow = true;

      mg.instances.forEach((mat, idx) => {
        instancedMesh.setMatrixAt(idx, mat);
      });

      instancedMesh.instanceMatrix.needsUpdate = true;
      group.add(instancedMesh);
    });
  } catch (e) {
    console.error('Error creating voxel mesh:', e);
  }

  return group;
}
