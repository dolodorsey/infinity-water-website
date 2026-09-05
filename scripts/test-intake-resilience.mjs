import assert from 'node:assert/strict';
import { POST } from '../src/app/api/forms/route.js';

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

function request(body) {
  return new Request('https://watertoinfinity.com/api/forms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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

async function testCrmOnlyFallback() {
  let crmBody;
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
      return json({ ok: true }, 201);
    }
    throw new Error(`Unexpected URL: ${target}`);
  };

  const response = await POST(request({}));
  const body = await response.json();
  assert.equal(response.status, 202);
  assert.equal(body.success, true);
  assert.equal(body.durability, 'crm_only');
  assert.equal(body.crmSynced, true);
  assert.match(body.reference, /^INFINITY-\d{8}-[A-Z0-9]{10}$/);
  assert.equal(crmBody.locationId, 'OQcKgzwCYdUYLSjZnRBE');
  assert.match(crmBody.source, new RegExp(body.reference));
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

async function testDatabaseOnlySuccess() {
  globalThis.fetch = async (url) => {
    const target = String(url);
    if (target.includes('/rest/v1/infinity_quote_requests')) {
      return new Response(null, { status: 201 });
    }
    if (target.endsWith('/contacts/upsert')) {
      return new Response('crm unavailable', { status: 503 });
    }
    throw new Error(`Unexpected URL: ${target}`);
  };

  const response = await POST(request({}));
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.equal(body.durability, 'database_only');
  assert.equal(body.crmSynced, false);
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
  await testCrmOnlyFallback();
  await testTotalFailureFailsClosed();
  await testDatabaseOnlySuccess();
  await testCrossBrandFailsBeforeNetwork();
  console.log('Infinity intake resilience behavior verified.');
} finally {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}
