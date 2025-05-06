import type { C4Plugin } from './registry.ts'
import DefaultToolbar from '@/components/Toolbar'

const plugin: C4Plugin = {
  name: 'oss-default',
  version: '0.0.1',
  setup(registry) {
    registry.registerComponent('toolbar:main', async () => DefaultToolbar)
  },
}

export default plugin;