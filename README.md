# C4 Modelizer

[![License: CC BY-NC 4.0](https://img.shields.io/badge/license-CC--BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
[![linter](https://github.com/Eth3rnit3/c4_modelizer/actions/workflows/lint.yaml/badge.svg)](https://github.com/Eth3rnit3/c4_modelizer/actions/workflows/lint.yaml)
[![Cypress Tests](https://github.com/Eth3rnit3/c4_modelizer/actions/workflows/cypress.yml/badge.svg)](https://github.com/Eth3rnit3/c4_modelizer/actions/workflows/cypress.yml)
[![Node.js >=22](https://img.shields.io/badge/node-%3E%3D22-brightgreen.svg)](https://nodejs.org/)
[![Open Issues](https://img.shields.io/github/issues/eth3rnit3/c4_modelizer)](https://github.com/eth3rnit3/c4_modelizer/issues)

![C4 Modelizer Logo](/public/logo.svg)

C4 Modelizer is a web application for visually modeling the software architecture of a system using the C4 method. It enables the creation, editing, and documentation of C4 diagrams (System, Container, Component, Code) in an interactive and collaborative way.

## Project Purpose

- Help teams design and document software architecture graphically.
- Facilitate communication between stakeholders with clear visual representations.
- Provide a modern and ergonomic interface based on React, TypeScript, and Material UI.
- Support customization of blocks (technologies, system types, icons, etc.).

## Main Features

- Create and edit C4 blocks (System, Container, Component, Code)
- Select system type with icon
- Associate technologies with blocks
- Manage connections and dependencies
- Import/export the model (with schema versioning)
- Responsive and multilingual interface (i18n)

## Demonstration

### Application Overview

![C4 Modelizer Application Demo](/doc/app.gif)

### Import/Export Functionality

![C4 Modelizer Import/Export Demo](/doc/import.gif)

## Main Dependencies

- [Vite](https://vitejs.dev/) — Lightning-fast frontend tooling
- [React](https://react.dev/) — UI library
- [Material UI](https://mui.com/) — UI components
- [@xyflow/react](https://reactflow.dev/) — Diagramming/flow rendering
- [i18next](https://www.i18next.com/) — Internationalization
- [TypeScript](https://www.typescriptlang.org/) — Static typing for JavaScript

## Requirements

- Node.js >= 22
- npm >= 11

## Installation & Usage

```bash
# Clone the repository
git clone https://github.com/eth3rnit3/c4_modelizer.git
cd c4_modelizer

# Install dependencies
npm install

# Start the application in development mode
npm run dev
```

The app will be available at http://localhost:5173

## Contributing or Bug Fixes

1. **Fork** this repository and create a new descriptive branch (e.g. `fix/bug-description` or `feature/new-block-type`).
2. **Develop** your changes following the project’s structure and style (TypeScript, React, RSpec for Ruby tests if needed on backend).
3. **Test** your modifications locally.
4. **Open a Pull Request** to the main repository, clearly describing the problem or feature you are addressing.
5. A maintainer will review your contribution.

## Reporting Bugs or Suggestions

Open an issue using the "Issues" tab on GitHub, describing the problem or improvement idea in detail.

## License

This project is distributed under the Creative Commons BY-NC 4.0 International License.

You are free to:
- Share — copy, distribute and transmit the work by any means and in any format
- Adapt — remix, transform, and build upon the material

**Under the following conditions:**
- Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made.
- NonCommercial — You may not use the material for commercial purposes.

See the full license text: [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)
