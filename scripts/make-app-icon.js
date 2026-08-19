/**
 * Génère les icônes ARV.p (fond bleu) pour PWA et Android.
 * Usage: node scripts/make-app-icon.js
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const svgPath = path.join(__dirname, 'icon.svg');

async function main() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    console.error('Installation de sharp…');
    const { execSync } = require('child_process');
    execSync('npm install sharp --no-save', { cwd: __dirname, stdio: 'inherit' });
    sharp = require('sharp');
  }

  const svg = fs.readFileSync(svgPath);
  const svgFg = fs.readFileSync(path.join(__dirname, 'icon-foreground.svg'));

  const outputs = [
    { input: svg, size: 512, file: path.join(root, 'www', 'icons', 'icon-512.png') },
    { input: svg, size: 192, file: path.join(root, 'www', 'icons', 'icon-192.png') },
    { input: svgFg, size: 432, file: path.join(root, 'app', 'src', 'main', 'res', 'drawable', 'ic_arv_foreground.png') },
    { input: svg, size: 192, file: path.join(root, 'app', 'src', 'main', 'res', 'mipmap-xxxhdpi', 'ic_launcher.png') },
    { input: svg, size: 192, file: path.join(root, 'app', 'src', 'main', 'res', 'mipmap-xxxhdpi', 'ic_launcher_round.png') },
    { input: svg, size: 144, file: path.join(root, 'app', 'src', 'main', 'res', 'mipmap-xxhdpi', 'ic_launcher.png') },
    { input: svg, size: 144, file: path.join(root, 'app', 'src', 'main', 'res', 'mipmap-xxhdpi', 'ic_launcher_round.png') },
    { input: svg, size: 96, file: path.join(root, 'app', 'src', 'main', 'res', 'mipmap-xhdpi', 'ic_launcher.png') },
    { input: svg, size: 96, file: path.join(root, 'app', 'src', 'main', 'res', 'mipmap-xhdpi', 'ic_launcher_round.png') },
    { input: svg, size: 72, file: path.join(root, 'app', 'src', 'main', 'res', 'mipmap-hdpi', 'ic_launcher.png') },
    { input: svg, size: 72, file: path.join(root, 'app', 'src', 'main', 'res', 'mipmap-hdpi', 'ic_launcher_round.png') },
    { input: svg, size: 48, file: path.join(root, 'app', 'src', 'main', 'res', 'mipmap-mdpi', 'ic_launcher.png') },
    { input: svg, size: 48, file: path.join(root, 'app', 'src', 'main', 'res', 'mipmap-mdpi', 'ic_launcher_round.png') },
  ];

  for (const { input, size, file } of outputs) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    await sharp(input).resize(size, size).png().toFile(file);
    console.log('✓', path.relative(root, file), `(${size}px)`);
  }

  const assetsIcons = path.join(root, 'app', 'src', 'main', 'assets', 'www', 'icons');
  for (const name of ['icon-192.png', 'icon-512.png']) {
    const src = path.join(root, 'www', 'icons', name);
    const dest = path.join(assetsIcons, name);
    fs.mkdirSync(assetsIcons, { recursive: true });
    fs.copyFileSync(src, dest);
    console.log('✓', path.relative(root, dest));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
