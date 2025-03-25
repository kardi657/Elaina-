/*
Name : Auto Clearsession 
Type : Plugins ESM
Sumber : https://whatsapp.com/channel/0029Vb4yGiCISTkSLyvoeT23
*/

import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import readline from 'readline';

const platform = os.platform();
const TIME = 1000 * 60 * 120;
const AUTO_CLEAR_INTERVAL = 1000 * 60 * 10;
const __dirname = path.resolve();
const sessionPath = path.join(__dirname, './sessions');

if (!(await fs.stat(sessionPath).catch(() => null))) {
  await fs.mkdir(sessionPath, { recursive: true });
  console.log('Created session directory:', sessionPath);
}

async function clearSessions() {
  try {
    const ses = [os.tmpdir(), sessionPath];
    const filesToDelete = [];
    console.log('Directories to check:', ses);
    for (const dir of ses) {
      if (await fs.stat(dir).catch(() => null)) {
        console.log(`Checking directory: ${dir}`);
        const files = await fs.readdir(dir);
        for (const file of files) {
          if (file !== 'creds.json') {
            filesToDelete.push(path.join(dir, file));
          }
        }
      } else {
        console.warn(`Directory not found: ${dir}`);
      }
    }
    for (const file of filesToDelete) {
      const stat = await fs.stat(file);
      if (stat.isFile() && Date.now() - stat.mtimeMs >= TIME) {
        await fs.unlink(file);
        console.log(`Deleted: ${file}`);
      }
    }
    console.log('Session clearing completed.');
  } catch (error) {
    console.error('Error during session clearing:', error.message);
  }
}

function startAutoClear() {
  setInterval(async () => {
    console.log('Running auto-clear sessions...');
    try {
      await clearSessions();
      console.log('Auto-clear sessions completed.');
    } catch (error) {
      console.error('Error during auto-clear:', error.message);
    }
  }, AUTO_CLEAR_INTERVAL);
}

startAutoClear();
console.log('Auto-clear sessions started.');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('line', async (input) => {
  if (input.trim().toLowerCase() === 'clear') {
    console.log('Manual session clear initiated...');
    await clearSessions();
    console.log('Manual session clear completed.');
  }
});