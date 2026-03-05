import type { PageDocument, PageNode } from '../types'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function styleToString(style: Record<string, string | number | undefined>): string {
  return Object.entries(style)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => {
      const prop = k.replace(/([A-Z])/g, '-$1').toLowerCase()
      return `${prop}: ${typeof v === 'number' && prop !== 'font-weight' && prop !== 'opacity' ? `${v}px` : v}`
    })
    .join('; ')
}

function renderNode(node: PageNode, doc: PageDocument): string {
  const childrenHtml = node.children
    .map((childId) => {
      const child = doc.nodes[childId]
      return child ? renderNode(child, doc) : ''
    })
    .join('\n')

  switch (node.type) {
    case 'Section': {
      const style: Record<string, string | number | undefined> = {
        padding: node.props['padding'] as string,
        background: node.props['background'] as string,
        minHeight: node.props['minHeight'] as string,
      }
      const align = node.props['verticalAlign'] as string
      if (align) {
        style.display = 'flex'
        style.flexDirection = 'column'
        style.justifyContent =
          align === 'center' ? 'center' : align === 'end' ? 'flex-end' : 'flex-start'
      }
      return `<section style="${escapeHtml(styleToString(style))}">${childrenHtml}</section>`
    }

    case 'Container': {
      const style: Record<string, string | number | undefined> = {
        maxWidth: node.props['maxWidth'] as string,
        margin: '0 auto',
        padding: node.props['padding'] as string,
        background: node.props['background'] as string,
        borderRadius: node.props['borderRadius'] as number,
      }
      return `<div style="${escapeHtml(styleToString(style))}">${childrenHtml}</div>`
    }

    case 'Columns': {
      const cols = (node.props['columns'] as number) ?? 2
      const gap = (node.props['gap'] as number) ?? 16
      const style = `display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: ${gap}px`
      return `<div style="${escapeHtml(style)}">${childrenHtml}</div>`
    }

    case 'Grid': {
      const cols = (node.props['columns'] as number) ?? 3
      const gap = (node.props['gap'] as number) ?? 16
      const style = `display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: ${gap}px`
      return `<div style="${escapeHtml(style)}">${childrenHtml}</div>`
    }

    case 'Heading': {
      const level = Math.min(Math.max((node.props['level'] as number) ?? 1, 1), 6)
      const tag = `h${level}`
      const style: Record<string, string | number | undefined> = {
        textAlign: node.props['align'] as string,
        color: node.props['color'] as string,
        margin: '0',
      }
      const content = escapeHtml((node.props['content'] as string) ?? '')
      return `<${tag} style="${escapeHtml(styleToString(style))}">${content}</${tag}>`
    }

    case 'Text': {
      const style: Record<string, string | number | undefined> = {
        textAlign: node.props['align'] as string,
        fontSize: node.props['fontSize'] as number,
        fontWeight: node.props['fontWeight'] as number,
        color: node.props['color'] as string,
        margin: '0',
        lineHeight: '1.6',
      }
      const content = escapeHtml((node.props['content'] as string) ?? '')
      return `<p style="${escapeHtml(styleToString(style))}">${content}</p>`
    }

    case 'Button': {
      const label = escapeHtml((node.props['label'] as string) ?? 'Button')
      const variant = (node.props['variant'] as string) ?? 'primary'
      const size = (node.props['size'] as string) ?? 'md'
      const padding = size === 'sm' ? '8px 16px' : size === 'lg' ? '16px 32px' : '12px 24px'
      const fontSize = size === 'sm' ? '13px' : size === 'lg' ? '16px' : '14px'
      const bg =
        variant === 'primary' ? '#3b82f6' : variant === 'secondary' ? '#6b7280' : 'transparent'
      const color = variant === 'outline' ? '#3b82f6' : '#fff'
      const border = variant === 'outline' ? '2px solid #3b82f6' : 'none'
      const style = `padding: ${padding}; font-size: ${fontSize}; background: ${bg}; color: ${color}; border: ${border}; border-radius: 6px; cursor: pointer; font-weight: 600; display: inline-block`
      return `<button style="${escapeHtml(style)}">${label}</button>`
    }

    case 'Image': {
      const src = escapeHtml((node.props['src'] as string) ?? '')
      const alt = escapeHtml((node.props['alt'] as string) ?? '')
      const width = node.props['width'] as string
      const style = width ? `max-width: ${width}; height: auto` : 'max-width: 100%; height: auto'
      return `<img src="${src}" alt="${alt}" style="${escapeHtml(style)}" />`
    }

    case 'Spacer': {
      const height = (node.props['height'] as number) ?? 32
      return `<div style="height: ${height}px"></div>`
    }

    case 'Divider': {
      const color = (node.props['color'] as string) ?? '#e5e7eb'
      const thickness = (node.props['thickness'] as number) ?? 1
      return `<hr style="border: none; border-top: ${thickness}px solid ${escapeHtml(color)}; margin: 16px 0" />`
    }

    case 'Video': {
      const src = escapeHtml((node.props['src'] as string) ?? '')
      return `<video src="${src}" controls style="max-width: 100%; height: auto"></video>`
    }

    case 'Link': {
      const href = escapeHtml((node.props['href'] as string) ?? '#')
      const label = escapeHtml((node.props['label'] as string) ?? '')
      const color = (node.props['color'] as string) ?? '#3b82f6'
      return `<a href="${href}" style="color: ${escapeHtml(color)}; text-decoration: underline">${label || childrenHtml}</a>`
    }

    default:
      return childrenHtml ? `<div>${childrenHtml}</div>` : ''
  }
}

export function generateHtml(doc: PageDocument): string {
  const rootNode = doc.nodes[doc.rootId]
  if (!rootNode) return ''

  const bodyContent = rootNode.children
    .map((childId) => {
      const child = doc.nodes[childId]
      return child ? renderNode(child, doc) : ''
    })
    .join('\n')

  const title = escapeHtml(doc.meta?.title ?? 'PageCraft Export')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    img { display: block; }
  </style>
</head>
<body>
${bodyContent}
</body>
</html>`
}

export function exportToHtml(doc: PageDocument): void {
  const html = generateHtml(doc)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'page.html'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
