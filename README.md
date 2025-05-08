# C4 Modelizer

[![License: CC BY-NC 4.0](https://img.shields.io/badge/license-CC--BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
[![linter](https://github.com/Eth3rnit3/c4_modelizer/actions/workflows/lint.yaml/badge.svg)](https://github.com/Eth3rnit3/c4_modelizer/actions/workflows/lint.yaml)
[![Cypress Tests](https://github.com/Eth3rnit3/c4_modelizer/actions/workflows/cypress.yml/badge.svg)](https://github.com/Eth3rnit3/c4_modelizer/actions/workflows/cypress.yml)
[![Node.js >=22](https://img.shields.io/badge/node-%3E%3D22-brightgreen.svg)](https://nodejs.org/)
[![Open Issues](https://img.shields.io/github/issues/eth3rnit3/c4_modelizer)](https://github.com/eth3rnit3/c4_modelizer/issues)

![C4 Modelizer Logo](/public/logo.svg)

**C4 Modelizer** is a web application that lets you design, explore and document a system architecture using the [C4 model](https://c4model.com/). It supports collaborative diagram editing, import/export with schema versioning and a fully‑typed plugin API.

---

## ✨ Key goals

* **Visual communication** — help teams discuss and refine their architecture with clear diagrams.
* **Single source of truth** — all diagrams share the same JSON model; no drift between views.
* **Developer‑friendly** — React + TypeScript + Vite for a fast, hackable codebase.
* **Customisable** — blocks, icons and behaviours can be extended through the plugin system (see below).

---

## 🚀 Main features

| Category        | Details                                                              |
| --------------- | -------------------------------------------------------------------- |
| Diagram types   | System ↔ Container ↔ Component ↔ Code (C4 levels 1‑4)                |
| Edit            | Drag‑and‑drop nodes, inline rename, technology picker, context menus |
| Blocks          | Custom icons / colours, technology tags, markdown description        |
| Relations       | Create, edit, style connections and dependencies between any levels   |
| Import / Export | JSON with embedded schema version; copy‑paste between instances      |
| UX              | Multilingual (i18n), responsive layout, dark theme                   |

---

## 📸 Screenshots

### Live editing

![C4 Modelizer Import/Export Demo](/doc/import.gif)

---

## 🔗 Tech stack

* **[Vite](https://vitejs.dev/)** — lightning‑fast build and HMR
* **[React](https://react.dev/)** + **[TypeScript](https://www.typescriptlang.org/)**
* **[Material UI](https://mui.com/)** — component library
* **[@xyflow/react](https://reactflow.dev/)** — canvas & graph layout
* **[i18next](https://www.i18next.com/)** — internationalisation engine

---

## 🔧️ Setup & Usage

### Using Docker (recommanded)

The quickest way to run C4 Modelizer:

```bash
# Pull the image from Docker Hub
$ docker pull eth3rnit3/c4_modelizer:latest

# Run the container
$ docker run -p 8080:80 eth3rnit3/c4_modelizer:latest
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 💿 Development

### Requirements

* Node.js **≥ 22**
* npm **≥ 11** (or pnpm ≥ 9 / yarn ≥ 4)

### Local Setup

```bash
# 1. Clone the repo
$ git clone https://github.com/eth3rnit3/c4_modelizer.git
$ cd c4_modelizer

# 2. Install dependencies
$ npm install  # or pnpm install

# 3. Start the dev server
$ npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔌 Plugin system

C4 Modelizer ships with a light but powerful **runtime plugin API**. You can inject new UI pieces, override existing ones, render global overlays or even access the core Zustand store—all without touching the core source.

### 1. Quick overview

```text
┌────────────┐   loadPlugins()   ┌───────────────┐
│  Core app  │ ───────────────▶  │  Your plugin  │
└────────────┘                   └───────────────┘
        ▲    registry.register*()        │
        └────────────────────────────────┘
```

1. **The core** exposes a singleton `PluginRegistry`.
2. At boot, `loadPlugins()` reads **`VITE_PLUGINS`** (comma‑separated package names) and imports each one.
3. A plugin exports a `C4Plugin` object with a `setup(registry)` function where it registers **components**, **portals** and **methods**.
4. Slots (`ToolbarSlot`, `NavBarSlot`, etc.) resolve their component through the registry at render time.

---

### 2. Accessing the core store (`useStore`)

The core registers a helper so plugins can share the **exact same Zustand store**:

```ts
// inside the core (already done)
registry.registerMethod('useStore', () => useC4Store)
```

In a plugin:

```ts
import type { C4Plugin } from 'c4_modelizer/plugin'

const plugin: C4Plugin = {
  name: 'stats',
  version: '1.0.0',
  setup(reg) {
    const useStore = reg.getMethod('useStore')!()   // the real hook

    reg.registerComponent('panel:stats', async () => {
      return function StatsPanel() {
        const total = useStore((s) => s.model.systems.length)
        const reset = useStore((s) => s.actions.reset)
        return (
          <div>
            <p>{total} systems</p>
            <button onClick={reset}>Reset</button>
          </div>
        )
      }
    })
  },
}
export default plugin
```

> `getMethod()` returns the factory **you** registered; calling it yields the hook. All store selectors & actions are thus fully typed.

---

### 3. Global overlays via the `global-overlay` portal

The core provides a `<PortalTarget id="global-overlay" />` at the root of the DOM. Any plugin can push a React node into it:

```ts
import Overlay from './Overlay'

registry.registerPortal('global-overlay', <Overlay />)
```

`Overlay.tsx` can be anything—modals, toasts, real‑time collaboration panels—and it’s rendered outside the normal React tree, above everything else.

To **update or remove** the overlay later:

```ts
registry.registerPortal('global-overlay', null)            // remove
registry.registerPortal('global-overlay', <NewOverlay />)  // replace
```

---

### 4. Common slot identifiers

| Identifier       | Purpose                   | Core default     |
| ---------------- | ------------------------- | ---------------- |
| `root:provider`  | Wrap the whole app        | `React.Fragment` |
| `toolbar:main`   | Main action toolbar       | `Toolbar`        |
| `navbar:main`    | Breadcrumb / nav bar      | `NavBar`         |
| `global-overlay` | Full‑screen portal target | *(empty)*        |

*(Need another slot? Open an issue or PR!)*

---

### 5. Enabling plugins

```bash
# 1. Install your package next to c4_modelizer
npm i @my-scope/cool-toolbar --save

# 2. List active plugins (comma‑separated)
VITE_PLUGINS=@my-scope/cool-toolbar npm run dev
```

That’s it – the registry will pick them up and your components or overlays will show up instantly.

## 🤝 Contributing Contributing

1. **Fork** the repository and create a feature or fix branch (`feature/new‑icon‑set`, `fix/overflow‑toolbar`, …).
2. **Code** your changes following the project conventions (ESLint, Prettier, TypeScript strict mode).
3. **Test** locally (`npm test`, `npm run cypress:open`).
4. **Commit** using conventional commits (`feat:`, `fix:`, etc.).
5. **Open a Pull Request** — describe the motivation and link to any related issue.

The maintainers will review and guide you through the merge.

---

## 🐞 Bug reports & ideas

Use the **Issues** tab. Please include:

* steps to reproduce (gif or screenshot appreciated),
* expected vs. actual behaviour,
* browser / OS / Node version.

---

## 📄 License

C4 Modelizer is available under the **Polyform Internal Use License 1.0.0**.

You may:

* **Share** — copy and redistribute the software **for internal use** within your organization.
* **Adapt** — remix, transform and build upon the software **for internal use**.

**Under the following conditions:**

* **Internal Use Only** — any use beyond your organization’s internal operations (including commercial SaaS, redistribution, or offering as a service) requires a separate commercial license.


