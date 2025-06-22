import { useFlatC4Store } from "c4-modelizer-sdk/core";
import { pluginLoaders } from './bundle'
import { C4Plugin, registry } from './registry'

const defaultPlugins = ['@archivisio/default', '@archivisio/simon-brown-credit']

export async function loadPlugins() {
  registry.registerMethod('useStore', () => useFlatC4Store)

  const wanted = import.meta.env.VITE_PLUGINS ? (import.meta.env.VITE_PLUGINS ?? '').split(',').filter(Boolean) : defaultPlugins

  await Promise.all(
    wanted.map(async (name: string) => {
      const loader = (pluginLoaders as Record<string, () => Promise<{ default: C4Plugin }>>)[name]

      if (!loader) return

      try {
        const { default: plugin } = await loader()
        plugin.setup(registry)
        console.info(`[plugin] ${plugin.name}@${plugin.version} loaded`)
      } catch (e) {
        console.error(`[plugin] ${name} load failed`, e)
      }
    }),
  )
}
