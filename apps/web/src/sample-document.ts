import type { PageDocument, PageNode } from '@pageforge/core'

const ROOT_ID = 'ROOT'

function node(
  id: string,
  type: string,
  props: Record<string, unknown>,
  children: string[] = [],
  parentId: string | null = ROOT_ID,
): PageNode {
  return {
    id,
    type,
    props,
    children,
    slots: {},
    parentId,
    displayName: type,
  }
}

export const sampleDocument: PageDocument = {
  version: 1,
  rootId: ROOT_ID,
  nodes: {
    [ROOT_ID]: node(ROOT_ID, 'Root', {}, ['hero-section', 'features-section', 'cta-section'], null),

    'hero-section': node(
      'hero-section',
      'Section',
      {
        padding: '80px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
      ['hero-heading', 'hero-text', 'hero-button'],
    ),

    'hero-heading': node(
      'hero-heading',
      'Heading',
      {
        content: 'Build Pages Visually',
        level: 1,
        color: '#ffffff',
        align: 'center',
      },
      [],
      'hero-section',
    ),

    'hero-text': node(
      'hero-text',
      'Text',
      {
        content:
          'PageForge is a modern visual page builder with a powerful plugin system. Drag, drop, and publish — no code required.',
        color: 'rgba(255,255,255,0.9)',
        fontSize: 20,
        align: 'center',
      },
      [],
      'hero-section',
    ),

    'hero-button': node(
      'hero-button',
      'Button',
      {
        label: 'Get Started',
        variant: 'primary',
        size: 'lg',
      },
      [],
      'hero-section',
    ),

    'features-section': node(
      'features-section',
      'Section',
      {
        padding: '60px 20px',
        background: '#ffffff',
      },
      ['features-heading', 'features-grid'],
    ),

    'features-heading': node(
      'features-heading',
      'Heading',
      {
        content: 'Features',
        level: 2,
        align: 'center',
      },
      [],
      'features-section',
    ),

    'features-grid': node(
      'features-grid',
      'Columns',
      {
        columns: 3,
        gap: 24,
      },
      ['feature-1', 'feature-2', 'feature-3'],
      'features-section',
    ),

    'feature-1': node(
      'feature-1',
      'Container',
      {
        padding: '24px',
        borderRadius: 12,
        background: '#f8f9fa',
      },
      ['feature-1-heading', 'feature-1-text'],
      'features-grid',
    ),

    'feature-1-heading': node(
      'feature-1-heading',
      'Heading',
      {
        content: 'Drag & Drop',
        level: 3,
        align: 'center',
      },
      [],
      'feature-1',
    ),

    'feature-1-text': node(
      'feature-1-text',
      'Text',
      {
        content: 'Intuitive drag-and-drop interface for building pages without writing code.',
        color: '#666666',
        align: 'center',
      },
      [],
      'feature-1',
    ),

    'feature-2': node(
      'feature-2',
      'Container',
      {
        padding: '24px',
        borderRadius: 12,
        background: '#f8f9fa',
      },
      ['feature-2-heading', 'feature-2-text'],
      'features-grid',
    ),

    'feature-2-heading': node(
      'feature-2-heading',
      'Heading',
      {
        content: 'Plugin System',
        level: 3,
        align: 'center',
      },
      [],
      'feature-2',
    ),

    'feature-2-text': node(
      'feature-2-text',
      'Text',
      {
        content:
          'Extend functionality with a type-safe plugin SDK. Build custom components and integrations.',
        color: '#666666',
        align: 'center',
      },
      [],
      'feature-2',
    ),

    'feature-3': node(
      'feature-3',
      'Container',
      {
        padding: '24px',
        borderRadius: 12,
        background: '#f8f9fa',
      },
      ['feature-3-heading', 'feature-3-text'],
      'features-grid',
    ),

    'feature-3-heading': node(
      'feature-3-heading',
      'Heading',
      {
        content: 'Responsive',
        level: 3,
        align: 'center',
      },
      [],
      'feature-3',
    ),

    'feature-3-text': node(
      'feature-3-text',
      'Text',
      {
        content: 'Built-in responsive design with breakpoint-aware styles for every device.',
        color: '#666666',
        align: 'center',
      },
      [],
      'feature-3',
    ),

    'cta-section': node(
      'cta-section',
      'Section',
      {
        padding: '60px 20px',
        background: '#1e1e2e',
      },
      ['cta-heading', 'cta-spacer', 'cta-button'],
    ),

    'cta-heading': node(
      'cta-heading',
      'Heading',
      {
        content: 'Ready to build?',
        level: 2,
        color: '#ffffff',
        align: 'center',
      },
      [],
      'cta-section',
    ),

    'cta-spacer': node(
      'cta-spacer',
      'Spacer',
      {
        height: 24,
      },
      [],
      'cta-section',
    ),

    'cta-button': node(
      'cta-button',
      'Button',
      {
        label: 'Start Building',
        variant: 'primary',
        size: 'lg',
      },
      [],
      'cta-section',
    ),
  },
  styles: [],
  meta: {
    title: 'PageForge Demo',
    description: 'A sample landing page built with PageForge',
  },
}
