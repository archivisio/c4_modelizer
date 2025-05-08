import {C4Model, CodeBlock, ComponentBlock, ContainerBlock, SystemBlock} from '@interfaces/c4';
import {ConnectionData} from '@interfaces/connection';
import {systemStateHandler} from '@store/state-handlers/system-state-handler.ts';
import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {containerStateHandler} from "@store/state-handlers/container-state-handler.ts";

export interface C4State {
  model: C4Model;
  addSystem: (system: Omit<SystemBlock, 'id' | 'containers'>) => void;
  updateSystem: (id: string, data: Partial<SystemBlock>) => void;
  removeSystem: (id: string) => void;
  connectSystems: (fromId: string, connection: ConnectionData) => void;
  updateConnection: (level: 'system' | 'container' | 'component' | 'code', systemId: string, sourceId: string, targetId: string, data: Partial<ConnectionData>) => void;
  removeConnection: (level: 'system' | 'container' | 'component' | 'code', systemId: string, sourceId: string, targetId: string) => void;
  addContainer: (systemId: string, container: Omit<ContainerBlock, 'id' | 'systemId' | 'components'>) => void;
  updateContainer: (systemId: string, containerId: string, data: Partial<ContainerBlock>) => void;
  removeContainer: (systemId: string, containerId: string) => void;
  connectContainers: (systemId: string, fromId: string, connection: ConnectionData) => void;
  addComponent: (systemId: string, containerId: string, component: Omit<ComponentBlock, 'id' | 'systemId' | 'containerId' | 'codeElements'>) => void;
  updateComponent: (systemId: string, containerId: string, componentId: string, data: Partial<ComponentBlock>) => void;
  removeComponent: (systemId: string, containerId: string, componentId: string) => void;
  connectComponents: (systemId: string, containerId: string, fromId: string, connection: ConnectionData) => void;
  addCodeElement: (systemId: string, containerId: string, componentId: string, codeElement: Omit<CodeBlock, 'id' | 'systemId' | 'containerId' | 'componentId'>) => void;
  updateCodeElement: (systemId: string, containerId: string, componentId: string, codeElementId: string, data: Partial<CodeBlock>) => void;
  removeCodeElement: (systemId: string, containerId: string, componentId: string, codeElementId: string) => void;
  connectCodeElements: (systemId: string, containerId: string, componentId: string, fromId: string, connection: ConnectionData) => void;
  setActiveSystem: (systemId: string | undefined) => void;
  setActiveContainer: (containerId: string | undefined) => void;
  setActiveComponent: (componentId: string | undefined) => void;
  setViewLevel: (level: 'system' | 'container' | 'component' | 'code') => void;
  setModel: (model: C4Model) => void;
}

export type C4StateSetter =  {
  (partial: (C4State | Partial<C4State> | ((state: C4State) => (C4State | Partial<C4State>))), replace?: false): void
  (state: (C4State | ((state: C4State) => C4State)), replace: true): void
}
export interface C4LayerStateHandler {
  add: (set: C4StateSetter, ...args: never[]) => void;
  update: (set: C4StateSetter, ...args: never[]) => void;
  remove: (set: C4StateSetter, ...args: never[]) => void;
  connect: (set: C4StateSetter, ...args: never[]) => void;
}

export const useC4Store = create<C4State>()(
  persist(
    (set) => ({
      model: { systems: [], viewLevel: 'system' },
      addSystem: (system) => systemStateHandler.add(set, system),
      updateSystem: (id, data) => systemStateHandler.update(set, id, data),
      removeSystem: (id) => systemStateHandler.remove(set, id),
      connectSystems: (fromId, connection) => systemStateHandler.connect(set, fromId, connection),
      addContainer: (systemId, container) => containerStateHandler.add(set, systemId, container),
      updateContainer: (systemId, containerId, data) => containerStateHandler.update(set, systemId, containerId, data),
      removeContainer: (systemId, containerId) => containerStateHandler.remove(set, systemId, containerId),
      connectContainers: (systemId, fromId, connection) => containerStateHandler.connect(set, systemId, fromId, connection),
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
                          // @ts-expect-error id is not defined in Omit<ComponentBlock, 'id' | 'systemId' | 'containerId' | 'codeElements'>
                          id: component.id || crypto.randomUUID(),
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
      connectComponents: (systemId, containerId, fromId, connection) =>
        set((state) => {
          const updatedSystems = state.model.systems.map(system => {
            if (system.id === systemId) {
              return {
                ...system,
                containers: (system.containers || []).map(container => {
                  if (container.id === containerId && container.components) {
                    return {
                      ...container,
                      components: container.components.map(component => {

                        const connectionExists = component.connections.some(c => c.targetId === connection.targetId);
                        if (component.id === fromId && !connectionExists) {
                          return {
                            ...component,
                            connections: [...component.connections, connection]
                          };
                        }
                        return component;
                      })
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
      addCodeElement: (systemId, containerId, componentId, codeElement) =>
        set((state) => {
          const updatedSystems = state.model.systems.map(system => {
            if (system.id === systemId) {
              return {
                ...system,
                containers: (system.containers || []).map(container => {
                  if (container.id === containerId) {
                    return {
                      ...container,
                      components: (container.components || []).map(component => {
                        if (component.id === componentId) {
                          const codeElements = component.codeElements || [];
                          return {
                            ...component,
                            codeElements: [
                              ...codeElements,
                              {
                                ...codeElement,
                                // @ts-expect-error id is not defined in Omit<CodeBlock, 'id' | 'systemId' | 'containerId' | 'componentId'>
                                id: codeElement.id || crypto.randomUUID(),
                                systemId,
                                containerId,
                                componentId,
                                connections: []
                              }
                            ]
                          };
                        }
                        return component;
                      })
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
      updateCodeElement: (systemId, containerId, componentId, codeElementId, data) =>
        set((state) => {
          const updatedSystems = state.model.systems.map(system => {
            if (system.id === systemId) {
              return {
                ...system,
                containers: (system.containers || []).map(container => {
                  if (container.id === containerId) {
                    return {
                      ...container,
                      components: (container.components || []).map(component => {
                        if (component.id === componentId && component.codeElements) {
                          return {
                            ...component,
                            codeElements: component.codeElements.map(codeElement =>
                              codeElement.id === codeElementId ? { ...codeElement, ...data } : codeElement
                            )
                          };
                        }
                        return component;
                      })
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
      removeCodeElement: (systemId, containerId, componentId, codeElementId) =>
        set((state) => {
          const updatedSystems = state.model.systems.map(system => {
            if (system.id === systemId) {
              return {
                ...system,
                containers: (system.containers || []).map(container => {
                  if (container.id === containerId) {
                    return {
                      ...container,
                      components: (container.components || []).map(component => {
                        if (component.id === componentId && component.codeElements) {
                          return {
                            ...component,
                            codeElements: component.codeElements.filter(codeElement => codeElement.id !== codeElementId)
                          };
                        }
                        return component;
                      })
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
      connectCodeElements: (systemId, containerId, componentId, fromId, connection) =>
        set((state) => {
          const updatedSystems = state.model.systems.map(system => {
            if (system.id === systemId) {
              return {
                ...system,
                containers: (system.containers || []).map(container => {
                  if (container.id === containerId) {
                    return {
                      ...container,
                      components: (container.components || []).map(component => {
                        if (component.id === componentId) {
                          return {
                            ...component,
                            codeElements: (component.codeElements || []).map(codeElement => {

                              const connectionExists = codeElement.connections.some(c => c.targetId === connection.targetId);
                              if (codeElement.id === fromId && !connectionExists) {
                                return {
                                  ...codeElement,
                                  connections: [...codeElement.connections, connection]
                                };
                              }
                              return codeElement;
                            })
                          };
                        }
                        return component;
                      })
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
      updateConnection: (level, systemId, sourceId, targetId, data) =>
        set((state) => {
          let updatedSystems = [...state.model.systems];
          if (level === 'system') {
            updatedSystems = updatedSystems.map(system => {
              if (system.id === sourceId) {
                return {
                  ...system,
                  connections: system.connections.map(conn =>
                    conn.targetId === targetId ? { ...conn, ...data } : conn
                  )
                };
              }
              return system;
            });
          } else if (level === 'container') {
            updatedSystems = updatedSystems.map(system => {
              if (system.id === systemId) {
                return {
                  ...system,
                  containers: (system.containers || []).map(container => {
                    if (container.id === sourceId) {
                      return {
                        ...container,
                        connections: container.connections.map(conn =>
                          conn.targetId === targetId ? { ...conn, ...data } : conn
                        )
                      };
                    }
                    return container;
                  })
                };
              }
              return system;
            });
          } else if (level === 'component') {
            updatedSystems = updatedSystems.map(system => {
              if (system.id === systemId) {
                return {
                  ...system,
                  containers: (system.containers || []).map(container => {
                    return {
                      ...container,
                      components: (container.components || []).map(component => {
                        if (component.id === sourceId) {
                          return {
                            ...component,
                            connections: component.connections.map(conn =>
                              conn.targetId === targetId ? { ...conn, ...data } : conn
                            )
                          };
                        }
                        return component;
                      })
                    };
                  })
                };
              }
              return system;
            });
          } else if (level === 'code') {
            updatedSystems = updatedSystems.map(system => {
              if (system.id === systemId) {
                return {
                  ...system,
                  containers: (system.containers || []).map(container => {
                    return {
                      ...container,
                      components: (container.components || []).map(component => {
                        return {
                          ...component,
                          codeElements: (component.codeElements || []).map(codeElement => {
                            if (codeElement.id === sourceId) {
                              return {
                                ...codeElement,
                                connections: codeElement.connections.map(conn =>
                                  conn.targetId === targetId ? { ...conn, ...data } : conn
                                )
                              };
                            }
                            return codeElement;
                          })
                        };
                      })
                    };
                  })
                };
              }
              return system;
            });
          }
          return { model: { ...state.model, systems: updatedSystems } };
        }),
      removeConnection: (level, systemId, sourceId, targetId) =>
        set((state) => {
          let updatedSystems = [...state.model.systems];
          if (level === 'system') {
            updatedSystems = updatedSystems.map(system => {
              if (system.id === sourceId) {
                return {
                  ...system,
                  connections: system.connections.filter(conn => conn.targetId !== targetId)
                };
              }
              return system;
            });
          } else if (level === 'container') {
            updatedSystems = updatedSystems.map(system => {
              if (system.id === systemId) {
                return {
                  ...system,
                  containers: (system.containers || []).map(container => {
                    if (container.id === sourceId) {
                      return {
                        ...container,
                        connections: container.connections.filter(conn => conn.targetId !== targetId)
                      };
                    }
                    return container;
                  })
                };
              }
              return system;
            });
          } else if (level === 'component') {
            updatedSystems = updatedSystems.map(system => {
              if (system.id === systemId) {
                return {
                  ...system,
                  containers: (system.containers || []).map(container => {
                    return {
                      ...container,
                      components: (container.components || []).map(component => {
                        if (component.id === sourceId) {
                          return {
                            ...component,
                            connections: component.connections.filter(conn => conn.targetId !== targetId)
                          };
                        }
                        return component;
                      })
                    };
                  })
                };
              }
              return system;
            });
          } else if (level === 'code') {
            updatedSystems = updatedSystems.map(system => {
              if (system.id === systemId) {
                return {
                  ...system,
                  containers: (system.containers || []).map(container => {
                    return {
                      ...container,
                      components: (container.components || []).map(component => {
                        return {
                          ...component,
                          codeElements: (component.codeElements || []).map(codeElement => {
                            if (codeElement.id === sourceId) {
                              return {
                                ...codeElement,
                                connections: codeElement.connections.filter(conn => conn.targetId !== targetId)
                              };
                            }
                            return codeElement;
                          })
                        };
                      })
                    };
                  })
                };
              }
              return system;
            });
          }

          return { model: { ...state.model, systems: updatedSystems } };
        }),
      setModel: (model) => set(() => ({ model })),
    }),
    {
      name: 'c4modelizer_store',
    }
  )
);
