#!/usr/bin/env node
/**
 * Sync Data Script
 *
 * Copies JSON data files from data/ to public/api/ before build.
 * This enables the "mock API" pattern for GitHub Pages static deployment.
 *
 * Usage:
 *   node scripts/sync-data.js
 *   npm run sync-data
 */

const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(process.cwd(), 'data');
const TARGET_DIR = path.join(process.cwd(), 'public', 'api');

// Files to sync (add more as needed)
const DATA_FILES = [
  'f9_launches_2025.json',
  'f9_launches_2026.json',
  'world_launches_2025.json',
  'world_launches_2026.json',
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
}

function syncFile(filename) {
  const sourcePath = path.join(SOURCE_DIR, filename);
  const targetPath = path.join(TARGET_DIR, filename);

  if (!fs.existsSync(sourcePath)) {
    console.log(`⚠️  Skipped: ${filename} (not found in data/)`);
    return false;
  }

  fs.copyFileSync(sourcePath, targetPath);
  const stats = fs.statSync(targetPath);
  const sizeKB = (stats.size / 1024).toFixed(1);
  console.log(`✅ Synced: ${filename} (${sizeKB} KB)`);
  return true;
}

function main() {
  console.log('\n🔄 Syncing data files to public/api/...\n');
  console.log(`   Source: ${SOURCE_DIR}`);
  console.log(`   Target: ${TARGET_DIR}\n`);

  ensureDir(TARGET_DIR);

  let synced = 0;
  let skipped = 0;

  for (const file of DATA_FILES) {
    if (syncFile(file)) {
      synced++;
    } else {
      skipped++;
    }
  }

  console.log(`\n📊 Summary: ${synced} synced, ${skipped} skipped\n`);
}

main();
