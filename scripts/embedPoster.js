const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const webpPath = path.join(ROOT, 'www', 'icons', 'signes_appel_vih_pediatrique.webp');
const indexPath = path.join(ROOT, 'www', 'index.html');

if (!fs.existsSync(webpPath)) {
  console.error('File not found:', webpPath);
  process.exit(1);
}

const b64 = fs.readFileSync(webpPath).toString('base64');
const dataUri = `data:image/webp;base64,${b64}`;

let html = fs.readFileSync(indexPath, 'utf8');

// Replace any existing img src for signes_appel with the clean base64 dataUri without inline onerror
html = html.replace(/src="[^"]*signes_appel[^"]*"/g, `src="${dataUri}"`);
html = html.replace(/\s*onerror="[^"]*"/g, '');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully embedded base64 WebP image cleanly into www/index.html');
