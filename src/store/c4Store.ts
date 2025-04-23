import { create } from 'zustand';
import { SystemBlock, C4Model, ContainerBlock, ComponentBlock, CodeBlock } from '../types/c4';
import { ConnectionData } from '../types/connection';

interface C4State {
  model: C4Model;
  // System operations
  addSystem: (system: Omit<SystemBlock, 'id' | 'containers'>) => void;
  updateSystem: (id: string, data: Partial<SystemBlock>) => void;
  removeSystem: (id: string) => void;
  connectSystems: (fromId: string, connection: ConnectionData) => void;
  updateConnection: (level: 'system' | 'container' | 'component' | 'code', systemId: string, sourceId: string, targetId: string, data: Partial<ConnectionData>) => void;
  removeConnection: (level: 'system' | 'container' | 'component' | 'code', systemId: string, sourceId: string, targetId: string) => void;
  // Container operations
  addContainer: (systemId: string, container: Omit<ContainerBlock, 'id' | 'systemId' | 'components'>) => void;
  updateContainer: (systemId: string, containerId: string, data: Partial<ContainerBlock>) => void;
  removeContainer: (systemId: string, containerId: string) => void;
  connectContainers: (systemId: string, fromId: string, connection: ConnectionData) => void;
  // Component operations
  addComponent: (systemId: string, containerId: string, component: Omit<ComponentBlock, 'id' | 'systemId' | 'containerId' | 'codeElements'>) => void;
  updateComponent: (systemId: string, containerId: string, componentId: string, data: Partial<ComponentBlock>) => void;
  removeComponent: (systemId: string, containerId: string, componentId: string) => void;
  connectComponents: (systemId: string, containerId: string, fromId: string, connection: ConnectionData) => void;
  // Code operations
  addCodeElement: (systemId: string, containerId: string, componentId: string, codeElement: Omit<CodeBlock, 'id' | 'systemId' | 'containerId' | 'componentId'>) => void;
  updateCodeElement: (systemId: string, containerId: string, componentId: string, codeElementId: string, data: Partial<CodeBlock>) => void;
  removeCodeElement: (systemId: string, containerId: string, componentId: string, codeElementId: string) => void;
  connectCodeElements: (systemId: string, containerId: string, componentId: string, fromId: string, connection: ConnectionData) => void;
  // Navigation
  setActiveSystem: (systemId: string | undefined) => void;
  setActiveContainer: (containerId: string | undefined) => void;
  setActiveComponent: (componentId: string | undefined) => void;
  setViewLevel: (level: 'system' | 'container' | 'component' | 'code') => void;
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
  connectSystems: (fromId, connection) =>
    set((state) => ({
      model: {
        ...state.model,
        systems: state.model.systems.map((s) => {
          if (s.id === fromId) {
            // Vérifier si la connexion existe déjà
            const connectionExists = s.connections.some(c => c.targetId === connection.targetId);
            if (!connectionExists) {
              return { 
                ...s, 
                connections: [...s.connections, connection] 
              };
            }
          }
          return s;
        }),
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
    
  connectContainers: (systemId, fromId, connection) =>
    set((state) => {
      const updatedSystems = state.model.systems.map(system => {
        if (system.id === systemId && system.containers) {
          return {
            ...system,
            containers: system.containers.map(container => {
              // Vérifier si la connexion existe déjà
              const connectionExists = container.connections.some(c => c.targetId === connection.targetId);
              if (container.id === fromId && !connectionExists) {
                return { 
                  ...container, 
                  connections: [...container.connections, connection] 
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
                    // Vérifier si la connexion existe déjà
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

  // Code operations
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
                            id: crypto.randomUUID(), 
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
                          // Vérifier si la connexion existe déjà
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

  // Navigation operations
  setActiveSystem: (systemId) =>
    set((state) => ({
      model: {
        ...state.model,
        activeSystemId: systemId,
        // Switch to container view if selecting a system and clear active container
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
        // Switch to component view if selecting a container
        viewLevel: containerId ? 'component' : 'container',
        activeComponentId: undefined
      }
    })),

  setActiveComponent: (componentId) =>
    set((state) => ({
      model: {
        ...state.model,
        activeComponentId: componentId,
        // Switch to code view if selecting a component
        viewLevel: componentId ? 'code' : 'component'
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
        newState.activeComponentId = undefined;
      } else if (level === 'container') {
        newState.activeContainerId = undefined;
        newState.activeComponentId = undefined;
      } else if (level === 'component') {
        newState.activeComponentId = undefined;
      }
      
      return { model: newState };
    }),
  
  // Connection operations
  updateConnection: (level, systemId, sourceId, targetId, data) =>
    set((state) => {
      let updatedSystems = [...state.model.systems];

      // Handle different levels
      if (level === 'system') {
        // Update system-level connection
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
        // Update container-level connection
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
        // Update component-level connection
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
        // Update code-level connection
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

  // Remove connection at any level
  removeConnection: (level, systemId, sourceId, targetId) =>
    set((state) => {
      let updatedSystems = [...state.model.systems];

      // Handle different levels
      if (level === 'system') {
        // Remove system-level connection
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
        // Remove container-level connection
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
        // Remove component-level connection
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
        // Remove code-level connection
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

  // Model operations
  setModel: (model) => set(() => ({ model })),
}));
