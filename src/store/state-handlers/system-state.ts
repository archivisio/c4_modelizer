import {SystemBlock} from "@/types/c4.ts";
import {C4State} from "../c4Store.ts"
import {ConnectionData} from "@/types/connection.ts";


export const addSystemStateHandler = (
    set: {
        (partial: (C4State | Partial<C4State> | ((state: C4State) => (C4State | Partial<C4State>))), replace?: false): void
        (state: (C4State | ((state: C4State) => C4State)), replace: true): void
    },
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
    set: {
        (partial: (C4State | Partial<C4State> | ((state: C4State) => (C4State | Partial<C4State>))), replace?: false): void
        (state: (C4State | ((state: C4State) => C4State)), replace: true): void
    },
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
    set:  {
        (partial: (C4State | Partial<C4State> | ((state: C4State) => (C4State | Partial<C4State>))), replace?: false): void
        (state: (C4State | ((state: C4State) => C4State)), replace: true): void
    },
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
    set: {
        (partial: (C4State | Partial<C4State> | ((state: C4State) => (C4State | Partial<C4State>))), replace?: false): void
        (state: (C4State | ((state: C4State) => C4State)), replace: true): void
    },
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
