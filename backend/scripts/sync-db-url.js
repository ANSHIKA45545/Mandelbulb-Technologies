import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const envPath = join(root, '.env');

const output = execSync('npx prisma dev ls', { cwd: root, encoding: 'utf8' });

const match = output.match(/prisma\+postgres:\/\/localhost:\d+\/\?api_key=[A-Za-z0-9+/=._-]+/);
if (!match) {
  console.error('No running Prisma dev database found. Run: npm run db:start');
  process.exit(1);
}

const databaseUrl = match[0];
let env = readFileSync(envPath, 'utf8');

if (/^DATABASE_URL=.*/m.test(env)) {
  env = env.replace(/^DATABASE_URL=.*/m, `DATABASE_URL="${databaseUrl}"`);
} else {
  env = `DATABASE_URL="${databaseUrl}"\n${env}`;
}

writeFileSync(envPath, env);
console.log('Updated DATABASE_URL in .env');
console.log('Run: npm run db:push  (if schema not yet applied)');
