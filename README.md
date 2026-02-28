# @pratham/ui

> Shared React + TypeScript design system for all portfolio projects.

**Storybook:** https://pratham-ui.vercel.app  
**Stack:** React 19 · TypeScript · CSS Custom Properties · Vite · Storybook 8

---

## Components (18)

| Component | Key Props |
|-----------|-----------|
| `Button` | `variant` (primary/secondary/ghost/danger/glow), `size`, `loading`, `iconLeft/Right` |
| `Card` | `variant` (glass/solid/outlined), `clickable`, `noPadding` |
| `Badge` | `variant` (accent/success/warning/danger/neutral), `size`, `outlined`, `dot` |
| `Nav` | `logo`, `links: {label, href}[]`, `cta` — scroll-aware glass transition |
| `Footer` | `brand`, `tagline`, `links`, `copyright`, `bottomRight` |
| `Input` | `label`, `error`, `iconLeft/Right`, `showCount`, `size` |
| `Textarea` | `label`, `error`, `autoResize`, `showCount` |
| `LoadingSpinner` | `size` (sm/md/lg) |
| `Skeleton` | `variant` (text/rect/circle), `width`, `height` |
| `Modal` | `open`, `onClose`, `title`, `size`, `footer` — focus trap + Escape |
| `Tooltip` | `content`, `placement` (top/bottom/left/right), `delay` |
| `Tag` | `outlined`, `clickable`, `icon`, `removable`, `onRemove` |
| `Avatar` | `src`, `name` (initials fallback), `size`, `online` |
| `StatCard` | `value`, `label`, `trend` (up/down/neutral), `trendLabel`, `icon` |
| `GlassPanel` | `glow`, `noPadding` |
| `EmptyState` | `icon`, `title`, `description`, `action` |
| `ConnectionStatus` | `state` (connected/connecting/disconnected/unavailable), `variant` (banner/badge) |
| `SectionHeader` | `overline`, `title`, `subtitle`, `centered`, `as` |

---

## Integration (sibling projects)

### 1. Add to `package.json`

```json
{
  "dependencies": {
    "@pratham/ui": "file:../pratham-ui"
  }
}
```

### 2. Install

```bash
npm install
```

### 3. Import CSS in `src/main.tsx`

```tsx
import '@pratham/ui/styles'   // tokens + reset + component styles
import './index.css'           // your project overrides
```

### 4. Override accent in your `src/index.css`

```css
:root {
  --ui-accent: #6366f1;             /* your project's accent */
  --ui-accent-dim: rgba(99,102,241,0.25);
  --ui-accent-glow: rgba(99,102,241,0.12);
}
```

### 5. Use components

```tsx
import { Button, Card, Badge, Nav, GlassPanel } from '@pratham/ui'

function App() {
  return (
    <>
      <Nav
        logo={<span>MyApp</span>}
        links={[{ label: 'About', href: '#about' }]}
        cta={<Button variant="glow" size="sm">Hire Me</Button>}
      />
      <GlassPanel glow>
        <Badge variant="accent" dot>Live</Badge>
        <Button variant="primary">Get Started</Button>
      </GlassPanel>
    </>
  )
}
```

---

## Token Reference

All components use `--ui-*` CSS variables. Override any token in your project's `:root`:

```css
/* Backgrounds */
--ui-bg-0: #080810;   --ui-bg-1: #0f0f1a;   --ui-bg-2: #15151f;   --ui-bg-3: #1c1c2a;

/* Accent (OVERRIDE per project) */
--ui-accent: #00E5D1;
--ui-accent-dim: rgba(0,229,209,0.25);
--ui-accent-glow: rgba(0,229,209,0.12);

/* Text */
--ui-text-0: #fff;   --ui-text-1: rgba(255,255,255,0.75);   --ui-text-2: rgba(255,255,255,0.45);

/* Radius: --ui-r-sm/md/lg/xl/full */
/* Spacing: --ui-sp-1 through --ui-sp-16 */
/* Transitions: --ui-t-fast/base/slow */
```

---

## DocMind AI token mapping

```css
/* In docmind's index.css */
:root {
  --purple: var(--ui-accent);      /* was var(--purple) */
  --cyan:   var(--ui-accent);      /* alias */
  --text:   var(--ui-text-0);
  --border: var(--ui-border);
}
```

---

## Local development

```bash
npm run storybook       # dev server at :6006
npm run build           # lib build → dist/
npm run build-storybook # static → storybook-static/
```

---

## Notes for consuming projects

- **No Framer Motion** — all animations are CSS transitions. Projects with Framer Motion can wrap components in `motion.div`
- **No router deps** — components are pure, no `react-router` imports
- **Tree-shakeable** — named ESM exports, import only what you use
- **Collabboard light/dark**: `useTheme()` hook still works; our tokens read from `:root`, so toggle `data-theme` on `<html>` and override `--ui-*` vars in `[data-theme="light"]`

---

_Built by Forge · @pratham/ui v1.0.0_
