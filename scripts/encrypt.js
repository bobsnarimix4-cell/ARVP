#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const NAMESPACE = 'com.example.arvp';
const SALT = 'ARVP_SALT_2024_v1';
const ALGO = 'aes-256-cbc';
const KEY_LEN = 32;
const IV_LEN = 16;

const ROOT = path.resolve(__dirname, '..');
const WWW = path.join(ROOT, 'www');
const ASSETS_WWW = path.join(ROOT, 'app', 'src', 'main', 'assets', 'www');

function deriveKey() {
  return crypto.createHash('sha256')
    .update(NAMESPACE + SALT)
    .digest();
}

function encrypt(plaintext) {
  const key = deriveKey();
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  let encrypted = cipher.update(plaintext, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return {
    iv: iv.toString('base64'),
    data: encrypted.toString('base64')
  };
}

function buildHTML() {
  const cssFile = path.join(WWW, 'css', 'styles.css');
  // Dans www/css/styles.css, les images sont référencées en ../icons/ (valide pour
  // la source et la PWA). Une fois le CSS inliné dans le HTML à la racine, il faut
  // revenir à icons/ pour que les chemins restent corrects dans le bundle.
  const cssSource = fs.readFileSync(cssFile, 'utf8')
    .replace(/url\((['"]?)\.\.\/icons\//g, 'url($1icons/');
  const css = '<style>\n' + cssSource + '\n</style>';

  const jsFiles = [
    'js/data.js',
    'js/validation.js',
    'js/classification.js',
    'js/render.js',
    'js/ui.js',
    'js/mva-pediatric-flowchart.js',
    'js/infant-followup-flowchart.js'
  ];

  let scripts = '';
  for (const f of jsFiles) {
    const p = path.join(WWW, f);
    if (fs.existsSync(p)) {
      scripts += '<script>\n' + fs.readFileSync(p, 'utf8') + '\n</script>\n';
    } else {
      console.error('[WARN] Missing JS file:', f);
    }
  }

  // La source charge le CSS et le JS en fichiers séparés : ils sont inlinés ci-dessous.
  // On retire donc ces références, sinon le HTML assemblé contient des 404
  // (ou une double exécution des scripts si les dossiers sont copiés dans les assets).
  const indexHtml = fs.readFileSync(path.join(WWW, 'index.html'), 'utf8')
    .replace(/<link[^>]+href=["']css\/styles\.css["'][^>]*>\s*/gi, '')
    .replace(/<script[^>]+src=["']js\/[^"']+["'][^>]*>\s*<\/script>\s*/gi, '');

  const headClose = indexHtml.indexOf('</head>');
  const bodyOpen = indexHtml.indexOf('<body>');
  const bodyClose = indexHtml.indexOf('</body>');

  let html;
  if (headClose !== -1 && bodyOpen !== -1 && bodyClose !== -1) {
    const headContent = indexHtml.substring(0, headClose);
    const bodyContent = indexHtml.substring(bodyOpen + '<body>'.length, bodyClose);
    html = headContent + '\n' + css + '\n</head>\n<body>' + bodyContent + '\n' + scripts + '</body>\n</html>';
  } else {
    html = css + indexHtml.substring(bodyOpen, bodyClose) +
      scripts + '</body></html>';
  }

  // Garde-fou : aucune référence locale externe ne doit subsister dans le bundle.
  if (/<script[^>]+src=["'](?:\.\/)?js\//i.test(html) || /<link[^>]+href=["'](?:\.\/)?css\//i.test(html)) {
    throw new Error('Référence CSS/JS locale restante dans le HTML assemblé (inlining incomplet).');
  }

  return html;
}

function copyAssetsToWWW() {
  const filesToCopy = [
    'manifest.json',
    'sw.js'
  ];
  for (const f of filesToCopy) {
    const src = path.join(WWW, f);
    const dst = path.join(ASSETS_WWW, f);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dst);
      console.log('  Copied:', f);
    }
  }

  const iconsDir = path.join(WWW, 'icons');
  const dstIconsDir = path.join(ASSETS_WWW, 'icons');
  if (fs.existsSync(iconsDir)) {
    fs.mkdirSync(dstIconsDir, { recursive: true });
    for (const f of fs.readdirSync(iconsDir)) {
      fs.copyFileSync(path.join(iconsDir, f), path.join(dstIconsDir, f));
    }
    console.log('  Copied icons/');
  }

  const ghPagesDir = path.join(ROOT, 'gh-pages');
  const ghEncFile = path.join(ghPagesDir, 'index.html.enc');
  const srcEncFile = path.join(ASSETS_WWW, 'index.html.enc');
  fs.mkdirSync(ghPagesDir, { recursive: true });
  fs.copyFileSync(srcEncFile, ghEncFile);
  console.log('  Copied index.html.enc to gh-pages/ for OTA');

  // Copie de l'application PWA web complète dans gh-pages/ pour accès iPhone (iOS/Safari)
  const pwaFiles = ['index.html', 'manifest.json', 'sw.js'];
  for (const f of pwaFiles) {
    const src = path.join(WWW, f);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(ghPagesDir, f));
    }
  }
  const pwaDirs = ['css', 'js', 'icons'];
  for (const d of pwaDirs) {
    const srcDir = path.join(WWW, d);
    const dstDir = path.join(ghPagesDir, d);
    if (fs.existsSync(srcDir)) {
      fs.mkdirSync(dstDir, { recursive: true });
      for (const f of fs.readdirSync(srcDir)) {
        fs.copyFileSync(path.join(srcDir, f), path.join(dstDir, f));
      }
    }
  }
  console.log('  Copied PWA web app to gh-pages/ for iOS/Safari support');
}

function main() {
  console.log('=== ARV.P Encryption Build ===');

  console.log('1. Building concatenated HTML...');
  const html = buildHTML();
  const htmlSize = Buffer.byteLength(html, 'utf8');
  console.log('   HTML size:', (htmlSize / 1024).toFixed(1), 'KB');

  console.log('2. Encrypting (AES-256-CBC)...');
  const { iv, data } = encrypt(html);
  const encJson = JSON.stringify({ iv, data });
  const encSize = Buffer.byteLength(encJson, 'utf8');
  console.log('   Encrypted size:', (encSize / 1024).toFixed(1), 'KB');

  console.log('3. Writing index.html.enc to assets...');
  const encPath = path.join(ASSETS_WWW, 'index.html.enc');
  fs.mkdirSync(path.dirname(encPath), { recursive: true });
  fs.writeFileSync(encPath, encJson, 'utf8');
  console.log('   Written:', path.relative(ROOT, encPath));

  // Le bundle chiffré est la seule source utilisée par l'application (CryptoManager).
  // Un index.html en clair dans les assets exposerait le contenu et serait obsolète.
  const plaintextPath = path.join(ASSETS_WWW, 'index.html');
  if (fs.existsSync(plaintextPath)) {
    fs.unlinkSync(plaintextPath);
    console.log('   Removed stale plaintext index.html');
  }

  console.log('4. Copying assets to www/...');
  copyAssetsToWWW();

  console.log('5. Computing SHA-256 hash...');
  const hash = crypto.createHash('sha256').update(encJson).digest('hex');
  console.log('   SHA-256:', hash);

  console.log('\nBuild complete. Encrypted content ready for Android.');
  console.log('Run "node scripts/buildARVP.js" to generate update.json.');
}

main();
