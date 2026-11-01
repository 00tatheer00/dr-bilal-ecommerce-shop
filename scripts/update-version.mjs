import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let commitHash = 'prod';
try {
  commitHash = execSync('git rev-parse --short HEAD').toString().trim();
} catch {
  commitHash = 'prod';
}

const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const dateStr = `${year}.${month}.${day}`;
const buildId = `${dateStr}-${commitHash}`;

const versionFilePath = path.join(__dirname, '..', 'src', 'config', 'version.ts');
const content = `/**
 * GULNAAR by MK — Application Version & Deployment Metadata
 * Automatically updated on every build & push
 */
export const APP_VERSION = {
  version: '2.1.0',
  build: '${buildId}',
  releaseName: 'Royal Velvet & Champagne Gold Edition',
  updatedAt: '${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}',
  environment: process.env.NODE_ENV || 'production',
  status: 'operational',
} as const;
`;

fs.writeFileSync(versionFilePath, content, 'utf8');
console.log(`[Version Tracker] Updated build metadata to: ${buildId}`);
