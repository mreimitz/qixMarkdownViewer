/**
 * Package the extension into a ZIP file ready for upload to Qlik Cloud.
 *
 * Usage:  node scripts/package.js
 * Output: release/qixMarkdownViewer.zip
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const root = path.resolve(__dirname, '..');
const releaseDir = path.join(root, 'release');
const outZip = path.join(releaseDir, 'qixMarkdownViewer.zip');

// Ensure release/ exists
if (!fs.existsSync(releaseDir)) fs.mkdirSync(releaseDir);

// Remove previous ZIP if present
if (fs.existsSync(outZip)) fs.unlinkSync(outZip);

// Files to include in the extension ZIP
const files = [
  'extension/qixMarkdownViewer.qext',
  'extension/qixMarkdownViewer.js',
  'extension/qixMarkdownViewer.html',
  'extension/qixMarkdownViewer.css',
  'dist/libs.js',
  'dist/qixMarkdownViewer.js'
];

// Verify all files exist
for (const f of files) {
  const full = path.join(root, f);
  if (!fs.existsSync(full)) {
    console.error('Missing file: ' + f);
    console.error('Run "npm run build" first.');
    process.exit(1);
  }
}

// Build ZIP  — flatten extension/ files to root, keep dist/ folder
const cmd = [
  'cd ' + JSON.stringify(root),
  '&&',
  'zip -j', JSON.stringify(outZip),
  'extension/qixMarkdownViewer.qext',
  'extension/qixMarkdownViewer.js',
  'extension/qixMarkdownViewer.html',
  'extension/qixMarkdownViewer.css',
  '&&',
  'zip', JSON.stringify(outZip), '-r',
  'dist/libs.js',
  'dist/qixMarkdownViewer.js'
].join(' ');

execSync(cmd, { stdio: 'inherit' });

const stats = fs.statSync(outZip);
console.log('\nPackaged: release/qixMarkdownViewer.zip (' + Math.round(stats.size / 1024) + ' KB)');
