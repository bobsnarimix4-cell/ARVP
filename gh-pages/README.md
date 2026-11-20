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
node scripts/verify-bundle.js
```

`encrypt.js` copie automatiquement `index.html.enc` dans `gh-pages/` ; `buildARVP.js` y écrit `update.json`.

2. Commit and push:
```bash
git add gh-pages/
git commit -m "chore: update OTA files"
git push origin main
```

### GitHub Pages Configuration

1. Go to: https://github.com/bobsnarimix4-cell/ARVP/settings/pages
2. Source: "Deploy from a branch"
3. Branch: `main`, folder: `/gh-pages`
4. The update.json will be available at:
   `https://bobsnarimix4-cell.github.io/ARVP/gh-pages/update.json`

### Update Flow

1. App calls `update.json` on startup
2. Compares `versionCode` with locally stored value
3. Downloads `index.html.enc` if newer version available
4. Verifies SHA-256 hash integrity
5. Saves to internal storage
6. Restarts activity to load updated content

> La version embarquée dans l'APK (`assets/www/index.html.enc`) reste prioritaire :
> une mise à jour OTA de version inférieure ou égale est ignorée puis supprimée.
