import { C4Plugin, registry } from './registry.ts'

export async function loadPlugins() {
  const list = import.meta.env.VITE_PLUGINS?.split(',') ?? []
  const internal = ['./oss-default']
  const all = [...internal, ...list]

  await Promise.all(
    all.map(async (id) => {
      try {
        const { default: plugin } = await import(/* @vite-ignore */ id) as { default: C4Plugin }
        plugin.setup(registry)
      } catch (e) {
        console.error(`Failed to load plugin ${id}`, e)
      }
    }),
  )
}
