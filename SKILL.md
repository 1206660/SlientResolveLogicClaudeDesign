# 一介·寒土孤山 Design System — Skill manifest

When designing for **《一介：寒土孤山》(YiJie · HanWraith)**, follow these rules. They override generic defaults.

## Always
1. **Read `README.md` first.** It defines the two themes (Ink primary, Default 楷墨 dark variant), content voice, and 95/4/1 color rule.
2. **Link `colors_and_type.css`** in any preview/UI you produce, before component CSS.
3. **Pick a theme up front.** Menus / settings / dialogue / lobby / codex → **Ink**. Combat HUD / inventory / 武学 over 3D viewport → **Default 楷墨**. Never mix the two on a single screen.
4. **Use the bundled font.** `KaiBrush` (`fonts/ZhongQiMaShanZhengBrushKai.ttf`) for all 楷书 display & UI. `Noto Serif SC` for long body paragraphs. `JetBrains Mono` for tech/system bits only.
5. **Reference the source.** When designing a screen that already exists in `source/WebLogin_Ink/` or `source/WebLogin/`, read that file before re-implementing.
6. **Vertical 一介 + brushstroke spear** is the brand mark. See `preview/brand_mark.html`. Don't replace it with a horizontal logo.

## Color rule (95 / 4 / 1)
- **95%** off-white paper + off-black ink (`--paper`, `--paper-bg`, `--ink-1`, `--ink-black`).
- **4%** cool ink-wash greys for secondary chrome (`--bamboo-green`, `--bamboo-light`).
- **1%** 朱砂 vermilion (`--zhusha`). At most ONE flooded vermilion element per screen — usually a seal stamp, an active-tab underline, a focus ring, or a letterbox edge.
- Default theme allows brighter `--warm-zhusha` (`#D85528`) more liberally — chapter seals, weapon highlights, "破" alerts.

## Typography
- Display headings: `font-family: var(--font-kai)`, `font-weight: 900`, `letter-spacing: 0.22em–0.32em`. Always.
- The title 一介 is **vertical** (`writing-mode: vertical-rl; text-orientation: upright; transform: rotate(-2deg)`) on a black brushstroke `::before`.
- Body copy: `font-family: var(--font-body)` at `13–15px`, `line-height: 1.72`, `letter-spacing: 0.06em`, color `rgba(5,7,8,0.78)`.
- Use **full-width Chinese punctuation** (`、 · ， 。 「」 ：`) — never ASCII commas/periods in player-facing copy.
- Mid-dot `·` separates name/section fragments: `第三幕 · 山村回忆 · 灵儿戏水`.
- Numbers in narrative copy use long-form Chinese (`二〇二六/四/二四`); HUD/stats may use mono Arabic.

## Voice & vocabulary (do / don't)

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

- **No emoji.** Ever. Unicode `✕ ○ △ □` only as PS5 face-button glyphs.
- **No lower-case English** in player UI. `L1 R1 R2 PS5` only inside `.tk-key` capsules.
- Use the spaced-character pattern `留 下` / `离 开` for destructive modal actions.

## Iconography
- **No CDN icon fonts** (Lucide, Heroicons, FontAwesome). **No SVG icon set.**
- Identity = typography (vertical 楷书) + 朱印 seals + PS5 face-button glyphs.
- Need a fresh icon? Typeset the Chinese name of the concept in 楷书 inside an `inset 1.5px solid` box, rotate 0–4°. That IS the iconography.
- Inventory category icons: use the bespoke Figma slices in `assets/` (`icon_input_action_*.png`); never substitute.

## Layout grammar
- Reference 1920×1080. Min 960×540.
- Safe area: `clamp(46px, 5vw, 92px)` horizontal, `clamp(30px, 4.2vh, 72px)` vertical.
- **Page-shell tab bar** sits **top-left** (Ink), not centered. Width `clamp(860px, 62vw, 1280px)`.
- **Footer prompt bar** is fixed-bottom, height 64–72px. Holds: build version (left, mono); `✕ 确认 · ○ 返回 · △ 阅览` (right, kbd capsules + 楷书 verb).
- **Corners are sharp** (`border-radius: 0`). The only rounded things: PS5 face buttons (50%) and Latin shoulder pills (18px).
- **Backgrounds**: layered radial gradients + inline-SVG `feTurbulence` paper grain + inline-SVG ink-wash mountain silhouette anchored to bottom 31vh. Never photographic.
- **Particles**: 22 falling snow / 落叶 with randomized fall (9–20s), sway (2.6–5.4s), spin (5–12s). Kill on `prefers-reduced-motion: reduce`.

## Motion
- Page enter: `translate3d(48px, 0, 0)` + `blur(3px)` → settled, 240ms `cubic-bezier(0.2, 0.78, 0.16, 1)`.
- Hover lift: `translateX(-6px)` (menus shift leftward), 160ms.
- Press: `translateY(1px) scale(0.998)`.
- Combat HUD adds a **24fps Kurosawa flicker** + grain shift via `html[data-sr-page]::before`.

## Defaults to never reach for
- ❌ Material shadows / soft drop-shadow stacks (use cool-grey paper shadows: tier-1/2/3 in `colors_and_type.css`).
- ❌ Blue/green system colors. Cool greys + 1 vermilion accent only.
- ❌ Rounded corners on cards/modals. Paper, not glass.
- ❌ Centered logos. Brand sits top-left or hero-top.
- ❌ "Click here" / imperative voice. Cinematic narration only.
- ❌ Photographic key art unless the user provides it.

## Component starting points
- Menu rows · Tabs · Buttons · Item rows · Sliders · Save toast · Seals · Modals — see `preview/components.html`.
- Title screen, lobby, dialogue, combat HUD, inventory, settings reference implementations — see `source/WebLogin_Ink/` (Ink) and `source/WebLogin/` (Default).
