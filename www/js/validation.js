/* Validation — escapeHtml, compareVersions, isValidData */
(function () {
  function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }

  function compareVersions(v1, v2) {
    var a = String(v1).split('.').map(function (s) { return parseInt(s, 10) || 0; });
    var b = String(v2).split('.').map(function (s) { return parseInt(s, 10) || 0; });
    for (var i = 0; i < Math.max(a.length, b.length); i++) {
      if ((a[i] || 0) > (b[i] || 0)) return 1;
      if ((b[i] || 0) > (a[i] || 0)) return -1;
    }
    return 0;
  }

  function isValidData(d) {
    if (!d || typeof d !== 'object') return false;
    var keys = ['TR', 'ARV', 'SCH', 'SI', 'EF_MOL', 'ARV_MOL', 'PC', 'CTMX', 'INH', 'IO_LIST'];
    for (var i = 0; i < keys.length; i++) {
      if (!d[keys[i]] || typeof d[keys[i]] !== 'object') return false;
    }
    return true;
  }

  window.escapeHtml = escapeHtml;
  window.__ARVP.escapeHtml = escapeHtml;
  window.__ARVP.compareVersions = compareVersions;
  window.__ARVP.isValidData = isValidData;
})();
