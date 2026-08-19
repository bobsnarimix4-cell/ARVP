class InfantFollowupFlowchart extends HTMLElement {
  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' });

    root.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
          max-width: 100%;
          --pcr-bg: #fff;
          --pcr-header-bg: #16A085;
          --pcr-header-color: #fff;
          --pcr-svg-bg: #fff;
          --pcr-node-fill: #123A5E;
          --pcr-node-action-fill: #B03A2E;
          --pcr-node-followup-fill: #0E6B5C;
          --pcr-label-fill: #fff;
          --pcr-sublabel-fill: #d7e6f0;
          --pcr-arrow-stroke: #123A5E;
          --pcr-arrow-label-fill: #123A5E;
        }
        @media (prefers-color-scheme: dark) {
          :host {
            --pcr-bg: #1c1c1a;
            --pcr-header-bg: #1a7a68;
            --pcr-header-color: #fff;
            --pcr-svg-bg: #242420;
            --pcr-node-fill: #1a4a72;
            --pcr-node-action-fill: #a03020;
            --pcr-node-followup-fill: #0c5a4a;
            --pcr-label-fill: #f0eee8;
            --pcr-sublabel-fill: #c0d8e8;
            --pcr-arrow-stroke: #90b8d8;
            --pcr-arrow-label-fill: #90b8d8;
          }
        }
        .pcr-algo-wrap {
          background: var(--pcr-bg);
          border-radius: 10px;
          overflow: hidden;
        }
        .pcr-algo-svg-box {
          background: var(--pcr-svg-bg);
          border-radius: 10px;
          padding: 8px;
        }
        svg { display: block; width: 100%; height: auto; }
        .pcr-node-group { cursor: pointer; }
        .pcr-node-group:hover rect { filter: brightness(1.12); }
        .pcr-node-group rect { transition: filter 0.15s; }
      </style>
      <div class="pcr-algo-wrap">
        <div class="pcr-algo-svg-box">
          <svg viewBox="0 0 680 640" role="img" aria-label="Ordinogramme du diagnostic VIH pédiatrique">
            <defs>
              <marker id="pcr-arrowhead-inf" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M2 1L8 5L2 9" fill="none" stroke="var(--pcr-arrow-stroke)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </marker>
            </defs>

            <!-- R0 -->
            <g class="pcr-node-group" data-node="expose">
              <rect x="240" y="30" width="200" height="44" rx="8" fill="var(--pcr-node-fill)"/>
              <text x="340" y="52" fill="var(--pcr-label-fill)" font-size="14" font-weight="600" text-anchor="middle" dominant-baseline="central">Enfant exposé au VIH</text>
            </g>
            <line x1="340" y1="74" x2="340" y2="104" stroke="var(--pcr-arrow-stroke)" stroke-width="2" fill="none" marker-end="url(#pcr-arrowhead-inf)"/>

            <!-- R1 -->
            <g class="pcr-node-group" data-node="pcr6">
              <rect x="190" y="104" width="300" height="44" rx="8" fill="var(--pcr-node-fill)"/>
              <text x="340" y="126" fill="var(--pcr-label-fill)" font-size="14" font-weight="600" text-anchor="middle" dominant-baseline="central">Faire une PCR à 6 semaines</text>
            </g>
            <path d="M340 148 V162 H110 V178" stroke="var(--pcr-arrow-stroke)" stroke-width="2" fill="none" marker-end="url(#pcr-arrowhead-inf)"/>
            <path d="M340 148 V162 H340 V178" stroke="var(--pcr-arrow-stroke)" stroke-width="2" fill="none" marker-end="url(#pcr-arrowhead-inf)"/>
            <path d="M340 148 V162 H560 V178" stroke="var(--pcr-arrow-stroke)" stroke-width="2" fill="none" marker-end="url(#pcr-arrowhead-inf)"/>

            <!-- R2 -->
            <g class="pcr-node-group" data-node="pcr1-pos">
              <rect x="35" y="178" width="150" height="44" rx="8" fill="var(--pcr-node-fill)"/>
              <text x="110" y="200" fill="var(--pcr-label-fill)" font-size="14" font-weight="600" text-anchor="middle" dominant-baseline="central">PCR1 positive</text>
            </g>
            <line x1="185" y1="200" x2="265" y2="200" stroke="var(--pcr-arrow-stroke)" stroke-width="2" fill="none" marker-end="url(#pcr-arrowhead-inf)"/>
            <g class="pcr-node-group" data-node="preleve-pcr2">
              <rect x="265" y="178" width="150" height="44" rx="8" fill="var(--pcr-node-fill)"/>
              <text x="340" y="200" fill="var(--pcr-label-fill)" font-size="14" font-weight="600" text-anchor="middle" dominant-baseline="central">Prélever PCR2</text>
            </g>
            <g class="pcr-node-group" data-node="pcr1-neg">
              <rect x="485" y="178" width="150" height="44" rx="8" fill="var(--pcr-node-fill)"/>
              <text x="560" y="200" fill="var(--pcr-label-fill)" font-size="14" font-weight="600" text-anchor="middle" dominant-baseline="central">PCR1 négative</text>
            </g>

            <line x1="110" y1="222" x2="110" y2="252" stroke="var(--pcr-arrow-stroke)" stroke-width="2" fill="none" marker-end="url(#pcr-arrowhead-inf)"/>
            <path d="M340 222 V237 H265 V252" stroke="var(--pcr-arrow-stroke)" stroke-width="2" fill="none" marker-end="url(#pcr-arrowhead-inf)"/>
            <path d="M340 222 V237 H415 V252" stroke="var(--pcr-arrow-stroke)" stroke-width="2" fill="none" marker-end="url(#pcr-arrowhead-inf)"/>
            <line x1="560" y1="222" x2="560" y2="252" stroke="var(--pcr-arrow-stroke)" stroke-width="2" fill="none" marker-end="url(#pcr-arrowhead-inf)"/>

            <!-- R3 -->
            <g class="pcr-node-group" data-node="tarv-immediat">
              <rect x="25" y="252" width="170" height="56" rx="8" fill="var(--pcr-node-action-fill)"/>
              <text x="110" y="272" fill="var(--pcr-label-fill)" font-size="14" font-weight="600" text-anchor="middle" dominant-baseline="central">Débuter le TARV</text>
              <text x="110" y="290" fill="var(--pcr-sublabel-fill)" font-size="12" font-weight="400" text-anchor="middle" dominant-baseline="central">immédiatement</text>
            </g>
            <g class="pcr-node-group" data-node="pcr2-pos">
              <rect x="210" y="252" width="110" height="44" rx="8" fill="var(--pcr-node-fill)"/>
              <text x="265" y="274" fill="var(--pcr-label-fill)" font-size="14" font-weight="600" text-anchor="middle" dominant-baseline="central">PCR2 positive</text>
            </g>
            <g class="pcr-node-group" data-node="pcr2-neg">
              <rect x="360" y="252" width="110" height="44" rx="8" fill="var(--pcr-node-fill)"/>
              <text x="415" y="274" fill="var(--pcr-label-fill)" font-size="14" font-weight="600" text-anchor="middle" dominant-baseline="central">PCR2 négative</text>
            </g>
            <g class="pcr-node-group" data-node="am-protege">
              <rect x="475" y="252" width="170" height="56" rx="8" fill="var(--pcr-node-followup-fill)"/>
              <text x="560" y="272" fill="var(--pcr-label-fill)" font-size="14" font-weight="600" text-anchor="middle" dominant-baseline="central">AM protégé</text>
              <text x="560" y="290" fill="var(--pcr-sublabel-fill)" font-size="12" font-weight="400" text-anchor="middle" dominant-baseline="central">en cours</text>
            </g>

            <line x1="415" y1="296" x2="385" y2="326" stroke="var(--pcr-arrow-stroke)" stroke-width="2" fill="none" marker-end="url(#pcr-arrowhead-inf)"/>
            <line x1="560" y1="308" x2="550" y2="326" stroke="var(--pcr-arrow-stroke)" stroke-width="2" fill="none" marker-end="url(#pcr-arrowhead-inf)"/>

            <!-- R4 -->
            <g class="pcr-node-group" data-node="pcr3-neg-1">
              <rect x="330" y="326" width="110" height="44" rx="8" fill="var(--pcr-node-fill)"/>
              <text x="385" y="348" fill="var(--pcr-label-fill)" font-size="14" font-weight="600" text-anchor="middle" dominant-baseline="central">PCR3 négative</text>
            </g>
            <g class="pcr-node-group" data-node="enfant-non-infecte">
              <rect x="460" y="326" width="180" height="56" rx="8" fill="var(--pcr-node-followup-fill)"/>
              <text x="550" y="346" fill="var(--pcr-label-fill)" font-size="14" font-weight="600" text-anchor="middle" dominant-baseline="central">Enfant non infecté</text>
              <text x="550" y="364" fill="var(--pcr-sublabel-fill)" font-size="12" font-weight="400" text-anchor="middle" dominant-baseline="central">Facteur de risque persistant</text>
            </g>

            <path d="M385 370 V385 H255 V400" stroke="var(--pcr-arrow-stroke)" stroke-width="2" fill="none" marker-end="url(#pcr-arrowhead-inf)"/>
            <line x1="385" y1="370" x2="385" y2="400" stroke="var(--pcr-arrow-stroke)" stroke-width="2" fill="none" marker-end="url(#pcr-arrowhead-inf)"/>
            <line x1="550" y1="382" x2="560" y2="400" stroke="var(--pcr-arrow-stroke)" stroke-width="2" fill="none" marker-end="url(#pcr-arrowhead-inf)"/>

            <!-- R5 -->
            <g class="pcr-node-group" data-node="pcr3-pos">
              <rect x="200" y="400" width="110" height="44" rx="8" fill="var(--pcr-node-fill)"/>
              <text x="255" y="422" fill="var(--pcr-label-fill)" font-size="14" font-weight="600" text-anchor="middle" dominant-baseline="central">PCR3 positive</text>
            </g>
            <g class="pcr-node-group" data-node="pcr3-neg-2">
              <rect x="330" y="400" width="110" height="44" rx="8" fill="var(--pcr-node-fill)"/>
              <text x="385" y="422" fill="var(--pcr-label-fill)" font-size="14" font-weight="600" text-anchor="middle" dominant-baseline="central">PCR3 négative</text>
            </g>
            <g class="pcr-node-group" data-node="suivi-clinique">
              <rect x="490" y="400" width="150" height="44" rx="8" fill="var(--pcr-node-followup-fill)"/>
              <text x="565" y="422" fill="var(--pcr-label-fill)" font-size="14" font-weight="600" text-anchor="middle" dominant-baseline="central">Suivi clinique</text>
            </g>
            <text x="463" y="392" fill="var(--pcr-arrow-label-fill)" font-size="12" font-weight="600" text-anchor="middle">Arrêt ARV</text>
            <line x1="440" y1="422" x2="490" y2="422" stroke="var(--pcr-arrow-stroke)" stroke-width="2" fill="none" marker-end="url(#pcr-arrowhead-inf)"/>

            <!-- Convergence vers Enfant infecté -->
            <path d="M265 296 V385 H175 V518" stroke="var(--pcr-arrow-stroke)" stroke-width="2" fill="none" marker-end="url(#pcr-arrowhead-inf)"/>
            <path d="M255 444 V480 H175 V518" stroke="var(--pcr-arrow-stroke)" stroke-width="2" fill="none" marker-end="url(#pcr-arrowhead-inf)"/>
            <line x1="565" y1="444" x2="545" y2="474" stroke="var(--pcr-arrow-stroke)" stroke-width="2" fill="none" marker-end="url(#pcr-arrowhead-inf)"/>

            <!-- R6 -->
            <g class="pcr-node-group" data-node="enfant-infecte">
              <rect x="100" y="518" width="150" height="44" rx="8" fill="var(--pcr-node-action-fill)"/>
              <text x="175" y="540" fill="var(--pcr-label-fill)" font-size="14" font-weight="600" text-anchor="middle" dominant-baseline="central">Enfant infecté</text>
            </g>
            <g class="pcr-node-group" data-node="allaitement-12">
              <rect x="450" y="474" width="190" height="56" rx="8" fill="var(--pcr-node-followup-fill)"/>
              <text x="545" y="494" fill="var(--pcr-label-fill)" font-size="14" font-weight="600" text-anchor="middle" dominant-baseline="central">Allaitement 12 mois</text>
              <text x="545" y="512" fill="var(--pcr-sublabel-fill)" font-size="12" font-weight="400" text-anchor="middle" dominant-baseline="central">Sérologie à 14 mois</text>
            </g>

            <line x1="175" y1="562" x2="175" y2="592" stroke="var(--pcr-arrow-stroke)" stroke-width="2" fill="none" marker-end="url(#pcr-arrowhead-inf)"/>

            <!-- R7 -->
            <g class="pcr-node-group" data-node="continuer-tarv">
              <rect x="100" y="592" width="150" height="44" rx="8" fill="var(--pcr-node-action-fill)"/>
              <text x="175" y="614" fill="var(--pcr-label-fill)" font-size="14" font-weight="600" text-anchor="middle" dominant-baseline="central">Continuer le TARV</text>
            </g>
          </svg>
        </div>
      </div>
    `;

    var details = {
      expose: "Enfant né de mère vivant avec le VIH, considéré exposé jusqu'à confirmation du statut.",
      pcr6: "PCR à ADN proviral réalisée à partir de 6 semaines de vie (ou à la première consultation après 6 semaines).",
      "pcr1-pos": "Une PCR1 positive impose un traitement présomptif immédiat, en attendant la confirmation par PCR2.",
      "preleve-pcr2": "Prélèvement de confirmation à réaliser au plus vite après un résultat PCR1 positif.",
      "pcr1-neg": "PCR1 négative : poursuivre la surveillance tant que l'allaitement maternel expose l'enfant.",
      "tarv-immediat": "Le TARV présomptif est débuté sans attendre la PCR2, vu le risque vital de retarder le traitement.",
      "pcr2-pos": "Deux PCR positives (PCR1 + PCR2) confirment l'infection.",
      "pcr2-neg": "Résultat discordant (PCR1+ / PCR2-) : une 3e PCR est nécessaire pour trancher.",
      "am-protege": "Allaitement maternel protégé : mère sous ARV efficace, allaitement exclusif recommandé.",
      "pcr3-neg-1": "PCR3 réalisée pour lever le doute créé par le résultat discordant PCR1+/PCR2-.",
      "enfant-non-infecte": "Tant que l'allaitement se poursuit, le risque de transmission persiste : surveillance à maintenir.",
      "pcr3-pos": "PCR3 positive : le diagnostic d'infection est confirmé, le TARV est poursuivi à vie.",
      "pcr3-neg-2": "Deux PCR négatives sur trois (PCR2 et PCR3) permettent d'arrêter le TARV présomptif.",
      "suivi-clinique": "Suivi clinique régulier, en particulier tant que l'allaitement maternel se poursuit.",
      "enfant-infecte": "Diagnostic d'infection à VIH confirmé : prise en charge chronique à initier (bilan CD4, dépistage TB, etc.).",
      "allaitement-12": "Sérologie VIH à réaliser à 14 mois (soit ~3 mois après la fin de l'allaitement), pour confirmer le statut sérologique final.",
      "continuer-tarv": "TARV poursuivi à vie, sans fenêtre d'arrêt, avec transition progressive des schémas selon l'âge/poids."
    };

    root.querySelectorAll('.pcr-node-group').forEach((node) => {
      node.addEventListener('click', () => {
        var key = node.getAttribute('data-node');
        var detail = details[key] || '';
        this.dispatchEvent(new CustomEvent('step-click', {
          detail: { id: key, title: key, text: detail },
          bubbles: true,
          composed: true,
        }));
      });
    });
  }
}

customElements.define('infant-followup-flowchart', InfantFollowupFlowchart);
