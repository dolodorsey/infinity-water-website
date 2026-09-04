import fs from 'node:fs';

function requireText(path, expected, label) {
  const text = fs.readFileSync(path, 'utf8');
  if (!text.includes(expected)) {
    throw new Error(`${label}: missing ${expected}`);
  }
  return text;
}

const routePath = 'src/app/api/forms/route.js';
const route = requireText(
  routePath,
  '/rest/v1/infinity_quote_requests',
  'Infinity intake isolation'
);

if (route.includes('/rest/v1/quote_requests')) {
  throw new Error('Infinity intake isolation: shared quote_requests endpoint is still referenced');
}
if (route.includes('process.env.GHL_LOCATION_ID')) {
  throw new Error('Infinity CRM isolation: runtime-selectable GHL location is not allowed');
}
requireText(routePath, "const GHL_LOCATION_ID = 'OQcKgzwCYdUYLSjZnRBE';", 'Infinity CRM destination');
requireText(routePath, "const BRAND_KEY = 'infinity';", 'Infinity brand identity');

const migrationPath = 'supabase/migrations/20260903235440_infinity_quote_requests_isolation.sql';
requireText(migrationPath, 'create table public.infinity_quote_requests', 'Infinity dataset migration');
requireText(migrationPath, 'revoke all on table public.infinity_quote_requests from anon, authenticated;', 'Infinity least privilege');
requireText(migrationPath, 'grant insert on table public.infinity_quote_requests to anon, authenticated;', 'Infinity public intake contract');
requireText(migrationPath, "assigned_team = 'Infinity Water Sales'", 'Infinity ownership boundary');

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (packageJson.dependencies?.next !== '16.3.4') {
  throw new Error('Infinity runtime: Next.js must remain pinned to 16.3.4');
}
if (packageJson.engines?.node !== '24.x') {
  throw new Error('Infinity runtime: Node must remain pinned to 24.x');
}
if (packageJson.overrides?.nanoid !== '3.3.18') {
  throw new Error('Infinity runtime: nanoid security override must remain at patched 3.3.18');
}

const nextConfig = requireText('next.config.mjs', "poweredByHeader: false", 'Infinity framework disclosure');
for (const header of [
  'Strict-Transport-Security',
  'X-Content-Type-Options',
  'X-Frame-Options',
  'Referrer-Policy',
  'Permissions-Policy',
]) {
  if (!nextConfig.includes(header)) {
    throw new Error(`Infinity security headers: missing ${header}`);
  }
}

console.log('Infinity enterprise contract verified.');
