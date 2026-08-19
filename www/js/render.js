/* Render — pills SVG, badges, dose chips, tables, cards, pages */
(function () {
  var A = window.__ARVP;

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
    var c = A.pc[nom] || '#bdbdbd';
    var style = isSpecial ? " style='max-width:85px; justify-content:flex-start'" : '';
    var h = "<span class='pills-row'" + style + ">";
    for (var i = 0; i < p.w; i++) h += pillW(c);
    if (p.h) h += pillH(c);
    return h + '</span>';
  }

  function badge(s) {
    var i = A.si[s];
    return "<span class='sbadge' style='background:" + i.bg + ';border-color:' + i.border + ';color:' + i.color + "'>" + s.toUpperCase() + '</span>';
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
    return "<div style='display:flex; flex-wrap:wrap; gap:12px; margin-top:5px'><div style='display:flex; align-items:center; gap:6px'><span style='font-size:0.6rem; color:#546e7a; font-weight:800; text-transform:uppercase'>\u2600\uFE0F Matin:</span>" + pills(t.m, nom) + "<span class='ddose-val'>" + escapeHtml(t.m) + "</span></div><div style='display:flex; align-items:center; gap:6px'><span style='font-size:0.6rem; color:#546e7a; font-weight:800; text-transform:uppercase'>\uD83C\uDF19 Soir:</span>" + pills(t.s, nom) + "<span class='ddose-val'>" + escapeHtml(t.s) + "</span></div></div>";
  }

  function chev(o) {
    return "<svg class='chevron" + (o ? ' open' : '') + "' width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><polyline points='6 9 12 15 18 9'/></svg>";
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
    var rows = isINH ? A.inh : A.ctmx;
    var cols = isINH
      ? ['Poids', 'Dose']
      : ['Tranche (Poids/\u00c2ge)', 'Sirop (200/40)', 'Cp Simple (400/80)', 'Cp Fort (800/160)'];
    var title = isINH ? 'Doses INH pr\u00e9ventif' : 'Doses Cotrimoxazole (CTX)';
    var hi = -1;
    if (isINH && !isNaN(w)) {
      hi = A.inhIdx(w);
    } else if (!isINH && !isNaN(w)) {
      if (w < 5) hi = 0;
      else if (w < 15) hi = 1;
      else if (w < 30) hi = 2;
      else hi = 3;
    }
    var color = isINH ? '#5a4000' : '#0a5e3e';
    var escapeHtml = A.escapeHtml;
    var h = "<div style='font-size:.68rem;font-weight:700;color:" + color + ";text-transform:uppercase;letter-spacing:.05em;margin:.8rem 0 .35rem'>" + escapeHtml(title) + "</div>";
    h += "<div class='twrap' style='overflow-x:auto'><table><thead><tr>";
    cols.forEach(function (c) { h += '<th>' + escapeHtml(c) + '</th>'; });
    h += '</tr></thead><tbody>';
    rows.forEach(function (r, i) {
      var isHl = hi !== -1 && i === hi;
      if (isINH) {
        h += "<tr class='" + (isHl ? 'hl' : '') + "'><td>" + escapeHtml(r.p) + "</td><td style='font-family:DM Mono,monospace;font-weight:500'>" + escapeHtml(r.d) + '</td></tr>';
      } else {
        h += "<tr class='" + (isHl ? 'hl' : '') + "'><td>" + escapeHtml(r.label) + "</td><td style='font-family:DM Mono,monospace;font-weight:500'>" + escapeHtml(r.susp) + "</td><td style='font-family:DM Mono,monospace;font-weight:500'>" + escapeHtml(r.simple) + "</td><td style='font-family:DM Mono,monospace;font-weight:500'>" + escapeHtml(r.fort) + '</td></tr>';
      }
    });
    h += '</tbody></table></div>';
    return h;
  }

  function renderProphylaxies(w) {
    var rh = '';
    rh += "<div class='card' style='border-left:4px solid #0e7a4e; background:rgba(232, 245, 233, 0.85)'><div class='slabel' style='color:#0e7a4e; font-size:.9rem'>\uD83E\uDE79 TRAITEMENTS PR\u00c9VENTIFS (Prophylaxies)</div>";
    rh += "<div style='margin-bottom:1.5rem'><div style='display:flex; align-items:center; gap:8px; margin-bottom:8px'><span style='background:#0e7a4e; color:white; padding:4px 8px; border-radius:6px; font-weight:800; font-size:0.75rem'>INH</span><b style='color:#1a1a1a; font-size:0.85rem'>ISONIAZIDE (100 mg)</b></div><div style='font-size:.78rem; color:#2c2c2a; margin-left:5px; line-height:1.4'>Pr\u00e9vient la Tuberculose. \u00c0 donner pendant 6 mois (10mg/kg/j, max 300mg) apr\u00e8s exclusion TB active.</div>" + genTable('INH', w) + '</div>';
    rh += "<hr style='border:0; border-top:1px dashed #0e7a4e; margin:1.5rem 0; opacity:0.2'>";
    rh += "<div><div style='display:flex; align-items:center; gap:8px; margin-bottom:8px'><span style='background:#1a5ab8; color:white; padding:4px 8px; border-radius:6px; font-weight:800; font-size:0.75rem'>CTX</span><b style='color:#1a1a1a; font-size:0.85rem'>COTRIMOXAZOLE</b></div><div style='font-size:.78rem; color:#2c2c2a; margin-left:5px; line-height:1.4'>Pr\u00e9vient les infections opportunistes. Arr\u00eat si CV < 1000 copies sur 2 mesures cons\u00e9cutives.</div>" + genTable('CTX', w) + '</div></div>';
    return rh;
  }

  function renderSuivi(w) {
    var rh = '';
    rh += "<div class='card' style='border-left:4px solid #1a4a96'><div class='slabel' style='color:#1a4a96;font-size:.9rem'>\uD83D\uDCC5 SUIVI CLINIQUE</div><div style='font-size:.75rem;font-weight:700;margin-top:.6rem;color:#1a4a96;text-transform:uppercase'>P\u00e9riodicit\u00e9 :</div><ul class='rlist'><li class='ritem'><span class='rdot'></span>Mensuelle (voire toutes les deux semaines) \u00e0 l'initiation du traitement ou enfant instable.</li><li class='ritem'><span class='rdot'></span>Tous les 3 mois : enfant stable (sous TAR depuis au moins 6 mois).</li></ul><div style='font-size:.75rem;font-weight:700;margin-top:.6rem;color:#1a4a96;text-transform:uppercase'>\u00c9l\u00e9ments du suivi :</div><ul class='rlist'><li class='ritem'><span class='rdot'></span>Surveillance de la croissance par la mesure du poids et de la taille</li><li class='ritem'><span class='rdot'></span>Rechercher une toux persistante, un amaigrissement et une fi\u00e8vre</li><li class='ritem'><span class='rdot'></span>Rechercher des signes de gravit\u00e9 (PCIME)</li></ul><div style='font-size:.75rem;font-weight:700;margin-top:.6rem;color:#1a4a96;text-transform:uppercase'>\u00c9valuation de l'Observance :</div><ul class='rlist'><li class='ritem'><span class='rdot'></span>S'assurer de la prise r\u00e9guli\u00e8re des m\u00e9dicaments</li><li class='ritem'><span class='rdot'></span>R\u00e9adapter la posologie des ARV en fonction du poids de l'enfant</li></ul></div>";
    rh += "<div class='card' style='border-left:4px solid #0d2f7a'><div class='slabel' style='color:#0d2f7a;font-size:.9rem'>\uD83D\uDD2C SUIVI BIOLOGIQUE</div><div style='font-size:.78rem;margin: .6rem 0'>P\u00e9riodicit\u00e9 : tous les six mois</div><div style='font-size:.75rem;font-weight:700;color:#0d2f7a;text-transform:uppercase;margin-top:.6rem'>El\u00e9ments de suivi</div><ul class='rlist'><li class='ritem'><span class='rdot'></span>Charge virale doit \u00eatre inf\u00e9rieure \u00e0 1000 copies</li><li class='ritem'><span class='rdot'></span>Num\u00e9ration formule sanguine</li><li class='ritem'><span class='rdot'></span>Cr\u00e9atinin\u00e9mie</li><li class='ritem'><span class='rdot'></span>Transaminases h\u00e9patiques</li></ul></div>";
    rh += "<div class='card' style='border-left:4px solid #b91c1c;background:#fff0f0'><div class='slabel' style='color:#b91c1c;font-size:.9rem'>CRIT\u00c8RES DEVANT CONDUIRE A UNE R\u00c9F\u00c9RENCE</div><div style='font-size:.75rem;font-weight:700;margin-top:.6rem;color:#b91c1c;text-transform:uppercase'>Crit\u00e8res cliniques</div><ul class='rlist'><li class='ritem' style='color:#7f1d1d'><span class='rdot' style='background:#ef4444'></span>Perte poids lors de deux visites cons\u00e9cutives </li><li class='ritem' style='color:#7f1d1d'><span class='rdot' style='background:#ef4444'></span>Signes de gravit\u00e9 PCIME</li><li class='ritem' style='color:#7f1d1d'><span class='rdot' style='background:#ef4444'></span>Enfant infect\u00e9 malgr\u00e9 la PTME</li></ul><div style='font-size:.75rem;font-weight:700;margin-top:.4rem;color:#b91c1c;text-transform:uppercase'>Crit\u00e8res biologiques :</div><ul class='rlist'><li class='ritem' style='color:#7f1d1d'><span class='rdot' style='background:#ef4444'></span>\u00c9chec virologique : une charge virale sup\u00e9rieure \u00e0 1000 copies apr\u00e8s deux mesures cons\u00e9cutives malgr\u00e9 un traitement bien conduit</li><li class='ritem' style='color:#7f1d1d'><span class='rdot' style='background:#ef4444'></span>Anomalie NFS, cr\u00e9atinin\u00e9mie et transaminases</li></ul></div>";
    document.getElementById('results-suivi').innerHTML = rh;
  }

  function renderMols(prefix, filterNames) {
    var escapeHtml = A.escapeHtml;
    var keys = filterNames
      ? Object.keys(A.efMol).filter(function (n) { return filterNames.indexOf(n) !== -1; })
      : Object.keys(A.efMol);
    if (keys.length === 0) return '';
    var rh = '';
    rh += "<div class='card' style='border-left:3px solid #a8c4e0; background:rgba(244,248,252,0.95); padding:0; overflow:hidden'>";
    rh += "<div style='padding:.9rem 1rem .5rem'><div style='font-size:.82rem; font-weight:600; color:#5a7fa5; margin-bottom:.3rem'>Effets secondaires & interactions</div>";
    rh += "<div style='font-size:.7rem; color:#7a8fa5; margin-bottom:.1rem'>Mol\u00e9cules actives sur cette tranche de poids</div></div>";
    keys.forEach(function (molName) {
      var data = A.efMol[molName];
      var isOpen = A.openMols[prefix + molName] || false;
      rh += "<div style='margin:0 .6rem .5rem; border-radius:10px; background:rgba(255,255,255,0.8); border:1px solid #dce6f0; overflow:hidden'>";
      rh += "<button type='button' onclick='toggleMol(\"" + prefix + escapeHtml(molName).replace(/"/g, '&quot;') + "\")' style='width:100%; background:transparent; border:none; padding:.7rem .9rem; display:flex; justify-content:space-between; align-items:center; cursor:pointer'><span style='font-size:.78rem; font-weight:500; color:#5a7fa5; text-align:left'>" + escapeHtml(molName) + '</span>' + chev(isOpen) + '</button>';
      if (isOpen) {
        rh += "<div style='padding:0 .9rem .7rem; animation: fadeIn 0.25s ease'>";
        if (data.freq && data.freq.length > 0) {
          rh += "<div style='font-size:.65rem; font-weight:600; color:#6a8ab5; margin-bottom:.25rem; text-transform:uppercase'>Fr\u00e9quents :</div><ul class='rlist' style='margin-bottom:.5rem'>";
          data.freq.forEach(function (f) { rh += "<li class='ritem'><span class='rdot' style='background:#94b8e0'></span>" + escapeHtml(f) + '</li>'; });
          rh += '</ul>';
        }
        if (data.grave && data.grave.length > 0) {
          rh += "<div style='font-size:.65rem; font-weight:600; color:#b45a5a; margin-bottom:.25rem; text-transform:uppercase'>Graves / Alerte :</div><ul class='rlist' style='margin-bottom:.5rem'>";
          data.grave.forEach(function (g) { rh += "<li class='ritem'><span class='rdot' style='background:#d98a8a'></span><span style='color:#7a3a3a'>" + escapeHtml(g) + '</span></li>'; });
          rh += '</ul>';
        }
        if (data.interact && data.interact.length > 0) {
          rh += "<div style='font-size:.65rem; font-weight:600; color:#b87a3a; margin-bottom:.25rem; text-transform:uppercase'>Interactions :</div><div style='background:rgba(253,243,226,0.8); border:1px solid #f0d9b5; border-radius:8px; padding:.5rem; margin-bottom:.5rem'><ul class='rlist'>";
          data.interact.forEach(function (i) { rh += "<li class='ritem' style='color:#9a6a2a'><span class='rdot' style='background:#d4a862'></span>" + escapeHtml(i) + '</li>'; });
          rh += '</ul></div>';
        }
        if (data.surv && data.surv.length > 0) {
          rh += "<div style='font-size:.65rem; font-weight:600; color:#5a8a6a; margin-bottom:.25rem; text-transform:uppercase'>Surveillance :</div><ul class='rlist'>";
          data.surv.forEach(function (s) { rh += "<li class='ritem'><span class='rdot' style='background:#8ab89a'></span>" + escapeHtml(s) + '</li>'; });
          rh += '</ul>';
        }
        rh += '</div>';
      }
      rh += '</div>';
    });
    rh += '</div>';
    return rh;
  }

  function renderRes() {
    var escapeHtml = A.escapeHtml;
    var rh = '';
    rh += "<div class='card' style='padding:0; overflow:hidden; margin-bottom:.7rem; border-left:4px solid #5a7a00'><div style='padding:1rem; padding-bottom:.5rem'><div class='slabel' style='color:#5a7a00; font-size:.9rem'>Infections Opportunistes & Traitement</div></div>";
    rh += "<div style='padding:0 .5rem .6rem'>";
    A.ioList.forEach(function (io, idx) {
      var safeId = escapeHtml(io.nom).replace(/[^a-zA-Z0-9]/g, '_');
      rh += "<div class='tbtn' onclick=\"toggleIO('" + escapeHtml(io.nom).replace(/'/g, "\\'") + "')\" id='io-" + safeId + "' style='border-left:4px solid " + io.couleur + "'><span>" + escapeHtml(io.nom) + "</span><svg class='chevron' width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><polyline points='6 9 12 15 18 9'/></svg></div>";
      rh += "<div id='io-content-" + safeId + "' class='io-panel'><div style='padding:1rem; border-left:4px solid " + io.border + "; background:" + io.bg + "; border-radius:0 0 14px 14px'><div style='font-size:.78rem;color:#1a1a1a;margin-bottom:.5rem;line-height:1.4'>" + escapeHtml(io.desc) + '</div>';
      io.details.forEach(function (d) {
        rh += "<div style='font-size:.72rem;color:#2c2c2a;padding:.15rem 0;line-height:1.4'>\u2022 " + escapeHtml(d) + '</div>';
      });
      if (io.tableau) {
        var tbl = io.tableau;
        var tblRows = A[tbl.rowsKey];
        if (tblRows) {
          rh += "<div style='margin-top:.6rem'><div style='font-size:.65rem;font-weight:700;color:" + io.couleur + ";text-transform:uppercase;margin-bottom:.3rem'>" + escapeHtml(tbl.label) + '</div><table style="width:100%;font-size:.72rem;border-collapse:collapse"><thead><tr>';
          tbl.cols.forEach(function (c) { rh += '<th style="padding:.3rem .5rem;border-bottom:1px solid rgba(0,0,0,.1);text-align:left;font-size:.65rem;text-transform:uppercase">' + escapeHtml(c) + '</th>'; });
          rh += '</tr></thead><tbody>';
          tblRows.forEach(function (row) {
            if (tbl.rowsKey === 'CTMX') {
              rh += '<tr><td style="padding:.3rem .5rem;border-bottom:1px solid rgba(0,0,0,.05)">' + escapeHtml(row.label) + '</td><td style="padding:.3rem .5rem;border-bottom:1px solid rgba(0,0,0,.05);font-family:monospace">' + escapeHtml(row.susp) + '</td><td style="padding:.3rem .5rem;border-bottom:1px solid rgba(0,0,0,.05);font-family:monospace">' + escapeHtml(row.simple) + '</td><td style="padding:.3rem .5rem;border-bottom:1px solid rgba(0,0,0,.05);font-family:monospace">' + escapeHtml(row.fort) + '</td></tr>';
            } else {
              rh += '<tr><td style="padding:.3rem .5rem;border-bottom:1px solid rgba(0,0,0,.05)">' + escapeHtml(row.p) + '</td><td style="padding:.3rem .5rem;border-bottom:1px solid rgba(0,0,0,.05);font-family:monospace">' + escapeHtml(row.d) + '</td></tr>';
            }
          });
          rh += '</tbody></table></div>';
        }
      }
      rh += '</div></div>';
    });
    rh += '</div></div>';

    document.getElementById('results-res').innerHTML = rh;
  }

  function render() {
    var raw = document.getElementById('poids').value;
    var w = parseFloat(raw);
    var err = document.getElementById('error');
    var res = document.getElementById('results');
    var escapeHtml = A.escapeHtml;
    document.getElementById('rbar').innerHTML = A.tranches.map(function (t) {
      return "<div class='rseg" + (!isNaN(w) && w >= t.min && w <= t.max ? ' active' : '') + "'></div>";
    }).join('');
    if (!raw || isNaN(w)) {
      err.style.display = isNaN(w) && raw ? 'flex' : 'none';
      res.style.display = 'none';
      renderSuivi(NaN);
      renderRes();
      return;
    }
    var idx = A.tIdx(w);
    if (idx === -1) {
      err.style.display = 'flex';
      document.getElementById('errtxt').textContent = 'Hors intervalle (3-200 kg).';
      res.style.display = 'none';
      renderSuivi(NaN);
      renderRes();
      return;
    }
    err.style.display = 'none';
    res.style.display = 'block';
    var T = A.tranches[idx];
    var G = grpBySchema(idx);
    var molNames = [];
    ['a', 'b', 'c', 'd'].forEach(function (s) {
      G[s].forEach(function (it) {
        if (molNames.indexOf(it.arv.nom) === -1) molNames.push(it.arv.nom);
      });
    });
    var O = [];
    ['a', 'b', 'c', 'd'].forEach(function (s) {
      var info = A.si[s];
      var items = G[s];
      if (!items || items.length === 0) return;
      var h = "<div class='card' style='border-top:5px solid " + info.border + ';background:' + info.bg + "'>";
      h += "<div class='slabel' style='color:" + info.color + "'>" + badge(s) + ' ' + escapeHtml(info.label) + ' \u2014 ' + escapeHtml(T.label) + '</div>';
      var badgeList = [];
      items.forEach(function (it) {
        var molName = it.arv.nom;
        var molImg = it.arv.img;
        var bottleImg = molImg ? "<img class='dchip-mini-bottle' src='" + escapeHtml(molImg) + "' style='z-index:10' alt=''>" : '';
        h += "<div class='dchip' style='border-color:" + info.border + "'><div class='dchip-content'><div class='dname' style='color:" + info.color + "'>" + escapeHtml(molName) + "</div><div class='ddose'>" + doseChip(it.t, molName) + "</div></div>" + bottleImg + '</div>';
        badgeList.push("<span class='dchip-badge'><span style='color:" + info.color + ";font-weight:700'>" + escapeHtml(molName) + '</span> ' + "<span class='disp-tag' style='background:" + (it.arv.isDispersible ? info.color : '#607d8b') + "'>" + (it.arv.isDispersible ? 'Dispersible' : 'Non dispersible') + '</span></span>');
      });
      h += "<div class='dchip-badges'>" + badgeList.join('') + '</div>';
      h += '</div>';
      O.push(h);
    });
    O.push(renderProphylaxies(w));
    O.push(renderMols('pos_', molNames));
    res.innerHTML = O.join('');
    renderSuivi(w);
    renderRes();
  }

  window.toggleIO = function (nom) {
    var safeId = nom.replace(/[^a-zA-Z0-9]/g, '_');
    var el = document.getElementById('io-content-' + safeId);
    var btn = document.getElementById('io-' + safeId);
    if (!el) return;
    var isOpen = el.classList.contains('open');
    document.querySelectorAll('.io-panel.open').forEach(function (p) {
      p.classList.remove('open');
      var pid = p.id.replace('io-content-', '');
      var b = document.getElementById('io-' + pid);
      if (b) { b.classList.remove('active'); var c = b.querySelector('.chevron'); if (c) c.classList.remove('open'); }
    });
    document.querySelectorAll('.tbtn.active').forEach(function (b) {
      b.classList.remove('active');
      var c = b.querySelector('.chevron'); if (c) c.classList.remove('open');
    });
    if (!isOpen) {
      el.classList.add('open');
      if (btn) {
        btn.classList.add('active');
        var ch = btn.querySelector('.chevron');
        if (ch) ch.classList.add('open');
      }
    }
  };

  A.render = render;
  A.renderSuivi = renderSuivi;
  A.renderRes = renderRes;
})();
