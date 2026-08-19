/**
 * <mva-pediatric-flowchart>
 * Organigramme : Prise en charge du VIH chez l'enfant et stratégie MVA
 */
class MvaPediatricFlowchart extends HTMLElement {
  connectedCallback() {
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
        }
        .wrap { background: var(--surface); border-radius: 12px; padding: 8px; }
        svg { display: block; width: 100%; height: auto; }
        .node { cursor: pointer; }
        .node:hover rect { filter: brightness(0.96); }
        .node text { pointer-events: none; }
        .th { font-size: 14px; font-weight: 600; }
        .ts { font-size: 12px; font-weight: 400; }
        .arr { stroke: var(--text-secondary); stroke-width: 1.5; fill: none; }
      </style>
      <div class="wrap">
        <svg viewBox="0 0 680 750" role="img" aria-label="Organigramme de prise en charge du VIH chez l'enfant, avec branche maladie VIH avancée">
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
    `;

    root.querySelectorAll('.node').forEach((node) => {
      node.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('step-click', {
          detail: { id: node.dataset.id, title: node.dataset.title },
          bubbles: true,
          composed: true,
        }));
      });
    });
  }
}

customElements.define('mva-pediatric-flowchart', MvaPediatricFlowchart);
