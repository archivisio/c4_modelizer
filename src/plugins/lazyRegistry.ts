import { ComponentType, lazy } from 'react'
import { registry } from './registry'

export function lazyRegistry<P>(
  id: string,
  fallback?: ComponentType<P>,
) {
  return lazy<ComponentType<P>>(async () => {
    const Comp = await registry.getComponent<P>(id)
    const Safe = (Comp ?? fallback ?? (() => null)) as ComponentType<P>
    return { default: Safe }
  })
}
