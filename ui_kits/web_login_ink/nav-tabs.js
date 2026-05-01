/* ============================================================================
 * 一介 · 共享全局导航交互
 * 行为：点击 tab → 跳页；点击 L1/R1 或按 Q/E → 循环切页。
 * 当前界面通过 <nav class="nav-tabs" data-current="settings"> 标识。
 * ============================================================================ */
(function () {
  const ORDER = ["map","journal","inventory","skills","codex","settings"];
  const HREF = {
    map: "map.html",
    journal: "journal.html",
    inventory: "inventory.html",
    skills: "skills.html",
    codex: "codex.html",
    settings: "settings.html"
  };

  function init() {
    const nav = document.querySelector(".nav-tabs");
    if (!nav) return;
    const cur = nav.dataset.current || "settings";

    // active 状态
    nav.querySelectorAll(".tab-link").forEach(t => {
      t.classList.toggle("active", t.dataset.screen === cur);
      if (!t.getAttribute("href") && HREF[t.dataset.screen]) {
        t.setAttribute("href", HREF[t.dataset.screen]);
      }
    });

    // L1/R1 循环
    function cycle(dir) {
      const idx = ORDER.indexOf(cur);
      const next = ORDER[(idx + dir + ORDER.length) % ORDER.length];
      window.location.href = HREF[next];
    }
    const lk = nav.querySelector(".tk-key.l");
    const rk = nav.querySelector(".tk-key.r");
    if (lk) lk.addEventListener("click", () => cycle(-1));
    if (rk) rk.addEventListener("click", () => cycle(1));

    // 键盘
    document.addEventListener("keydown", (e) => {
      if (e.target && /^(input|textarea|select)$/i.test(e.target.tagName)) return;
      if (e.key === "q" || e.key === "Q") { e.preventDefault(); cycle(-1); }
      else if (e.key === "e" || e.key === "E") { e.preventDefault(); cycle(1); }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
