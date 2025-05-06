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

  registerPortal(id: string, node: React.ReactNode) {
    this.portals.set(id, node)
  }

  getPortal(id: string) { return this.portals.get(id) }

  private methods = new Map<string, () => void>()

  registerMethod(id: string, method: () => void) {
    this.methods.set(id, method)
  }

  getMethod(id: string) { return this.methods.get(id) }
}

export const registry = new PluginRegistry()
