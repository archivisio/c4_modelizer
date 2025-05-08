import {SystemBlock} from "@/types/c4.ts";
import {C4StateSetter} from "../c4Store.ts"
import {ConnectionData} from "@/types/connection.ts";


export const addSystemStateHandler = (
    set: C4StateSetter,
    system: Omit<SystemBlock, 'id' | 'containers'>
): void => {
    set((state) => ({
        model: {
            ...state.model,
            systems: [
                ...state.model.systems,
                {...system, id: crypto.randomUUID(), connections: []},
            ],
        },
    }))
};
export const updateSystemStateHandler = (
    set: C4StateSetter,
    id: string,
    data: Partial<SystemBlock>
):void => {
    set((state) => ({
        model: {
            ...state.model,
            systems: state.model.systems.map((s) =>
                s.id === id ? { ...s, ...data } : s
            ),
        },
    }));
};
export const removeSystemStateHandler=  (
    set:  C4StateSetter,
    id: string
):void => {
    set((state) => ({
        model: {
            ...state.model,
            systems: state.model.systems.filter((s) => s.id !== id),
        },
    }));
};
export const connectSystemsStateHandler = (
    set: C4StateSetter,
    fromId: string,
    connection: ConnectionData
):void => {
    set((state) => ({
        model: {
            ...state.model,
            systems: state.model.systems.map((s) => {
                if (s.id === fromId) {

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
    }));
};

export default {
    addSystemStateHandler,
    updateSystemStateHandler,
    removeSystemStateHandler,
    connectSystemsStateHandler,
}
