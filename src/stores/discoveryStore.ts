import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DiscoveryEntry } from '@/types';

interface DiscoveryState {
  discoveries: DiscoveryEntry[];
  
  addDiscovery: (entry: DiscoveryEntry) => void;
  hasDiscovered: (materialId: string) => boolean;
  getDiscovery: (materialId: string) => DiscoveryEntry | undefined;
  addPropertyToDiscovery: (materialId: string, property: string) => void;
  resetDiscoveries: () => void;
}

export const useDiscoveryStore = create<DiscoveryState>()(
  persist(
    (set, get) => ({
      discoveries: [],

      addDiscovery: (entry: DiscoveryEntry) => {
        const { discoveries } = get();
        if (!discoveries.find(d => d.materialId === entry.materialId)) {
          set({ discoveries: [...discoveries, entry] });
        }
      },

      hasDiscovered: (materialId: string) => {
        return get().discoveries.some(d => d.materialId === materialId);
      },

      getDiscovery: (materialId: string) => {
        return get().discoveries.find(d => d.materialId === materialId);
      },

      addPropertyToDiscovery: (materialId: string, property: string) => {
        const { discoveries } = get();
        set({
          discoveries: discoveries.map(d =>
            d.materialId === materialId && !d.properties.includes(property)
              ? { ...d, properties: [...d.properties, property] }
              : d
          ),
        });
      },

      resetDiscoveries: () => set({ discoveries: [] }),
    }),
    { name: 'polyquest-discoveries' }
  )
);
