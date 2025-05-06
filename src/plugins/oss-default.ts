import NavBar from '@/components/NavBar'
import Toolbar from '@/components/Toolbar'
import type { C4Plugin } from './registry.ts'

const plugin: C4Plugin = {
  name: 'oss-default',
  version: '0.0.1',
  setup(registry) {
    registry.registerComponent('toolbar:main', async () => Toolbar)
    registry.registerComponent('navbar:main', async () => NavBar)
  },
}

export default plugin;