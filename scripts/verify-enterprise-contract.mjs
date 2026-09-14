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
requireText(routePath, "process.env.INFINITY_GHL_EXECUTION_CERTIFIED === 'true'", 'Infinity CRM certification gate');
requireText(routePath, 'if (!CRM_EXECUTION_CERTIFIED) return false;', 'Infinity CRM fail-closed behavior');
requireText(routePath, "formType === 'email_updates'", 'Infinity marketing form scope');
requireText(routePath, 'body.contact_consent === true', 'Infinity explicit contact consent');
requireText(routePath, 'body.marketing_consent === true', 'Infinity explicit marketing consent');
requireText(routePath, 'contact_consent: contactConsent', 'Infinity persisted contact consent');
requireText(routePath, 'marketing_consent: marketingConsent', 'Infinity persisted marketing consent');
requireText(routePath, 'consent_at: marketingConsent ? new Date().toISOString() : null', 'Infinity truthful consent timestamp');
requireText(routePath, "marketingConsent ? 'marketing_opt_in' : 'inquiry_response_only'", 'Infinity CRM consent tagging');
requireText(routePath, 'Marketing consent: not granted by this form.', 'Infinity inquiry CRM consent disclosure');
requireText(routePath, 'Marketing consent granted.', 'Infinity marketing CRM consent disclosure');

const conversionPath = 'src/components/InfinityConversionLayer.tsx';
const conversion = requireText(
  conversionPath,
  'name="marketing_consent" type="checkbox" required',
  'Infinity marketing checkbox'
);
requireText(conversionPath, 'contact_consent: marketingConsent', 'Infinity marketing contact consent payload');
requireText(conversionPath, 'marketing_consent: marketingConsent', 'Infinity marketing consent payload');
requireText(conversionPath, 'I can unsubscribe at any time.', 'Infinity unsubscribe disclosure');
if (conversion.includes('consent: true')) {
  throw new Error('Infinity consent integrity: implicit hard-coded consent is not allowed');
}

const connectPath = 'src/app/connect/page.jsx';
const connect = requireText(
  connectPath,
  "const SECONDARY_FORMS = ['vendor', 'influencer', 'sponsor', 'inquiry'];",
  'Infinity connect revenue focus'
);
requireText(connectPath, 'forms={SECONDARY_FORMS}', 'Infinity connect explicit form scope');
for (const path of [
  '/water/infinity-water/wholesale',
  '/water/infinity-water/hospitality',
  '/water/infinity-water/distribution',
  '/water/infinity-water/events',
]) {
  if (!connect.includes(path)) {
    throw new Error(`Infinity connect routing: missing ${path}`);
  }
}
for (const unrelatedForm of [
  'artist_painter',
  'artist_music',
  'onboarding',
  'what_you_do',
  'rsvp',
  'intern',
  'volunteer',
  'table_reservation',
  'nda',
]) {
  if (connect.includes(`'${unrelatedForm}'`)) {
    throw new Error(`Infinity connect isolation: unrelated form ${unrelatedForm} must not be exposed`);
  }
}
if (connect.includes('View every Infinity Water inquiry')) {
  throw new Error('Infinity connect isolation: unscoped all-inquiry escape link must not be exposed');
}

const migrationPath = 'supabase/migrations/20260903235440_infinity_quote_requests_isolation.sql';
requireText(migrationPath, 'create table public.infinity_quote_requests', 'Infinity dataset migration');
requireText(migrationPath, 'revoke all on table public.infinity_quote_requests from anon, authenticated;', 'Infinity least privilege');
requireText(migrationPath, 'grant insert on table public.infinity_quote_requests to anon, authenticated;', 'Infinity public intake contract');
requireText(migrationPath, "assigned_team = 'Infinity Water Sales'", 'Infinity ownership boundary');

const consentColumnsPath = 'supabase/migrations/20260914121500_infinity_consent_integrity_columns.sql';
requireText(consentColumnsPath, 'contact_consent boolean not null default false', 'Infinity contact-consent column');
requireText(consentColumnsPath, 'marketing_consent boolean not null default false', 'Infinity marketing-consent column');

const consentPolicyPath = 'supabase/migrations/20260914124500_infinity_public_intake_consent_truth.sql';
requireText(consentPolicyPath, 'contact_consent is false', 'Infinity inquiry contact-consent policy');
requireText(consentPolicyPath, 'marketing_consent is false', 'Infinity inquiry marketing-consent policy');
requireText(consentPolicyPath, 'consent_at is null', 'Infinity inquiry consent timestamp policy');

const explicitConsentPolicyPath = 'supabase/migrations/20260914125500_infinity_explicit_marketing_consent.sql';
requireText(explicitConsentPolicyPath, "inquiry_type = 'email_updates'", 'Infinity marketing policy scope');
requireText(explicitConsentPolicyPath, 'contact_consent is true', 'Infinity marketing contact consent policy');
requireText(explicitConsentPolicyPath, 'marketing_consent is true', 'Infinity marketing consent policy');
requireText(explicitConsentPolicyPath, 'consent_at is not null', 'Infinity marketing consent timestamp policy');
requireText(explicitConsentPolicyPath, "inquiry_type <> 'email_updates'", 'Infinity inquiry/marketing separation');

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
if (packageJson.overrides?.['js-yaml'] !== '4.3.2') {
  throw new Error('Infinity runtime: js-yaml security override must remain at patched 4.3.2');
}

const lockJson = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));
if (lockJson.packages?.['node_modules/js-yaml']?.version !== '4.3.2') {
  throw new Error('Infinity runtime: lockfile must resolve js-yaml to patched 4.3.2');
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
