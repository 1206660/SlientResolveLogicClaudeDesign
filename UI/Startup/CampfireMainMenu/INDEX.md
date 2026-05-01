# Campfire Main Menu

Common UI landing zone for the Steam single-player startup screen of `《一介: 寒土孤山》`.

## Runtime classes

- `/Script/SlientResolveLogic.SlientResolveStartupMenuScreenWidget`
- `/Script/SlientResolveLogic.SlientResolveStartupMenuIndexedButton`
- `/Script/SlientResolveLogic.SlientResolveStartupMenuViewModel`

## Expected widget assets

- `/Game/CoreLogic/UI/Startup/CampfireMainMenu/WBP_StartupCampfireScreen`
- `/Game/CoreLogic/UI/Startup/CampfireMainMenu/WBP_StartupCampfireMenuButton`
- `/Game/CoreLogic/UI/Startup/CampfireMainMenu/WBP_StartupCampfireSaveSlotEntry`
- `/Game/CoreLogic/UI/Startup/CampfireMainMenu/WBP_StartupCampfireSettingsPanel`

## Expected scene assets

- `/Game/CoreLogic/World/Startup/Campfire/Maps/L_Startup_CampfireMainMenu`

## 2D visual assets

- `SourceArt/T_StartupCampfire_BG_Cinematic.png`
- `/Game/CoreLogic/UI/Startup/CampfireMainMenu/Textures/T_StartupCampfire_BG_Cinematic` (optional imported cache)

Runtime fire overlay is intentionally disabled; the campfire is part of the cinematic background.

## Fonts

- `Fonts/ZhongQiMaShanZhengBrushKai.ttf`

Use a licensed copy of 钟齐马善政毛笔楷书 for the Startup title and start prompt. The runtime code looks for this project font first, then falls back to local Windows Kai fonts for editor preview.

## First-screen UX

- Title at upper left.
- One bottom-center prompt: `开始游戏`.
- The prompt uses a slow alpha breathing animation.
- Hidden menu lists, save status, cloud status, and settings entries stay off the first screen.

## Source of truth

- `StartupCampfireMainMenu.manifest.json`
- `scripts/create_campfire_startup_widgets.py`
- `scripts/validate_campfire_startup_widgets.py`
- `scripts/create_campfire_startup_2d_assets.py`
- `scripts/validate_campfire_startup_2d_assets.py`
- `scripts/scaffold_campfire_startup_2d.ps1`
