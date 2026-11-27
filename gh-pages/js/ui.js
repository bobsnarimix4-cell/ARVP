(function () {
  var A = window.__ARVP;
  var D = A.data;

  A.si = D.SI;
  A.arv = D.ARV;
  A.tranches = D.TR;
  A.pc = D.PC;
  A.ctmx = D.CTMX;
  A.inh3rh = D.INH_3RH;
  A.inh3hp = D.INH_3HP;

  var currentPage = 'calc';

  // Les données cliniques proviennent exclusivement du bundle signé/vérifié
  // livré avec l'application (ou de la mise à jour OTA native). Aucun canal
  // distant non signé n'est utilisé : pas de Gist, pas de localStorage.

  function clearLegacyRemoteData() {
    try { localStorage.removeItem('PEC_DATA_UPDATED'); } catch (e) {}
  }
  clearLegacyRemoteData();

  window.switchPage = function (p) {
    currentPage = p;
    var subtitles = {
      calc: 'Posologies ARV selon le poids',
      suivi: 'Suivi clinique et biologique',
      res: 'Ressources'
    };
    document.getElementById('pageSubtitle').textContent = subtitles[p] || '';
    document.querySelectorAll('.page-content').forEach(function (x) { x.classList.remove('active'); });
    document.querySelectorAll('.nav-btn').forEach(function (x) { x.classList.remove('active'); });
    document.getElementById('page-' + p).classList.add('active');
    document.querySelector('.nav-btn[data-page="' + p + '"]').classList.add('active');
    if (p === 'suivi') A.renderSuivi(A.parseWeight(document.getElementById('poids').value));
  };

  document.getElementById('poids').addEventListener('input', A.render);
  document.querySelectorAll('.nav-btn').forEach(function (b) {
    b.addEventListener('click', function () { window.switchPage(b.getAttribute('data-page')); });
  });
  document.querySelectorAll('.qbtn[data-kg]').forEach(function (b) {
    b.addEventListener('click', function () { A.setWeight(parseFloat(b.getAttribute('data-kg'))); });
  });

  document.querySelectorAll('.zoomable').forEach(function (img) {
    function open() { window.openSignesAppel(img.currentSrc || img.src); }
    img.addEventListener('click', open);
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });

  A.renderSuivi(NaN);

  function initFooterBehavior() {
    var footer = document.querySelector('.footer');
    var scrollContainer = document.getElementById('root');

    function checkBottom() {
      if (!footer) return;
      var isAtBottom = false;

      if (scrollContainer && scrollContainer.scrollHeight > 0) {
        var scrollTop = scrollContainer.scrollTop;
        var clientHeight = scrollContainer.clientHeight;
        var scrollHeight = scrollContainer.scrollHeight;
        isAtBottom = (scrollTop + clientHeight >= scrollHeight - 35);
      } else {
        var winScroll = window.pageYOffset || document.documentElement.scrollTop;
        var winHeight = window.innerHeight;
        var docHeight = document.documentElement.scrollHeight;
        isAtBottom = (winScroll + winHeight >= docHeight - 35);
      }

      if (isAtBottom) {
        footer.style.transform = 'translateY(0)';
        footer.style.opacity = '1';
        footer.style.pointerEvents = 'auto';
      } else {
        footer.style.transform = 'translateY(110%)';
        footer.style.opacity = '0';
        footer.style.pointerEvents = 'none';
      }
    }

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkBottom, { passive: true });
    }
    window.addEventListener('scroll', checkBottom, { passive: true });
    window.addEventListener('resize', checkBottom, { passive: true });

    document.querySelectorAll('.nav-btn').forEach(function (b) {
      b.addEventListener('click', function () { setTimeout(checkBottom, 120); });
    });
    var inputPoids = document.getElementById('poids');
    if (inputPoids) {
      inputPoids.addEventListener('input', function () { setTimeout(checkBottom, 120); });
    }

    checkBottom();
  }

  var isFileProtocol = location.protocol === 'file:';

  if (!isFileProtocol && 'serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      initFooterBehavior();
      navigator.serviceWorker.register('./sw.js').catch(function () {});
    });
  } else {
    initFooterBehavior();
  }

  var deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    if (isFileProtocol) return;
    e.preventDefault();
    deferredPrompt = e;
    var banner = document.getElementById('installBanner');
    if (banner && !localStorage.getItem('INSTALL_DISMISSED')) { banner.classList.add('show'); }
  });
  var installBtn = document.getElementById('installBtn');
  if (installBtn) {
    installBtn.addEventListener('click', function () {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function () {
          deferredPrompt = null;
          var b = document.getElementById('installBanner');
          if (b) b.classList.remove('show');
        });
      }
    });
  }
  var dismissBtn = document.getElementById('dismissBtn');
  if (dismissBtn) {
    dismissBtn.addEventListener('click', function () {
      localStorage.setItem('INSTALL_DISMISSED', '1');
      var b = document.getElementById('installBanner');
      if (b) b.classList.remove('show');
    });
  }
})();
