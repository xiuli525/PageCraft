# ⚡ PageForge

> The visual page builder engine for the modern web. Build once, deploy anywhere, scale infinitely.

[![License MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![GitHub Stars](https://img.shields.io/github/stars/pageforge/pageforge.svg?style=social)](https://github.com/pageforge/pageforge)

PageForge is a high-performance, extensible open-source visual page builder and low-code platform. It provides a robust engine and a professional-grade editing experience for building complex, responsive web pages without writing a single line of CSS.

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
    │      editor      │        │     renderer     │        │      server      │ (Hono + SQLite)
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

## ✨ Features

- **🎨 Professional Editor** — A 3-panel layout with a dark sidebar (240px), a flexible white canvas, and a powerful configuration panel (300px).
- **📐 Flat-Map Schema** — High-performance `Record<NodeId, PageNode>` document model with bidirectional references for O(1) node lookups and updates.
- **⚡ Reactive State** — Powered by **Zustand** and **Immer**, featuring a built-in 50-step undo/redo history and efficient partial re-renders.
- **🎯 Precise Drag & Drop** — Built on **@dnd-kit** with PointerSensor (5px activation distance) for a fluid and intentional design experience.
- **📱 Responsive by Design** — Native support for breakpoint-specific styles, named slots, and fluid layouts (Grid, Columns, Section).
- **🔌 Plugin Architecture** — Extensible host system supporting custom components, datasources, actions, and themes within a dual-context sandbox.

## 📦 Package Overview

| Package                 | Description                                                      | Status   |
| :---------------------- | :--------------------------------------------------------------- | :------- |
| `@pageforge/core`       | Schema definition, document model, plugin host, and event system | `Stable` |
| `@pageforge/editor`     | 3-panel visual editor UI with canvas and configuration panels    | `Active` |
| `@pageforge/renderer`   | High-performance engine for converting schema to React UI        | `Stable` |
| `@pageforge/components` | Library of 12 standard built-in visual components                | `Stable` |
| `@pageforge/sdk`        | Developer SDK for building custom plugins with `definePlugin`    | `Stable` |
| `@pageforge/server`     | Hono-based API with SQLite storage for templates and publishing  | `Beta`   |
| `@pageforge/web`        | Official demo application and reference implementation           | `Active` |

## 🚀 Quick Start

Ensure you have [pnpm](https://pnpm.io/) installed.

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Build all packages**

   ```bash
   pnpm build
   ```

3. **Start development environment**
   ```bash
   pnpm dev
   ```

   - Web App: `http://localhost:3000`
   - Server API: `http://localhost:3001`

## 🏗️ Technical Deep Dive

### Flat-Map Schema

Unlike traditional tree-based schemas that suffer from performance degradation on deep hierarchies, PageForge uses a **Flat-Map** design. Every node is stored at the top level of a record, indexed by its ID. This allows for instant updates and simplified serialization without recursive traversals.

### Plugin System

The plugin host manages a strict lifecycle (`activate` / `deactivate`) with a 5s timeout safety mechanism. Plugins run in a dual-context sandbox, ensuring that third-party code cannot compromise the editor's core stability while still providing full access to the PageForge SDK.

## 🔌 Plugin Development

Creating a custom component or action is simple with the `@pageforge/sdk`.

```typescript
import { definePlugin } from '@pageforge/sdk';

export default definePlugin({
  id: 'my-custom-button',
  type: 'component',
  version: '1.0.0',

  activate(ctx) {
    ctx.registerComponent({
      name: 'CustomButton',
      render: (props) => <button>{props.label}</button>,
      settings: [
        { id: 'label', type: 'text', label: 'Button Text' }
      ]
    });
  },

  deactivate() {
    console.log('Plugin cleaning up...');
  }
});
```

## 🧩 Built-in Components

PageForge comes with 12 essential components out of the box:

- **Layout**: `Section`, `Container`, `Grid`, `Columns`, `Spacer`
- **Content**: `Text`, `Heading`, `Image`, `Video`
- **Interaction**: `Button`, `Link`
- **Visual**: `Divider`

## 🛣️ Roadmap

- [x] Core Flat-Map Document Model
- [x] Zustand State Engine with 50-step Undo/Redo
- [x] @dnd-kit Visual Canvas Integration
- [x] Hono + SQLite Template Server
- [ ] Real-time Collaboration (WebSockets)
- [ ] Advanced CSS Grid Visual Designer
- [ ] Multi-page Site Publishing Pipeline
- [ ] Theme Variable System (Design Tokens)

## 🤝 Contributing

We love contributions! Whether it's fixing bugs, improving documentation, or proposing new features, please feel free to open an issue or submit a pull request.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
