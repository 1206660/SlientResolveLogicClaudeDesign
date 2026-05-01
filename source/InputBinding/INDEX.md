# HanWraith Input Binding

Common UI + MVVM runtime landing zone for the HanWraith 风格输入绑定设置页。

## Runtime classes

- `/Script/SlientResolveLogic.SlientResolveInputBindingScreenWidget`
- `/Script/SlientResolveLogic.SlientResolveInputBindingViewModel`
- `/Script/SlientResolveLogic.SlientResolveInputBindingIndexedButton`

## Expected widget assets

- `/Game/CoreLogic/UI/InputBinding/WBP_HanWraithInputBindingScreen`
- `/Game/CoreLogic/UI/InputBinding/WBP_HanWraithInputBindingDeviceTabButton`
- `/Game/CoreLogic/UI/InputBinding/WBP_HanWraithInputBindingModeButton`
- `/Game/CoreLogic/UI/InputBinding/WBP_HanWraithInputBindingActionRow`
- `/Game/CoreLogic/UI/InputBinding/WBP_HanWraithInputBindingDetailPanel`

## Generated art assets

- `/Game/CoreLogic/UI/InputBinding/Generated/T_UI_InputBinding_Backdrop`
- `/Game/CoreLogic/UI/InputBinding/Generated/T_UI_InputBinding_PanelFrame`
- `/Game/CoreLogic/UI/InputBinding/Generated/T_UI_InputBinding_Emblem`

## Current phase

- 已交付 **可编译的 C++ runtime screen + MVVM view model + 内容 manifest**
- 已补本地程序化生成并导入的 UI 贴图资源
- 当前 runtime 优先使用 `SourceArt/HanWraith/` 下的 Figma 切图：整屏底板、选择器带、左右主面板、详情信息块、保存条、Tab 状态、选中行和局部图标
- 已补 `scripts/create_input_binding_widgets.py` / `scripts/validate_input_binding_widgets.py` 用于创建和校验 UMG Widget Blueprint 壳子
- 当前 Figma 目标 Frame: `YsuAddHhPcoVEHbvJi22GE#1002:2`
- 第一版动作列表固定为 `Move, Look, Attack, Dodge, Interact, LockOn, MenuBack`
- 不依赖 IMAGE2；当前正式资源由 `SourceArt/HanWraith/` 切图提供，旧 `Generated/T_UI_*` 资源保留为历史/备用输出
- 不依赖 Unreal Editor 手工创建真实 Widget `.uasset`

## Integration seam

- 真实输入绑定数据应通过 `USlientResolveInputBindingSettingsLocalPlayerSubsystem` 提供
- 持久化载体命名约定为 `USlientResolveInputBindingSettingsSaveGame`
- 本屏只负责 **设备页签 / 模式切换 / 动作行列表 / 锁定态 / 冲突态 / 详情说明**
- 不承载底层 Trigger / Modifier 编辑器

## Source of truth

- `InputBinding.manifest.json`
- `.omx/plans/ralplan-input-binding-ui.md`
- `Obisdian/03_游戏系统/02_战斗与技能/IMC_ARPG_InputSystem输入映射整理.md`
