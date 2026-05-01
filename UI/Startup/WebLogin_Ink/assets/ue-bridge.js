// SlientResolve WebUI ↔ Unreal bridge.
// Provides ue5(name, data) which serializes a payload to the C++ widget via UE's
// standard ue.interface.broadcast / hash-fallback mechanism.
(function () {
  try {
    var file = (location.pathname.split("/").pop() || "index.html").replace(/\.html$/i, "");
    if (file === "index") file = "login";
    document.documentElement.dataset.srPage = file || "login";
  } catch (_) {}
})();
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

/* Shared late-pass skinning for pages that still carried older warm
 * "Sanguo" ornament. This style tag is appended after page-local CSS so we
 * can re-skin legacy wood/parchment surfaces without rewriting each page's
 * JS contract first. */
(function installInkPageRefactorSkin() {
  if (typeof document === "undefined") return;
  if (document.getElementById("sr-ink-page-refactor")) return;

  const style = document.createElement("style");
  style.id = "sr-ink-page-refactor";
  style.textContent = `
html[data-sr-page="skills"] .stage,
html[data-sr-page="profile"] .stage,
html[data-sr-page="inventory"] .stage,
html[data-sr-page="codex"] .stage,
html[data-sr-page="journal"] .stage,
html[data-sr-page="load"] .stage,
html[data-sr-page="lobby"] .stage,
html[data-sr-page="map"] .stage {
  background:
    radial-gradient(ellipse 42vw 30vh at 49% 24%, rgba(255,255,255,.80), transparent 72%),
    radial-gradient(ellipse 50vw 38vh at 52% 58%, rgba(214,226,238,.42), transparent 78%),
    radial-gradient(ellipse 22vw 18vh at 9% 94%, rgba(115,132,145,.30), transparent 72%),
    radial-gradient(ellipse 24vw 20vh at 86% 92%, rgba(190,202,214,.24), transparent 74%),
    linear-gradient(180deg, #F1F5FA 0%, #E7EEF6 46%, #DDE6EF 100%) !important;
}

html[data-sr-page="pause"] .stage,
html[data-sr-page="cinematic"] .stage,
html[data-sr-page="dialogue"] .stage {
  background:
    radial-gradient(ellipse 42vw 28vh at 50% 42%, rgba(214,226,238,.12), transparent 74%),
    radial-gradient(ellipse 28vw 18vh at 50% 74%, rgba(8,10,11,.18), transparent 76%),
    linear-gradient(180deg, #14191D 0%, #0D1114 52%, #07090B 100%) !important;
}

html[data-sr-page="codex"] .body,
html[data-sr-page="journal"] .body,
html[data-sr-page="load"] .body,
html[data-sr-page="lobby"] .body,
html[data-sr-page="map"] .body {
  background: transparent !important;
  box-shadow: none !important;
}

html[data-sr-page="skills"] .header,
html[data-sr-page="profile"] .header,
html[data-sr-page="codex"] .header,
html[data-sr-page="journal"] .header,
html[data-sr-page="load"] .header,
html[data-sr-page="lobby"] .header,
html[data-sr-page="map"] .header {
  background:
    linear-gradient(180deg, rgba(248,251,255,.84), rgba(235,242,248,.72)),
    radial-gradient(ellipse at 0% 50%, rgba(5,7,8,.05), transparent 62%) !important;
  border-bottom: 1px solid rgba(30,38,45,.14) !important;
  box-shadow: 0 18px 48px rgba(77,92,106,.12), inset 0 0 0 1px rgba(255,255,255,.38) !important;
}

html[data-sr-page="skills"] .header::before,
html[data-sr-page="skills"] .header::after,
html[data-sr-page="profile"] .header::before,
html[data-sr-page="profile"] .header::after,
html[data-sr-page="pause"] .panel::before,
html[data-sr-page="cinematic"] .bar-top::after,
html[data-sr-page="cinematic"] .bar-bottom::after {
  opacity: .22 !important;
  filter: grayscale(1) !important;
}

html[data-sr-page="skills"] .bc-kanji,
html[data-sr-page="profile"] .bc-kanji,
html[data-sr-page="codex"] .bc-kanji,
html[data-sr-page="journal"] .bc-kanji,
html[data-sr-page="load"] .bc-kanji,
html[data-sr-page="lobby"] .bc-kanji,
html[data-sr-page="map"] .bc-kanji,
html[data-sr-page="pause"] .kanji,
html[data-sr-page="cinematic"] .chapter-mark .name {
  color: rgba(5,7,8,.88) !important;
  text-shadow: 0 1px 0 rgba(255,255,255,.34), 0 16px 28px rgba(83,98,110,.16) !important;
}

html[data-sr-page="skills"] .bc-path,
html[data-sr-page="profile"] .bc-path,
html[data-sr-page="codex"] .bc-path,
html[data-sr-page="journal"] .bc-path,
html[data-sr-page="load"] .bc-path,
html[data-sr-page="lobby"] .bc-tag,
html[data-sr-page="map"] .bc-path {
  background: rgba(248,251,255,.76) !important;
  color: rgba(24,30,34,.72) !important;
  border-left: 1px solid rgba(30,38,45,.16) !important;
  border-right: 1px solid rgba(30,38,45,.16) !important;
  box-shadow: 0 12px 26px rgba(77,92,106,.10), inset 0 0 0 1px rgba(255,255,255,.42) !important;
}

html[data-sr-page="skills"] .seal,
html[data-sr-page="profile"] .seal,
html[data-sr-page="codex"] .seal,
html[data-sr-page="journal"] .seal,
html[data-sr-page="load"] .seal,
html[data-sr-page="lobby"] .seal,
html[data-sr-page="map"] .seal,
html[data-sr-page="pause"] .panel::after,
html[data-sr-page="cinematic"] .chapter-mark .num,
html[data-sr-page="cinematic"] .caption-speaker {
  background: rgba(235,240,246,.78) !important;
  color: rgba(22,27,31,.74) !important;
  border-color: rgba(42,48,52,.38) !important;
  box-shadow: 0 8px 18px rgba(66,78,88,.12), inset 0 0 0 2px rgba(255,255,255,.28) !important;
  text-shadow: none !important;
}

html[data-sr-page="skills"] .list,
html[data-sr-page="skills"] .tree,
html[data-sr-page="skills"] .detail,
html[data-sr-page="profile"] .portrait,
html[data-sr-page="profile"] .identity,
html[data-sr-page="profile"] .section,
html[data-sr-page="profile"] .spider,
html[data-sr-page="profile"] .history,
html[data-sr-page="inventory"] .topbar,
html[data-sr-page="inventory"] .cats,
html[data-sr-page="inventory"] .charms,
html[data-sr-page="inventory"] .preview,
html[data-sr-page="inventory"] .topbar-right,
html[data-sr-page="codex"] .cats,
html[data-sr-page="codex"] .entries,
html[data-sr-page="codex"] .scroll-pane,
html[data-sr-page="journal"] .list,
html[data-sr-page="journal"] .timeline,
html[data-sr-page="journal"] .scroll,
html[data-sr-page="load"] .slots,
html[data-sr-page="load"] .thumb,
html[data-sr-page="load"] .info,
html[data-sr-page="lobby"] .body,
html[data-sr-page="lobby"] .card-row,
html[data-sr-page="map"] .map-canvas,
html[data-sr-page="map"] .panel,
html[data-sr-page="pause"] .panel,
html[data-sr-page="cinematic"] .caption,
html[data-sr-page="cinematic"] .controls {
  background: rgba(248,251,255,.42) !important;
  color: rgba(12,16,19,.78) !important;
  border-color: rgba(30,38,45,.16) !important;
  box-shadow: 0 20px 52px rgba(77,92,106,.12), inset 0 0 0 1px rgba(255,255,255,.30) !important;
}

html[data-sr-page="skills"] .school,
html[data-sr-page="skills"] .skill-row,
html[data-sr-page="inventory"] .cat,
html[data-sr-page="inventory"] .charm,
html[data-sr-page="inventory"] .lock,
html[data-sr-page="journal"] .entry,
html[data-sr-page="profile"] .attrs > div,
html[data-sr-page="profile"] .equipped > div,
html[data-sr-page="pause"] .menu-item,
html[data-sr-page="codex"] .entry-row,
html[data-sr-page="codex"] .cats > div,
html[data-sr-page="codex"] .scroll-head,
html[data-sr-page="codex"] .scroll-meta,
html[data-sr-page="codex"] .scroll-meta-row,
html[data-sr-page="journal"] .entry-row,
html[data-sr-page="load"] .slot,
html[data-sr-page="lobby"] .card-row > div,
html[data-sr-page="map"] .panel-tag,
html[data-sr-page="map"] .action-btn,
html[data-sr-page="cinematic"] .cine-btn,
html[data-sr-page="inventory"] .expand-prompt {
  background: rgba(255,255,255,.26) !important;
  color: rgba(18,24,28,.74) !important;
  border-color: rgba(30,38,45,.16) !important;
  box-shadow: 0 14px 30px rgba(77,92,106,.10), inset 0 0 0 1px rgba(255,255,255,.28) !important;
}

html[data-sr-page="skills"] .school.active,
html[data-sr-page="skills"] .skill-row.active,
html[data-sr-page="inventory"] .cat.active,
html[data-sr-page="inventory"] .charm.active,
html[data-sr-page="journal"] .entry.active,
html[data-sr-page="profile"] .attrs > div.active,
html[data-sr-page="profile"] .equipped > div.active,
html[data-sr-page="pause"] .menu-item.active,
html[data-sr-page="codex"] .entry-row.active,
html[data-sr-page="codex"] .cats > div.active,
html[data-sr-page="journal"] .entry-row.active,
html[data-sr-page="load"] .slot.active,
html[data-sr-page="lobby"] .card-row > div.active,
html[data-sr-page="map"] .action-btn.primary,
html[data-sr-page="cinematic"] .cine-btn.primary,
html[data-sr-page="inventory"] .tab-link.active {
  background: rgba(255,255,255,.68) !important;
  color: rgba(0,0,0,.90) !important;
  border-color: rgba(5,7,8,.28) !important;
  box-shadow: 0 18px 42px rgba(77,92,106,.14), inset 0 -2px 0 rgba(5,7,8,.22) !important;
}

html[data-sr-page="skills"] .school-name,
html[data-sr-page="skills"] .tree-title,
html[data-sr-page="skills"] .detail-title,
html[data-sr-page="profile"] .identity .name,
html[data-sr-page="profile"] .section h3,
html[data-sr-page="inventory"] .charm-name,
html[data-sr-page="inventory"] .cat-name,
html[data-sr-page="inventory"] .tab-link,
html[data-sr-page="codex"] .scroll-title,
html[data-sr-page="codex"] .entry-name,
html[data-sr-page="journal"] .scroll-title,
html[data-sr-page="load"] .slot-name,
html[data-sr-page="lobby"] .card-cn,
html[data-sr-page="map"] .panel-title,
html[data-sr-page="pause"] .subline,
html[data-sr-page="cinematic"] .caption-line,
html[data-sr-page="cinematic"] .caption-line::before,
html[data-sr-page="cinematic"] .caption-line::after {
  color: rgba(5,7,8,.88) !important;
  text-shadow: 0 1px 0 rgba(255,255,255,.24), 0 12px 24px rgba(83,98,110,.12) !important;
}

html[data-sr-page="skills"] .school-tag,
html[data-sr-page="skills"] .tree-hint,
html[data-sr-page="skills"] .detail-tag,
html[data-sr-page="profile"] .clazz,
html[data-sr-page="profile"] .lineage,
html[data-sr-page="profile"] .what,
html[data-sr-page="inventory"] .sub,
html[data-sr-page="inventory"] .footer-meta,
html[data-sr-page="inventory"] .charm-icon,
html[data-sr-page="codex"] .entry-tag,
html[data-sr-page="codex"] .scroll-cat,
html[data-sr-page="journal"] .entry-where,
html[data-sr-page="load"] .slot-where,
html[data-sr-page="lobby"] .card-desc,
html[data-sr-page="map"] .panel-coord,
html[data-sr-page="pause"] .hint,
html[data-sr-page="cinematic"] .caption-speaker,
html[data-sr-page="cinematic"] .name {
  color: rgba(57,68,78,.62) !important;
}

html[data-sr-page="inventory"] .leaf,
html[data-sr-page="inventory"] .leaf-floor,
html[data-sr-page="inventory"] .leaf-layer,
html[data-sr-page="inventory"] .hero-mount,
html[data-sr-page="inventory"] .hero-mount svg,
html[data-sr-page="cinematic"] .bar-top,
html[data-sr-page="cinematic"] .bar-bottom {
  filter: grayscale(1) saturate(.35) brightness(1.08) !important;
}

html[data-sr-page="codex"] .scroll-pane,
html[data-sr-page="codex"] .scroll-body,
html[data-sr-page="codex"] .entries,
html[data-sr-page="codex"] .cats,
html[data-sr-page="journal"] .scroll-summary,
html[data-sr-page="journal"] .scroll,
html[data-sr-page="journal"] .list,
html[data-sr-page="journal"] .meta,
html[data-sr-page="load"] .slot-stats,
html[data-sr-page="load"] .slots,
html[data-sr-page="load"] .thumb,
html[data-sr-page="load"] .info,
html[data-sr-page="cinematic"] .progress,
html[data-sr-page="cinematic"] .dot,
html[data-sr-page="cinematic"] .scene {
  background: rgba(248,251,255,.24) !important;
  color: rgba(18,24,28,.72) !important;
  border-color: rgba(30,38,45,.16) !important;
}

html[data-sr-page="cinematic"] .scene {
  box-shadow: inset 0 0 160px rgba(0,0,0,.36) !important;
}

html[data-sr-page="codex"] .scroll-body,
html[data-sr-page="journal"] .scroll-summary {
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.18) !important;
}

html[data-sr-page="pause"] .panel,
html[data-sr-page="cinematic"] .caption,
html[data-sr-page="dialogue"] .dialogue-frame,
html[data-sr-page="dialogue"] .npc-card {
  backdrop-filter: blur(8px) saturate(1.02) !important;
}
`;

  (document.head || document.documentElement).appendChild(style);
})();

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
    try {
      return document.documentElement.dataset.srPage || "login";
    } catch (_) {
      return "login";
    }
  }

  function isShellPage(pageId) {
    return pageIndex.has(pageId);
  }

  function getWrappedIndex(index) {
    const total = PAGES.length;
    return (index + total) % total;
  }

  function computeDirection(fromIndex, toIndex) {
    const total = PAGES.length;
    const forward = getWrappedIndex(toIndex - fromIndex);
    const backward = getWrappedIndex(fromIndex - toIndex);
    return forward <= backward ? 1 : -1;
  }

  function prepareTransition(step, targetId) {
    try {
      sessionStorage.setItem(TRANSITION_KEY, JSON.stringify({
        to: targetId,
        dir: step >= 0 ? "next" : "prev",
        at: Date.now()
      }));
    } catch (_) {}
  }

  function applyEntryTransition() {
    const currentPageId = getCurrentPageId();
    if (!isShellPage(currentPageId)) return;

    let payload = null;
    try {
      payload = JSON.parse(sessionStorage.getItem(TRANSITION_KEY) || "null");
    } catch (_) {
      payload = null;
    }

    if (!payload || payload.to !== currentPageId || Date.now() - (payload.at || 0) > 5000) {
      return;
    }

    try {
      sessionStorage.removeItem(TRANSITION_KEY);
    } catch (_) {}

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
    if (!isShellPage(currentPageId) || !isShellPage(targetId) || currentPageId === targetId) {
      return false;
    }

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
    isShellPage,
    prepareTransition,
    applyEntryTransition,
    pageStep,
    goToPage,
    render: buildShell
  };
})();

window.addEventListener("DOMContentLoaded", () => {
  SRPageShell.render();
  SRPageShell.applyEntryTransition();
});

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
 * 帧率分色：≥55 金色 / 30–54 朱红 / <30 警示红，并附 1s 平均的最低值 (low) 帮助观察卡顿。
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
    /* 每 4s 重置 low，让卡顿历史不会无限糊住 */
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


/* === SRNav — Spatial focus navigation（Ink 主题，与默认主题契约一致）======
 * 同 WebLogin/assets/ue-bridge.js 末尾的 SRNav，详见那边注释。
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
