// SlientResolve WebUI ↔ Unreal bridge.
// Provides ue5(name, data) which serializes a payload to the C++ widget via UE's
// standard ue.interface.broadcast / hash-fallback mechanism.
"object" != typeof ue && (ue = {}),
uuidv4 = function () {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, function (t) {
    return (t ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> t / 4).toString(16);
  });
},
ue5 = function (r) {
  return "object" != typeof ue.interface || "function" != typeof ue.interface.broadcast
    ? (ue.interface = {}, function (t, e, n, o) {
        var u, i;
        "string" == typeof t && ("function" == typeof e && (o = n, n = e, e = null),
        u = [t, "", r(n, o)],
        void 0 !== e && (u[1] = e),
        i = encodeURIComponent(JSON.stringify(u)),
        "object" == typeof history && "function" == typeof history.pushState
          ? (history.pushState({}, "", "#" + i), history.pushState({}, "", "#" + encodeURIComponent("[]")))
          : (document.location.hash = i, document.location.hash = encodeURIComponent("[]")));
      })
    : (i = ue.interface, ue.interface = {}, function (t, e, n, o) {
        var u;
        "string" == typeof t && ("function" == typeof e && (o = n, n = e, e = null),
        u = r(n, o),
        void 0 !== e ? i.broadcast(t, JSON.stringify(e), u) : i.broadcast(t, "", u));
      });
  var i;
}(function (t, e) {
  if ("function" != typeof t) return "";
  var n = uuidv4();
  return ue.interface[n] = t, setTimeout(function () { delete ue.interface[n]; }, 1e3 * Math.max(1, parseInt(e) || 0)), n;
});

// Tiny perf monitor: count ue5 calls + log if frame budget overruns.
window.SRBridge = {
  send(name, payload) {
    try {
      ue5(name, payload || {});
    } catch (err) {
      console.error("[SRBridge] failed to send", name, err);
    }
  },
  ready(surface) { this.send("ready", { surface }); },
  back(surface)  { this.send("back",  { surface }); },

  /** Generic transient toast — every page can call this without owning its own DOM. */
  toast(text, opts) {
    SRToastStack.push(text, opts || {});
  }
};

/* === Toast stack ============================================================== */
window.SRToastStack = (function() {
  let containerEl = null;
  let nextId = 0;

  function ensureContainer() {
    if (containerEl) return containerEl;
    containerEl = document.createElement("div");
    containerEl.id = "sr-toast-stack";
    containerEl.style.cssText = [
      "position:fixed",
      "top:24px",
      "right:24px",
      "z-index:9000",
      "display:flex",
      "flex-direction:column",
      "gap:10px",
      "pointer-events:none",
      "max-width:340px"
    ].join(";");
    if (document.body) {
      document.body.appendChild(containerEl);
    } else {
      window.addEventListener("DOMContentLoaded", () => document.body.appendChild(containerEl));
    }
    return containerEl;
  }

  function push(text, opts) {
    const c = ensureContainer();
    const id = ++nextId;
    const node = document.createElement("div");
    node.dataset.id = String(id);
    const tone = opts.tone || "default"; // default | quest | warn | danger
    const palette = {
      default: ["#EDDFC2", "#A8997D", "rgba(237,223,194,0.45)"],
      quest:   ["#EDDFC2", "#D85528", "rgba(216,85,40,0.55)"],
      warn:    ["#EDDFC2", "#C9A24B", "rgba(201,162,75,0.55)"],
      danger:  ["#EDDFC2", "#B83A1C", "rgba(184,58,28,0.7)"]
    }[tone] || ["#EDDFC2", "#A8997D", "rgba(237,223,194,0.45)"];
    node.style.cssText = [
      "pointer-events:auto",
      "padding:10px 18px",
      "min-width:200px",
      "background:rgba(20,17,13,0.94)",
      `border-left:3px solid ${palette[1]}`,
      `box-shadow:0 4px 18px ${palette[2]}`,
      "color:" + palette[0],
      "font-family:KaiBrush, STKaiti, KaiTi, '楷体', serif",
      "font-size:14px",
      "letter-spacing:0.18em",
      "line-height:1.5",
      "opacity:0",
      "transform:translateX(20px)",
      "transition:opacity 0.2s ease, transform 0.2s ease"
    ].join(";");
    if (opts.title) {
      const t = document.createElement("div");
      t.style.cssText = "font-family:'JetBrains Mono', Consolas, monospace;font-size:10px;letter-spacing:0.3em;color:" + palette[1] + ";margin-bottom:4px;";
      t.textContent = opts.title;
      node.appendChild(t);
    }
    const body = document.createElement("div");
    body.textContent = text;
    node.appendChild(body);
    c.appendChild(node);
    requestAnimationFrame(() => {
      node.style.opacity = "1";
      node.style.transform = "translateX(0)";
    });
    const ttl = Math.max(800, opts.ttl || 2400);
    setTimeout(() => {
      node.style.opacity = "0";
      node.style.transform = "translateX(20px)";
      setTimeout(() => node.remove(), 240);
    }, ttl);
    return id;
  }

  return { push };
})();

/* Allow C++ to push toasts: Browser->Call("toast", { text, tone, ttl, title }) */
ue.interface.toast = function(payload) {
  if (!payload) return;
  SRBridge.toast(payload.text || "", payload);
};

/* === Accessibility theme application ===========================================
 * Applied via body[data-*] attributes; common.css contains the variants. C++
 * pushes the active theme on every page's ready event so navigation stays
 * consistent without each page hand-rolling theme state.
 *
 *   payload = { colorblind: "off|rg|by|all", contrast: "normal|high", bigtext: "off|on" }
 */
window.SRTheme = {
  apply(payload) {
    if (!document.body) return;
    if (payload.colorblind && payload.colorblind !== "off") {
      document.body.dataset.colorblind = payload.colorblind;
    } else {
      delete document.body.dataset.colorblind;
    }
    if (payload.contrast === "high") {
      document.body.dataset.contrast = "high";
    } else {
      delete document.body.dataset.contrast;
    }
    if (payload.bigtext === "on" || payload.bigtext === true) {
      document.body.dataset.bigtext = "on";
    } else {
      delete document.body.dataset.bigtext;
    }
  }
};
ue.interface.setTheme = function(payload) {
  if (payload) SRTheme.apply(payload);
};
// On page DOMContentLoaded apply once if any state was already pushed.
window.addEventListener("DOMContentLoaded", () => {
  if (window.__SR_PENDING_THEME) {
    SRTheme.apply(window.__SR_PENDING_THEME);
    delete window.__SR_PENDING_THEME;
  }
});

/* === FPS overlay (backtick toggles; pages may default-on via SRPerfHud.toggle()) ====
 * 帧率分色：≥55 金 / 30–54 朱红 / <30 警示红，并附 4s 内最低值 (low) 帮助观察卡顿。
 * 计算用 requestAnimationFrame，每 500ms 平滑一次，与浏览器合成帧严格对齐。 */
(function() {
  let visible = false;
  let frames = 0;
  let lastReport = performance.now();
  let fps = 0;
  let lowFps = 999;
  let lowResetAt = performance.now();
  let overlayEl = null;
  let valueEl = null;
  let raf = null;

  function ensureOverlay() {
    if (overlayEl) return overlayEl;
    overlayEl = document.createElement("div");
    overlayEl.id = "sr-fps-overlay";
    overlayEl.style.cssText = [
      "position:fixed",
      "right:10px",
      "top:10px",
      "z-index:99998",
      "padding:6px 12px",
      "background:rgba(10,7,4,0.82)",
      "border:1px solid rgba(216,85,40,0.55)",
      "border-radius:3px",
      "color:#EDDFC2",
      "font-family:'JetBrains Mono', Consolas, monospace",
      "font-size:13px",
      "letter-spacing:0.10em",
      "line-height:1.3",
      "pointer-events:none",
      "box-shadow:0 4px 14px rgba(0,0,0,0.55), 0 0 12px rgba(216,85,40,0.18)",
      "user-select:none",
      "display:none"
    ].join(";");
    const label = document.createElement("span");
    label.textContent = "WebUI ";
    label.style.cssText = "color:#A8997D;font-size:11px;letter-spacing:0.22em;";
    valueEl = document.createElement("span");
    valueEl.textContent = "—";
    overlayEl.appendChild(label);
    overlayEl.appendChild(valueEl);
    if (document.body) {
      document.body.appendChild(overlayEl);
    } else {
      window.addEventListener("DOMContentLoaded", () => document.body.appendChild(overlayEl));
    }
    return overlayEl;
  }

  function paint() {
    if (!valueEl) return;
    const color = fps >= 55 ? "#DCC288" : fps >= 30 ? "#DC4A20" : "#FF5040";
    valueEl.style.color = color;
    valueEl.textContent = `${String(fps).padStart(3, " ")} fps · low ${String(lowFps === 999 ? 0 : lowFps).padStart(3, " ")}`;
  }

  function tick(now) {
    frames++;
    const dt = now - lastReport;
    if (dt >= 500) {
      fps = Math.round((frames * 1000) / dt);
      if (fps < lowFps) lowFps = fps;
      frames = 0;
      lastReport = now;
      if (visible) paint();
    }
    if (now - lowResetAt >= 4000) { lowFps = fps || 999; lowResetAt = now; }
    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (raf) return;
    lastReport = performance.now();
    lowResetAt = lastReport;
    frames = 0; lowFps = 999;
    raf = requestAnimationFrame(tick);
  }
  function stop() {
    if (raf) { cancelAnimationFrame(raf); raf = null; }
  }

  function toggle() {
    visible = !visible;
    const el = ensureOverlay();
    el.style.display = visible ? "inline-block" : "none";
    if (visible) start(); else stop();
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "`" || e.key === "~") {
      e.preventDefault();
      toggle();
    }
  }, true);

  window.SRPerfHud = { toggle, isVisible: () => visible, fps: () => fps };
})();

/* === Page Shell — 顶部 tab strip + L1/R1 hint, 与 Ink 主题对齐 ============
 * 自动按 documentElement.dataset.srPage 知道当前页 → buildShell 把 tab strip
 * 注入 .stage 顶部。点击 tab 或按 L1/R1（C++ 路由 Gamepad_LeftShoulder/RightShoulder
 * → SRBridge.send("nav") 经由 keydown 触发）切到目标页。
 *
 * 与 Ink 实现的差异：纯 JS 逻辑相同，配色由 common.css 走默认楷墨主题 token。
 * ========================================================================== */
window.SRPageShell = (function() {
  const TRANSITION_KEY = "sr-page-shell-transition";
  const PAGES = [
    { id: "lobby",     label: "前堂" },
    { id: "settings",  label: "设定" },
    { id: "skills",    label: "武学" },
    { id: "inventory", label: "行囊" },
    { id: "journal",   label: "行錄" },
    { id: "map",       label: "地图" },
    { id: "codex",     label: "典藏" },
    { id: "profile",   label: "人物" },
    { id: "load",      label: "载入" }
  ];
  const pageIndex = new Map(PAGES.map((page, index) => [page.id, index]));

  function getCurrentPageId() {
    try { return document.documentElement.dataset.srPage || "login"; }
    catch (_) { return "login"; }
  }
  function isShellPage(pageId) { return pageIndex.has(pageId); }
  function getWrappedIndex(index) { const total = PAGES.length; return (index + total) % total; }

  function computeDirection(fromIndex, toIndex) {
    const total = PAGES.length;
    const forward = getWrappedIndex(toIndex - fromIndex);
    const backward = getWrappedIndex(fromIndex - toIndex);
    return forward <= backward ? 1 : -1;
  }

  function prepareTransition(step, targetId) {
    try {
      sessionStorage.setItem(TRANSITION_KEY, JSON.stringify({
        to: targetId, dir: step >= 0 ? "next" : "prev", at: Date.now()
      }));
    } catch (_) {}
  }

  function applyEntryTransition() {
    const currentPageId = getCurrentPageId();
    if (!isShellPage(currentPageId)) return;
    let payload = null;
    try { payload = JSON.parse(sessionStorage.getItem(TRANSITION_KEY) || "null"); } catch (_) {}
    if (!payload || payload.to !== currentPageId || Date.now() - (payload.at || 0) > 5000) return;
    try { sessionStorage.removeItem(TRANSITION_KEY); } catch (_) {}
    const stage = document.querySelector(".stage");
    if (!stage) return;
    const cls = payload.dir === "prev" ? "sr-page-enter-prev" : "sr-page-enter-next";
    stage.classList.remove("sr-page-entry-complete");
    stage.classList.add(cls);
    stage.addEventListener("animationend", () => {
      stage.classList.add("sr-page-entry-complete");
      stage.classList.remove(cls);
    }, { once: true });
  }

  function goToPage(targetId) {
    const currentPageId = getCurrentPageId();
    if (!isShellPage(currentPageId) || !isShellPage(targetId) || currentPageId === targetId) return false;
    const fromIndex = pageIndex.get(currentPageId);
    const toIndex = pageIndex.get(targetId);
    const direction = computeDirection(fromIndex, toIndex);
    prepareTransition(direction, targetId);
    SRBridge.send("nav", { to: targetId, recordHistory: false });
    return true;
  }

  function pageStep(step) {
    const currentPageId = getCurrentPageId();
    if (!isShellPage(currentPageId)) return false;
    const currentIndex = pageIndex.get(currentPageId);
    const nextPage = PAGES[getWrappedIndex(currentIndex + (step >= 0 ? 1 : -1))];
    prepareTransition(step, nextPage.id);
    SRBridge.send("nav", { to: nextPage.id, recordHistory: false });
    return true;
  }

  function buildShell() {
    const currentPageId = getCurrentPageId();
    if (!isShellPage(currentPageId)) return;
    const stage = document.querySelector(".stage");
    if (!stage || document.querySelector(".sr-page-shell")) return;

    const currentIndex = pageIndex.get(currentPageId);
    const prevPage = PAGES[getWrappedIndex(currentIndex - 1)];
    const nextPage = PAGES[getWrappedIndex(currentIndex + 1)];

    document.body && document.body.classList.add("sr-page-shell-active");

    const shell = document.createElement("section");
    shell.className = "sr-page-shell";

    const tabs = PAGES.map((page) => {
      const tab = document.createElement("button");
      tab.type = "button";
      tab.className = "sr-page-shell__tab" + (page.id === currentPageId ? " is-active" : "");
      tab.textContent = page.label;
      tab.addEventListener("click", () => goToPage(page.id));
      return tab;
    });

    shell.innerHTML = [
      "<div class=\"sr-page-shell__row\">",
      "  <button type=\"button\" class=\"sr-page-shell__button is-prev\" data-step=\"-1\">",
      "    <span class=\"sr-page-shell__key\">L1</span>",
      "  </button>",
      "  <div class=\"sr-page-shell__tabs\"></div>",
      "  <button type=\"button\" class=\"sr-page-shell__button is-next\" data-step=\"1\">",
      "    <span class=\"sr-page-shell__key\">R1</span>",
      "  </button>",
      "</div>"
    ].join("");

    const tabsHost = shell.querySelector(".sr-page-shell__tabs");
    tabs.forEach((tab) => tabsHost.appendChild(tab));

    const prevButton = shell.querySelector("[data-step='-1']");
    const nextButton = shell.querySelector("[data-step='1']");
    prevButton.title = "上一页：" + prevPage.label;
    nextButton.title = "下一页：" + nextPage.label;
    prevButton.setAttribute("aria-label", "上一页：" + prevPage.label);
    nextButton.setAttribute("aria-label", "下一页：" + nextPage.label);

    prevButton.addEventListener("click", () => pageStep(-1));
    nextButton.addEventListener("click", () => pageStep(1));

    stage.appendChild(shell);
  }

  return {
    isShellPage, prepareTransition, applyEntryTransition,
    pageStep, goToPage, render: buildShell
  };
})();

window.addEventListener("DOMContentLoaded", () => {
  SRPageShell.render();
  SRPageShell.applyEntryTransition();
});

/* === SRNav — Spatial focus navigation（默认主题 + Ink 主题共用契约）=========
 * 解决"所有界面方向键不切控件"问题。
 *
 * 工作原理：
 *  1. 每页 C++ 路由 Up/Down/Left/Right 到当前 SR<X> namespace 的 moveUp/Down/Left/Right。
 *     若该页未自定义这些方法，SRNav 在 DOMContentLoaded 时给 SR<X> 装默认实现 → 走空间焦点遍历。
 *  2. 同时 window 全局监听 ArrowUp/Down/Left/Right + WASD 作 fallback（防 C++ 路由偶发不到）。
 *  3. 选元素：优先 `[data-srnav]` 显式标记，无则 fallback 到 button / role=button / a[href]
 *     / input / [tabindex] 通用 focusable 选择器。
 *  4. 算"上下左右最近"用 bounding-box 中心：主方向距离 + 副方向距离 × 2 倍 penalty。
 *
 * 接入约定（建议但非强制）：
 *  - 在 .stage 内可交互元素加 `data-srnav` → 进入 SRNav 候选集
 *  - 不希望被 SRNav 选中（例如 .sr-page-shell__tab，它们走 L1/R1）：加 `data-srnav-skip="true"`
 *  - 当前焦点元素自动获得 `data-srnav-focus="true"`（CSS 可加 `[data-srnav-focus] { outline: ... }`）
 *
 * 高亮 CSS（默认楷墨主题，配色 token 在 common.css，本模块只负责 marker）
 * ============================================================================ */
(function() {
  function isFocusable(el) {
    if (!el || !(el instanceof HTMLElement)) return false;
    if (el.hasAttribute("disabled") || el.getAttribute("aria-disabled") === "true") return false;
    if (el.dataset && el.dataset.srnavSkip === "true") return false;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.05) return false;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return false;
    return true;
  }

  function getCandidates() {
    const explicit = Array.from(document.querySelectorAll("[data-srnav]")).filter(isFocusable);
    if (explicit.length) return explicit;
    return Array.from(document.querySelectorAll(
      "button:not([disabled]), [role='button'], a[href], input:not([type=hidden]):not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
    )).filter(isFocusable);
  }

  function getCurrentFocus(cands) {
    const marked = document.querySelector("[data-srnav-focus]");
    if (marked && cands.includes(marked)) return marked;
    if (cands.includes(document.activeElement)) return document.activeElement;
    return null;
  }

  function rectOf(el) { return el.getBoundingClientRect(); }

  function findNeighbor(dir) {
    const cands = getCandidates();
    if (!cands.length) return null;
    const cur = getCurrentFocus(cands);
    if (!cur) return cands[0];

    const r0 = rectOf(cur);
    const cx = r0.left + r0.width / 2;
    const cy = r0.top + r0.height / 2;

    let best = null, bestScore = Infinity;
    for (const el of cands) {
      if (el === cur) continue;
      const r = rectOf(el);
      const ex = r.left + r.width / 2;
      const ey = r.top + r.height / 2;
      const dx = ex - cx, dy = ey - cy;
      let primary = 0, secondary = 0;

      if (dir === "up")    { if (dy >= -2) continue; primary = -dy; secondary = Math.abs(dx); }
      else if (dir === "down")  { if (dy <= 2)  continue; primary = dy;  secondary = Math.abs(dx); }
      else if (dir === "left")  { if (dx >= -2) continue; primary = -dx; secondary = Math.abs(dy); }
      else if (dir === "right") { if (dx <= 2)  continue; primary = dx;  secondary = Math.abs(dy); }
      else continue;

      const score = primary + secondary * 2;
      if (score < bestScore) { bestScore = score; best = el; }
    }
    return best;
  }

  function moveFocus(dir) {
    const next = findNeighbor(dir);
    if (!next) return false;
    document.querySelectorAll("[data-srnav-focus]").forEach((el) => el.removeAttribute("data-srnav-focus"));
    next.setAttribute("data-srnav-focus", "true");
    if (typeof next.focus === "function") {
      try { next.focus({ preventScroll: false }); } catch (_) { try { next.focus(); } catch (_) {} }
    }
    if (typeof next.scrollIntoView === "function") {
      try { next.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" }); } catch (_) {}
    }
    return true;
  }

  function commit() {
    const cands = getCandidates();
    const cur = getCurrentFocus(cands);
    if (cur && typeof cur.click === "function") { cur.click(); return true; }
    return false;
  }

  function pageNamespace() {
    const pageId = (document.documentElement.dataset.srPage || "").trim();
    if (!pageId) return null;
    // floating-text → SRFloatingText / lobby → SRLobby / settings → SRSettings ...
    const camel = pageId.replace(/-(\w)/g, (_, c) => c.toUpperCase());
    return "SR" + camel.charAt(0).toUpperCase() + camel.slice(1);
  }

  function installFallbacks() {
    const ns = pageNamespace();
    if (!ns) return;
    const obj = window[ns];
    if (!obj) return;
    if (typeof obj.moveUp    !== "function") obj.moveUp    = () => moveFocus("up");
    if (typeof obj.moveDown  !== "function") obj.moveDown  = () => moveFocus("down");
    if (typeof obj.moveLeft  !== "function") obj.moveLeft  = () => moveFocus("left");
    if (typeof obj.moveRight !== "function") obj.moveRight = () => moveFocus("right");
    if (typeof obj.commit    !== "function") obj.commit    = () => commit();
  }

  // 全局键盘 fallback（防 C++ 路由偶发不到 / editor 测试无手柄）
  window.addEventListener("keydown", (e) => {
    let dir = null;
    if (e.key === "ArrowUp"   ) dir = "up";
    else if (e.key === "ArrowDown" ) dir = "down";
    else if (e.key === "ArrowLeft" ) dir = "left";
    else if (e.key === "ArrowRight") dir = "right";
    if (!dir) return;
    if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
    if (moveFocus(dir)) e.preventDefault();
  }, true);

  window.addEventListener("DOMContentLoaded", installFallbacks);

  window.SRNav = { moveFocus, findNeighbor, getCurrentFocus, getCandidates, commit };
})();
