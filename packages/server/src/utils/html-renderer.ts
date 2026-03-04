import type { PageDocument, PageNode } from '../types.js'

interface StyleMap {
  [key: string]: string | number | undefined
}

function styleObjectToString(styles: StyleMap): string {
  return Object.entries(styles)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => {
      const property = k.replace(/([A-Z])/g, '-$1').toLowerCase()
      return `${property}: ${v}`
    })
    .join('; ')
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderNode(nodeId: string, nodes: Record<string, PageNode>, depth: number = 0): string {
  const node = nodes[nodeId]
  if (!node || node.hidden) return ''

  const indent = '  '.repeat(depth)
  const childrenHtml = node.children
    .map((childId) => renderNode(childId, nodes, depth + 1))
    .join('\n')

  const styles = node.styles ? styleObjectToString(node.styles as StyleMap) : ''
  const styleAttr = styles ? ` style="${escapeHtml(styles)}"` : ''

  const props = node.props

  switch (node.type) {
    case 'Text': {
      const content = String(props['text'] ?? '')
      return `${indent}<p${styleAttr}>${escapeHtml(content)}</p>`
    }

    case 'Heading': {
      const level = Math.min(6, Math.max(1, Number(props['level'] ?? 1)))
      const content = String(props['text'] ?? '')
      return `${indent}<h${level}${styleAttr}>${escapeHtml(content)}</h${level}>`
    }

    case 'Button': {
      const href = props['href'] ? String(props['href']) : null
      const content = String(props['text'] ?? 'Button')
      if (href) {
        return `${indent}<a href="${escapeHtml(href)}"${styleAttr}>${escapeHtml(content)}</a>`
      }
      return `${indent}<button${styleAttr}>${escapeHtml(content)}</button>`
    }

    case 'Image': {
      const src = escapeHtml(String(props['src'] ?? ''))
      const alt = escapeHtml(String(props['alt'] ?? ''))
      const widthAttr = props['width'] ? ` width="${escapeHtml(String(props['width']))}"` : ''
      const heightAttr = props['height'] ? ` height="${escapeHtml(String(props['height']))}"` : ''
      return `${indent}<img src="${src}" alt="${alt}"${widthAttr}${heightAttr}${styleAttr} />`
    }

    case 'Container': {
      return `${indent}<div${styleAttr}>\n${childrenHtml}\n${indent}</div>`
    }

    case 'Grid': {
      const cols = Number(props['columns'] ?? 3)
      const gap = String(props['gap'] ?? '1rem')
      const gridStyle = `display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: ${gap}`
      const combined = styles ? `${gridStyle}; ${styles}` : gridStyle
      return `${indent}<div style="${escapeHtml(combined)}">\n${childrenHtml}\n${indent}</div>`
    }

    case 'Section': {
      return `${indent}<section${styleAttr}>\n${childrenHtml}\n${indent}</section>`
    }

    case 'Divider': {
      return `${indent}<hr${styleAttr} />`
    }

    case 'Spacer': {
      const height = String(props['height'] ?? '2rem')
      const spacerStyle = `height: ${height}`
      const combined = styles ? `${spacerStyle}; ${styles}` : spacerStyle
      return `${indent}<div style="${escapeHtml(combined)}"></div>`
    }

    case 'Video': {
      const src = String(props['src'] ?? '')
      const isYoutube = src.includes('youtube.com') || src.includes('youtu.be')
      if (isYoutube) {
        return `${indent}<iframe src="${escapeHtml(src)}" frameborder="0" allowfullscreen${styleAttr}></iframe>`
      }
      return `${indent}<video src="${escapeHtml(src)}" controls${styleAttr}></video>`
    }

    case 'Link': {
      const href = escapeHtml(String(props['href'] ?? '#'))
      const content = String(props['text'] ?? '')
      return `${indent}<a href="${href}"${styleAttr}>${escapeHtml(content)}</a>`
    }

    case 'Columns': {
      const gap = String(props['gap'] ?? '1rem')
      const colStyle = `display: flex; gap: ${gap}`
      const combined = styles ? `${colStyle}; ${styles}` : colStyle
      return `${indent}<div style="${escapeHtml(combined)}">\n${childrenHtml}\n${indent}</div>`
    }

    default: {
      return `${indent}<div${styleAttr}>\n${childrenHtml}\n${indent}</div>`
    }
  }
}

export function renderDocumentToHtml(document: PageDocument): string {
  const title = escapeHtml(document.meta.title ?? 'Untitled')
  const description = escapeHtml(document.meta.description ?? '')
  const body = renderNode(document.rootId, document.nodes, 2)

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>${description ? `\n    <meta name="description" content="${description}" />` : ''}
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      body { margin: 0; font-family: system-ui, sans-serif; }
      img { max-width: 100%; height: auto; }
    </style>
  </head>
  <body>
${body}
  </body>
</html>`
}
