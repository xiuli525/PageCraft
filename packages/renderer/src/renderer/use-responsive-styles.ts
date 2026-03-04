import * as React from 'react'
import type { ResponsiveStyles } from '../types'
import { useStyleContext } from './StyleProvider'

const BREAKPOINT_ORDER = ['base', 'sm', 'md', 'lg', 'xl'] as const

export function useResponsiveStyles(styles?: ResponsiveStyles): React.CSSProperties {
  const { breakpoint } = useStyleContext()

  return React.useMemo(() => {
    if (!styles) return {}

    const currentIndex = BREAKPOINT_ORDER.indexOf(breakpoint)
    let merged: React.CSSProperties = {}

    for (let i = 0; i <= currentIndex; i++) {
      const key = BREAKPOINT_ORDER[i]
      if (key !== undefined && styles[key] !== undefined) {
        merged = { ...merged, ...styles[key] }
      }
    }

    return merged
  }, [styles, breakpoint])
}
