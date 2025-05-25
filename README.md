# C4 Modelizer

[![License: CC BY-NC 4.0](https://img.shields.io/badge/license-CC--BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
[![linter](https://github.com/archivisio/c4_modelizer/actions/workflows/lint.yaml/badge.svg)](https://github.com/archivisio/c4_modelizer/actions/workflows/lint.yaml)
[![Cypress Tests](https://github.com/archivisio/c4_modelizer/actions/workflows/cypress.yml/badge.svg)](https://github.com/archivisio/c4_modelizer/actions/workflows/cypress.yml)
[![Node.js >=22](https://img.shields.io/badge/node-%3E%3D22-brightgreen.svg)](https://nodejs.org/)
[![Open Issues](https://img.shields.io/github/issues/archivisio/c4_modelizer)](https://github.com/archivisio/c4_modelizer/issues)

![C4 Modelizer Logo](/public/logo.svg)

**C4 Modelizer** is a web application that lets you design, explore and document a system architecture using the [C4 model](https://c4model.com/).

---

## ✨ Key goals

* **Visual communication** — help teams discuss and refine their architecture with clear diagrams
* **Single source of truth** — all diagrams share the same JSON model; no drift between views
* **Developer‑friendly** — React + TypeScript + Vite for a fast, hackable codebase

---

## 🚀 Main features

* **Diagram types**: System ↔ Container ↔ Component ↔ Code (C4 levels 1‑4)
* **Edit**: Drag‑and‑drop nodes, inline rename, technology picker, context menus
* **Blocks**: Custom icons/colours, technology tags, markdown description
* **Relations**: Create, edit, style connections and dependencies between any levels
* **Import/Export**: JSON with embedded schema version; copy‑paste between instances
* **UX**: Multilingual (i18n), responsive layout, dark theme

---

## 📸 Screenshots

![C4 Modelizer Import/Export Demo](/doc/import.gif)

---

## 🔗 Tech stack

* **[Vite](https://vitejs.dev/)** — lightning‑fast build and HMR
* **[React](https://react.dev/)** + **[TypeScript](https://www.typescriptlang.org/)**
* **[Material UI](https://mui.com/)** — component library
* **[@xyflow/react](https://reactflow.dev/)** — canvas & graph layout
* **[i18next](https://www.i18next.com/)** — internationalisation engine

---

## 🔌 Plugin system

C4 Modelizer features a powerful plugin system for extending functionality. For detailed documentation, see [Plugin Documentation](./docs/PLUGINS.md).

---

## 🔧️ Setup & Usage

### Using Docker (recommended)

```bash
# Pull the image from Docker Hub
$ docker pull eth3rnit3/c4_modelizer:latest

# Run the container
$ docker run -p 8080:80 eth3rnit3/c4_modelizer:latest
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

### Development

**Requirements:**
* Node.js **≥ 22**
* npm **≥ 11** (or pnpm ≥ 9 / yarn ≥ 4)

```bash
# 1. Clone the repo
$ git clone https://github.com/eth3rnit3/c4_modelizer.git
$ cd c4_modelizer

# 2. Install dependencies
$ npm install

# 3. Start the dev server
$ npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🤝 Contributing

1. **Fork** the repository and create a feature branch
2. **Code** your changes following the project conventions
3. **Test** locally (`npm test`, `npm run cypress:open`)
4. **Commit** using conventional commits (`feat:`, `fix:`, etc.)
5. **Open a Pull Request** with a clear description

---

## 🐞 Bug reports

Use the **Issues** tab. Please include:
* Steps to reproduce (gif or screenshot appreciated)
* Expected vs actual behaviour
* Browser/OS/Node version

---

## 📄 License

C4 Modelizer is available under the **Polyform Internal Use License 1.0.0**.

You may:
* **Share** — copy and redistribute the software **for internal use** within your organization
* **Adapt** — remix, transform and build upon the software **for internal use**

**Under the following conditions:**
* **Internal Use Only** — any use beyond your organization's internal operations requires a separate commercial license
