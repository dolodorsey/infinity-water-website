import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const routeSourcePath = new URL('../src/app/api/forms/route.js', import.meta.url);
const harnessPath = new URL('./.tmp-infinity-intake-route.mjs', import.meta.url);
const routeSource = await fs.readFile(routeSourcePath, 'utf8');
await fs.writeFile(
  harnessPath,
  routeSource.replace("from 'next/server'", "from 'next/server.js'"),
  'utf8'
);

const { POST } = await import(`${harnessPath.href}?v=${Date.now()}`);
const originalFetch = globalThis.fetch;
const originalEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  GHL_PIT_TOKEN: process.env.GHL_PIT_TOKEN,
};

process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://infinity-test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'test-publishable-key';
delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
process.env.GHL_PIT_TOKEN = 'test-infinity-pit-token';

function request(body, referer = '') {
  const headers = { 'Content-Type': 'application/json' };
  if (referer) headers.Referer = referer;
  return new Request('https://watertoinfinity.com/api/forms', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      formType: 'wholesale',
      name: 'Infinity QA',
      email: 'qa@infinity.example',
      source: 'Infinity QA',
      fields: { organization: 'Infinity QA' },
      ...body,
    }),
  });
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function testCrmOnlyFallbackPreservesAttribution() {
  let crmBody;
  let noteBody;
  globalThis.fetch = async (url, init = {}) => {
    const target = String(url);
    if (target.includes('/rest/v1/infinity_quote_requests')) {
      return new Response('database unavailable', { status: 503 });
    }
    if (target.endsWith('/contacts/upsert')) {
      crmBody = JSON.parse(init.body);
      return json({ contact: { id: 'contact-infinity-qa' } });
    }
    if (target.includes('/contacts/contact-infinity-qa/notes')) {
      noteBody = JSON.parse(init.body);
      return json({ ok: true }, 201);
    }
    throw new Error(`Unexpected URL: ${target}`);
  };

  const response = await POST(
    request(
      { utm: { utm_source: 'newsletter', utm_campaign: 'launch' } },
      'https://watertoinfinity.com/wholesale?utm_source=instagram&utm_medium=paid_social&gclid=GCLID123'
    )
  );
  const body = await response.json();
  assert.equal(response.status, 202);
  assert.equal(body.success, true);
  assert.equal(body.durability, 'crm_only');
  assert.equal(body.crmSynced, true);
  assert.match(body.reference, /^INFINITY-\d{8}-[A-Z0-9]{10}$/);
  assert.equal(crmBody.locationId, 'OQcKgzwCYdUYLSjZnRBE');
  assert.match(crmBody.source, new RegExp(body.reference));
  assert.match(noteBody.body, /utm source: newsletter/);
  assert.match(noteBody.body, /utm medium: paid_social/);
  assert.match(noteBody.body, /utm campaign: launch/);
  assert.match(noteBody.body, /gclid: GCLID123/);
  assert.doesNotMatch(noteBody.body, /utm source: instagram/);
}

async function testTotalFailureFailsClosed() {
  globalThis.fetch = async (url) => {
    const target = String(url);
    if (target.includes('/rest/v1/infinity_quote_requests')) {
      return new Response('database unavailable', { status: 503 });
    }
    if (target.endsWith('/contacts/upsert')) {
      return new Response('crm unavailable', { status: 503 });
    }
    throw new Error(`Unexpected URL: ${target}`);
  };

  const response = await POST(request({}));
  const body = await response.json();
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('retry-after'), '60');
  assert.equal(body.success, false);
  assert.match(body.reference, /^INFINITY-\d{8}-[A-Z0-9]{10}$/);
}

async function testDatabaseOnlySuccessPreservesAttribution() {
  let databaseBody;
  globalThis.fetch = async (url, init = {}) => {
    const target = String(url);
    if (target.includes('/rest/v1/infinity_quote_requests')) {
      databaseBody = JSON.parse(init.body);
      return new Response(null, { status: 201 });
    }
    if (target.endsWith('/contacts/upsert')) {
      return new Response('crm unavailable', { status: 503 });
    }
    throw new Error(`Unexpected URL: ${target}`);
  };

  const response = await POST(
    request({}, 'https://watertoinfinity.com/forms/wholesale?utm_source=google&utm_medium=cpc&fbclid=FB123')
  );
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.equal(body.durability, 'database_only');
  assert.equal(body.crmSynced, false);
  assert.deepEqual(databaseBody.utm, {
    utm_source: 'google',
    utm_medium: 'cpc',
    fbclid: 'FB123',
  });
  assert.match(databaseBody.details, /utm source: google/);
  assert.match(databaseBody.details, /utm medium: cpc/);
  assert.match(databaseBody.details, /fbclid: FB123/);
}

async function testCrossBrandFailsBeforeNetwork() {
  globalThis.fetch = async () => {
    throw new Error('Cross-brand request must not reach an upstream');
  };

  const response = await POST(request({ brand_key: 'sos' }));
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.equal(body.success, false);
  assert.equal(body.error, 'Invalid brand route.');
}

try {
  await testCrmOnlyFallbackPreservesAttribution();
  await testTotalFailureFailsClosed();
  await testDatabaseOnlySuccessPreservesAttribution();
  await testCrossBrandFailsBeforeNetwork();
  console.log('Infinity intake resilience and attribution behavior verified.');
} finally {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  await fs.rm(harnessPath, { force: true });
}
