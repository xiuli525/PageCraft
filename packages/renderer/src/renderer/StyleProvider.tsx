import * as React from 'react'
import type { Breakpoint, BreakpointConfig, DesignTokens, StyleContextValue } from '../types'
import { DEFAULT_BREAKPOINTS } from '../types'

const StyleContext = React.createContext<StyleContextValue>({
  breakpoint: 'base',
  viewportWidth: 1024,
  breakpointConfig: DEFAULT_BREAKPOINTS,
  designTokens: {},
})

export function useStyleContext(): StyleContextValue {
  return React.useContext(StyleContext)
}

function resolveBreakpoint(width: number, config: BreakpointConfig): Breakpoint {
  if (width >= config.xl) return 'xl'
  if (width >= config.lg) return 'lg'
  if (width >= config.md) return 'md'
  if (width >= config.sm) return 'sm'
  return 'base'
}

interface StyleProviderProps {
  children: React.ReactNode
  viewportWidth?: number
  breakpointConfig?: BreakpointConfig
  designTokens?: DesignTokens
}

export function StyleProvider({
  children,
  viewportWidth: overrideWidth,
  breakpointConfig = DEFAULT_BREAKPOINTS,
  designTokens = {},
}: StyleProviderProps): React.ReactElement {
  const [windowWidth, setWindowWidth] = React.useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1024,
  )

  React.useEffect(() => {
    if (overrideWidth !== undefined) return

    function handleResize() {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [overrideWidth])

  const viewportWidth = overrideWidth ?? windowWidth
  const breakpoint = resolveBreakpoint(viewportWidth, breakpointConfig)

  const value = React.useMemo<StyleContextValue>(
    () => ({ breakpoint, viewportWidth, breakpointConfig, designTokens }),
    [breakpoint, viewportWidth, breakpointConfig, designTokens],
  )

  return <StyleContext.Provider value={value}>{children}</StyleContext.Provider>
}
