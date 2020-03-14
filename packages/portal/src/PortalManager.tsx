import * as React from "react"
import { createContext } from "@chakra-ui/utils"
import { useIsomorphicEffect, useForceUpdate } from "@chakra-ui/hooks"

export interface PortalsContext {
  host: HTMLElement
  zIndex?: number
}

const [PortalsProvider, usePortalsContext] = createContext<PortalsContext>({
  strict: false,
})

export { usePortalsContext }

interface LayerManagerProps {
  children?: React.ReactNode
  zIndex?: number
}

// This component should be used once in the root
export function PortalManager({ children, zIndex }: LayerManagerProps) {
  // The element that wraps the stacked layers
  const hostRef = React.useRef<HTMLDivElement>(null)

  // force an update so the Provider works correctly
  const forceUpdate = useForceUpdate()
  useIsomorphicEffect(() => {
    forceUpdate()
  }, [])

  // let's detect if use has mutiple instances of this component
  const parent = usePortalsContext()

  // Broadcast the host element via context
  // If user passed a stacking context (aka z-index), send that as well
  const context = {
    host: parent?.host || hostRef.current,
    zIndex,
  }

  return (
    <PortalsProvider value={context}>
      {children}
      <div className="chakra-portal-manager" ref={hostRef} />
    </PortalsProvider>
  )
}

export default PortalManager