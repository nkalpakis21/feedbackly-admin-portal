#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to sync SDK files from feedbackly-sdk to admin-portal during build
 * This ensures we always have the latest SDK code without maintaining symlinks
 */

const SDK_SOURCE_PATH = path.join(__dirname, '../../feedbackly-sdk/src');
const SDK_TARGET_PATH = path.join(__dirname, '../src/lib/shiply');

console.log('🔄 Syncing SDK files...');
console.log(`Source: ${SDK_SOURCE_PATH}`);
console.log(`Target: ${SDK_TARGET_PATH}`);

// Check if source exists
if (!fs.existsSync(SDK_SOURCE_PATH)) {
  console.error('❌ SDK source path does not exist:', SDK_SOURCE_PATH);
  process.exit(1);
}

// Remove existing target directory if it exists
if (fs.existsSync(SDK_TARGET_PATH)) {
  console.log('🗑️  Removing existing SDK directory...');
  fs.rmSync(SDK_TARGET_PATH, { recursive: true, force: true });
}

// Create target directory
fs.mkdirSync(SDK_TARGET_PATH, { recursive: true });

// Copy all files and directories
function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    // Create directory
    fs.mkdirSync(dest, { recursive: true });
    
    // Copy contents
    const items = fs.readdirSync(src);
    for (const item of items) {
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    // Copy file
    fs.copyFileSync(src, dest);
  }
}

try {
  copyRecursive(SDK_SOURCE_PATH, SDK_TARGET_PATH);
  console.log('✅ SDK files synced successfully!');
  
  // Log what was copied
  const copiedFiles = [];
  function listFiles(dir, prefix = '') {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        listFiles(fullPath, prefix + item + '/');
      } else {
        copiedFiles.push(prefix + item);
      }
    }
  }
  
  listFiles(SDK_TARGET_PATH);
  console.log(`📁 Copied ${copiedFiles.length} files:`);
  copiedFiles.forEach(file => console.log(`   - ${file}`));
  
} catch (error) {
  console.error('❌ Error syncing SDK files:', error.message);
  process.exit(1);
}
