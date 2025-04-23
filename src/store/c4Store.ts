import { create } from 'zustand';
import { SystemBlock, C4Model } from '../types/c4';

interface C4State {
  model: C4Model;
  addSystem: (system: Omit<SystemBlock, 'id'>) => void;
  updateSystem: (id: string, data: Partial<SystemBlock>) => void;
  removeSystem: (id: string) => void;
  connectSystems: (fromId: string, toId: string) => void;
  setModel: (model: C4Model) => void;
}

export const useC4Store = create<C4State>((set) => ({
  model: { systems: [] },
  addSystem: (system) =>
    set((state) => ({
      model: {
        ...state.model,
        systems: [
          ...state.model.systems,
          { ...system, id: crypto.randomUUID(), connections: [] },
        ],
      },
    })),
  updateSystem: (id, data) =>
    set((state) => ({
      model: {
        ...state.model,
        systems: state.model.systems.map((s) =>
          s.id === id ? { ...s, ...data } : s
        ),
      },
    })),
  removeSystem: (id) =>
    set((state) => ({
      model: {
        ...state.model,
        systems: state.model.systems.filter((s) => s.id !== id),
      },
    })),
  connectSystems: (fromId, toId) =>
    set((state) => ({
      model: {
        ...state.model,
        systems: state.model.systems.map((s) =>
          s.id === fromId && !s.connections.includes(toId)
            ? { ...s, connections: [...s.connections, toId] }
            : s
        ),
      },
    })),
  setModel: (model) => set(() => ({ model })),
}));
