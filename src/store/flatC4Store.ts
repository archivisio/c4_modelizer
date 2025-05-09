import { ConnectionData } from '@interfaces/connection';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CodeBlock, ComponentBlock, ContainerBlock, SystemBlock, ViewLevel } from '../types/c4';

type C4EntityType = ViewLevel;

export interface FlatSystemBlock extends SystemBlock {
  connections: ConnectionData[];
}

export interface FlatContainerBlock extends Omit<ContainerBlock, 'components'> {
  connections: ConnectionData[];
}

export interface FlatComponentBlock extends Omit<ComponentBlock, 'codeElements'> {
  connections: ConnectionData[];
}

export interface FlatCodeBlock extends CodeBlock {
  connections: ConnectionData[];
}

export interface FlatC4Model {
  systems: FlatSystemBlock[];
  containers: FlatContainerBlock[];
  components: FlatComponentBlock[];
  codeElements: FlatCodeBlock[];
  viewLevel: C4EntityType;
  activeSystemId?: string;
  activeContainerId?: string;
  activeComponentId?: string;
}

interface FlatC4State {
  model: FlatC4Model;

  // Systems functions
  addSystem: (system: Omit<SystemBlock, 'id' | 'containers'>) => void;
  updateSystem: (id: string, data: Partial<SystemBlock>) => void;
  removeSystem: (id: string) => void;
  connectSystems: (fromId: string, connection: ConnectionData) => void;

  // Containers functions
  addContainer: (systemId: string, container: Omit<ContainerBlock, 'id' | 'systemId' | 'components'>) => void;
  updateContainer: (containerId: string, data: Partial<ContainerBlock>) => void;
  removeContainer: (containerId: string) => void;
  connectContainers: (fromId: string, connection: ConnectionData) => void;

  // Components functions
  addComponent: (containerId: string, component: Omit<ComponentBlock, 'id' | 'systemId' | 'containerId' | 'codeElements'>) => void;
  updateComponent: (componentId: string, data: Partial<ComponentBlock>) => void;
  removeComponent: (componentId: string) => void;
  connectComponents: (fromId: string, connection: ConnectionData) => void;

  // Code elements functions
  addCodeElement: (componentId: string, codeElement: Omit<CodeBlock, 'id' | 'systemId' | 'containerId' | 'componentId'>) => void;
  updateCodeElement: (codeElementId: string, data: Partial<CodeBlock>) => void;
  removeCodeElement: (codeElementId: string) => void;
  connectCodeElements: (fromId: string, connection: ConnectionData) => void;

  // Connections functions
  updateConnection: (level: C4EntityType, sourceId: string, targetId: string, data: Partial<ConnectionData>) => void;
  removeConnection: (level: C4EntityType, sourceId: string, targetId: string) => void;

  // Navigation functions
  setActiveSystem: (systemId: string | undefined) => void;
  setActiveContainer: (containerId: string | undefined) => void;
  setActiveComponent: (componentId: string | undefined) => void;
  setViewLevel: (level: C4EntityType) => void;

  // Model functions
  setModel: (model: FlatC4Model) => void;
}

export const useFlatC4Store = create<FlatC4State>()(
  persist(
    (set) => ({
      model: {
        systems: [],
        containers: [],
        components: [],
        codeElements: [],
        viewLevel: 'system'
      },

      // Systèmes
      addSystem: (system) =>
        set((state) => {
          const newSystem = {
            ...system,
            // @ts-expect-error id is not defined in Omit<SystemBlock, 'id' | 'containers'>
            id: system.id || crypto.randomUUID() as string,
            connections: []
          };

          return {
            model: {
              ...state.model,
              systems: [...state.model.systems, newSystem],
            },
          };
        }),

      updateSystem: (id, data) =>
        set((state) => {
          const updateEntities = <T extends { original?: { id: string }, name: string, systemId: string }>(entities: T[]): T[] => entities.map((entity) => {
            if (entity.original?.id === id) {
              const { description, technology, url, name } = data;
              return { 
                ...entity, 
                description, 
                technology, 
                url, 
                name: name ? name : entity.name 
              };
            }
            return { ...entity, systemId: id };
          });

          return {
            model: {
              ...state.model,
              systems: state.model.systems.map((s) =>
                s.id === id ? { ...s, ...data } : s
              ),
              containers: updateEntities(state.model.containers),
              components: updateEntities(state.model.components),
              codeElements: updateEntities(state.model.codeElements),
            },
          }
        }),

      removeSystem: (id) =>
        set((state) => {
          const filteredContainers = state.model.containers.filter(c => c.systemId !== id);
          const filteredComponents = state.model.components.filter(c => !state.model.containers.some(cont => cont.systemId === id && cont.id === c.containerId));
          const filteredCodeElements = state.model.codeElements.filter(c => !state.model.components.some(comp => comp.systemId === id && comp.id === c.componentId));

          const updatedSystemConnections = state.model.systems.map(s => ({
            ...s,
            connections: s.connections.filter(conn => conn.targetId !== id)
          }));

          return {
            model: {
              ...state.model,
              systems: updatedSystemConnections.filter(s => s.id !== id),
              containers: filteredContainers,
              components: filteredComponents,
              codeElements: filteredCodeElements,
            },
          };
        }),

      connectSystems: (fromId, connection) =>
        set((state) => {
          const sourceSystem = state.model.systems.find(s => s.id === fromId);
          if (!sourceSystem) return state;

          const connectionExists = sourceSystem.connections.some(c => c.targetId === connection.targetId);
          if (connectionExists) return state;

          return {
            model: {
              ...state.model,
              systems: state.model.systems.map(s =>
                s.id === fromId
                  ? { ...s, connections: [...s.connections, connection] }
                  : s
              ),
            },
          };
        }),

      // Containers
      addContainer: (systemId, container) =>
        set((state) => {
          const newContainer = {
            ...container,
            // @ts-expect-error id is not defined in Omit<ContainerBlock, 'id' | 'systemId' | 'components'>
            id: container.id || crypto.randomUUID() as string,
            systemId,
            connections: []
          };

          return {
            model: {
              ...state.model,
              containers: [...state.model.containers, newContainer],
            },
          };
        }),

      updateContainer: (containerId, data) =>
        set((state) => ({
          model: {
            ...state.model,
            containers: state.model.containers.map(c =>
              c.id === containerId ? { ...c, ...data } : c
            ),
          },
        })),

      removeContainer: (containerId) =>
        set((state) => {
          const filteredComponents = state.model.components.filter(c => c.containerId !== containerId);
          const filteredCodeElements = state.model.codeElements.filter(c => !state.model.components.some(comp => comp.containerId === containerId && comp.id === c.componentId));

          const updatedContainerConnections = state.model.containers.map(c => ({
            ...c,
            connections: c.connections.filter(conn => conn.targetId !== containerId)
          }));

          return {
            model: {
              ...state.model,
              containers: updatedContainerConnections.filter(c => c.id !== containerId),
              components: filteredComponents,
              codeElements: filteredCodeElements,
            },
          };
        }),

      connectContainers: (fromId, connection) =>
        set((state) => {
          const sourceContainer = state.model.containers.find(c => c.id === fromId);
          if (!sourceContainer) return state;

          const connectionExists = sourceContainer.connections.some(c => c.targetId === connection.targetId);
          if (connectionExists) return state;

          return {
            model: {
              ...state.model,
              containers: state.model.containers.map(c =>
                c.id === fromId
                  ? { ...c, connections: [...c.connections, connection] }
                  : c
              ),
            },
          };
        }),

      // Components
      addComponent: (containerId, component) =>
        set((state) => {
          const container = state.model.containers.find(c => c.id === containerId);
          if (!container) return state;

          const newComponent = {
            ...component,
            // @ts-expect-error id is not defined in Omit<ComponentBlock, 'id' | 'systemId' | 'containerId' | 'codeElements'>
            id: component.id || crypto.randomUUID() as string,
            systemId: container.systemId,
            containerId,
            connections: []
          };

          return {
            model: {
              ...state.model,
              components: [...state.model.components, newComponent],
            },
          };
        }),

      updateComponent: (componentId, data) =>
        set((state) => ({
          model: {
            ...state.model,
            components: state.model.components.map(c =>
              c.id === componentId ? { ...c, ...data } : c
            ),
          },
        })),

      removeComponent: (componentId) =>
        set((state) => {
          const filteredCodeElements = state.model.codeElements.filter(c => c.componentId !== componentId);

          const updatedComponentConnections = state.model.components.map(c => ({
            ...c,
            connections: c.connections.filter(conn => conn.targetId !== componentId)
          }));

          return {
            model: {
              ...state.model,
              components: updatedComponentConnections.filter(c => c.id !== componentId),
              codeElements: filteredCodeElements,
            },
          };
        }),

      connectComponents: (fromId, connection) =>
        set((state) => {
          const sourceComponent = state.model.components.find(c => c.id === fromId);
          if (!sourceComponent) return state;

          const connectionExists = sourceComponent.connections.some(c => c.targetId === connection.targetId);
          if (connectionExists) return state;

          return {
            model: {
              ...state.model,
              components: state.model.components.map(c =>
                c.id === fromId
                  ? { ...c, connections: [...c.connections, connection] }
                  : c
              ),
            },
          };
        }),

      // Code Elements
      addCodeElement: (componentId, codeElement) =>
        set((state) => {
          const component = state.model.components.find(c => c.id === componentId);
          if (!component) return state;

          const newCodeElement = {
            ...codeElement,
            // @ts-expect-error id is not defined in Omit<CodeBlock, 'id' | 'systemId' | 'containerId' | 'componentId'>
            id: codeElement.id || crypto.randomUUID() as string,
            systemId: component.systemId,
            containerId: component.containerId,
            componentId,
            connections: []
          };

          return {
            model: {
              ...state.model,
              codeElements: [...state.model.codeElements, newCodeElement],
            },
          };
        }),

      updateCodeElement: (codeElementId, data) =>
        set((state) => ({
          model: {
            ...state.model,
            codeElements: state.model.codeElements.map(c =>
              c.id === codeElementId ? { ...c, ...data } : c
            ),
          },
        })),

      removeCodeElement: (codeElementId) =>
        set((state) => {
          const updatedCodeElementConnections = state.model.codeElements.map(c => ({
            ...c,
            connections: c.connections.filter(conn => conn.targetId !== codeElementId)
          }));

          return {
            model: {
              ...state.model,
              codeElements: updatedCodeElementConnections.filter(c => c.id !== codeElementId),
            },
          };
        }),

      connectCodeElements: (fromId, connection) =>
        set((state) => {
          const sourceCodeElement = state.model.codeElements.find(c => c.id === fromId);
          if (!sourceCodeElement) return state;

          const connectionExists = sourceCodeElement.connections.some(c => c.targetId === connection.targetId);
          if (connectionExists) return state;

          return {
            model: {
              ...state.model,
              codeElements: state.model.codeElements.map(c =>
                c.id === fromId
                  ? { ...c, connections: [...c.connections, connection] }
                  : c
              ),
            },
          };
        }),

      // Connections
      updateConnection: (level, sourceId, targetId, data) =>
        set((state) => {
          const updatedModel = { ...state.model };

          if (level === 'system') {
            updatedModel.systems = updatedModel.systems.map(s =>
              s.id === sourceId
                ? {
                  ...s,
                  connections: s.connections.map(conn =>
                    conn.targetId === targetId ? { ...conn, ...data } : conn
                  )
                }
                : s
            );
          } else if (level === 'container') {
            updatedModel.containers = updatedModel.containers.map(c =>
              c.id === sourceId
                ? {
                  ...c,
                  connections: c.connections.map(conn =>
                    conn.targetId === targetId ? { ...conn, ...data } : conn
                  )
                }
                : c
            );
          } else if (level === 'component') {
            updatedModel.components = updatedModel.components.map(c =>
              c.id === sourceId
                ? {
                  ...c,
                  connections: c.connections.map(conn =>
                    conn.targetId === targetId ? { ...conn, ...data } : conn
                  )
                }
                : c
            );
          } else if (level === 'code') {
            updatedModel.codeElements = updatedModel.codeElements.map(c =>
              c.id === sourceId
                ? {
                  ...c,
                  connections: c.connections.map(conn =>
                    conn.targetId === targetId ? { ...conn, ...data } : conn
                  )
                }
                : c
            );
          }

          return { model: updatedModel };
        }),

      removeConnection: (level, sourceId, targetId) =>
        set((state) => {
          const updatedModel = { ...state.model };

          if (level === 'system') {
            updatedModel.systems = updatedModel.systems.map(s =>
              s.id === sourceId
                ? {
                  ...s,
                  connections: s.connections.filter(conn => conn.targetId !== targetId)
                }
                : s
            );
          } else if (level === 'container') {
            updatedModel.containers = updatedModel.containers.map(c =>
              c.id === sourceId
                ? {
                  ...c,
                  connections: c.connections.filter(conn => conn.targetId !== targetId)
                }
                : c
            );
          } else if (level === 'component') {
            updatedModel.components = updatedModel.components.map(c =>
              c.id === sourceId
                ? {
                  ...c,
                  connections: c.connections.filter(conn => conn.targetId !== targetId)
                }
                : c
            );
          } else if (level === 'code') {
            updatedModel.codeElements = updatedModel.codeElements.map(c =>
              c.id === sourceId
                ? {
                  ...c,
                  connections: c.connections.filter(conn => conn.targetId !== targetId)
                }
                : c
            );
          }

          return { model: updatedModel };
        }),

      // Navigation
      setActiveSystem: (systemId) =>
        set((state) => ({
          model: {
            ...state.model,
            activeSystemId: systemId,
            viewLevel: systemId ? 'container' : 'system',
            activeContainerId: undefined,
            activeComponentId: undefined
          }
        })),

      setActiveContainer: (containerId) =>
        set((state) => ({
          model: {
            ...state.model,
            activeContainerId: containerId,
            viewLevel: containerId ? 'component' : 'container',
            activeComponentId: undefined
          }
        })),

      setActiveComponent: (componentId) =>
        set((state) => ({
          model: {
            ...state.model,
            activeComponentId: componentId,
            viewLevel: componentId ? 'code' : 'component'
          }
        })),

      setViewLevel: (level) =>
        set((state) => {
          const newState = {
            ...state.model,
            viewLevel: level
          };

          if (level === 'system') {
            newState.activeSystemId = undefined;
            newState.activeContainerId = undefined;
            newState.activeComponentId = undefined;
          } else if (level === 'container') {
            newState.activeContainerId = undefined;
            newState.activeComponentId = undefined;
          } else if (level === 'component') {
            newState.activeComponentId = undefined;
          }

          return { model: newState };
        }),

      setModel: (model) => set(() => ({ model })),
    }),
    {
      name: 'c4modelizer_flat_store',
    }
  )
);

// Hooks
export const useActiveEntities = () => {
  const store = useFlatC4Store();

  const activeSystem = store.model.systems.find(s => s.id === store.model.activeSystemId);
  const activeContainer = store.model.containers.find(c => c.id === store.model.activeContainerId);
  const activeComponent = store.model.components.find(c => c.id === store.model.activeComponentId);

  return {
    activeSystem,
    activeContainer,
    activeComponent,
    viewLevel: store.model.viewLevel
  };
};

export const useFilteredEntities = () => {
  const store = useFlatC4Store();
  const { activeSystem, activeContainer, activeComponent, viewLevel } = useActiveEntities();

  const filteredContainers = store.model.containers.filter(c =>
    c.systemId === activeSystem?.id
  );

  const filteredComponents = store.model.components.filter(c =>
    c.containerId === activeContainer?.id
  );

  const filteredCodeElements = store.model.codeElements.filter(c =>
    c.componentId === activeComponent?.id
  );

  return {
    containers: filteredContainers,
    components: filteredComponents,
    codeElements: filteredCodeElements,
    viewLevel
  };
};