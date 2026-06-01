/* MLOps.Ninja · site chrome (topbar + footer)
 * Renders consistent navigation/footer into pages.
 * Usage:
 *   <header id="site-header" data-active="about"></header>
 *   ...
 *   <footer id="site-footer"></footer>
 *   <script src="chrome.js"></script>
 */
(function () {
  const BASE = (typeof window !== 'undefined' && window.SITE_BASE) ? window.SITE_BASE : '';

  const SERVICES = [
    { slug: 'eda',       label: 'EDA',         blurb: 'Exploratory Data Analysis',   color: 'sky' },
    { slug: 'data-prep', label: 'Data Prep',   blurb: 'Pipelines &amp; feature store', color: 'sky' },
    { slug: 'develop',   label: 'Develop',     blurb: 'Model training &amp; experiments', color: 'sky' },
    { slug: 'retrain',   label: '(Re)Train',   blurb: 'Continual training &amp; drift', color: 'sky' },
    { slug: 'deploy',    label: 'Deploy',      blurb: 'CI/CD &amp; rollout',            color: 'fuchsia' },
    { slug: 'inference', label: 'Inference',   blurb: 'Serving &amp; runtime',          color: 'fuchsia' },
    { slug: 'monitor',   label: 'Monitor',     blurb: 'Observability &amp; alerts',     color: 'fuchsia' },
    { slug: 'review',    label: 'Review',      blurb: 'Incident &amp; perf review',      color: 'fuchsia' },
    { slug: 'ml',        label: 'ML',          blurb: 'The model side, end-to-end',     color: 'ink' },
    { slug: 'ops',       label: 'Ops',         blurb: 'The production side, end-to-end', color: 'ink' },
  ];

  // Inject chrome-only CSS once
  if (!document.getElementById('chrome-styles')) {
    const s = document.createElement('style');
    s.id = 'chrome-styles';
    s.textContent = `
      /* Topbar */
      .topbar {
        position: sticky; top: 0; z-index: 50;
        background: rgba(255,255,255,.86);
        backdrop-filter: blur(14px);
        border-bottom: 1px solid var(--hairline);
      }
      .topbar__inner {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        height: 68px;
        gap: var(--space-5);
      }
      .topbar__inner > .brand { justify-self: start; }
      .topbar__menu { display: contents; }
      .topbar__inner .nav   { justify-self: center; }
      .topbar__inner .topbar__cta { justify-self: end; }

      /* Hamburger toggle — hidden on desktop, shown in the mobile media query */
      .nav__toggle {
        display: none;
        justify-self: end;
        width: 42px; height: 42px;
        align-items: center; justify-content: center;
        flex-direction: column; gap: 5px;
        background: transparent; border: 0; cursor: pointer;
        padding: 0; border-radius: var(--radius-sm);
      }
      .nav__toggle:focus-visible { outline: 2px solid var(--primary-container); outline-offset: 2px; }
      .nav__toggle-bar {
        width: 22px; height: 2px; background: var(--on-surface);
        transition: transform 220ms ease, opacity 160ms ease;
      }
      .topbar.is-menu-open .nav__toggle-bar:nth-child(1) { transform: translateY(7px) rotate(45deg); }
      .topbar.is-menu-open .nav__toggle-bar:nth-child(2) { opacity: 0; }
      .topbar.is-menu-open .nav__toggle-bar:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

      .brand {
        display: inline-flex; align-items: center; gap: 10px;
        font-family: var(--font-display);
        font-weight: 700;
        font-size: 18px;
        letter-spacing: -0.012em;
        color: var(--on-surface);
      }
      .brand__mark { width: 30px; height: 30px; display: inline-flex; align-items: center; justify-content: center; }
      .brand__mark img { width: 100%; height: 100%; display: block; }
      .brand__name { color: var(--on-surface); }
      .brand__suffix { color: var(--on-surface-muted); }

      .nav { display: flex; gap: 36px; align-items: center; }
      .nav__item {
        position: relative;
        font-family: var(--font-body);
        font-size: 14.5px; font-weight: 500;
        color: var(--on-surface-variant);
        padding: 4px 0;
        background: transparent;
        border: 0;
        border-bottom: 1.5px solid transparent;
        transition: color 160ms, border-color 160ms;
        display: inline-flex; align-items: center; gap: 6px;
        cursor: pointer;
        text-decoration: none;
        border-radius: 0;
        line-height: 1.4;
      }
      .nav__item:focus { outline: none; }
      .nav__item:focus-visible {
        outline: 2px solid var(--primary-container);
        outline-offset: 4px;
      }
      .nav__item:hover { color: var(--on-surface); }
      .nav__item.is-active {
        color: var(--on-surface);
        border-bottom-color: var(--primary-container);
      }
      .nav__caret {
        width: 9px; height: 9px;
        transition: transform 180ms;
      }
      .nav__item--menu[aria-expanded="true"] .nav__caret,
      .nav__item--menu:hover .nav__caret {
        transform: rotate(180deg);
      }

      /* Dropdown */
      .nav__dropwrap { position: relative; }
      .nav__dropdown {
        position: absolute;
        top: calc(100% + 14px);
        left: 0; /* horizontal offset set by JS so it never clips the viewport */
        transform: translateY(-4px);
        background: #fff;
        border: 1px solid var(--hairline);
        box-shadow: var(--shadow-float);
        padding: 12px;
        width: min(640px, calc(100vw - 24px));
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 4px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 160ms, transform 200ms;
        z-index: 60;
      }
      @media (max-width: 600px) {
        .nav__dropdown { grid-template-columns: 1fr 1fr; }
      }
      @media (max-width: 380px) {
        .nav__dropdown { grid-template-columns: 1fr; }
      }
      .nav__dropwrap:hover .nav__dropdown,
      .nav__dropwrap:focus-within .nav__dropdown,
      .nav__dropwrap.is-open .nav__dropdown {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(0);
      }
      /* Bridge so cursor can travel from item -> dropdown without closing */
      .nav__dropwrap::after {
        content: "";
        position: absolute;
        top: 100%; left: 0; right: 0;
        height: 18px;
      }
      .nav__drop-item {
        display: flex; gap: 12px; align-items: center;
        padding: 12px 14px;
        text-decoration: none;
        color: var(--on-surface);
        transition: background 140ms;
        border-radius: var(--radius-sm);
      }
      .nav__drop-item:hover { background: var(--surface-container-low); }
      .nav__drop-dot {
        width: 10px; height: 10px;
        flex-shrink: 0;
        border: 2.5px solid var(--primary-container);
        background: #fff;
      }
      .nav__drop-dot--sky     { border-color: var(--primary-container); }
      .nav__drop-dot--ink     { border-color: var(--on-surface); background: var(--on-surface); }
      .nav__drop-dot--fuchsia { border-color: var(--secondary-container); }
      .nav__drop-label {
        display: flex; flex-direction: column; gap: 3px;
      }
      .nav__drop-name {
        font-family: var(--font-display);
        font-weight: 700; font-size: 15px;
        letter-spacing: -0.005em;
        color: var(--on-surface);
        line-height: 1.1;
      }
      .nav__drop-blurb {
        font-family: var(--font-mono);
        font-size: 10.5px;
        color: var(--on-surface-muted);
        letter-spacing: 0.04em;
        line-height: 1;
      }

      /* Footer */
      .footer {
        background: var(--surface);
        border-top: 1px solid var(--hairline);
        padding: var(--space-8) 0 var(--space-4);
      }
      .footer__grid {
        display: grid;
        grid-template-columns: 2.4fr 1fr 1fr;
        gap: var(--space-6);
        margin-bottom: var(--space-7);
      }
      .footer__brand .brand { margin-bottom: 20px; }
      .footer__tag {
        font-size: 14.5px; color: var(--on-surface-variant);
        max-width: 340px; line-height: 1.6;
        margin: 0 0 var(--space-3);
      }
      .footer__contact {
        font-family: var(--font-mono);
        font-size: 12.5px; line-height: 1.9;
        color: var(--on-surface-variant);
        letter-spacing: 0.02em;
      }
      .footer__contact a { color: inherit; text-decoration: none; }
      .footer__contact a:hover { color: var(--on-surface); }
      .footer__contact .k {
        display: inline-block; width: 18px;
        color: var(--on-surface-muted);
      }
      .footer__group h4 {
        font-family: var(--font-mono);
        font-size: 11px; font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: var(--on-surface);
        margin: 0 0 18px;
      }
      .footer__group a {
        display: block;
        font-size: 14.5px;
        color: var(--on-surface-variant);
        padding: 5px 0;
        text-decoration: none;
        transition: color 160ms;
      }
      .footer__group a:hover { color: var(--on-surface); }
      .footer__bottom {
        display: flex; justify-content: space-between; align-items: center;
        padding-top: var(--space-3);
        border-top: 1px solid var(--hairline);
        font-family: var(--font-mono);
        font-size: 11px;
        color: var(--on-surface-muted);
        letter-spacing: 0.06em;
      }
      .footer__bottom .right { display: flex; gap: 22px; align-items: center; }
      .footer__bottom .status { display: inline-flex; align-items: center; gap: 8px; }
      .footer__bottom .status::before {
        content: ""; width: 7px; height: 7px;
        background: #22c55e; border-radius: 50%;
        box-shadow: 0 0 0 3px rgba(34,197,94,.18);
      }

      /* ============ MOBILE NAV + FOOTER ============ */
      @media (max-width: 760px) {
        .topbar__inner {
          display: flex;
          justify-content: space-between;
          gap: var(--space-3);
        }
        .nav__toggle { display: inline-flex; }

        /* Nav + CTA become a slide-down panel under the bar */
        .topbar__menu {
          display: block;
          position: absolute;
          top: 100%; left: 0; right: 0;
          background: #fff;
          border-bottom: 1px solid var(--hairline);
          box-shadow: var(--shadow-float);
          padding: 0 max(20px, env(safe-area-inset-left));
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          pointer-events: none;
          transition: max-height 260ms ease, opacity 180ms ease;
        }
        .topbar.is-menu-open .topbar__menu {
          max-height: calc(100vh - 68px);
          overflow-y: auto;
          opacity: 1;
          pointer-events: auto;
          padding-top: var(--space-2);
          padding-bottom: var(--space-4);
        }

        .nav {
          flex-direction: column;
          align-items: stretch;
          gap: 0;
          width: 100%;
        }
        .nav__item {
          width: 100%;
          font-size: 16px;
          padding: 16px 2px;
          border-bottom: 1px solid var(--hairline);
          border-radius: 0;
        }
        .nav__item.is-active { border-bottom-color: var(--hairline); color: var(--primary); }
        .nav__dropwrap { width: 100%; }
        .nav__item--menu { justify-content: space-between; }

        /* Lifecycle list expands inline within the panel (tap-driven) */
        .nav__dropdown {
          position: static;
          width: 100%;
          left: auto;
          transform: none;
          display: none;
          grid-template-columns: 1fr;
          gap: 0;
          padding: 4px 0 12px;
          border: 0;
          box-shadow: none;
          background: transparent;
          opacity: 1;
          pointer-events: auto;
        }
        .nav__dropwrap.is-open .nav__dropdown { display: grid; }
        .nav__drop-item { padding: 11px 12px; }

        .topbar__cta {
          width: 100%;
          padding-top: var(--space-3);
        }
        .topbar__cta .btn { width: 100%; justify-content: center; }
      }

      /* Footer: collapse 3 columns -> 1 on small screens */
      @media (max-width: 720px) {
        .footer__grid {
          grid-template-columns: 1fr;
          gap: var(--space-5);
        }
        .footer__bottom {
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }
        .footer__bottom .right { flex-wrap: wrap; gap: 14px; }
      }
    `;
    document.head.appendChild(s);
  }

  // ---- Markup builders ----
  function brandHTML() {
    return `
      <a class="brand" href="${BASE}index.html">
        <span class="brand__mark"><img src="${BASE}assets/logo.svg" alt="" /></span>
        <span><span class="brand__name">MLOps</span><span class="brand__suffix">.Ninja</span></span>
      </a>
    `;
  }

  function dropdownHTML(active) {
    const items = SERVICES.map(s => `
      <a class="nav__drop-item" href="${BASE}blog.html?cat=${s.slug}">
        <span class="nav__drop-dot nav__drop-dot--${s.color}"></span>
        <span class="nav__drop-label">
          <span class="nav__drop-name">${s.label}</span>
          <span class="nav__drop-blurb">${s.blurb}</span>
        </span>
      </a>
    `).join('');
    return `
      <div class="nav__dropwrap">
        <button class="nav__item nav__item--menu ${active==='lifecycle'?'is-active':''}" aria-haspopup="true" aria-expanded="false">
          Lifecycle
          <svg class="nav__caret" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M2.5 4.5 L6 8 L9.5 4.5"/>
          </svg>
        </button>
        <div class="nav__dropdown" role="menu">${items}</div>
      </div>
    `;
  }

  function navHTML(active) {
    return `
      <nav class="nav">
        ${dropdownHTML(active)}
        <a class="nav__item ${active==='about'  ?'is-active':''}" href="${BASE}about.html">About</a>
        <a class="nav__item ${active==='blog'   ?'is-active':''}" href="${BASE}blog.html">Blog</a>
        <a class="nav__item ${active==='contact'?'is-active':''}" href="${BASE}contact.html">Contact</a>
      </nav>
    `;
  }

  function topbarHTML(active) {
    return `
      <div class="container topbar__inner">
        ${brandHTML()}
        <button class="nav__toggle" aria-label="Open menu" aria-expanded="false" aria-controls="site-menu">
          <span class="nav__toggle-bar"></span>
          <span class="nav__toggle-bar"></span>
          <span class="nav__toggle-bar"></span>
        </button>
        <div class="topbar__menu" id="site-menu">
          ${navHTML(active)}
          <div class="topbar__cta">
            <a href="https://github.com/mlnja" target="_blank" rel="noopener" class="btn btn--primary btn--sm">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5Z"/></svg>
              GitHub
            </a>
          </div>
        </div>
      </div>
    `;
  }

  function footerHTML() {
    return `
      <div class="container">
        <div class="footer__grid">
          <div class="footer__brand">
            ${brandHTML()}
            <p class="footer__tag">
              An open journal &amp; workshop on production machine learning &mdash;
              written and built in the open by practitioners who&rsquo;d rather
              show the work than sell it.
            </p>
            <div class="footer__contact">
              <div><span class="k">✱</span><a href="mailto:launch@mlops.ninja">launch@mlops.ninja</a></div>
              <div><span class="k">☎</span><a href="tel:+972543576969">+972 (54) 357-69-69</a></div>
            </div>
          </div>
          <div class="footer__group">
            <h4>Studio</h4>
            <a href="${BASE}about.html">About</a>
            <a href="${BASE}blog.html">Blog</a>
            <a href="${BASE}contact.html">Contact</a>
          </div>
          <div class="footer__group">
            <h4>Legal</h4>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Imprint</a>
          </div>
        </div>
        <div class="footer__bottom">
          <div>© 2026 MLOps.Ninja</div>
          <div class="right">
            <span class="status">All systems operational</span>
            <span>Designed in-house</span>
          </div>
        </div>
      </div>
    `;
  }

  // ---- Mount ----
  function mount() {
    const head = document.getElementById('site-header');
    if (head) {
      const active = head.dataset.active || '';
      head.classList.add('topbar');
      head.innerHTML = topbarHTML(active);
    }
    const foot = document.getElementById('site-footer');
    if (foot) {
      foot.classList.add('footer');
      foot.innerHTML = footerHTML();
    }

    // Dropdown open/close. Hover handles desktop; click/tap handles touch
    // (no hover there) and is the reliable open state via the .is-open class.
    document.querySelectorAll('.nav__item--menu').forEach(btn => {
      const wrap = btn.closest('.nav__dropwrap');
      const setOpen = (v) => {
        btn.setAttribute('aria-expanded', v ? 'true' : 'false');
        wrap.classList.toggle('is-open', v);
        if (v) positionDropdown(wrap);
      };
      wrap.addEventListener('mouseenter', () => positionDropdown(wrap));
      wrap.addEventListener('focusin', () => positionDropdown(wrap));
      // Close when focus fully leaves the dropdown (keyboard tab-out).
      wrap.addEventListener('focusout', () => {
        if (!wrap.contains(document.activeElement)) setOpen(false);
      });
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        // Close any other open menus first.
        document.querySelectorAll('.nav__dropwrap.is-open').forEach(w => {
          if (w !== wrap) {
            w.classList.remove('is-open');
            const b = w.querySelector('.nav__item--menu');
            if (b) b.setAttribute('aria-expanded', 'false');
          }
        });
        setOpen(!wrap.classList.contains('is-open'));
      });
    });

    // Tap/click outside or Escape closes any open dropdown.
    const closeAll = () => document.querySelectorAll('.nav__dropwrap.is-open').forEach(w => {
      w.classList.remove('is-open');
      const b = w.querySelector('.nav__item--menu');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav__dropwrap')) closeAll();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });

    // Mobile hamburger: toggle the slide-down menu panel.
    const topbar = document.querySelector('.topbar');
    const toggle = document.querySelector('.nav__toggle');
    if (topbar && toggle) {
      const setMenu = (v) => {
        topbar.classList.toggle('is-menu-open', v);
        toggle.setAttribute('aria-expanded', v ? 'true' : 'false');
        toggle.setAttribute('aria-label', v ? 'Close menu' : 'Open menu');
        if (!v) closeAll(); // collapse any expanded Lifecycle list when closing
      };
      toggle.addEventListener('click', () => {
        setMenu(!topbar.classList.contains('is-menu-open'));
      });
      // Tapping a real navigation link closes the menu (anchors that don't reload).
      topbar.querySelectorAll('.nav__item:not(.nav__item--menu), .nav__drop-item, .topbar__cta a').forEach(a => {
        a.addEventListener('click', () => setMenu(false));
      });
      // Tap outside the bar closes the menu.
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.topbar')) setMenu(false);
      });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
      // Returning to desktop width clears the open state.
      window.addEventListener('resize', () => {
        if (window.innerWidth > 760) setMenu(false);
      });
    }

    // Keep the dropdown clamped inside the viewport on load + resize
    const positionAll = () => document.querySelectorAll('.nav__dropwrap').forEach(positionDropdown);
    positionAll();
    window.addEventListener('resize', positionAll);
  }

  // Position the dropdown so it stays fully on-screen regardless of viewport width.
  // The panel is anchored to the wrap (left:0) and centered under its button when
  // there's room; near an edge it slides in just enough to keep a small margin.
  function positionDropdown(wrap) {
    const dd = wrap.querySelector('.nav__dropdown');
    const btn = wrap.querySelector('.nav__item--menu');
    if (!dd || !btn) return;
    const margin = 12;
    const wrapRect = wrap.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const w = dd.offsetWidth;
    // Desired viewport-left: centered under the button.
    let left = btnRect.left + btnRect.width / 2 - w / 2;
    // Clamp into the viewport.
    left = Math.max(margin, Math.min(left, window.innerWidth - w - margin));
    // Express relative to the wrap (the dropdown's positioning context).
    dd.style.left = (left - wrapRect.left) + 'px';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
