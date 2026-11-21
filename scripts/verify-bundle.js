#!/usr/bin/env node

/*
 * Vérifie le bundle chiffré réellement chargé par l'application
 * (app/src/main/assets/www/index.html.enc).
 *
 * Objectif : détecter les régressions du pipeline avant publication :
 *  - références CSS/JS externes non inlinées (404 dans la WebView) ;
 *  - contenu clinique manquant (TPT, MVA) ;
 *  - désynchronisation de version avec www/js/data.js ;
 *  - image géante encore embarquée en base64.
 *
 * Usage : node scripts/verify-bundle.js
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ENC_FILE = path.join(ROOT, 'app', 'src', 'main', 'assets', 'www', 'index.html.enc');
const GH_ENC_FILE = path.join(ROOT, 'gh-pages', 'index.html.enc');
const DATA_FILE = path.join(ROOT, 'www', 'js', 'data.js');

const NAMESPACE = 'com.example.arvp';
const SALT = 'ARVP_SALT_2024_v1';

let failed = false;

function check(ok, label, detail) {
  console.log((ok ? '  OK   ' : '  FAIL ') + label + (detail ? ' — ' + detail : ''));
  if (!ok) failed = true;
}

function decrypt(file) {
  const key = crypto.createHash('sha256').update(NAMESPACE + SALT).digest();
  const payload = JSON.parse(fs.readFileSync(file, 'utf8'));
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(payload.iv, 'base64'));
  return Buffer.concat([
    decipher.update(Buffer.from(payload.data, 'base64')),
    decipher.final()
  ]).toString('utf8');
}

function main() {
  console.log('=== Vérification du bundle ARV.P ===');

  if (!fs.existsSync(ENC_FILE)) {
    console.error('Bundle introuvable : ' + path.relative(ROOT, ENC_FILE));
    process.exit(1);
  }

  const html = decrypt(ENC_FILE);
  const dataSource = fs.readFileSync(DATA_FILE, 'utf8');
  const versionMatch = dataSource.match(/version:\s*["']([^"']+)["']/);
  const version = versionMatch ? versionMatch[1] : null;

  console.log('\nContenu déchiffré : ' + html.length + ' caractères');

  check(!/<script[^>]+src=["'](?:\.\/)?js\//i.test(html), 'aucune balise <script src="js/…">');
  check(!/<link[^>]+href=["'](?:\.\/)?css\//i.test(html), 'aucune balise <link href="css/…">');
  check((html.match(/<body/g) || []).length === 1, 'un seul <body>');
  check((html.match(/<html/g) || []).length === 1, 'un seul <html>');
  check(html.includes('MVA — Définition'), 'contenu MVA présent');
  check(html.includes('INH_3RH') && html.includes('INH_3HP'), 'données TPT 3RH/3HP présentes');
  check(html.includes('data:image/webp;base64,'), 'affiche embarquée en base64 WebP');
  check(!html.includes('io-btn') && !html.includes('io-table'), 'section IO_LIST absente du bundle');
  check(!html.includes('mol-btn') && !html.includes('EF_MOL'), 'section Effets secondaires & interactions absente');
  check(!html.includes('results-res'), 'conteneur IO retiré du HTML');
  check(html.includes('mva-fs-close') && html.includes('Plein écran'), 'organigramme MVA : ouverture plein écran en un clic');
  check(html.includes('fc-toolbar') && html.includes('applyZoom'), 'organigramme nourrisson : contrôles de zoom présents');
  check(html.includes('mva-fc-title') && html.includes('inf-fc-title'), 'organigrammes : titres accessibles présents');
  check(html.includes('viewBox="0 0 680 750"') && html.includes('viewBox="0 0 680 640"'), 'organigrammes : viewBox conservés');
  check(!/\bon(?:click|error|load)\s*=\s*["']/i.test(html), 'aucun handler inline (onclick/onerror)');
  check(!html.includes('gist.githubusercontent.com'), 'aucun canal de données non signé (Gist)');
  check(!/localStorage\.(?:get|set)Item\(\s*['"]PEC_DATA_UPDATED/.test(html), 'aucune surcharge localStorage des données');

  if (version) {
    check(html.includes('version: "' + version + '"') || html.includes("version: '" + version + "'"),
      'version du bundle = ' + version);
  } else {
    check(false, 'version introuvable dans www/js/data.js');
  }

  if (fs.existsSync(GH_ENC_FILE)) {
    const assetHash = crypto.createHash('sha256').update(fs.readFileSync(ENC_FILE)).digest('hex');
    const ghHash = crypto.createHash('sha256').update(fs.readFileSync(GH_ENC_FILE)).digest('hex');
    check(assetHash === ghHash, 'gh-pages/index.html.enc identique au bundle embarqué');
  } else {
    check(false, 'gh-pages/index.html.enc présent');
  }

  console.log(failed ? '\nBundle NON conforme.' : '\nBundle conforme.');
  process.exit(failed ? 1 : 0);
}

main();
