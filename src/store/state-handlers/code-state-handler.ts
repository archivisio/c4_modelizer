import {C4LevelStateHandler, C4StateSetter} from "@store/c4Store.ts";
import {CodeBlock} from "@/types/c4.ts";
import {ConnectionData} from "@/types/connection.ts";

class CodeStateHandler implements C4LevelStateHandler{
    add(
        set: C4StateSetter,
        systemId: string,
        containerId: string,
        componentId: string,
        codeElement: Omit<CodeBlock, "id" | "systemId" | "containerId" | "componentId">
    ): void {
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
        });
    }

    update(
        set: C4StateSetter,
        systemId: string,
        containerId: string,
        componentId: string,
        codeElementId: string,
        data: Partial<CodeBlock>
    ): void {
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
        });
    }

    remove(
        set: C4StateSetter,
        systemId: string,
        containerId: string,
        componentId: string,
        codeElementId: string
    ): void {
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
        });
    }

    connect(
        set: C4StateSetter,
        systemId: string,
        containerId: string,
        componentId: string,
        fromId: string,
        connection: ConnectionData
    ): void {
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
        });
    }





}

export const codeStateHandler = new CodeStateHandler();