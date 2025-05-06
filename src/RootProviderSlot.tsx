import { registry } from '@/plugins/registry'
import { ReactNode, Suspense, useEffect, useRef, useState } from 'react'

type Props = {
  children: ReactNode
}
export default function RootProviderSlot({ children }: Props) {
  const [Provider, setProvider] = useState<React.ComponentType<Props> | null>(null)
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true
    registry.getComponent('root:provider').then((comp) => {
      if (mounted.current && comp) setProvider(() => comp as React.ComponentType<Props>)
    })
    return () => {
      mounted.current = false
    }
  }, [])

  if (!Provider) return <>{children}</>

  return (
    <Suspense fallback={null}>
      <Provider>{children}</Provider>
    </Suspense>
  )
}