import { create } from 'zustand';
import { SystemBlock, C4Model, ContainerBlock, ComponentBlock } from '../types/c4';

interface C4State {
  model: C4Model;
  // System operations
  addSystem: (system: Omit<SystemBlock, 'id' | 'containers'>) => void;
  updateSystem: (id: string, data: Partial<SystemBlock>) => void;
  removeSystem: (id: string) => void;
  connectSystems: (fromId: string, toId: string) => void;
  // Container operations
  addContainer: (systemId: string, container: Omit<ContainerBlock, 'id' | 'systemId' | 'components'>) => void;
  updateContainer: (systemId: string, containerId: string, data: Partial<ContainerBlock>) => void;
  removeContainer: (systemId: string, containerId: string) => void;
  connectContainers: (systemId: string, fromId: string, toId: string) => void;
  // Component operations
  addComponent: (systemId: string, containerId: string, component: Omit<ComponentBlock, 'id' | 'systemId' | 'containerId'>) => void;
  updateComponent: (systemId: string, containerId: string, componentId: string, data: Partial<ComponentBlock>) => void;
  removeComponent: (systemId: string, containerId: string, componentId: string) => void;
  connectComponents: (systemId: string, containerId: string, fromId: string, toId: string) => void;
  // Navigation
  setActiveSystem: (systemId: string | undefined) => void;
  setActiveContainer: (containerId: string | undefined) => void;
  setViewLevel: (level: 'system' | 'container' | 'component') => void;
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
  
  // Component operations
  addComponent: (systemId, containerId, component) =>
    set((state) => {
      const updatedSystems = state.model.systems.map(system => {
        if (system.id === systemId) {
          return {
            ...system,
            containers: (system.containers || []).map(container => {
              if (container.id === containerId) {
                const components = container.components || [];
                return {
                  ...container,
                  components: [
                    ...components,
                    { 
                      ...component, 
                      id: crypto.randomUUID(), 
                      systemId, 
                      containerId, 
                      connections: [] 
                    }
                  ]
                };
              }
              return container;
            })
          };
        }
        return system;
      });
      
      return { model: { ...state.model, systems: updatedSystems } };
    }),
  
  updateComponent: (systemId, containerId, componentId, data) =>
    set((state) => {
      const updatedSystems = state.model.systems.map(system => {
        if (system.id === systemId) {
          return {
            ...system,
            containers: (system.containers || []).map(container => {
              if (container.id === containerId && container.components) {
                return {
                  ...container,
                  components: container.components.map(component =>
                    component.id === componentId ? { ...component, ...data } : component
                  )
                };
              }
              return container;
            })
          };
        }
        return system;
      });
      
      return { model: { ...state.model, systems: updatedSystems } };
    }),
    
  removeComponent: (systemId, containerId, componentId) =>
    set((state) => {
      const updatedSystems = state.model.systems.map(system => {
        if (system.id === systemId) {
          return {
            ...system,
            containers: (system.containers || []).map(container => {
              if (container.id === containerId && container.components) {
                return {
                  ...container,
                  components: container.components.filter(component => component.id !== componentId)
                };
              }
              return container;
            })
          };
        }
        return system;
      });
      
      return { model: { ...state.model, systems: updatedSystems } };
    }),
    
  connectComponents: (systemId, containerId, fromId, toId) =>
    set((state) => {
      const updatedSystems = state.model.systems.map(system => {
        if (system.id === systemId) {
          return {
            ...system,
            containers: (system.containers || []).map(container => {
              if (container.id === containerId && container.components) {
                return {
                  ...container,
                  components: container.components.map(component =>
                    component.id === fromId && !component.connections.includes(toId)
                      ? { ...component, connections: [...component.connections, toId] }
                      : component
                  )
                };
              }
              return container;
            })
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
        // Switch to container view if selecting a system and clear active container
        viewLevel: systemId ? 'container' : 'system',
        activeContainerId: undefined
      }
    })),
    
  setActiveContainer: (containerId) =>
    set((state) => ({
      model: {
        ...state.model,
        activeContainerId: containerId,
        // Switch to component view if selecting a container
        viewLevel: containerId ? 'component' : 'container'
      }
    })),
    
  setViewLevel: (level) =>
    set((state) => {
      const newState = {
        ...state.model,
        viewLevel: level
      };
      
      // Clear navigation state based on level
      if (level === 'system') {
        newState.activeSystemId = undefined;
        newState.activeContainerId = undefined;
      } else if (level === 'container') {
        newState.activeContainerId = undefined;
      }
      
      return { model: newState };
    }),
  
  // Model operations
  setModel: (model) => set(() => ({ model })),
}));
