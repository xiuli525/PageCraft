# ⚡ PageCraft

> A visual page builder engine for the modern web. Drag, drop, design — export anywhere.

[![License MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

PageCraft is a high-performance, extensible open-source visual page builder. It provides a professional-grade editing experience for building responsive web pages through an intuitive drag-and-drop interface — no CSS knowledge required.

## 🎬 What It Does

- **Drag components** from a palette onto a live canvas
- **Click to select** any element and edit its properties in real-time
- **Undo / Redo** every change (50-step history with keyboard shortcuts)
- **Preview** your page without editor chrome
- **Export to HTML** — download a standalone, dependency-free HTML file
- **Auto-save** to localStorage — your work persists across sessions
- **Keyboard shortcuts** — Delete, Ctrl+Z, Ctrl+Shift+Z, Ctrl+C/V, Escape

## 🏗️ Architecture

```text
                                  ┌──────────────────┐
                                  │    @pageforge    │
                                  │       web        │ (Demo App :3000)
                                  └────────┬─────────┘
                                           │
               ┌───────────────────────────┼───────────────────────────┐
               ▼                           ▼                           ▼
    ┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
    │    @pageforge    │        │    @pageforge    │        │    @pageforge    │
    │      editor      │        │     renderer     │        │      server      │
    └──────────┬───────┘        └──────────┬───────┘        └──────────────────┘
               │                           │
               └─────────────┬─────────────┘
                             ▼
                    ┌──────────────────┐        ┌──────────────────┐
                    │    @pageforge    │        │    @pageforge    │
                    │      core        │◄───────┤       sdk        │
                    └────────┬─────────┘        └──────────────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    @pageforge    │
                    │    components    │ (12 Built-ins)
                    └──────────────────┘
```

## 📦 Packages

| Package                 | Description                                                                | Status |
| :---------------------- | :------------------------------------------------------------------------- | :----- |
| `@pageforge/core`       | Document model (Zustand + Immer), schema types, plugin host, event bus     | Stable |
| `@pageforge/editor`     | 3-panel visual editor — canvas, component palette, property panel, toolbar | Active |
| `@pageforge/renderer`   | Standalone rendering engine for preview and SSR                            | Stable |
| `@pageforge/components` | 12 built-in components with full prop schemas                              | Stable |
| `@pageforge/sdk`        | `definePlugin()` API for custom components and extensions                  | Stable |
| `@pageforge/server`     | Hono API with SQLite for template CRUD, HTML export, publishing            | Beta   |

## 🚀 Quick Start

```bash
git clone https://github.com/xiuli525/PageCraft.git
cd PageCraft
pnpm install
cd apps/web && npx vite
```

Open http://localhost:3000

## 🧩 Built-in Components

**Layout**: Section, Container, Grid, Columns, Spacer
**Content**: Text, Heading, Image, Video
**Interaction**: Button, Link
**Visual**: Divider

## ⚙️ Tech Stack

| Layer        | Technology                                             |
| :----------- | :----------------------------------------------------- |
| Monorepo     | Turborepo + pnpm workspaces                            |
| UI Framework | React 18 + TypeScript (strict)                         |
| State        | Zustand + Immer (immutable updates, 50-step undo/redo) |
| Drag & Drop  | @dnd-kit (PointerSensor, 5px activation)               |
| Build        | Vite (dev) + Vite library mode (packages)              |
| Backend      | Hono + SQLite (templates API)                          |
| Styling      | Inline styles only (zero CSS dependencies)             |

## 🔑 Key Design Decisions

### Flat-Map Document Model

Every node lives in a flat `Record<NodeId, PageNode>` — no recursive tree traversal needed. O(1) lookups, O(1) updates, trivially serializable to JSON.

### Plugin System

Type-safe `definePlugin()` API with strict lifecycle (`activate` / `deactivate`). Plugins register components, datasources, actions, and themes through a sandboxed context.

```typescript
import { definePlugin } from '@pageforge/sdk'

export default definePlugin({
  id: 'my-chart',
  type: 'component',
  version: '1.0.0',
  activate(ctx) {
    ctx.registerComponent({
      name: 'BarChart',
      render: (props) => <div>{/* chart */}</div>,
      settings: [{ id: 'data', type: 'text', label: 'Data Source' }],
    })
  },
  deactivate() {},
})
```

### Zero External UI Dependencies

The entire editor UI uses inline React styles — no Ant Design, no Tailwind, no CSS modules. This means zero style conflicts when embedded in any host application, no CSS build pipeline, and trivial theming through style overrides.

## 🛣️ Roadmap

- [x] Flat-Map document model with 50-step undo/redo
- [x] Visual drag-and-drop canvas with @dnd-kit
- [x] Real-time property editing with live canvas updates
- [x] Keyboard shortcuts (Delete, Undo, Redo, Copy, Paste, Select All)
- [x] Preview mode (full-page, no editor chrome)
- [x] HTML export (standalone, dependency-free)
- [x] localStorage persistence (auto-save)
- [x] Hono + SQLite template server
- [ ] Real-time collaboration (WebSockets)
- [ ] Advanced CSS Grid visual designer
- [ ] Multi-page site publishing pipeline
- [ ] Theme / design token system
- [ ] AI-assisted layout generation

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT — see [LICENSE](LICENSE) for details.
