import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

console.log('Waiting for database to start...');
await sleep(8000);

execSync('npm run db:sync', { cwd: root, stdio: 'inherit' });
execSync('npm run db:push', { cwd: root, stdio: 'inherit' });
console.log('Database setup complete!');
