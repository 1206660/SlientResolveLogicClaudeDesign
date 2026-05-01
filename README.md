# Handoff: 一介 · 寒土孤山 — In-game Web UI

## Overview

This package hands off the **hi-fi design references** for the in-game web UI of **《一介：寒土孤山》(YiJie · HanWraith)** — a Steam single-player Three Kingdoms-era 水墨 (ink-wash) ARPG. The screens cover the full **Ink (水墨)** theme menu/HUD surface: title boot, lobby (main menu), map (with continuous zoom + village LOD), inventory, journal, skills (武学), codex (阅览), settings (设定).

The runtime ships these screens as **CEF web pages embedded into Unreal Engine** (see `source/WebLogin_Ink/`). The mocks in this bundle are 1:1 with the runtime's structural intent but use modern HTML/CSS/JS so the dev can read them quickly.

## About the Design Files

The files in this bundle are **design references created in HTML** — prototypes showing the intended look, copy, motion, and behavior. They are **not** production code to ship verbatim.

The implementer's job is to **recreate these designs inside the existing runtime environment**:
- The shipping target is **Unreal Engine + CEF (HTML/CSS/JS)**. The HTML in this bundle can be ported into `Content/UI/Startup/WebLogin_Ink/` directly, but should be matched to the existing `source/WebLogin_Ink/assets/common.css` token names, page-shell classes (`.sr-page-shell`, `[data-sr-page]`), and JS bootstrapping (`common.js`).
- For non-CEF surfaces (UMG/MVVM screens like `InputBinding`), translate the layout & tokens into UMG widgets but keep typography, spacing, and 朱砂 accent rules from the design system.

## Fidelity

**High-fidelity (hifi).** Every screen has final colors, typography, spacing, hover/active states, motion, and exact copy. Implement pixel-perfectly.

The single concession: the brush 楷书 display font (`ZhongQiMaShanZhengBrushKai.ttf`) is bundled in `fonts/` for the runtime, but in your dev environment you may want to load it via `@font-face` or fall back to `Noto Serif SC` until art-pipeline integration.

---

## Screens / Views

All screens share a **1280×720 design viewport** (the runtime CEF surface scales it). Reference layout: 64px top nav tab bar, 60px footer prompt strip, body grid in between. Background paper texture + ink-wash mountains + falling snow particles are part of every screen.

### 1. `title_boot.html` — Title boot
- **Purpose:** Cinematic title splash → "press any key" entry.
- **Layout:** Centered vertical 楷书 一介 title (writing-mode: vertical-rl, rotated -2deg) with a brush-spear pseudo-element behind it. Subtitle 寒土孤山 horizontal, mid-dot separated. Small build-version mono caption bottom-left, prompt strip bottom-right.
- **Motion:** Title fades + lifts 240ms `cubic-bezier(0.2, 0.78, 0.16, 1)`, snow loop, 3 brush-stroke birds drift upper third.

### 2. `lobby.html` — Main menu / lobby
- **Purpose:** Continue / new / load / settings / quit.
- **Layout:** Left: profile slab (last save thumb + chapter line + playtime in mono `已游 12 时`). Right: vertical menu list right-aligned, each row 8–14 char `<small>` hint. Floating tab shell across top.
- **Components:** Menu items use `:hover` translateX(-6px) leftward shift, `:active` 1px Y dip + 0.998 scale, selected state adds 2px black `inset bottom`.
- **Copy:** 继续旅途 · 新的开始 · 载入存档 · 设定 · 退出. Each gets a poetic hint.

### 3. `map.html` — 山河图 (Map) ★ key screen
- **Purpose:** World map with 5 named locations + deep-dive on 山村南口 (home village).
- **Layout:** 3-pane: top nav (64), main split into **scroll canvas (left, flex)** + **info panel (right, 360px fixed)**, footer (60).
- **Map canvas:**
  - SVG `viewBox="0 0 100 60"` with all geometry inside `<g id="world">`.
  - **Continuous zoom 1×–8×** via `transform="translate(tx ty) scale(z)"`. Wheel = zoom-at-cursor; pointer drag = pan; +/-/0 keyboard; HUD top-left has `+ / track / − / 原` buttons.
  - **LOD system:** 5 markers (`居延关 · 漠北古道 · 山村南口 · 敌寨影崖 · 旧都长安`) render as menu pins (rotated squares with labels) at low zoom. As `zoom > 4`, the `#village-detail` group fades in (0 at z<4 → 1 at z>=6); simultaneously fog patches lift, and the `han_village` pin reverse-fades to avoid overlap with detail. Markers use `vector-effect: non-scaling-stroke` + reverse `transform="scale(1/z)"` to keep visual size constant.
  - **Village detail:** vector-drawn at world coords ~ (48,42), ~12×8 units. Includes田 grid, 旧屋 cluster, 火堆, 井, 树, 灵儿小人剪影, 山村南口 sign.
  - **POIs (子兴趣点):** 3 hotspots inside the village — `well` (灵儿), `fire` (火堆/先生), `old_house` (南口旧屋). Click = `setHot(id)`; pulses `B83A1C` ring; surfaces a hot-card in the right panel.
- **Right panel:** title + coord + 立/访/封 stamp, 风味文字, 记号 tag chips, 诸数 stat grid, 传送/深入 buttons. When `view.zoom > 4` and active marker is `han_village`, a hot-card section is appended.
- **Markers data:** see `MAP.markers` array at top of `<script>` — `{id, name, x, y, visited, current, locked, flavor, tags, stats}`.

### 4. `inventory.html` — 行囊 (Inventory)
- **Purpose:** Equipment & consumables grid with detail panel.
- **Layout:** Left vertical category strip → center grid (6×4) → right item detail. Categories use ink-brush PNG glyphs from `assets/icon_input_action_*.png`.

### 5. `journal.html` — 日志 (Journal)
- **Purpose:** Quest / chapter narrative log.
- **Layout:** Two-column scroll: left chapter list with mini-stamps, right rich text in 楷书.

### 6. `skills.html` — 武学 (Skills)
- **Purpose:** Skill tree.
- **Layout:** Hex/grid skill nodes connected by ink-brush lines. Active = filled black square; locked = dashed hairline.

### 7. `codex.html` — 阅览 (Codex)
- **Purpose:** Lore / NPC / item codex.
- **Layout:** Left index of categories → right entry pages with vertical 楷书 headings and horizontal body.

### 8. `settings.html` — 设定 (Settings)
- **Purpose:** Display, audio, controls (links into the InputBinding UMG screen at runtime).

### Shared chrome

- **Top nav tab bar:** see `nav-tabs.css` + `nav-tabs.js`. Shoulder-button `L1`/`R1` capsules flank the tab list; right side has chapter ordinal `壹` and a coin meter. Tabs cycle on L1/R1.
- **Footer prompt strip:** `✕ 确认 · ○ 返回 · △ 阅览` style; PS5 face buttons render as inline Unicode in `<span class="key cross|circle|triangle|square">`.

---

## Interactions & Behavior

### Map (most logic-heavy)
- **Wheel:** `e.preventDefault()`; factor = `exp(-deltaY * 0.0015)`; `zoomAt(cursorWorldX, cursorWorldY, newZoom)`.
- **Drag:** pointerdown on canvas (excluding `.zoom-hud`, `.pin-g`, `.hot`) → captures pointer → translates `tx,ty` in viewBox units, clamped so world stays inside canvas.
- **Keyboard:** ↑↓/WASD cycle markers; +/− zoom; 0 reset; Enter/Space = travel to active marker.
- **`zoomAt(cx, cy, z)`:** keeps the world point under cursor stationary by adjusting `tx += cx*(z0-z1); ty += cy*(z0-z1);`.
- **`animateZoomTo(z, cx, cy, duration)`:** easeOutCubic; used by HUD buttons & `zoomToVillage()` (深入).
- **Travel:** only enabled if `marker.visited && marker.id !== currentId`. Toast `传送：<name>` for 1.6s.

### Lobby / menu screens
- Hover translateX(-6px) leftward shift (160ms). Active = 1px Y dip + 0.998 scale.
- Selected item adds `inset 0 -2px 0 rgba(5,6,7,0.38)` and `letter-spacing: 0.28em`.

### Modals (e.g. quit confirm)
- Two single-character buttons `留 下` / `离 开` separated by thin space. Backdrop = paper-translucent + blur(8px).

### Particles
- 22 snow/leaf particles spawned in JS with randomized fall (9–20s), sway (2.6–5.4s), spin (5–12s).
- 3 birds drift upper third — pure CSS pseudo-elements at ±18°.
- `prefers-reduced-motion: reduce` kills all particle loops.

---

## State Management

Per-screen state is local to the page. Cross-screen state the runtime owns:

| State | Owner | Used by |
|---|---|---|
| `currentChapter` (壹/贰/叁) | save data | nav, lobby, map, journal |
| `playtime` (mono "已游 N 时") | runtime telemetry | lobby, settings |
| `coins` | save data | nav coin meter |
| `mapState`: `{currentLocationId, visitedIds[], lockedIds[]}` | save data | map.html `MAP` object |
| `colorblind` (`""|"rg"`) | settings | `body[data-colorblind]` |
| `contrast` (`""|"high"`) | settings | `body[data-contrast]` |

For the standalone HTML mocks each page seeds its own demo state. The implementer should wire these into the existing save / settings store.

---

## Design Tokens

All tokens live in `colors_and_type.css` as CSS variables. Highlights:

### Colors — Ink theme
- `--paper-1: #F1F5FA` (lightest) · `--paper-2: #E7EEF6` · `--paper-3: #DDE6EF` (deepest).
- `--ink-black: #0F1418`. Body text `rgba(5,7,8,0.88)`, captions `rgba(5,7,8,0.58)`.
- `--bamboo-green: #6C7C85` · `--bamboo-light: #AAB7C1` (cool ink-wash greys).
- `--zhusha: #8A2E28` (vermilion seal — use sparingly).
- Card baseline `rgba(248,251,255,0.34)` → active `rgba(255,255,255,0.56)`.
- Hairline `rgba(38,45,51,0.14)` → active `rgba(5,6,7,0.32)`.

### Colors — Default theme (used in combat HUD / Default-theme inventory)
- Background ramp `#1A0F06 → #2A1B0E → #3A2616`.
- Body cream `#EDDFC2`. Vermilion bright `#D85528`. Gold rivets `#BC8F3A`.

### Typography
- **Display:** 钟齐马善政毛笔楷书 (`ZhongQiMaShanZhengBrushKai.ttf`, in `fonts/`). Always `font-weight: 900`, `letter-spacing: 0.10em–0.32em`.
- **Body fallback:** `Noto Serif SC` (Google Fonts).
- **Mono:** `JetBrains Mono` only for telemetry/timestamps/kbd (`letter-spacing: 0.20em`).
- Title `一介` is vertical: `writing-mode: vertical-rl; text-orientation: upright; transform: rotate(-2deg);` with brush-spear `::before`.
- Body 13–17px, captions 11–12px, HUD numerals 10–11px mono.

### Spacing
- Safe area: `clamp(46px, 5vw, 92px)` H, `clamp(30px, 4.2vh, 72px)` V.
- Nav tab bar 64px, footer prompt strip 60px.
- Map right panel fixed 360px.

### Border radius
- **Zero** for menu panels, cards, modals (sharp paper-cut).
- `.key` (PS5 face) `50%`. `.tk-key` (L1/R1 capsules) `18px` pill.

### Shadows (cool grey only — never warm/black)
- Tier 1 (badge/seal): `0 8px 18px rgba(66,78,88,0.15) + inset 0 0 0 1px rgba(255,255,255,0.28)`.
- Tier 2 (card): `0 18px 52px rgba(96,115,132,0.12) + inset hairline`.
- Tier 3 (modal/menu): `0 30px 88px rgba(87,104,119,0.18) + heavy inset hairline`.

### Motion
- Page enter: `translate3d(48px,0,0)+blur(3px)` → 0, 240ms `cubic-bezier(0.2,0.78,0.16,1)`.
- Hover lift: `translateX(-6px)` 160ms.
- Press: `translateY(1px) scale(0.998)`.
- Map zoom anim: 280–500ms easeOutCubic.

---

## Assets

| Path | Source | Use |
|---|---|---|
| `fonts/ZhongQiMaShanZhengBrushKai.ttf` | licensed brush 楷书 from runtime | display heading font |
| `assets/keyart_main_compo.png` | runtime Figma export | title screen background option |
| `assets/keyart_input_binding.png` | runtime Figma export | settings/input screen background |
| `assets/texture_header_backdrop.png` | runtime Figma export | optional header decorative |
| `assets/icon_input_action_a–d.png` | Figma slice (`InputBinding/SourceArt/HanWraith/Icon_1_*.png`) | inventory category glyphs (Default theme) |

**No CDN icon fonts.** **No emoji.** When a fresh icon is needed: typeset the Chinese name of the concept in 楷书 inside an `inset 1.5px solid rgba(42,48,52,0.55)` box rotated 0–4° — that IS the iconography.

The mountain silhouette, snow, leaves, birds are all inline-SVG / CSS — no raster background photography.

---

## Files in this bundle

```
design_handoff_yijie_ui/
├── README.md                         ← this file
├── DESIGN_SYSTEM.md                  ← full design system reference (themes, voice, motion)
├── colors_and_type.css               ← all design tokens
├── fonts/
│   └── ZhongQiMaShanZhengBrushKai.ttf
├── assets/                           ← raster art (key visuals + inventory glyphs)
├── preview/                          ← design-system specimen cards
│   ├── brand_mark.html
│   ├── components.html
│   ├── palette.html
│   ├── spacing_elevation.html
│   └── type_specimen.html
└── ui_kits/web_login_ink/            ← the 8 page mocks
    ├── title_boot.html
    ├── lobby.html
    ├── map.html               ★ continuous zoom + LOD + POI
    ├── inventory.html
    ├── journal.html
    ├── skills.html
    ├── codex.html
    ├── settings.html
    ├── nav-tabs.css           ← shared top tab bar styles
    └── nav-tabs.js            ← shared tab cycling logic
```

## How to implement

1. **Read `DESIGN_SYSTEM.md` end-to-end first** — it's the brand bible (themes, voice, content rules, motion grammar). Do not skip; the rules around vermilion 朱砂 use, no-emoji, no-CDN-icons, and 楷书 typography are non-negotiable.
2. **Mount `colors_and_type.css`** at the top of every screen. All color/type rules below should consume its variables.
3. **Drop each `ui_kits/web_login_ink/*.html` into `Content/UI/Startup/WebLogin_Ink/`** (or your equivalent CEF folder) and reconcile against the existing `common.css` and `common.js` — token names should align; copy-paste any missing classes.
4. For **`map.html`** specifically: the SVG transform model is the core mechanic. Don't replace it with CSS-only zoom — the LOD opacity transitions and reverse-scale on markers depend on the SVG transform graph being driven by JS each frame.
5. **Wire state** to the existing save/settings store (see "State Management" table).
6. Keep **paper-quiet rule**: one 朱砂 accent per screen, max.

## Live preview

Open any `.html` in `ui_kits/web_login_ink/` directly in a browser — they're standalone. Recommended order: `title_boot → lobby → map → inventory → journal → skills → codex → settings`.
