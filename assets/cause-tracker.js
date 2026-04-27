// PlainBlack GivesBack — cause tracker
//
// When a visitor "picks" a cause on /givesback (or one of the cause
// landers), we stash the slug + display name in localStorage. From
// that point on, every form on the site gets two hidden fields
// (`givesback_cause`, `givesback_cause_name`) auto-injected so the
// downstream Web3Forms email + any future ingestion tooling knows
// who to attribute the lead, purchase, or call booking to.
//
// A small persistent badge in the bottom-left corner confirms the
// active cause and offers a one-click clear.
//
// Public API (callable from buttons via inline `onclick` or wired
// listeners):
//   window.PB.pickCause(slug, displayName)
//   window.PB.clearCause()
//   window.PB.getCause() -> { slug, name, at } | null

(function () {
  const KEY = 'pb_givesback_cause';
  const FIELD = 'givesback_cause';
  const FIELD_NAME = 'givesback_cause_name';

  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.slug) return null;
      return parsed;
    } catch { return null; }
  }

  function write(value) {
    try {
      if (value === null) localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, JSON.stringify(value));
    } catch {}
  }

  // Inject hidden fields into every form on the page so the picked
  // cause rides along with any submission. Also patches in-flight
  // FormData / fetch payloads so JS-driven submits get them too.
  function injectFormFields(cause) {
    document.querySelectorAll('form').forEach((form) => {
      let slugField = form.querySelector(`input[name="${FIELD}"]`);
      let nameField = form.querySelector(`input[name="${FIELD_NAME}"]`);
      if (!cause) {
        if (slugField) slugField.remove();
        if (nameField) nameField.remove();
        return;
      }
      if (!slugField) {
        slugField = document.createElement('input');
        slugField.type = 'hidden';
        slugField.name = FIELD;
        form.appendChild(slugField);
      }
      slugField.value = cause.slug;
      if (!nameField) {
        nameField = document.createElement('input');
        nameField.type = 'hidden';
        nameField.name = FIELD_NAME;
        form.appendChild(nameField);
      }
      nameField.value = cause.name || cause.slug;
    });
  }

  // ── Badge UI ─────────────────────────────────────────────────
  function ensureStyles() {
    if (document.getElementById('pb-cause-styles')) return;
    const style = document.createElement('style');
    style.id = 'pb-cause-styles';
    style.textContent = `
      .pb-cause-badge{
        position:fixed;bottom:20px;left:20px;z-index:1090;
        display:flex;align-items:center;gap:10px;
        background:rgba(20,20,20,0.92);
        border:1px solid rgba(62,207,142,0.35);
        border-left:3px solid #3ecf8e;
        color:#f5f3ef;
        padding:10px 14px;border-radius:8px;
        font-family:'Figtree',sans-serif;font-size:0.78rem;
        line-height:1.3;
        box-shadow:0 8px 24px rgba(0,0,0,0.35);
        backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);
        max-width:280px;
        animation:pbCauseBadgeIn .25s ease-out;
      }
      .pb-cause-badge__label{
        color:rgba(245,243,239,0.55);
        font-size:0.66rem;font-weight:700;
        letter-spacing:0.12em;text-transform:uppercase;
      }
      .pb-cause-badge__name{
        color:#3ecf8e;font-weight:700;
        margin-top:2px;
      }
      .pb-cause-badge__clear{
        background:transparent;border:none;color:rgba(245,243,239,0.55);
        cursor:pointer;font-size:1.05rem;line-height:1;
        padding:4px 6px;margin-left:auto;border-radius:4px;
        transition:color .2s, background .2s;
      }
      .pb-cause-badge__clear:hover{color:#fff;background:rgba(255,255,255,0.08)}
      @keyframes pbCauseBadgeIn{
        from{opacity:0;transform:translateY(8px)}
        to{opacity:1;transform:translateY(0)}
      }
      @media (max-width:600px){
        /* Leave the bottom-right corner for the chat bot — narrow
           the badge so its × never disappears under the bot icon. */
        .pb-cause-badge{
          bottom:14px;left:14px;right:auto;
          max-width:calc(100vw - 100px);
          font-size:0.74rem;
        }
        .pb-cause-badge__name{font-size:0.82rem}
      }
      /* Pick-cause button shared style */
      .cause-pick-btn{
        margin-top:24px;margin-left:10px;
        display:inline-flex;align-items:center;gap:8px;
        padding:11px 22px;border-radius:8px;
        background:#3ecf8e;color:#0a0a0a;
        border:1px solid #3ecf8e;
        font-family:'Figtree',sans-serif;font-weight:700;font-size:0.82rem;
        letter-spacing:0.04em;
        cursor:pointer;
        transition:all .2s;
      }
      .cause-pick-btn:hover{background:#5fe0a3;border-color:#5fe0a3}
      .cause-pick-btn[data-active="true"]{
        background:transparent;color:#3ecf8e;
        cursor:default;
      }
      .cause-pick-btn[data-active="true"]:hover{background:transparent}
    `;
    document.head.appendChild(style);
  }

  function renderBadge(cause) {
    document.querySelectorAll('.pb-cause-badge').forEach(n => n.remove());
    if (!cause) return;
    ensureStyles();
    const badge = document.createElement('div');
    badge.className = 'pb-cause-badge';
    badge.setAttribute('role', 'status');
    badge.innerHTML = `
      <div>
        <div class="pb-cause-badge__label">Backing</div>
        <div class="pb-cause-badge__name"></div>
      </div>
      <button type="button" class="pb-cause-badge__clear" aria-label="Clear backed cause">&times;</button>
    `;
    badge.querySelector('.pb-cause-badge__name').textContent = cause.name || cause.slug;
    badge.querySelector('.pb-cause-badge__clear').addEventListener('click', () => {
      window.PB.clearCause();
    });
    document.body.appendChild(badge);
  }

  // Mark each pick-cause button on the page so the visitor knows
  // which one they've already picked.
  function syncPickButtons(cause) {
    ensureStyles();
    document.querySelectorAll('[data-pick-cause]').forEach((btn) => {
      const slug = btn.dataset.pickCause;
      if (cause && cause.slug === slug) {
        btn.dataset.active = 'true';
        btn.textContent = '✓ You’re backing this cause';
      } else {
        btn.dataset.active = 'false';
        btn.textContent = btn.dataset.pickLabel || 'Back this cause';
      }
    });
  }

  function refresh() {
    const cause = read();
    injectFormFields(cause);
    renderBadge(cause);
    syncPickButtons(cause);
  }

  // ── Public API ───────────────────────────────────────────────
  window.PB = window.PB || {};
  window.PB.pickCause = function (slug, name) {
    if (!slug) return;
    write({ slug, name: name || slug, at: Date.now() });
    refresh();
  };
  window.PB.clearCause = function () {
    write(null);
    refresh();
  };
  window.PB.getCause = read;

  // Auto-wire any element with [data-pick-cause] to call pickCause
  // when clicked. The label can be customised with [data-pick-label].
  function wireButtons() {
    document.querySelectorAll('[data-pick-cause]').forEach((btn) => {
      if (btn.__pbWired) return;
      btn.__pbWired = true;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const slug = btn.dataset.pickCause;
        const name = btn.dataset.pickName || btn.dataset.pickCause;
        window.PB.pickCause(slug, name);
      });
    });
  }

  function init() {
    ensureStyles();
    wireButtons();
    refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
