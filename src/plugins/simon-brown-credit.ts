import type { C4Plugin } from './registry.ts'

const plugin: C4Plugin = {
  name: 'simon-brown-credit',
  version: '0.0.1',
  setup(registry) {
    registry.registerComponent('footer:credit', async () => import('@/components/SimonBrownCredit').then(m => m.default))
  },
}

export default plugin;
