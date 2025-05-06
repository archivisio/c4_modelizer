export interface C4Plugin {
  name: string
  version: string
  setup(registry: PluginRegistry): void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Resolver<T = any> = () => Promise<React.ComponentType<T>>

export class PluginRegistry {
  private components = new Map<string, Resolver>()

  registerComponent(id: string, resolver: Resolver) {
    this.components.set(id, resolver)
  }

  async getComponent(id: string) {
    return (await this.components.get(id)?.()) ?? null
  }

  private portals = new Map<string, React.ReactNode>()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(event: string, ...args: any[]) {
    console.log(event, args)
  }

  registerPortal(id: string, node: React.ReactNode) {
    this.portals.set(id, node)
    this.emit('update', id)
  }

  getPortal(id: string) { return this.portals.get(id) }
}

export const registry = new PluginRegistry()
