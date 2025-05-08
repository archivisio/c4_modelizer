import {C4LayerStateHandler, C4StateSetter} from "@store/c4Store.ts";
import {ComponentBlock} from "@/types/c4.ts";
import {ConnectionData} from "@/types/connection.ts";

class ComponentStateHandler implements C4LayerStateHandler {
    add(
        set: C4StateSetter,
        systemId: string,
        containerId: string,
        component: Omit<ComponentBlock, "id" | "systemId" | "containerId" | "codeElements">
    ): void {
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
            return {model: {...state.model, systems: updatedSystems}};
        });
    }

    update(
        set: C4StateSetter,
        systemId: string,
        containerId: string,
        componentId: string,
        data: Partial<ComponentBlock>
    ): void {
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
                                        component.id === componentId ? {...component, ...data} : component
                                    )
                                };
                            }
                            return container;
                        })
                    };
                }
                return system;
            });
            return {model: {...state.model, systems: updatedSystems}};
        });
    }

    remove(
        set: C4StateSetter,
        systemId: string,
        containerId: string,
        componentId: string
    ): void {
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
            return {model: {...state.model, systems: updatedSystems}};
        });
    }

    connect(
        set: C4StateSetter,
        systemId: string,
        containerId: string,
        fromId: string,
        connection: ConnectionData
    ): void {
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
            return {model: {...state.model, systems: updatedSystems}};
        });
    }

}

export const componentStateHandler = new ComponentStateHandler();