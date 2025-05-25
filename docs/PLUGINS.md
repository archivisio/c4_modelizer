# Plugin System

C4 Modelizer ships with a light but powerful **runtime plugin API**. You can inject new UI pieces, override existing ones, render global overlays or even access the core Zustand store—all without touching the core source.

---

## 1. Quick overview

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

## 2. Accessing the core store (`useStore`)

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

## 3. Global overlays via the `global-overlay` portal

The core provides a `<PortalTarget id="global-overlay" />` at the root of the DOM. Any plugin can push a React node into it:

```ts
import Overlay from './Overlay'

registry.registerPortal('global-overlay', <Overlay />)
```

`Overlay.tsx` can be anything—modals, toasts, real‑time collaboration panels—and it's rendered outside the normal React tree, above everything else.

To **update or remove** the overlay later:

```ts
registry.registerPortal('global-overlay', null)            // remove
registry.registerPortal('global-overlay', <NewOverlay />)  // replace
```

---

## 4. Common slot identifiers

| Identifier       | Purpose                   | Core default     |
| ---------------- | ------------------------- | ---------------- |
| `root:provider`  | Wrap the whole app        | `React.Fragment` |
| `toolbar:main`   | Main action toolbar       | `Toolbar`        |
| `navbar:main`    | Breadcrumb / nav bar      | `NavBar`         |
| `global-overlay` | Full‑screen portal target | *(empty)*        |
| `toolbar:actions-before` | Portal before the main toolbar | *(empty)*        |
| `toolbar:actions-after` | Portal after the main toolbar | *(empty)*        |
| `navbar:before` | Portal before the main navbar | *(empty)*        |
| `navbar:after` | Portal after the main navbar | *(empty)*        |

*(Need another slot? Open an issue or PR!)*

---

## 5. Enabling plugins

```bash
# 1. Install your package next to c4_modelizer
npm i @my-scope/cool-toolbar --save

# 2. List active plugins (comma‑separated)
VITE_PLUGINS=@my-scope/cool-toolbar npm run dev
```

That's it – the registry will pick them up and your components or overlays will show up instantly.

---

## Plugin Development Best Practices

1. **TypeScript first** — Use strict typing for better DX and reliability
2. **Lazy loading** — Use dynamic imports for component registration to improve startup time
3. **Error handling** — Wrap your plugin logic in try/catch blocks
4. **Testing** — Create unit tests for your plugin components and logic
5. **Documentation** — Document your plugin's API and usage patterns

---

## Example Plugin Structure

```
my-plugin/
├── src/
│   ├── components/
│   │   └── MyComponent.tsx
│   ├── types/
│   │   └── index.ts
│   └── index.ts
├── package.json
└── README.md
```

### package.json
```json
{
  "name": "@my-scope/c4-plugin-example",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "peerDependencies": {
    "react": "^18.0.0",
    "c4_modelizer": "^1.0.0"
  }
}
```

### src/index.ts
```ts
import type { C4Plugin } from 'c4_modelizer/plugin'

const plugin: C4Plugin = {
  name: 'example-plugin',
  version: '1.0.0',
  setup(registry) {
    // Register your components, portals, and methods here
  },
}

export default plugin
```
