# Design Brief: BLOOM

## Tone & Purpose
Celebratory, fan-focused K-pop showcase with maximalist-luxe energy. Dark-mode first design where each group's color theme becomes a vibrant, distinct accent against nearly-black backgrounds. Premium, editorial sophistication meets playful fan culture.

## Differentiation
Four complete visual theme shifts (ILLIT, BTS, Cortis, LE SSERAFIM) — each section feels like entering a different aesthetic universe. Bold color commits, no blending. Glassmorphic card treatments, smooth transitions, and curated typography hierarchy.

## Color Palette (OKLCH)

| Token | OKLCH | Usage |
|-------|-------|-------|
| `--background` | 0.1 0 0 | Nearly black, ultra-dark base |
| `--card` | 0.15 0 0 | Slightly elevated surfaces |
| `--foreground` | 0.92 0 0 | Bright white text |
| `--border` | 0.25 0 0 | Subtle dividers |
| `--illit-primary` | 0.7 0.15 350 | ILLIT pink/pastel accent |
| `--bts-primary` | 0.55 0.18 280 | BTS deep purple/navy |
| `--cortis-primary` | 0.6 0.18 200 | Cortis vibrant teal/cyan |
| `--sserafim-primary` | 0.65 0.16 25 | LE SSERAFIM gold/red |

## Typography
- **Display**: Space Grotesk (bold, modern, geometric) — headlines, section titles, CTAs
- **Body**: General Sans (clean, refined, accessible) — descriptions, facts, chart labels
- **Scale**: 12px (caption) → 14px (body) → 16px (label) → 20px (subtitle) → 28px (title) → 40px (hero)

## Shape Language
- **Border Radius**: 12px (cards, buttons), 16px (large containers), 24px (hero badges), 0px (minimal accents)
- **Spacing**: 4px grid; 8px/12px/16px/24px rhythm for padding, margins
- **Shadows**: Elevated cards use `shadow-glow-*` (group-themed glow), no harsh shadows

## Structural Zones

| Zone | Treatment | Purpose |
|------|-----------|---------|
| Header | Dark bg with group-themed underline, sticky navigation | Persistent wayfinding |
| Hero | Full-width gradient (group-specific), glassmorphic overlay | Visual impact, theme shift |
| Cards | `card-elevated` (backdrop blur, subtle border), hover brightens | Content hierarchy, interactivity |
| Content Grid | Alternating `bg-card` / `bg-muted` for rhythm | Breathing room, visual flow |
| Footer | `border-t border-border/40`, same bg as background | Grounded close |

## Component Patterns
- **Cards**: All content surfaces use `.card-elevated` — rounded 12px, semi-transparent bg, backdrop blur, smooth 0.3s transitions
- **Buttons**: Group-themed backgrounds (e.g., `.bg-[oklch(0.7_0.15_350)]` for ILLIT), uppercase labels, 24px padding, hover: brighten
- **Badges**: Uppercase labels, 8px padding, `rounded-full`, group-themed borders
- **Charts**: Leverage chart color tokens (--chart-1 through --chart-5) mapped to group themes
- **Member Cards**: Photo + name + role + facts, hover animation (float up 8px), shadow-glow-*

## Motion & Animation
- **Transitions**: All interactive elements use `transition-smooth` (0.3s cubic-bezier)
- **Entrance**: Page sections fade in + slide from bottom on load (staggered by 100ms per card)
- **Hover**: Cards brighten (bg opacity +10%), glow shadow activates, text color shifts slightly
- **Float**: Member avatars and hero badges float up/down continuously (`animation-float`, 3s)
- **Pulse Glow**: Section headers pulse with group accent glow (`animation-pulse-glow`, 2s)

## Signature Detail
**Group color gradient overlays** on section headers — each group's primary + secondary OKLCH colors blend diagonally (top-left to bottom-right). Creates instant visual recognition and polished luxury feel. Never flat, never generic.

## Dark Mode
Dark mode is the only mode. All tokens already tuned for dark backgrounds (high contrast foreground, muted accents). Light backgrounds are not used; every surface is elevated from the ultra-dark base via card elevation and border treatments.

## Accessibility & Performance
- All colors pass WCAG AA+ contrast (foreground 0.92 on background 0.1 = 9:1+ ratio)
- Font display: swap (fonts load without blocking layout)
- Reduced motion respected via `prefers-reduced-motion` media query
- Group-themed glows use `box-shadow`, not filters, for performance

## Constraints
- Do NOT use hex colors or raw RGB; OKLCH tokens only
- Do NOT add drop shadows on text (use color contrast instead)
- Do NOT use more than 2 fonts per section
- Do NOT mix light and dark mode logic; commit to dark
- Do NOT apply rounded corners larger than 24px except for badges/pills
