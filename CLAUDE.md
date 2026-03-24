# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev            # Vite dev server (for component prototyping)
npm run storybook      # Storybook at port 6006 (primary development environment)
npm run build          # Build library → dist/ (uses vite.lib.config.ts)
npm run build-storybook # Build static Storybook → storybook-static/
npm run lint           # ESLint (flat config, ESLint 9)
```

There are no tests configured. Storybook is the verification environment.

## Architecture

This is a **React 19 component library** published as `@pratham7711/ui`. It is consumed by sibling projects via `"@pratham/ui": "file:../pratham-ui"` in their `package.json`.

### Build outputs

- `dist/index.js` — ESM bundle of all components (entry: `src/index.ts`)
- `dist/styles.css` — Single CSS file with all tokens and component styles (`cssCodeSplit: false`)
- `dist/index.d.ts` — Type declarations

React and react-dom are externalized (peerDependencies). No CJS/UMD output.

### CSS token system

All styling uses CSS custom properties defined in `src/styles/tokens.css`. No CSS-in-JS, no Tailwind, no Framer Motion. Components use class-based styling from `src/styles/components.css`.

Key token namespaces: `--ui-bg-*`, `--ui-accent` (overridable per-project), `--ui-text-*`, `--ui-sp-*` (spacing 4px–64px), `--ui-r-*` (border radius), `--ui-z-*` (z-index scale), `--ui-t-*` (transition durations).

Theme switching works via `data-theme` attribute. Consuming projects customize the accent by overriding `--ui-accent`, `--ui-accent-dim`, and `--ui-accent-glow`.

### Component conventions

- All components in `src/components/`, one file per component
- Named exports only (no default exports)
- `React.forwardRef` used where DOM refs are needed
- Accessibility-first: semantic HTML + ARIA attributes
- Each component has a corresponding story in `src/stories/`
- All components re-exported from `src/index.ts`, which also side-effect imports `./styles/index.css`

### Deployment

Vercel deploys Storybook (`npm run build-storybook`) to https://pratham-ui.vercel.app. Install uses `--legacy-peer-deps` due to React 19 peer dep resolution.

### TypeScript

Strict mode enabled (`tsconfig.app.json`). No unused variables or parameters allowed. Uses project references: `tsconfig.json` → `tsconfig.app.json` (src) + `tsconfig.node.json` (build scripts). A `tsconfig.dts.json` exists (untracked) for declaration emit.
