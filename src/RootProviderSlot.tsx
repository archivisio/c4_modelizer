import { ReactNode, useEffect, useState, Suspense } from 'react'
import { registry } from '@/plugins/registry'

type Props = {
  children: ReactNode
}

export default function RootProviderSlot({ children }: Props) {
  const [Comp, setComp] = useState<React.ComponentType<Props> | null>(null)

  useEffect(() => {
    registry.getComponent('root:provider').then(setComp)
  }, [])

  if (!Comp) return <>{children}</>

  return (
    <Suspense fallback={null}>
      <Comp>{children}</Comp>
    </Suspense>
  )
}
