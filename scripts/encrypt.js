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
  const css = '<style>\n' + fs.readFileSync(cssFile, 'utf8') + '\n</style>';

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

  const indexHtml = fs.readFileSync(path.join(WWW, 'index.html'), 'utf8');
  const headClose = indexHtml.indexOf('</head>');
  const bodyClose = indexHtml.indexOf('</body>');

  let html;
  if (headClose !== -1 && bodyClose !== -1) {
    const headContent = indexHtml.substring(0, headClose);
    const bodyContent = indexHtml.substring(headClose + 7, bodyClose);
    html = headContent + '\n' + css + '\n</head>\n<body>' + bodyContent + '\n' + scripts + '</body>\n</html>';
  } else {
    html = '<style>' + fs.readFileSync(path.join(WWW, 'css', 'styles.css'), 'utf8') + '</style>' +
      indexHtml.substring(indexHtml.indexOf('<body>'), indexHtml.indexOf('</body>') + 7) +
      scripts + '</body></html>';
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

  console.log('4. Copying assets to www/...');
  copyAssetsToWWW();

  console.log('5. Computing SHA-256 hash...');
  const hash = crypto.createHash('sha256').update(encJson).digest('hex');
  console.log('   SHA-256:', hash);

  const hashPath = path.join(ROOT, 'scripts', '.last-build-hash');
  fs.writeFileSync(hashPath, hash, 'utf8');

  console.log('\nBuild complete. Encrypted content ready for Android.');
  console.log('Run "node scripts/buildARVP.js" to generate update.json.');
}

main();
