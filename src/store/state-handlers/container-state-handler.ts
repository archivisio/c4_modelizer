import {ContainerBlock} from "@/types/c4.ts";
import {ConnectionData} from "@/types/connection.ts";
import {C4LevelStateHandler, C4StateSetter} from "@store/c4Store.ts";

class ContainerStateHandler implements C4LevelStateHandler {
    add(
        set: C4StateSetter,
        systemId: string,
        container: Omit<ContainerBlock, "id" | "systemId" | "components">
    ): void {
        set((state) => {
            const updatedSystems = state.model.systems.map(system => {
                if (system.id === systemId) {
                    const containers = system.containers || [];
                    return {
                        ...system,
                        containers: [
                            ...containers,
                            // @ts-expect-error id is not defined in Omit<ContainerBlock, 'id' | 'systemId' | 'components'>
                            { ...container, id: container.id || crypto.randomUUID(), systemId, connections: [] }
                        ]
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
        data: Partial<ContainerBlock>
    ): void {
        set((state) => {
            const updatedSystems = state.model.systems.map(system => {
                if (system.id === systemId && system.containers) {
                    return {
                        ...system,
                        containers: system.containers.map(container =>
                            container.id === containerId ? {...container, ...data} : container
                        )
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
        containerId: string
    ): void {
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

            return {model: {...state.model, systems: updatedSystems}};
        });
    }

    connect(
        set: C4StateSetter,
        systemId: string,
        fromId: string,
        connection: ConnectionData
    ): void {
        set((state) => {
            const updatedSystems = state.model.systems.map(system => {
                if (system.id === systemId && system.containers) {
                    return {
                        ...system,
                        containers: system.containers.map(container => {

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

            return {model: {...state.model, systems: updatedSystems}};
        });
    }

}

export const containerStateHandler = new ContainerStateHandler();