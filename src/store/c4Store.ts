import { create } from 'zustand';
import { SystemBlock, C4Model, ContainerBlock } from '../types/c4';

interface C4State {
  model: C4Model;
  // System operations
  addSystem: (system: Omit<SystemBlock, 'id' | 'containers'>) => void;
  updateSystem: (id: string, data: Partial<SystemBlock>) => void;
  removeSystem: (id: string) => void;
  connectSystems: (fromId: string, toId: string) => void;
  // Container operations
  addContainer: (systemId: string, container: Omit<ContainerBlock, 'id' | 'systemId'>) => void;
  updateContainer: (systemId: string, containerId: string, data: Partial<ContainerBlock>) => void;
  removeContainer: (systemId: string, containerId: string) => void;
  connectContainers: (systemId: string, fromId: string, toId: string) => void;
  // Navigation
  setActiveSystem: (systemId: string | undefined) => void;
  setViewLevel: (level: 'system' | 'container') => void;
  // Model operations
  setModel: (model: C4Model) => void;
}

export const useC4Store = create<C4State>((set) => ({
  model: { systems: [], viewLevel: 'system' },
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
  // New container operations
  addContainer: (systemId, container) =>
    set((state) => {
      const updatedSystems = state.model.systems.map(system => {
        if (system.id === systemId) {
          const containers = system.containers || [];
          return {
            ...system,
            containers: [
              ...containers,
              { ...container, id: crypto.randomUUID(), systemId, connections: [] }
            ]
          };
        }
        return system;
      });
      
      return { model: { ...state.model, systems: updatedSystems } };
    }),
    
  updateContainer: (systemId, containerId, data) =>
    set((state) => {
      const updatedSystems = state.model.systems.map(system => {
        if (system.id === systemId && system.containers) {
          return {
            ...system,
            containers: system.containers.map(container =>
              container.id === containerId ? { ...container, ...data } : container
            )
          };
        }
        return system;
      });
      
      return { model: { ...state.model, systems: updatedSystems } };
    }),
    
  removeContainer: (systemId, containerId) =>
    set((state) => {
      const updatedSystems = state.model.systems.map(system => {
        if (system.id === systemId && system.containers) {
          return {
            ...system,
            containers: system.containers.filter(container => container.id !== containerId)
          };
        }
        return system;
      });
      
      return { model: { ...state.model, systems: updatedSystems } };
    }),
    
  connectContainers: (systemId, fromId, toId) =>
    set((state) => {
      const updatedSystems = state.model.systems.map(system => {
        if (system.id === systemId && system.containers) {
          return {
            ...system,
            containers: system.containers.map(container =>
              container.id === fromId && !container.connections.includes(toId)
                ? { ...container, connections: [...container.connections, toId] }
                : container
            )
          };
        }
        return system;
      });
      
      return { model: { ...state.model, systems: updatedSystems } };
    }),
  
  // Navigation operations
  setActiveSystem: (systemId) =>
    set((state) => ({
      model: {
        ...state.model,
        activeSystemId: systemId,
        // Switch to container view if selecting a system
        viewLevel: systemId ? 'container' : 'system'
      }
    })),
    
  setViewLevel: (level) =>
    set((state) => ({
      model: {
        ...state.model,
        viewLevel: level,
        // Clear active system when going back to system view
        activeSystemId: level === 'system' ? undefined : state.model.activeSystemId
      }
    })),
  
  // Model operations
  setModel: (model) => set(() => ({ model })),
}));
