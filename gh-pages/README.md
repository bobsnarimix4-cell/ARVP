# GitHub Pages Deployment - ARV.P

## OTA Update Hosting

This directory contains files served via GitHub Pages for OTA (Over-The-Air) updates.

### Files
- `update.json` - Update manifest with version, hash, and download URL
- `index.html.enc` - AES-256-CBC encrypted application bundle

### How to deploy

1. Run the build process:
```bash
node scripts/encrypt.js
node scripts/buildARVP.js
```

2. Copy the generated files:
```bash
cp app/src/main/assets/www/index.html.enc gh-pages/
cp scripts/update.json gh-pages/
```

3. Commit and push:
```bash
git add gh-pages/
git commit -m "chore: update OTA files v$(node -e "const d=require('fs').readFileSync('www/js/data.js','utf8');console.log(d.match(/version:\s*\"([^\"]+)\"/)[1])")"
git push origin main
```

### GitHub Pages Configuration

1. Go to: https://github.com/bobsnarimix4-cell/ARVP/settings/pages
2. Source: "Deploy from a branch"
3. Branch: `main`, folder: `/gh-pages`
4. The update.json will be available at:
   `https://bobsnarimix4-cell.github.io/ARVP/update.json`

### Update Flow

1. App calls `update.json` on startup
2. Compares `versionCode` with locally stored value
3. Downloads `index.html.enc` if newer version available
4. Verifies SHA-256 hash integrity
5. Saves to internal storage
6. Restarts activity to load updated content
