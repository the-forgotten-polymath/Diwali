#!/usr/bin/env node
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('\x1b[33m%s\x1b[0m', '🪔 ✨ Happy Diwali! ✨ 🪔');
console.log('\x1b[35m%s\x1b[0m', '🐾 Dedicated to Julie ("Juluu") — Forever in our hearts 💛\n');

const mainScript = join(__dirname, '../electron/main.cjs');

try {
  const electronModule = await import('electron');
  const electronPath = electronModule.default;

  if (electronPath) {
    console.log('🚀 Starting transparent macOS ambient screen overlay...');
    const child = spawn(electronPath, [mainScript], {
      detached: true,
      stdio: 'ignore',
      env: { ...process.env, ELECTRON_RUN_AS_NODE: undefined }
    });
    child.unref();
    console.log('✨ Overlay active! Look for the 🪔 icon in your menu bar.');
    process.exit(0);
  }
} catch (e) {
  console.log('To run the desktop overlay with Electron:');
  console.log('  git clone https://github.com/the-forgotten-polymath/Diwali.git');
  console.log('  cd Diwali && npm install && npm run overlay\n');
  console.log('Web package usage:');
  console.log("  import { rockets, diyas, labrador, rangoli } from 'diwali';");
}
