/* Classification — tranches, doses, utilitaires */
(function () {
  function tIdx(w) {
    var TR = window.__ARVP.tranches;
    if (isNaN(w)) return -1;
    for (var i = 0; i < TR.length; i++) {
      var next = TR[i + 1];
      if (w >= TR[i].min && (next ? w < next.min : w <= TR[i].max)) return i;
    }
    return -1;
  }

  function inhIdx(w) {
    if (isNaN(w) || w < 4) return -1;
    if (w <= 7) return 0;
    if (w <= 11) return 1;
    if (w <= 15) return 2;
    if (w <= 24) return 3;
    if (w <= 37) return 4;
    if (w <= 49) return 5;
    return -1;
  }

  function parseWeight(raw) {
    if (typeof raw === 'number') return raw;
    var s = String(raw == null ? '' : raw).trim().replace(',', '.');
    return s === '' ? NaN : Number(s);
  }

  function setWeight(v) {
    document.getElementById('poids').value = v;
    window.__ARVP.render();
  }

  function dk(hex) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return '#' + [Math.max(0, r - 50), Math.max(0, g - 50), Math.max(0, b - 50)]
      .map(function (v) { return ('0' + v.toString(16)).slice(-2); }).join('');
  }

  function pDose(s) {
    s = s.trim();
    if (s === '1/2 cp') return { w: 0, h: true };
    var m = s.match(/^(\d+)\+1\/2 cp$/);
    if (m) return { w: parseInt(m[1], 10), h: true };
    var m2 = s.match(/^(\d+) cp$/);
    if (m2) return { w: parseInt(m2[1], 10), h: false };
    return null;
  }

  window.setWeight = setWeight;
  window.__ARVP.tIdx = tIdx;
  window.__ARVP.inhIdx = inhIdx;
  window.__ARVP.parseWeight = parseWeight;
  window.__ARVP.setWeight = setWeight;
  window.__ARVP.dk = dk;
  window.__ARVP.pDose = pDose;
})();
