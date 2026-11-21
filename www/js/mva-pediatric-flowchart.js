/**
 * <mva-pediatric-flowchart>
 * Organigramme : Prise en charge du VIH chez l'enfant et stratégie MVA
 */
class MvaPediatricFlowchart extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const root = this.attachShadow({ mode: 'open' });

    const steps = [
      { id: 'diagnostic', title: "VIH confirmé chez l'enfant", subtitle: 'Sérologie ou PCR positive' },
      { id: 'age-moins-5', title: 'Enfant < 5 ans', subtitle: 'MVA automatique (OMS)' },
      { id: 'age-plus-5', title: 'Enfant ≥ 5 ans', subtitle: 'CD4 + stade OMS + échec ARV' },
      { id: 'mva', title: 'Maladie VIH avancée', subtitle: 'CD4<200 ou stade 3/4' },
      { id: 'non-avance', title: 'VIH non avancé', subtitle: 'CD4≥200, stade 1-2' },
      { id: 'bilan-mva', title: 'Bilan ciblé + prophylaxie', subtitle: 'TB-LAM, CrAg, cotrimoxazole' },
      { id: 'arv-standard', title: 'ARV standard (Test&Treat)', subtitle: 'Stratégie TATARSEN' },
      { id: 'arv-mva', title: 'ARV rapide + suivi IRIS', subtitle: 'Syndrome de reconstit. immune' },
      { id: 'reevaluation-1an', title: 'Réévaluation à 1 an', subtitle: '<5 ans initialement MVA, CV indétectable' },
      { id: 'suivi', title: 'Suivi au long cours', subtitle: 'CV, CD4, observance, transition ado' },
    ];

    root.innerHTML = `
      <style>
        :host {
          --surface: #ffffff;
          --border: #d8d6cd;
          --text-primary: #2c2c2a;
          --text-secondary: #5f5e5a;
          --coral-fill: #FAECE7;
          --coral-stroke: #D85A30;
          --coral-title: #4A1B0C;
          --coral-sub: #712B13;
          --teal-fill: #E1F5EE;
          --teal-stroke: #1D9E75;
          --teal-title: #04342C;
          --teal-sub: #085041;
          --gray-fill: #F1EFE8;
          --gray-stroke: #888780;
          --gray-title: #2C2C2A;
          --gray-sub: #444441;
          display: block;
          font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
          max-width: 100%;
        }
        @media (prefers-color-scheme: dark) {
          :host {
            --surface: #1c1c1a;
            --border: #444441;
            --text-primary: #f1efe8;
            --text-secondary: #b4b2a9;
            --coral-fill: #4A1B0C;
            --coral-stroke: #F0997B;
            --coral-title: #FAECE7;
            --coral-sub: #F5C4B3;
            --teal-fill: #04342C;
            --teal-stroke: #5DCAA5;
            --teal-title: #E1F5EE;
            --teal-sub: #9FE1CB;
            --gray-fill: #2C2C2A;
            --gray-stroke: #888780;
            --gray-title: #F1EFE8;
            --gray-sub: #D3D1C7;
          }
          .node:focus rect, .node:focus-visible rect { stroke: #82b1ff; }
        }
        .wrap { background: var(--surface); border-radius: 12px; padding: 8px; }
        .fc-hint { font-size: 11px; color: var(--text-secondary); margin: 0 0 6px; line-height: 1.35; }
        .fc-chart { cursor: zoom-in; border-radius: 10px; }
        .fc-expand {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; min-height: 44px; margin-top: 8px; padding: 8px 12px;
          border: 1px solid var(--border); border-radius: 10px;
          background: var(--surface); color: var(--text-primary);
          font-size: 13px; font-weight: 600; cursor: pointer;
        }
        .fc-expand:hover { filter: brightness(0.96); }
        .fc-expand:focus-visible { outline: 2px solid #0d47a1; outline-offset: 2px; }
        .fc-icon { font-size: 16px; line-height: 1; }
        svg { display: block; width: 100%; height: auto; }
        .node { cursor: pointer; }
        .node:hover rect { filter: brightness(0.96); }
        .node:focus { outline: none; }
        .node:focus rect, .node:focus-visible rect { stroke: #0d47a1; stroke-width: 3; }
        .node text { pointer-events: none; }
        .th { font-size: 14px; font-weight: 600; }
        .ts { font-size: 12px; font-weight: 400; }
        .arr { stroke: var(--text-secondary); stroke-width: 1.5; fill: none; }
      </style>
      <div class="wrap">
        <p class="fc-hint" id="mva-fc-hint">Touchez l'organigramme ou le bouton Plein écran pour l'agrandir.</p>
        <div class="fc-chart" id="mva-fc-chart">
          <svg viewBox="0 0 680 750" role="group" aria-labelledby="mva-fc-title" aria-describedby="mva-fc-hint">
            <title id="mva-fc-title">Organigramme de prise en charge du VIH chez l'enfant, avec branche maladie VIH avancée</title>
          <defs>
            <marker id="arrow-mva" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </marker>
          </defs>

          <path d="M340,96 L340,123 L190,123 L190,150" class="arr" marker-end="url(#arrow-mva)"/>
          <path d="M340,96 L340,123 L490,123 L490,150" class="arr" marker-end="url(#arrow-mva)"/>
          <path d="M190,206 L190,260" class="arr" marker-end="url(#arrow-mva)"/>
          <path d="M490,206 L490,260" class="arr" marker-end="url(#arrow-mva)"/>
          <path d="M420,206 L420,233 L230,233 L230,260" class="arr" marker-end="url(#arrow-mva)"/>
          <path d="M190,316 L190,370" class="arr" marker-end="url(#arrow-mva)"/>
          <path d="M490,316 L490,370" class="arr" marker-end="url(#arrow-mva)"/>
          <path d="M190,426 L190,480" class="arr" marker-end="url(#arrow-mva)"/>
          <path d="M190,536 L190,570" class="arr" marker-end="url(#arrow-mva)"/>
          <path d="M190,626 L190,653 L290,653 L290,680" class="arr" marker-end="url(#arrow-mva)"/>
          <path d="M490,426 L490,653 L390,653 L390,680" class="arr" marker-end="url(#arrow-mva)"/>

          <g class="node" data-id="diagnostic" data-title="VIH confirmé chez l'enfant">
            <rect x="190" y="40" width="300" height="56" rx="8" fill="var(--gray-fill)" stroke="var(--gray-stroke)" stroke-width="0.5"/>
            <text class="th" x="340" y="60" text-anchor="middle" dominant-baseline="central" fill="var(--gray-title)">VIH confirmé chez l'enfant</text>
            <text class="ts" x="340" y="80" text-anchor="middle" dominant-baseline="central" fill="var(--gray-sub)">Sérologie ou PCR positive</text>
          </g>

          <g class="node" data-id="age-moins-5" data-title="Enfant < 5 ans">
            <rect x="60" y="150" width="260" height="56" rx="8" fill="var(--gray-fill)" stroke="var(--gray-stroke)" stroke-width="0.5"/>
            <text class="th" x="190" y="170" text-anchor="middle" dominant-baseline="central" fill="var(--gray-title)">Enfant &lt; 5 ans</text>
            <text class="ts" x="190" y="190" text-anchor="middle" dominant-baseline="central" fill="var(--gray-sub)">MVA automatique (OMS)</text>
          </g>

          <g class="node" data-id="age-plus-5" data-title="Enfant ≥ 5 ans">
            <rect x="360" y="150" width="260" height="56" rx="8" fill="var(--gray-fill)" stroke="var(--gray-stroke)" stroke-width="0.5"/>
            <text class="th" x="490" y="170" text-anchor="middle" dominant-baseline="central" fill="var(--gray-title)">Enfant ≥ 5 ans</text>
            <text class="ts" x="490" y="190" text-anchor="middle" dominant-baseline="central" fill="var(--gray-sub)">CD4 + stade OMS + échec ARV</text>
          </g>

          <g class="node" data-id="mva" data-title="Maladie VIH avancée">
            <rect x="60" y="260" width="260" height="56" rx="8" fill="var(--coral-fill)" stroke="var(--coral-stroke)" stroke-width="0.5"/>
            <text class="th" x="190" y="280" text-anchor="middle" dominant-baseline="central" fill="var(--coral-title)">Maladie VIH avancée</text>
            <text class="ts" x="190" y="300" text-anchor="middle" dominant-baseline="central" fill="var(--coral-sub)">CD4&lt;200 ou stade 3/4</text>
          </g>

          <g class="node" data-id="non-avance" data-title="VIH non avancé">
            <rect x="360" y="260" width="260" height="56" rx="8" fill="var(--teal-fill)" stroke="var(--teal-stroke)" stroke-width="0.5"/>
            <text class="th" x="490" y="280" text-anchor="middle" dominant-baseline="central" fill="var(--teal-title)">VIH non avancé</text>
            <text class="ts" x="490" y="300" text-anchor="middle" dominant-baseline="central" fill="var(--teal-sub)">CD4≥200, stade 1-2</text>
          </g>

          <g class="node" data-id="bilan-mva" data-title="Bilan ciblé + prophylaxie">
            <rect x="60" y="370" width="260" height="56" rx="8" fill="var(--coral-fill)" stroke="var(--coral-stroke)" stroke-width="0.5"/>
            <text class="th" x="190" y="390" text-anchor="middle" dominant-baseline="central" fill="var(--coral-title)">Bilan ciblé + prophylaxie</text>
            <text class="ts" x="190" y="410" text-anchor="middle" dominant-baseline="central" fill="var(--coral-sub)">TB-LAM, CrAg, cotrimoxazole</text>
          </g>

          <g class="node" data-id="arv-standard" data-title="ARV standard (Test&amp;Treat)">
            <rect x="360" y="370" width="260" height="56" rx="8" fill="var(--teal-fill)" stroke="var(--teal-stroke)" stroke-width="0.5"/>
            <text class="th" x="490" y="390" text-anchor="middle" dominant-baseline="central" fill="var(--teal-title)">ARV standard (Test&amp;Treat)</text>
            <text class="ts" x="490" y="410" text-anchor="middle" dominant-baseline="central" fill="var(--teal-sub)">Stratégie TATARSEN</text>
          </g>

          <g class="node" data-id="arv-mva" data-title="ARV rapide + suivi IRIS">
            <rect x="60" y="480" width="260" height="56" rx="8" fill="var(--coral-fill)" stroke="var(--coral-stroke)" stroke-width="0.5"/>
            <text class="th" x="190" y="500" text-anchor="middle" dominant-baseline="central" fill="var(--coral-title)">ARV rapide + suivi IRIS</text>
            <text class="ts" x="190" y="520" text-anchor="middle" dominant-baseline="central" fill="var(--coral-sub)">Syndrome de reconstit. immune</text>
          </g>

          <g class="node" data-id="reevaluation-1an" data-title="Réévaluation à 1 an">
            <rect x="60" y="570" width="260" height="56" rx="8" fill="var(--teal-fill)" stroke="var(--teal-stroke)" stroke-width="0.5"/>
            <text class="th" x="190" y="590" text-anchor="middle" dominant-baseline="central" fill="var(--teal-title)">Réévaluation à 1 an</text>
            <text class="ts" x="190" y="610" text-anchor="middle" dominant-baseline="central" fill="var(--teal-sub)">&lt;5 ans initialement MVA, CV indétectable</text>
          </g>

          <g class="node" data-id="suivi" data-title="Suivi au long cours">
            <rect x="170" y="680" width="340" height="56" rx="8" fill="var(--gray-fill)" stroke="var(--gray-stroke)" stroke-width="0.5"/>
            <text class="th" x="340" y="700" text-anchor="middle" dominant-baseline="central" fill="var(--gray-title)">Suivi au long cours</text>
            <text class="ts" x="340" y="720" text-anchor="middle" dominant-baseline="central" fill="var(--gray-sub)">CV, CD4, observance, transition ado</text>
          </g>
        </svg>
        </div>
        <button type="button" class="fc-expand" data-action="expand" aria-label="Afficher l'organigramme en plein écran">
          <span class="fc-icon" aria-hidden="true">&#9974;</span> Plein écran
        </button>
      </div>
    `;

    const svg = root.querySelector('svg');
    const chart = root.querySelector('.fc-chart');
    const expandBtn = root.querySelector('[data-action="expand"]');
    const FS_VARS = [
      '--surface', '--border', '--text-primary', '--text-secondary',
      '--coral-fill', '--coral-stroke', '--coral-title', '--coral-sub',
      '--teal-fill', '--teal-stroke', '--teal-title', '--teal-sub',
      '--gray-fill', '--gray-stroke', '--gray-title', '--gray-sub',
    ];
    let overlay = null;
    let lastFocus = null;

    function closeFullscreen() {
      if (!overlay) return;
      overlay.remove();
      overlay = null;
      document.removeEventListener('keydown', onOverlayKey);
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }

    function onOverlayKey(e) {
      if (!overlay) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeFullscreen();
        return;
      }
      if (e.key === 'Tab') {
        const focusables = overlay.querySelectorAll('.mva-fs-close, .mva-fs-scroll');
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    function openFullscreen() {
      if (overlay) return;
      lastFocus = root.activeElement || document.activeElement;

      overlay = document.createElement('div');
      overlay.className = 'mva-fs';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-labelledby', 'mva-fs-title');
      overlay.setAttribute('aria-describedby', 'mva-fs-hint');

      const cs = getComputedStyle(this);
      FS_VARS.forEach(function (name) {
        const value = cs.getPropertyValue(name).trim();
        if (value) overlay.style.setProperty(name, value);
      });

      overlay.innerHTML = `
        <style>
          .mva-fs {
            position: fixed; inset: 0; z-index: 3000;
            display: flex; flex-direction: column;
            background: var(--surface); color: var(--text-primary);
            font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
            animation: fadeIn 0.2s ease;
          }
          .mva-fs-bar {
            display: flex; align-items: center; gap: 10px;
            padding: 10px 12px; border-bottom: 1px solid var(--border);
            padding-top: max(10px, env(safe-area-inset-top));
          }
          .mva-fs-title {
            flex: 1; margin: 0; font-size: 14px; font-weight: 700; line-height: 1.3;
          }
          .mva-fs-close {
            flex: none; width: 44px; height: 44px; border-radius: 50%;
            border: 1px solid var(--border); background: var(--surface);
            color: var(--text-primary); font-size: 20px; line-height: 1; cursor: pointer;
          }
          .mva-fs-close:focus-visible { outline: 2px solid #0d47a1; outline-offset: 2px; }
          .mva-fs-hint {
            margin: 0; padding: 6px 12px 0; font-size: 11px; line-height: 1.35;
            color: var(--text-secondary);
          }
          .mva-fs-scroll {
            flex: 1; overflow: auto; -webkit-overflow-scrolling: touch;
            overscroll-behavior: contain; padding: 10px 8px max(16px, env(safe-area-inset-bottom));
            background: var(--surface);
          }
          .mva-fs-scroll:focus-visible { outline: 2px solid #0d47a1; outline-offset: -2px; }
          .mva-fs svg { display: block; width: 680px; width: max(680px, 100%); height: auto; }
          .mva-fs .node { cursor: default; }
          .mva-fs .node text { pointer-events: none; }
          .mva-fs .th { font-size: 14px; font-weight: 600; }
          .mva-fs .ts { font-size: 12px; font-weight: 400; }
          .mva-fs .arr { stroke: var(--text-secondary); stroke-width: 1.5; fill: none; }
        </style>
        <div class="mva-fs-bar">
          <h2 class="mva-fs-title" id="mva-fs-title">Organigramme MVA &mdash; VIH chez l'enfant</h2>
          <button type="button" class="mva-fs-close" aria-label="Fermer le plein écran">&#10005;</button>
        </div>
        <p class="mva-fs-hint" id="mva-fs-hint">Faites défiler pour explorer l'organigramme.</p>
        <div class="mva-fs-scroll" tabindex="0" role="region" aria-label="Organigramme en plein écran"></div>
      `;

      const clone = svg.cloneNode(true);
      clone.setAttribute('role', 'img');
      clone.setAttribute('aria-label', "Organigramme de prise en charge du VIH chez l'enfant");
      clone.removeAttribute('aria-labelledby');
      clone.removeAttribute('aria-describedby');
      clone.querySelectorAll('.node').forEach(function (node) {
        node.removeAttribute('tabindex');
        node.removeAttribute('role');
        node.removeAttribute('aria-label');
      });
      clone.querySelectorAll('[id]').forEach(function (el) {
        el.id = el.id + '-fs';
      });
      clone.querySelectorAll('*').forEach(function (el) {
        Array.prototype.slice.call(el.attributes).forEach(function (attr) {
          if (attr.value.indexOf('url(#') !== -1) {
            attr.value = attr.value.replace(/url\(#([^)]+)\)/g, 'url(#$1-fs)');
          }
          if (attr.name === 'aria-labelledby' || attr.name === 'aria-describedby') {
            el.removeAttribute(attr.name);
          }
        });
      });

      overlay.querySelector('.mva-fs-scroll').appendChild(clone);
      document.body.appendChild(overlay);

      overlay.querySelector('.mva-fs-close').addEventListener('click', closeFullscreen);
      document.addEventListener('keydown', onOverlayKey);
      overlay.querySelector('.mva-fs-close').focus();

      const scroller = overlay.querySelector('.mva-fs-scroll');
      if (scroller) scroller.scrollTop = 0;
    }

    expandBtn.addEventListener('click', openFullscreen);
    chart.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('.node')) return;
      openFullscreen();
    });

    const activate = (node) => {
      this.dispatchEvent(new CustomEvent('step-click', {
        detail: { id: node.dataset.id, title: node.dataset.title },
        bubbles: true,
        composed: true,
      }));
    };

    root.querySelectorAll('.node').forEach((node) => {
      const label = Array.from(node.querySelectorAll('text'))
        .map((t) => t.textContent.trim())
        .filter(Boolean)
        .join(' — ');
      node.setAttribute('tabindex', '0');
      node.setAttribute('role', 'button');
      node.setAttribute('aria-label', label);
      node.addEventListener('click', () => activate(node));
      node.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate(node);
        }
      });
    });
  }
}

customElements.define('mva-pediatric-flowchart', MvaPediatricFlowchart);
