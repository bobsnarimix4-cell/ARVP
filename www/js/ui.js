(function () {
  var A = window.__ARVP;
  var D = A.data;
  var escapeHtml = A.escapeHtml;
  var compareVersions = A.compareVersions;
  var isValidData = A.isValidData;

  var savedData = localStorage.getItem('PEC_DATA_UPDATED');
  if (savedData) {
    try {
      var parsed = JSON.parse(savedData);
      if (isValidData(parsed) && compareVersions(parsed.version, D.version) > 0) {
        window.__ARVP.data = parsed;
        A.data = parsed;
      }
    } catch (e) {}
  }

  D = A.data;
  A.si = D.SI;
  A.arv = D.ARV;
  A.tranches = D.TR;
  A.sch = D.SCH;
  A.efMol = D.EF_MOL;
  A.arvMol = D.ARV_MOL;
  A.pc = D.PC;
  A.ctmx = D.CTMX;
  A.inh = D.INH;
  A.ioList = D.IO_LIST;

  var currentPage = 'calc';
  var openMols = {};
  A.openMols = openMols;

  var DATA_URL = 'https://gist.githubusercontent.com/bobsnarimix4-cell/76320890898a7a55cf3fd4e34445ac45/raw/data.json';

  function checkRemoteUpdates() {
    if (!navigator.onLine) return;
    fetch(DATA_URL + '?t=' + Date.now()).then(function (res) { return res.text(); }).then(function (text) {
      try {
        var newData = JSON.parse(text);
        if (isValidData(newData) && compareVersions(newData.version, D.version) > 0) {
          localStorage.setItem('PEC_DATA_UPDATED', JSON.stringify(newData));
          showUpdateToast();
        }
      } catch (e) {}
    }).catch(function () {});
  }

  function showUpdateToast() {
    var b = document.createElement('div');
    b.style.cssText = 'position:fixed;top:1rem;left:50%;transform:translateX(-50%);background:#0e7a4e;color:white;padding:.8rem 1.2rem;border-radius:12px;font-size:.85rem;font-weight:600;z-index:2000;display:flex;align-items:center;gap:.8rem;box-shadow:0 8px 24px rgba(0,0,0,0.2)';
    b.innerHTML = '<span>\u2705 Mise \u00e0 jour disponible</span><button id="reloadBtn" style="background:white;color:#0e7a4e;border:none;padding:.4rem .8rem;border-radius:8px;font-weight:700;cursor:pointer">Appliquer</button>';
    document.body.appendChild(b);
    document.getElementById('reloadBtn').onclick = function () { location.reload(); };
  }

  window.toggleMol = function (k) {
    openMols[k] = !openMols[k];
    if (currentPage === 'calc') A.render();
    else if (currentPage === 'res') A.renderRes();
  };

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
    if (p === 'suivi') A.renderSuivi(parseFloat(document.getElementById('poids').value));
    if (p === 'res') A.renderRes();
  };

  document.getElementById('poids').addEventListener('input', A.render);
  document.querySelectorAll('.nav-btn').forEach(function (b) {
    b.addEventListener('click', function () { window.switchPage(b.getAttribute('data-page')); });
  });
  document.querySelectorAll('.qbtn[data-kg]').forEach(function (b) {
    b.addEventListener('click', function () { A.setWeight(parseFloat(b.getAttribute('data-kg'))); });
  });

  A.renderRes();
  A.renderSuivi(NaN);

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      var lastScrollTop = 0;
      var footer = document.querySelector('.footer');
      if (footer) {
        window.addEventListener('scroll', function () {
          var st = window.pageYOffset || document.documentElement.scrollTop;
          if (st > lastScrollTop && st > 50) {
            footer.style.transform = 'translateY(110%)';
            footer.style.opacity = '0';
          } else {
            footer.style.transform = 'translateY(0)';
            footer.style.opacity = '1';
          }
          lastScrollTop = st <= 0 ? 0 : st;
        }, false);
      }
      navigator.serviceWorker.register('./sw.js');
    });
  }

  var deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', function (e) {
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

  setTimeout(checkRemoteUpdates, 3000);
})();
