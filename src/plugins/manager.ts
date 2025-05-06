import { pluginLoaders } from './bundle'
import plugin from './oss-default'
import { C4Plugin, registry } from './registry'

const loadOssDefault = () => plugin.setup(registry)

export async function loadPlugins() {
  const wanted = (import.meta.env.VITE_PLUGINS ?? '').split(',').filter(Boolean)

  loadOssDefault()
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
