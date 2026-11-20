/* Render — pills SVG, badges, dose chips, tables, cards, pages */
(function () {
  var A = window.__ARVP;

  /* Couleurs issues des données : n'accepter que des valeurs CSS sûres. */
  function safeColor(value, fallback) {
    if (typeof value === 'string') {
      var v = value.trim();
      if (/^#[0-9a-f]{3,8}$/i.test(v)) return v;
      if (/^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(?:,\s*(?:0|1|0?\.\d+)\s*)?\)$/i.test(v)) return v;
    }
    return fallback;
  }

  function safeHex(value, fallback) {
    return typeof value === 'string' && /^#[0-9a-f]{3,8}$/i.test(value.trim()) ? value.trim() : fallback;
  }

  function pillW(c) {
    var d = A.dk(c);
    return "<svg width='26' height='13' viewBox='0 0 26 13' style='display:inline-block;vertical-align:middle'><ellipse cx='13' cy='6.5' rx='12' ry='5.5' fill='" + c + "' stroke='" + d + "' stroke-width='1'/><line x1='13' y1='1.5' x2='13' y2='11.5' stroke='" + d + "' stroke-width='0.7' opacity='0.5'/></svg>";
  }

  function pillH(c) {
    var d = A.dk(c);
    return "<svg width='15' height='13' viewBox='0 0 15 13' style='display:inline-block;vertical-align:middle'><path d='M1,6.5 A12,5.5 0 0,1 13,1.2 L13,11.8 A12,5.5 0 0,1 1,6.5 Z' fill='" + c + "' stroke='" + d + "' stroke-width='1'/><line x1='13' y1='1.2' x2='13' y2='11.8' stroke='" + d + "' stroke-width='1.2'/></svg>";
  }

  function pills(ds, nom, isSpecial) {
    var p = A.pDose(ds);
    if (!p) return '';
    var c = safeHex(A.pc[nom], '#bdbdbd');
    var style = isSpecial ? " style='max-width:85px; justify-content:flex-start'" : '';
    var h = "<span class='pills-row'" + style + ">";
    for (var i = 0; i < p.w; i++) h += pillW(c);
    if (p.h) h += pillH(c);
    return h + '</span>';
  }

  function badge(s) {
    var i = A.si[s];
    var bg = safeColor(i && i.bg, '#eaf0fd');
    var border = safeColor(i && i.border, '#3a6ad4');
    var color = safeColor(i && i.color, '#0d2f7a');
    return "<span class='sbadge' style='background:" + bg + ';border-color:' + border + ';color:' + color + "'>" + s.toUpperCase() + '</span>';
  }

  function doseChip(t, nom) {
    if (!t) return '';
    var escapeHtml = A.escapeHtml;
    if (t.pu !== undefined) {
      var ht = t.heure === 'matin' ? "<span class='ddose-heure' style='margin:0; width:fit-content'>\u2600\uFE0F matin</span>" : '';
      var isPALD6 = (nom.indexOf('pALD') !== -1 && t.pu === '6 cp');
      if (isPALD6) {
        return "<div style='display:flex; align-items:center; flex-wrap:wrap; gap:8px'>" + pills(t.pu, nom, true) + "<span class='ddose-val'>" + escapeHtml(t.pu) + "</span><span class='ddose-tag'>prise unique /j</span>" + ht + "</div>";
      }
      return "<div style='display:flex; align-items:center; flex-wrap:wrap; gap:8px'>" + pills(t.pu, nom, false) + "<span class='ddose-val'>" + escapeHtml(t.pu) + "</span><span class='ddose-tag'>prise unique /j</span>" + ht + "</div>";
    }
    return "<div style='display:flex; flex-wrap:wrap; gap:12px; margin-top:5px'><div style='display:flex; align-items:center; gap:6px'><span class='dose-lbl'>\u2600\uFE0F Matin:</span>" + pills(t.m, nom) + "<span class='ddose-val'>" + escapeHtml(t.m) + "</span></div><div style='display:flex; align-items:center; gap:6px'><span class='dose-lbl'>\uD83C\uDF19 Soir:</span>" + pills(t.s, nom) + "<span class='ddose-val'>" + escapeHtml(t.s) + "</span></div></div>";
  }

  function grpBySchema(idx) {
    var g = { a: [], b: [], c: [], d: [] };
    A.arv.forEach(function (arv) {
      var t = arv.tranches[idx];
      if (!t) return;
      var s = t.pu !== undefined ? t.schema : t.ms;
      if (g[s] && !g[s].some(function (x) { return x.arv.nom === arv.nom; })) {
        g[s].push({ arv: arv, t: t });
      }
    });
    return g;
  }

  function genTable(type, w) {
    var isINH = type === 'INH';
    var isCTX = type === 'CTX';
    if (!isINH && !isCTX) return '';
    var escapeHtml = A.escapeHtml;

    if (isCTX) {
      var rows = A.ctmx;
      var cols = ['Tranche (Poids/\u00c2ge)', 'Sirop (200/40)', 'Cp Simple (400/80)', 'Cp Fort (800/160)'];
      var title = 'Doses Cotrimoxazole (CTX)';
      var hi = -1;
      if (!isNaN(w)) {
        if (w < 5) hi = 0;
        else if (w < 15) hi = 1;
        else if (w < 30) hi = 2;
        else hi = 3;
      }
      var h = "<div class='tbl-title ctx'>" + escapeHtml(title) + '</div>';
      h += "<div class='twrap' style='overflow-x:auto'><table><thead><tr>";
      cols.forEach(function (c) { h += '<th>' + escapeHtml(c) + '</th>'; });
      h += '</tr></thead><tbody>';
      rows.forEach(function (r, i) {
        var isHl = hi !== -1 && i === hi;
        h += "<tr class='" + (isHl ? 'hl' : '') + "'><td>" + escapeHtml(r.label) + "</td><td class='mono-cell'>" + escapeHtml(r.susp) + "</td><td class='mono-cell'>" + escapeHtml(r.simple) + "</td><td class='mono-cell'>" + escapeHtml(r.fort) + '</td></tr>';
      });
      h += '</tbody></table></div>';
      return h;
    }

    // INH TPT Table
    var is3HP = !isNaN(w) && w >= 50;
    var rows = is3HP ? (A.inh3hp || []) : (A.inh3rh || []);
    var cols = ['Poids', 'Dose'];
    var title = is3HP ? 'Posologie TPT 3HP (3 mois)' : 'Posologie TPT 3RH (3 mois)';
    var hi = -1;
    if (is3HP) {
      hi = 0;
    } else if (!isNaN(w) && w >= 4 && w < 50) {
      hi = A.inhIdx(w);
    }
    var h = "<div class='tbl-title inh'>" + escapeHtml(title) + '</div>';
    h += "<div class='twrap' style='overflow-x:auto'><table><thead><tr>";
    cols.forEach(function (c) { h += '<th>' + escapeHtml(c) + '</th>'; });
    h += '</tr></thead><tbody>';
    rows.forEach(function (r, i) {
      var isHl = hi !== -1 && i === hi;
      h += "<tr class='" + (isHl ? 'hl' : '') + "'><td>" + escapeHtml(r.p) + "</td><td class='mono-cell'>" + escapeHtml(r.d) + '</td></tr>';
    });
    h += '</tbody></table></div>';

    if (is3HP) {
      h += "<div class='tb-note'><b>Femme enceinte ou allaitante : 6H</b> \u2014 Isoniazide 300 mg, 1 comprim\u00e9 par jour pendant 6 mois (pas de 3HP). Suivi obst\u00e9trical habituel maintenu.</div>";
    }
    return h;
  }

  function renderProphylaxies(w) {
    var is3HP = !isNaN(w) && w >= 50;
    var rh = '';
    rh += "<div class='card card-proc'><div class='slabel proc-label'>\uD83E\uDE79 TRAITEMENTS PR\u00c9VENTIFS (Prophylaxies)</div>";

    rh += "<div class='proc-block'>";
    if (is3HP) {
      rh += "<div class='proc-head'><span class='proc-badge'>3HP</span><b class='proc-title'>3HP : ISONIAZIDE\u2013RIFAPENTINE</b></div>";
      rh += "<div class='proc-text'>Pr\u00e9vient la tuberculose. 3 mois, 1 prise par semaine, apr\u00e8s exclusion d'une TB maladie. Ne pas associer aux inhibiteurs de prot\u00e9ase, \u00e0 la doravirine ni au TAF.</div>";
    } else {
      rh += "<div class='proc-head'><span class='proc-badge'>3RH</span><b class='proc-title'>3RH : RIFAMPICINE\u2013ISONIAZIDE</b></div>";
      rh += "<div class='proc-text'>Pr\u00e9vient la tuberculose. 3 mois, 1 prise par jour, apr\u00e8s exclusion d'une TB maladie. Sous DTG : 2e dose de DTG 12 h apr\u00e8s le TAR pendant le TPT et 15 jours apr\u00e8s l'arr\u00eat.</div>";
    }
    rh += genTable('INH', w) + '</div>';
    rh += "<hr class='proc-hr'>";
    rh += "<div><div class='proc-head'><span class='proc-badge ctx'>CTX</span><b class='proc-title'>COTRIMOXAZOLE</b></div><div class='proc-text'>Pr\u00e9vient les infections opportunistes. Arr\u00eat si CV < 1000 copies sur 2 mesures cons\u00e9cutives.</div>" + genTable('CTX', w) + '</div></div>';
    return rh;
  }

  function renderSuivi(w) {
    var rh = '';
    rh += "<div class='card suivi-card suivi-clin'>" +
      "<div class='slabel suivi-label'>\uD83D\uDCC5 SUIVI CLINIQUE</div>" +
      "<div class='suivi-sub'>P\u00e9riodicit\u00e9 :</div>" +
      "<ul class='rlist'><li class='ritem'><span class='rdot'></span>Mensuelle (voire toutes les deux semaines) \u00e0 l'initiation du traitement ou enfant instable.</li><li class='ritem'><span class='rdot'></span>Tous les 3 mois : enfant stable (sous TAR depuis au moins 6 mois).</li></ul>" +
      "<div class='suivi-sub'>\u00c9l\u00e9ments du suivi :</div>" +
      "<ul class='rlist'><li class='ritem'><span class='rdot'></span>Surveillance de la croissance par la mesure du poids et de la taille</li><li class='ritem'><span class='rdot'></span>Rechercher une toux persistante, un amaigrissement et une fi\u00e8vre</li><li class='ritem'><span class='rdot'></span>Rechercher des signes de gravit\u00e9 (PCIME)</li></ul>" +
      "<div class='suivi-sub'>\u00c9valuation de l'Observance :</div>" +
      "<ul class='rlist'><li class='ritem'><span class='rdot'></span>S'assurer de la prise r\u00e9guli\u00e8re des m\u00e9dicaments</li><li class='ritem'><span class='rdot'></span>R\u00e9adapter la posologie des ARV en fonction du poids de l'enfant</li></ul></div>";
    rh += "<div class='card suivi-card suivi-bio'>" +
      "<div class='slabel suivi-label'>\uD83D\uDD2C SUIVI BIOLOGIQUE</div>" +
      "<div class='suivi-periode'>P\u00e9riodicit\u00e9 : tous les six mois</div>" +
      "<div class='suivi-sub'>El\u00e9ments de suivi</div>" +
      "<ul class='rlist'><li class='ritem'><span class='rdot'></span>Charge virale</li><li class='ritem'><span class='rdot'></span>Taux de CD4</li><li class='ritem'><span class='rdot'></span>Num\u00e9ration formule sanguine</li><li class='ritem'><span class='rdot'></span>Cr\u00e9atinin\u00e9mie</li><li class='ritem'><span class='rdot'></span>Transaminases h\u00e9patiques</li></ul></div>";
    rh += "<div class='card suivi-card suivi-ref'>" +
      "<div class='slabel suivi-label'>CRIT\u00c8RES DEVANT CONDUIRE A UNE R\u00c9F\u00c9RENCE</div>" +
      "<div class='suivi-sub'>Crit\u00e8res cliniques</div>" +
      "<ul class='rlist'><li class='ritem ref-txt'><span class='rdot ref-dot'></span>Perte poids lors de deux visites cons\u00e9cutives </li><li class='ritem ref-txt'><span class='rdot ref-dot'></span>Signes de gravit\u00e9 PCIME</li><li class='ritem ref-txt'><span class='rdot ref-dot'></span>Enfant infect\u00e9 malgr\u00e9 la PTME</li></ul>" +
      "<div class='suivi-sub'>Crit\u00e8res biologiques :</div>" +
      "<ul class='rlist'><li class='ritem ref-txt'><span class='rdot ref-dot'></span>\u00c9chec virologique : une charge virale sup\u00e9rieure \u00e0 1000 copies apr\u00e8s deux mesures cons\u00e9cutives malgr\u00e9 un traitement bien conduit</li><li class='ritem ref-txt'><span class='rdot ref-dot'></span>Anomalie NFS, cr\u00e9atinin\u00e9mie et transaminases</li></ul></div>";
    document.getElementById('results-suivi').innerHTML = rh;
  }

  function render() {
    var inputValue = document.getElementById('poids').value.trim();
    var w = A.parseWeight(inputValue);
    var err = document.getElementById('error');
    var errtxt = document.getElementById('errtxt');
    var res = document.getElementById('results');
    var escapeHtml = A.escapeHtml;
    var idx = isNaN(w) ? -1 : A.tIdx(w);
    document.getElementById('rbar').innerHTML = A.tranches.map(function (t, i) {
      return "<div class='rseg" + (i === idx ? ' active' : '') + "'></div>";
    }).join('');
    if (inputValue === '') {
      err.style.display = 'none';
      res.style.display = 'none';
      renderSuivi(NaN);
      return;
    }
    if (isNaN(w)) {
      err.style.display = 'flex';
      errtxt.textContent = 'Poids invalide : saisir un nombre (ex. 12,5).';
      res.style.display = 'none';
      renderSuivi(NaN);
      return;
    }
    if (idx === -1) {
      err.style.display = 'flex';
      errtxt.textContent = 'Hors intervalle (3-200 kg).';
      res.style.display = 'none';
      renderSuivi(NaN);
      return;
    }
    err.style.display = 'none';
    res.style.display = 'block';
    var T = A.tranches[idx];
    var G = grpBySchema(idx);
    var O = [];
    ['a', 'b', 'c', 'd'].forEach(function (s) {
      var info = A.si[s];
      var items = G[s];
      if (!items || items.length === 0) return;
      var accent = safeColor(info && info.color, '#0d2f7a');
      var bg = safeColor(info && info.bg, '#eaf0fd');
      var border = safeColor(info && info.border, '#3a6ad4');
      var h = "<div class='card arv-card' style='border-top:5px solid " + border + ';background:' + bg + "'>";
      h += "<div class='slabel' style='color:" + accent + "'>" + badge(s) + ' ' + escapeHtml(info.label) + ' \u2014 ' + escapeHtml(T.label) + '</div>';
      var badgeList = [];
      items.forEach(function (it) {
        var molName = it.arv.nom;
        var molImg = it.arv.img;
        var bottleImg = molImg ? "<img class='dchip-mini-bottle' src='" + escapeHtml(molImg) + "' style='z-index:10' alt=''>" : '';
        h += "<div class='dchip' style='border-color:" + border + "'><div class='dchip-content'><div class='dname' style='color:" + accent + "'>" + escapeHtml(molName) + "</div><div class='ddose'>" + doseChip(it.t, molName) + "</div></div>" + bottleImg + '</div>';
        badgeList.push("<span class='dchip-badge'><span style='color:" + accent + ";font-weight:700'>" + escapeHtml(molName) + '</span> ' + "<span class='disp-tag' style='background:" + (it.arv.isDispersible ? accent : '#607d8b') + "'>" + (it.arv.isDispersible ? 'Dispersible' : 'Non dispersible') + '</span></span>');
      });
      h += "<div class='dchip-badges'>" + badgeList.join('') + '</div>';
      h += '</div>';
      O.push(h);
    });
    O.push(renderProphylaxies(w));
    res.innerHTML = O.join('');
    renderSuivi(w);
  }


  window.openSignesAppel = function (src) {
    var existing = document.getElementById('img-zoom-overlay');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.id = 'img-zoom-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Affiche en plein \u00e9cran');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:3000;display:flex;align-items:center;justify-content:center;padding:0.5rem;box-sizing:border-box;cursor:pointer;animation:fadeIn 0.2s ease';

    var img = document.createElement('img');
    img.src = src;
    img.alt = 'Signes d\'appel du VIH p\u00e9diatrique';
    img.style.cssText = 'max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;border-radius:8px;box-shadow:0 8px 32px rgba(0,0,0,0.8)';

    overlay.appendChild(img);

    function close() {
      overlay.remove();
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) {
      if (e.key === 'Escape') close();
    }

    overlay.onclick = close;
    document.addEventListener('keydown', onKey);
    document.body.appendChild(overlay);
  };

  A.render = render;
  A.renderSuivi = renderSuivi;
})();
