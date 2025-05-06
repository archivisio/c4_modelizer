import type { C4Plugin } from './registry.ts'

const plugin: C4Plugin = {
  name: 'oss-default',
  version: '0.0.1',
  setup(registry) {
    registry.registerComponent('toolbar:main', async () => import('@/components/Toolbar').then(m => m.default))
    registry.registerComponent('navbar:main', async () => import('@/components/NavBar').then(m => m.default))
  },
}

export default plugin;