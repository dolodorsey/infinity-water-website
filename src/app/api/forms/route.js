import { NextResponse } from 'next/server';

const BRAND_KEY = 'infinity';
const BRAND_NAME = 'Infinity Water';
const GHL_API = 'https://services.leadconnectorhq.com';
const GHL_LOCATION_ID = 'OQcKgzwCYdUYLSjZnRBE';
const MAX_BODY_BYTES = 64 * 1024;
const CRM_TIMEOUT_MS = 8000;
const RETRY_AFTER_SECONDS = 60;

function clean(value, max = 5000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function cleanFields(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function cleanUtm(value) {
  const source = cleanFields(value);
  const allowed = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'gclid',
    'fbclid',
  ];

  return Object.fromEntries(
    allowed
      .map((key) => [key, clean(source[key], 250)])
      .filter(([, item]) => item)
  );
}

function refererAttribution(request) {
  const referer = clean(request.headers.get('referer'), 2000);
  if (!referer) return {};

  try {
    const url = new URL(referer);
    return cleanUtm(Object.fromEntries(url.searchParams.entries()));
  } catch {
    return {};
  }
}

function formDetails(formType, fields, reference, utm = {}) {
  const lines = Object.entries(fields || {})
    .filter(([, value]) => value !== '' && value !== null && value !== undefined)
    .map(([key, value]) => `${key.replaceAll('_', ' ')}: ${String(value)}`);
  const attribution = Object.entries(utm)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key.replaceAll('_', ' ')}: ${value}`);
  return [`[${formType}]`, `reference: ${reference}`, ...lines, ...attribution]
    .join('\n')
    .slice(0, 5000);
}

function createReference() {
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  return `INFINITY-${date}-${crypto.randomUUID().replaceAll('-', '').slice(0, 10).toUpperCase()}`;
}

async function storeLead({ formType, name, email, phone, source, fields, utm, reference }) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Lead storage is not configured');
  }

  const organization = clean(
    fields.organization || fields.business_name || fields.company || fields.company_name,
    200
  );

  const response = await fetch(`${url}/rest/v1/infinity_quote_requests`, {
    method: 'POST',
    cache: 'no-store',
    signal: AbortSignal.timeout(CRM_TIMEOUT_MS),
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      inquiry_type: formType,
      name,
      email,
      phone: phone || null,
      organization: organization || null,
      details: formDetails(formType, fields, reference, utm),
      reference,
      workflow_status: 'submitted',
      consent_at: new Date().toISOString(),
      source_page: source || `${BRAND_NAME} Website`,
      utm,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    const error = new Error(/rate limit|too many/i.test(message) ? 'rate_limit' : 'storage_failed');
    error.cause = message;
    throw error;
  }

  return true;
}

async function syncOptionalCrm({ formType, name, email, phone, fields, reference, utm }) {
  const pitToken = process.env.GHL_PIT_TOKEN;
  if (!pitToken) return false;

  const [firstName = '', ...lastNameParts] = name.split(/\s+/);
  const contactResponse = await fetch(`${GHL_API}/contacts/upsert`, {
    method: 'POST',
    cache: 'no-store',
    signal: AbortSignal.timeout(CRM_TIMEOUT_MS),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${pitToken}`,
      Version: '2021-07-28',
    },
    body: JSON.stringify({
      firstName,
      lastName: lastNameParts.join(' '),
      email,
      phone: phone || undefined,
      locationId: GHL_LOCATION_ID,
      source: `${BRAND_NAME}: ${formType.replaceAll('_', ' ')} | ${reference}`,
      tags: [`form_${formType}`, 'website_form', BRAND_KEY],
    }),
  });

  if (!contactResponse.ok) return false;
  const contact = await contactResponse.json();
  const contactId = contact?.contact?.id;
  if (!contactId) return true;

  await fetch(`${GHL_API}/contacts/${contactId}/notes`, {
    method: 'POST',
    cache: 'no-store',
    signal: AbortSignal.timeout(CRM_TIMEOUT_MS),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${pitToken}`,
      Version: '2021-07-28',
    },
    body: JSON.stringify({ body: formDetails(formType, fields, reference, utm) }),
  }).catch(() => undefined);

  return true;
}

export async function POST(request) {
  try {
    const rawBody = await request.text();
    if (rawBody.length > MAX_BODY_BYTES) {
      return NextResponse.json(
        { success: false, error: 'Request is too large.' },
        { status: 413, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const body = JSON.parse(rawBody || '{}');
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request.' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const submittedBrand = clean(body.brand_key || body.brandKey, 80);
    if (submittedBrand && !['infinity', 'infinity_water'].includes(submittedBrand)) {
      return NextResponse.json(
        { success: false, error: 'Invalid brand route.' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const formType = clean(body.formType || body.form_type, 80);
    const name = clean(body.name || body.full_name, 120);
    const email = clean(body.email, 254).toLowerCase();
    const phone = clean(body.phone, 50);
    const source = clean(body.source, 500);
    const fields = cleanFields(body.fields || body.form_data);
    const utm = { ...refererAttribution(request), ...cleanUtm(body.utm) };

    if (clean(fields.company_website, 200)) {
      return NextResponse.json(
        { success: true },
        { headers: { 'Cache-Control': 'no-store' } }
      );
    }

    if (
      formType.length < 2 ||
      name.length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid form type, name, and email.' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const reference = createReference();
    let databaseStored = false;
    let storageError;

    try {
      await storeLead({ formType, name, email, phone, source, fields, utm, reference });
      databaseStored = true;
    } catch (error) {
      storageError = error;
    }

    const crmSynced = await syncOptionalCrm({
      formType,
      name,
      email,
      phone,
      fields,
      reference,
      utm,
    }).catch(() => false);

    if (!databaseStored && !crmSynced) {
      const rateLimited = storageError?.message === 'rate_limit';
      console.error('Infinity intake unavailable', {
        reference,
        databaseStored,
        crmSynced,
        storageError: storageError?.message || 'unknown',
      });
      return NextResponse.json(
        {
          success: false,
          error: rateLimited
            ? 'We received several requests recently. Please try again later.'
            : 'We could not save your request. Please try again.',
          reference,
        },
        {
          status: rateLimited ? 429 : 503,
          headers: {
            'Cache-Control': 'no-store',
            'Retry-After': String(RETRY_AFTER_SECONDS),
          },
        }
      );
    }

    if (!databaseStored && crmSynced) {
      console.warn('Infinity lead accepted CRM-only while database is unavailable', { reference });
      return NextResponse.json(
        {
          success: true,
          message: 'Received. Our sales team will be in touch.',
          reference,
          crmSynced: true,
          durability: 'crm_only',
        },
        { status: 202, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    if (!crmSynced) {
      console.warn('Infinity CRM sync deferred', { reference });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Received. Our sales team will be in touch.',
        reference,
        crmSynced,
        durability: crmSynced ? 'database+crm' : 'database_only',
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    const invalidJson = error instanceof SyntaxError;
    console.error('Infinity form submission failed:', error?.message || error);
    return NextResponse.json(
      {
        success: false,
        error: invalidJson ? 'Invalid request.' : 'We could not save your request. Please try again.',
      },
      {
        status: invalidJson ? 400 : 503,
        headers: {
          'Cache-Control': 'no-store',
          ...(invalidJson ? {} : { 'Retry-After': String(RETRY_AFTER_SECONDS) }),
        },
      }
    );
  }
}
