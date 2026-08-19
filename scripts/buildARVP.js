#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ENC_FILE = path.join(ROOT, 'app', 'src', 'main', 'assets', 'www', 'index.html.enc');
const HASH_FILE = path.join(ROOT, 'scripts', '.last-build-hash');
const UPDATE_JSON = path.join(ROOT, 'gh-pages', 'update.json');
const VERSION_FILE = path.join(ROOT, 'www', 'js', 'data.js');

function extractVersion() {
  const content = fs.readFileSync(VERSION_FILE, 'utf8');
  const match = content.match(/version:\s*["']([^"']+)["']/);
  return match ? match[1] : '0.0.0';
}

function computeHash(filePath) {
  const data = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(data).digest('hex');
}

function main() {
  console.log('=== ARV.P Update Builder ===');

  if (!fs.existsSync(ENC_FILE)) {
    console.error('Error: index.html.enc not found. Run encrypt.js first.');
    process.exit(1);
  }

  const version = extractVersion();
  const sha256 = computeHash(ENC_FILE);
  const previousHash = fs.existsSync(HASH_FILE) ? fs.readFileSync(HASH_FILE, 'utf8').trim() : '';

  const updateData = {
    version: version,
    versionCode: Date.now(),
    sha256: sha256,
    url: 'https://bobsnarimix4-cell.github.io/ARVP/gh-pages/index.html.enc',
    minAppVersion: '1.0',
    releaseDate: new Date().toISOString(),
    releaseNotes: 'Mise \u00e0 jour automatique des donn\u00e9es cliniques et du contenu.'
  };

  fs.mkdirSync(path.dirname(UPDATE_JSON), { recursive: true });
  fs.writeFileSync(UPDATE_JSON, JSON.stringify(updateData, null, 2), 'utf8');

  fs.writeFileSync(HASH_FILE, sha256, 'utf8');

  console.log('Version:', version);
  console.log('SHA-256:', sha256);
  console.log('Written:', path.relative(ROOT, UPDATE_JSON));

  if (previousHash && previousHash !== sha256) {
    console.log('\nHash changed from previous build.');
  } else if (!previousHash) {
    console.log('\nFirst build - no previous hash to compare.');
  } else {
    console.log('\nHash unchanged from previous build.');
  }

  console.log('\nDone. Commit gh-pages/ folder and push to deploy.');
}

main();
