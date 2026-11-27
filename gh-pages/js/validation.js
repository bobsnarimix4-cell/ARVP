/* Validation — escapeHtml */
(function () {
  function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }

  window.escapeHtml = escapeHtml;
  window.__ARVP.escapeHtml = escapeHtml;
})();
