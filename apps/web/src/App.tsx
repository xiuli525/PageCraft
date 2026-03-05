import { useCallback, useMemo } from 'react'
import { PageEditor } from '@pageforge/editor'
import type { EditorConfig } from '@pageforge/editor'
import { defaultComponents, defaultDefinitions } from '@pageforge/components'
import { sampleDocument } from './sample-document'

const STORAGE_KEY = 'pageforge-document'

function loadDocument() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {
    // ignore parse errors
  }
  return sampleDocument
}

export function App() {
  const handleChange = useCallback((doc: unknown) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(doc))
    } catch {
      // ignore storage errors
    }
  }, [])

  const handleSave = useCallback((doc: unknown) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(doc))
    } catch {
      // ignore storage errors
    }
  }, [])

  const config: EditorConfig = useMemo(
    () => ({
      initialDocument: loadDocument(),
      componentDefinitions: defaultDefinitions,
      componentRenderers: defaultComponents,
      onChange: handleChange,
      onSave: handleSave,
    }),
    [handleChange, handleSave],
  )

  return <PageEditor config={config} />
}
