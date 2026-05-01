# 一介·寒土孤山 Design System

> Design system for **《一介：寒土孤山》(YiJie · HanWraith)** — a Steam single-player Three Kingdoms-era 水墨 (ink-wash) ARPG built in Unreal Engine. The visual language is anchored to a 剑来-style Chinese ink painting reference: cold rice-paper white, deep ink black, sparse 朱砂 (vermilion) seals, vertical 楷书 (regular-script) typography, large negative space, and quiet snow/rain particles.

---

## What this design system is for

- Building **mocks, prototypes and marketing artifacts** for the game in HTML.
- Onboarding designers/devs to the visual & content language of the game.
- Reference for the **two parallel themes** the runtime ships with (see Themes below).

## Sources

This system was built by reading, **not screenshots**:

- **GitHub:** `1206660/SlientResolveLogicClaudeDesign@main`
  - `UI/Startup/WebLogin/` — full HTML/CSS/JS implementation of the in-game web UI in the **Default 楷墨** (warm-wood vermilion) theme.
  - `UI/Startup/WebLogin_Ink/` — same pages re-skinned in the **Ink 水墨** (cold rice-paper) theme. **Ink is the reference / canonical theme.** Older "warm wood" CSS in some pages is overridden by the global `[data-sr-page]` ruleset in `WebLogin_Ink/assets/common.css`.
  - `UI/Startup/CampfireMainMenu/` — Steam title-screen UMG/MVVM scaffold (UE C++/Blueprint) and 钟齐马善政毛笔楷书 font reference.
  - `UI/InputBinding/` — UMG/MVVM input-binding settings screen with full Figma slice exports under `SourceArt/HanWraith/`.
  - `UI/Inventory/HanWraith/` — manifest-only landing zone (no art).
- **Localized originals (Obsidian — not in repo):** referenced by the source as `Obisdian/02_游戏设计/05_UIUX/UI设计稿v2/10_标题画面.md` and `Obisdian/03_游戏系统/02_战斗与技能/IMC_ARPG_InputSystem输入映射整理.md`. Not accessible to this design system.

The `source/` folder in this project is a verbatim mirror of the imported HTML/CSS/JS so designs in `ui_kits/` can cross-reference it directly.

---

## Index

| File / folder | What it contains |
|---|---|
| `README.md` | This file. |
| `SKILL.md` | Agent skill manifest — points an LLM at the rules in this folder. |
| `colors_and_type.css` | All design tokens (colors, type, spacing, radii, shadows, motion) as CSS variables, plus semantic `h1/h2/p` styles. |
| `assets/` | Logos, key visuals, raw UI textures imported from the Figma slice exports (`T_UI_*`, ghostBackground_*). |
| `preview/` | Small specimen cards that populate the Design System tab. |
| `ui_kits/web_login_ink/` | Hi-fi React recreation of the in-game web UI in the canonical **Ink** theme (title screen, lobby, dialogue, combat HUD, inventory, settings). |
| `ui_kits/web_login_default/` | Hi-fi React recreation of the in-game web UI in the **Default 楷墨** warm theme (combat HUD, inventory, skills/武学). |
| `source/WebLogin/` | Mirror of the Default theme HTML/JS — read-only reference. |
| `source/WebLogin_Ink/` | Mirror of the Ink theme HTML/JS — read-only reference. |
| `source/InputBinding/` | Input-binding settings page (UMG manifest + Figma slices). |

---

## Themes

The runtime ships **two parallel themes**. Pages can opt in via `<html data-sr-page="...">` and the global theme stylesheet swaps the look. **Ink is canonical for menus and non-combat screens.**

### 1. Ink · 冷白宣纸 (primary)

> "雪声未停，墨迹已干。"

Reference image is a 剑来-style cold rice-paper landscape: snow-white paper, distant ink-wash mountains at the bottom, 3 brush-stroke birds, 1–2 朱印 (vermilion seals). The runtime layers a **Kurosawa film grain + 24fps flicker + warm vignette** on top via `html[data-sr-page]::before/::after` for cinematic feel.

- **Backdrops** are layered radial gradients on `#F1F5FA → #E7EEF6 → #DDE6EF`, plus an inline-SVG `feTurbulence` noise filter for paper grain, plus an inline-SVG ink-wash mountain silhouette pinned to the bottom 31vh.
- **Text** is dark ink (`rgba(5,7,8,0.88)`) on cold paper. Body copy at `~0.78` opacity, captions at `~0.58`.
- **Cards / panels** are translucent white (`rgba(248,251,255,0.34)` baseline, `rgba(255,255,255,0.56)` on `.active`) with `backdrop-filter: blur(8px) saturate(1.05)`, hairline `rgba(38,45,51,0.14)` borders, and a soft cool-grey lift shadow.
- **Selected / active** state pushes the card to near-white (`0.56–0.78`) with a black `inset 0 -2px 0 rgba(5,6,7,0.38)` baseline — **never** a vermilion fill, **never** a left-border accent.
- 朱砂 vermilion (`#8A2E28`) is reserved for: **seal stamps**, **focus rings** in colorblind mode, **letterbox edges in cinematic dialogue**, and a **single 1–2px hairline** under active tabs. Never as a flood.

### 2. Default · 楷墨 暖木朱砂 (dark variant)

Used in the Default theme version of `combat.html`, `inventory.html`, `skills.html` — the more aggressive Three-Kingdoms-soulslike chrome. Where the Ink theme is paper, this is **lacquered cinnabar wood** with bamboo strips and tiger-tally seals.

- Backgrounds are `#1A0F06 → #2A1B0E → #3A2616` linear-gradient with warm ink-wash turbulence.
- Type is warm cream (`#EDDFC2`) on dark wood.
- 朱砂 here is **brighter** (`#D85528`) and used much more liberally: chapter seals, weapon-skill highlights, "破" alert glyphs.
- Bamboo-strip header bars, gold-stud (`#BC8F3A`) corner rivets on lacquer panels.

> **Rule of thumb:** if the screen is overlaid on 3D combat (HUD), it can carry the Default theme. If it's a menu, settings, lobby, dialogue, codex, journal — use Ink.

---

## Content Fundamentals

The voice of this game is **classical, sparse, Wuxia-novel-cadenced Mandarin**. Strong literary influence (剑来 / 三国 / 仙剑). Lower-case English and emoji are forbidden. Casing follows traditional Chinese typesetting:
- Use **Chinese full-width punctuation** (`、 · ， 。 「」 ：`) — never ASCII commas/periods in body copy.
- Mid-dot `·` separates name fragments: `一介 · 寒土孤山`, `第三幕 · 山村回忆 · 灵儿戏水`.
- Numbers in long-form Chinese in narrative copy: `二〇二六/四/二四 · 廿二时四一分`. Mono numerals (Arabic) are fine in HUD/stats.
- Latin tech words (`PS5`, `CEF`, `MVVM`) appear only in dev/code paths, never in player-facing UI.

### Tone — three registers

1. **Cinematic narration** (used in title taglines, modal copy, codex):
   > 凡人的宁静 · 时代的碾碎
   > 雪声未停，墨迹已干。自动存档会保留此刻。

   Short, image-rich, comma-broken. Never imperative. **No** "you", no "I" — the world is observed.

2. **System / menu copy** — concrete, terse 2–4 character labels:
   > 继续旅途 · 新的开始 · 载入存档 · 设定 · 退出
   > 暂离寒山？ · 留 下 · 离 开

   Each menu item gets a one-line 8–14-character `<small>` hint:
   > 继续旅途 / 第三幕 · 山村回忆
   > 设定 / 画面 · 声音 · 操作

   Note the `留 下` / `离 开` — single 楷书 chars separated by a thin space; this pattern is used in destructive modals.

3. **Diegetic UI noise** — mono Latin/Arabic for feel:
   > `内测版 〇·壹·〇 · 二〇二六`
   > `已游 12 时`

   `JetBrains Mono` at `letter-spacing: 0.20em` provides a faint "system telemetry" undertone behind the brushwork.

### Casing & vocabulary specifics

| Concept | Use | Don't |
|---|---|---|
| Save | 存档、续旅、自动存档 | 保存、save |
| Settings | 设定、议政厅 | 设置、菜单 |
| Quit | 退出、离 开 | 退出游戏、关闭 |
| Continue | 继续旅途 | 继续游戏 |
| Skills | 武学 | 技能、能力 |
| Inventory | 行囊 | 背包、物品 |
| Map | 地图 | 世界地图 |
| Journal | 日志 | 任务、笔记 |
| Codex | 阅览、典籍 | 词典、百科 |

Emoji: **never**. Unicode pictograms (`✕ ○ △ □`) appear only as PS5 face-button marks in the footer prompt strip. Latin glyphs `L1 R1 R2` appear inside `tk-key` capsules.

---

## Visual Foundations

### Typography

- **Display** uses 钟齐马善政毛笔楷书 (`KaiBrush.ttf`) — a licensed brush 楷书. **Not shipped here** — see "Substitutions" below. Always rendered with `font-weight: 900`, `letter-spacing: 0.10em–0.32em`, and a `text-shadow: 0 2px 0 rgba(255,255,255,0.24), 0 22px 36px rgba(68,84,97,0.28)` to lift it off the paper.
- **Title 一介** is **vertical** (`writing-mode: vertical-rl; text-orientation: upright`), rotated `-2deg`, with a **black brushstroke spear** painted behind it via a `::before` (`linear-gradient(180deg,…) border-radius: 70% 50% 60% 42%`). Always study the title screen before placing a brand mark.
- Body copy uses the same 楷书 stack, weight `400/700`, sizes 13–17px.
- Mono (`JetBrains Mono`) is **only** for tech/system bits: footer build version, save timestamps, kbd capsules, `data-mono` overlays.

### Color

See `colors_and_type.css` for tokens. The grammar is:
- 95% paper-and-ink. Most pixels are off-white or off-black.
- 4% cool ink-wash greys (`--bamboo-green #6C7C85`, `--bamboo-light #AAB7C1`) for distance / secondary chrome.
- 1% 朱砂 vermilion. **Sparingly**. One seal, one tab underline, one focus ring, the letterbox edge — never flood-fills.
- Accessibility shifts: `body[data-colorblind="rg"]` swaps 朱砂 to `#2A6BD0` blue and gold to `#F5D24E`; `body[data-contrast="high"]` boosts paper to `#FFF7E2` and bumps line opacity.

### Backgrounds

- **Layered radial gradients** establish a soft center-light and corner-dark vignette.
- An inline-SVG `feTurbulence` filter provides subtle paper grain — **never** a noise PNG.
- Bottom 31vh is anchored by an inline-SVG **ink-wash mountain silhouette** with a small temple (亭) at the left.
- Foreground particles: **slow falling snow / 落叶** spawned by JS — 22 particles, 9–20s fall, 2.6–5.4s sway, 5–12s spin. Always semi-transparent, always wind-swayed.
- 3 brush-stroke **birds** drift in the upper-third (`.ink-birds`) — pure CSS, two `::before/::after` curved tops at ±18°.
- Backdrops are **never** photographic and **never** gradient-mesh.

### Borders, corners, shadows

- **Corner radius is zero** for menu panels, cards, modals — sharp, like cut paper. The only rounded thing is `.key` (PS5 face buttons → 50%) and `.tk-key` (Latin shoulder buttons → 18px pill).
- **Borders** are 1px hairlines: `rgba(38,45,51,0.14)` baseline, `rgba(5,6,7,0.32)` on active.
- **Shadow system** — three tiers, all cool-grey (never warm/black):
  - Tier 1 (badges, seals): `0 8px 18px rgba(66,78,88,0.15)` + `inset 0 0 0 1px rgba(255,255,255,0.28)`.
  - Tier 2 (cards): `0 18px 52px rgba(96,115,132,0.12)` + inset hairline.
  - Tier 3 (floating menus, modals): `0 30px 88px rgba(87,104,119,0.18)` + heavy inset hairline.
- **Inset highlights** matter — every panel has an `inset 0 0 0 1px rgba(255,255,255,0.30–0.48)` to fake a paper-edge bevel.

### Layout

- 1920×1080 reference; never go below `min-width: 960px` or `min-height: 540px`.
- **Safe area** padding is `clamp(46px, 5vw, 92px)` horizontal, `clamp(30px, 4.2vh, 72px)` vertical.
- **Floating page shell** (`.sr-page-shell`) is a top-left tab bar at `top: clamp(10px, 1.5vh, 18px)`, width `clamp(860px, 62vw, 1280px)`. Tabs are `padding: 7px 16px 9px`, `font-size: 15px`, `letter-spacing: 0.18em`. Active tab gets a paper-fill, all-white background with a 2px white underline.
- **Footer prompt bar** is fixed at `bottom: 0`, height 64–72px, never intercepts pointer events except on its prompt children. Holds: build version (left, mono), `✕ 确认 · ○ 返回 · △ 阅览` (right, kbd capsules + 楷书 verb).
- **Vertical writing** is reserved for: title 一介, side seals, occasional poetic taglines. Never for body lists.

### Motion

- Page enters: `translate3d(48px, 0, 0)` + `blur(3px)` → settled, 240ms `cubic-bezier(0.2, 0.78, 0.16, 1)`. Reversed for back-nav.
- Stage fade-in: 180–380ms `ease-out`, 4–6px Y-offset.
- Hover lifts: `translateX(-6px)` (menu items rightward → leftward shift, since the menu sits on the right edge), 160ms.
- Press: `translateY(1px) scale(0.998)` — barely perceptible tactile dip.
- Snow / 落叶 / birds loop continuously; the JS spawns 22 particles with randomized fall/sway/spin parameters so the loop never feels canned.
- `prefers-reduced-motion: reduce` kills the leaf/snow loop entirely.
- Combat HUD additions (Default theme): a 24fps **Kurosawa film flicker** + grain shift via `html[data-sr-page]::before` — driven by `kurosawa-flicker` (0.0833s, steps(2)) and `kurosawa-grain-shift` (0.7s, steps(6)).

### Hover, focus, press

- **Hover**: card lightens (`rgba(255,255,255,0.78)`), color deepens to `rgba(0,0,0,0.92)`, slight outward shift on the menu axis.
- **Focus-visible**: `outline: 2px solid rgba(5,7,8,0.72)` with `outline-offset: 3px`. Never blue, never glow. In Default theme: `outline-color: var(--zhusha-bright)` + a `box-shadow: 0 0 0 4px rgba(216,85,40,0.18)` ring.
- **Press**: 1px Y-translate + 0.998 scale — globally applied to all interactive primitives via the universal `:active` rule in `common.css`.
- **Selected**: same as hover but with a 2px black `inset bottom` line (`inset 0 -2px 0 rgba(5,6,7,0.38)`) and `letter-spacing` bumped to `0.28em`.
- **Disabled**: opacity `0.36`, `cursor: not-allowed`, no hover effects.

### Imagery

- Cool, desaturated, slightly-blue. The Kurosawa overlay adds warm grain → **net feel: old film, slightly faded paper photo of a mountain.**
- Photo references: 剑来 series book covers, 山水画 (山水), Akira Kurosawa films (Yojimbo, Kagemusha), Ghost of Tsushima photo mode.
- Avoid: warm sunsets, neon, anime cel-shaded chrome, tech-blue.

---

## Iconography

The runtime uses **almost no icons.** Identity comes from typography (vertical 楷书), seals (朱印 stamps), and PS5 face-button glyphs. When iconography is needed:

- **PS5 face buttons** (`✕ ○ △ □`) are rendered as inline Unicode in `<span class="key cross|circle|triangle|square">`. Each gets its console-canonical color: cross blue, circle red, triangle teal, square purple. In Ink theme they're recolored to ink-on-paper so they don't shout.
- **Latin shoulder/D-pad keys** (`L1`, `R1`, `R2`, `LB`, `RB`) ride inside `.tk-key` pill capsules — warm gold-bordered in Default theme, cold paper-bordered in Ink.
- **Inventory category glyphs** in the Default theme are **PNG slices** from the Figma export (`source/InputBinding/SourceArt/HanWraith/Icon_1_*.png`). These are bespoke ink-brush silhouettes — never substitute with a CDN icon font.
- **Combat HUD seals** are typeset Chinese single-glyphs (`破`, `章`, `武`, `命`, `气`, `势`) inside framed boxes — they ARE the icons. No external icon dependency.
- **No CDN icon fonts** (Lucide, Heroicons, FontAwesome) are used. **No SVG icon set** is required.
- **No emoji.** Ever.
- **Bird, leaf, snow particles** are inline `<svg>` shapes generated in JS (`SR_LEAF_SVG`); these aren't "icons", they're motion decorations.

If you need a fresh icon and there's no Figma slice for it: typeset the Chinese name of the concept in 楷书 inside an `inset 1.5px solid rgba(42,48,52,0.55)` box, rotate 0–4°, and stop. That IS the iconography of this game.

---

## Substitutions / TODO from the user

- ✅ **Font: 钟齐马善政毛笔楷书 (`ZhongQiMaShanZhengBrushKai.ttf`)** — the licensed runtime brush 楷书 is shipped at `fonts/ZhongQiMaShanZhengBrushKai.ttf` and loaded by `colors_and_type.css`. **Body fallback** is `Noto Serif SC` (loaded from Google Fonts) when 楷 isn't appropriate (long paragraphs).
- ⚠️ **Inventory art** — `UI/Inventory/HanWraith/` is manifest-only; no pixel art shipped. The inventory UI kit reuses the `WebLogin/inventory.html` layout and the Figma slices from `InputBinding/SourceArt/`.
- ⚠️ **Background photography** — none was provided. The mountain silhouette is the inline-SVG `<path>` from `index.html`; no photographic asset exists in the source. If you'd like richer key art, attach references.

---

## How to use this in a new design

1. `<link rel="stylesheet" href="colors_and_type.css">` — gets you all tokens + base type.
2. Pick a theme via `<html data-theme="ink">` (default) or `<html data-theme="default">`.
3. Use the `ui_kits/web_login_ink/` components as building blocks (Title, Menu, Profile, SaveHint, FooterBar, ChoicePanel, CombatHUD, etc).
4. Read the **Ink** index page (`source/WebLogin_Ink/index.html`) before designing — it has the canonical tokens, particle system, and layout grammar.
5. Stay paper-quiet. **One** 朱砂 accent per screen. **No** emoji. **No** CDN icons.

---
