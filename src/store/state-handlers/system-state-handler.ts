import {SystemBlock} from "@/types/c4.ts";
import {C4LevelStateHandler, C4StateSetter} from "../c4Store.ts"
import {ConnectionData} from "@/types/connection.ts";

class SystemStateHandler implements C4LevelStateHandler{
    add(
        set: C4StateSetter,
        system: Omit<SystemBlock, 'id' | 'containers'>
    ): void {
        set((state) => ({
            model: {
                ...state.model,
                systems: [
                    ...state.model.systems,
                    {...system, id: crypto.randomUUID(), connections: []},
                ],
            },
        }))
    }

    update(
        set: C4StateSetter,
        id: string,
        data: Partial<SystemBlock>
    ):void {
        set((state) => ({
            model: {
                ...state.model,
                systems: state.model.systems.map((s) =>
                    s.id === id ? { ...s, ...data } : s
                ),
            },
        }));
    }

    remove(
        set:  C4StateSetter,
        id: string
    ):void {
        set((state) => ({
            model: {
                ...state.model,
                systems: state.model.systems.filter((s) => s.id !== id),
            },
        }));
    }

    connect(
        set: C4StateSetter,
        fromId: string,
        connection: ConnectionData
    ):void {
        set((state) => ({
            model: {
                ...state.model,
                systems: state.model.systems.map((s) => {
                    if (s.id === fromId) {

                        const connectionExists = s.connections.some(c => c.targetId === connection.targetId);
                        if (!connectionExists) {
                            this.test()
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

    private test(){
        console.log("test");
    }
}

export const systemStateHandler = new SystemStateHandler();
