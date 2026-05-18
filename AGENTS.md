<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Architecture
The app relies on DDD and clean architecture principles. The business entities and logic are located under @src folder.
Any changes to the "domain" and "application" layers should only be made with the approval of the task author (living person).
Changes in the infrastructure layer should always be based on 'domain' and 'application' layers.
Even though the app is in a single repository, you should treat @src as the separate core application and a source of truth for the app's architecture and implementations.

## Implementation/NextJS
When plugging core classes into the Next.js app, always ensure that core classes are usable in both client and server contexts, and if this isn't possible, never use the core classes in the context where they are not usable.

## Design

Warm, editorial, minimal. No flashy effects. Premium feel through restraint.

**Color palette** (Tailwind `stone` + custom sage accent):

| Role | Class / Value | Hex |
|------|--------------|-----|
| Page background | `bg-stone-100` | `#f5f5f4` |
| Surface (cards, sidebar) | `bg-white` | `#ffffff` |
| Primary text | `text-stone-900` | `#1c1917` |
| Secondary text | `text-stone-500` | `#78716c` |
| Border | `border-stone-200` | `#e7e5e4` |
| User message bubble | `bg-stone-900 text-white` | `#1c1917` |
| Assistant message bubble | `bg-stone-100 text-stone-900` | `#f5f5f4` |
| Accent (CTA, active state) | inline `#4a6741` | sage green |

**Typography:** Geist Sans. Headings `font-medium tracking-tight`. Body/messages `leading-relaxed text-sm`.

**Sidebar:** 260 px wide, white background, `border-r border-stone-200`. Active item has a left accent bar in sage green.

**Chat area:** max-width `672px`, centered. Messages use rounded bubbles (`rounded-2xl`) with a flattened corner on the speaking side.
