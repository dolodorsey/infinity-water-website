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

// Revenue resilience contract: the independently approved Infinity CRM route must still
// be attempted if database persistence is temporarily unavailable. The customer receives
// success only when at least one approved Infinity persistence path confirms acceptance.
requireText(routePath, 'let databaseStored = false;', 'Infinity intake persistence state');
requireText(routePath, 'if (!databaseStored && !crmSynced)', 'Infinity dual-persistence failure gate');
requireText(routePath, "durability: 'crm_only'", 'Infinity degraded accepted state');
requireText(routePath, "status: 202", 'Infinity degraded acceptance contract');
requireText(routePath, "'Retry-After': String(RETRY_AFTER_SECONDS)", 'Infinity outage retry contract');
requireText(routePath, "durability: crmSynced ? 'database+crm' : 'database_only'", 'Infinity healthy durability contract');
requireText(routePath, 'Infinity lead accepted CRM-only while database is unavailable', 'Infinity degraded observability');
requireText(routePath, 'Infinity intake unavailable', 'Infinity full-outage observability');

const storageAttempt = route.indexOf('await storeLead({');
const crmAttempt = route.indexOf('const crmSynced = await syncOptionalCrm({');
const dualFailureGate = route.indexOf('if (!databaseStored && !crmSynced)');
if (storageAttempt < 0 || crmAttempt < 0 || dualFailureGate < 0 || crmAttempt > dualFailureGate) {
  throw new Error('Infinity intake resilience: CRM fallback must execute before the dual-failure response');
}

for (const forbidden of [
  'sos_',
  'oc_',
  'gt_',
  'rex_',
  'mission365_',
  'halloween_',
  'stush',
  'pronto',
  'ora_',
  'noir_',
  'xxx_',
]) {
  if (route.includes(forbidden)) {
    throw new Error(`Infinity intake isolation: forbidden cross-brand reference ${forbidden}`);
  }
}

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
