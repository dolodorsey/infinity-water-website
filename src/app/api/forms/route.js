import { NextResponse } from 'next/server';

const BRAND_KEY = 'infinity';
const BRAND_NAME = 'Infinity Water';
const INTAKE_TABLE = 'infinity_quote_requests';
const ASSIGNED_TEAM = 'Infinity Water Sales';
const GHL_API = 'https://services.leadconnectorhq.com';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

function clean(value, max = 5000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function formDetails(formType, fields) {
  const lines = Object.entries(fields || {})
    .filter(([, value]) => value !== '' && value !== null && value !== undefined)
    .map(([key, value]) => `${key.replaceAll('_', ' ')}: ${String(value)}`);
  return [`[${formType}]`, ...lines].join('\n').slice(0, 5000);
}

function cleanUtm(body, fields) {
  const bodyUtm = body?.utm && typeof body.utm === 'object' ? body.utm : {};
  const normalized = {};

  for (const key of UTM_KEYS) {
    const value = clean(bodyUtm[key] || body?.[key] || fields?.[key], 250);
    if (value) normalized[key] = value;
  }

  return normalized;
}

async function storeLead({ formType, name, email, phone, source, fields, utm }) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Lead storage is not configured');
  }

  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  const reference = `INFINITY-${date}-${crypto.randomUUID().replaceAll('-', '').slice(0, 10).toUpperCase()}`;
  const organization = clean(
    fields.organization || fields.business_name || fields.company || fields.company_name,
    200
  );

  const response = await fetch(`${url}/rest/v1/${INTAKE_TABLE}`, {
    method: 'POST',
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
      details: formDetails(formType, fields),
      reference,
      workflow_status: 'submitted',
      consent_at: new Date().toISOString(),
      source_page: source || `${BRAND_NAME} Website`,
      utm,
      assigned_team: ASSIGNED_TEAM,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    const error = new Error(/rate limit|too many/i.test(message) ? 'rate_limit' : 'storage_failed');
    error.cause = message;
    throw error;
  }

  return reference;
}

async function syncOptionalCrm({ formType, name, email, phone, fields }) {
  const pitToken = process.env.GHL_PIT_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!pitToken || !locationId) return false;

  const [firstName = '', ...lastNameParts] = name.split(/\s+/);
  const contactResponse = await fetch(`${GHL_API}/contacts/upsert`, {
    method: 'POST',
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
      locationId,
      source: `${BRAND_NAME}: ${formType.replaceAll('_', ' ')}`,
      tags: [`form_${formType}`, 'website_form', BRAND_KEY],
    }),
  });

  if (!contactResponse.ok) return false;
  const contact = await contactResponse.json();
  const contactId = contact?.contact?.id;
  if (!contactId) return true;

  await fetch(`${GHL_API}/contacts/${contactId}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${pitToken}`,
      Version: '2021-07-28',
    },
    body: JSON.stringify({ body: formDetails(formType, fields) }),
  });
  return true;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const formType = clean(body.formType || body.form_type, 80);
    const name = clean(body.name || body.full_name, 120);
    const email = clean(body.email, 254).toLowerCase();
    const phone = clean(body.phone, 50);
    const source = clean(body.source, 500);
    const fields = body.fields || body.form_data || {};
    const utm = cleanUtm(body, fields);

    if (clean(fields.company_website, 200)) {
      return NextResponse.json({ success: true });
    }
    if (
      formType.length < 2 ||
      name.length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid form type, name, and email.' },
        { status: 400 }
      );
    }

    const reference = await storeLead({ formType, name, email, phone, source, fields, utm });
    const crmSynced = await syncOptionalCrm({ formType, name, email, phone, fields }).catch(
      () => false
    );

    return NextResponse.json({
      success: true,
      message: 'Received. Our sales team will be in touch.',
      reference,
      crmSynced,
    });
  } catch (error) {
    const rateLimited = error?.message === 'rate_limit';
    console.error('Infinity Water form submission failed:', error?.message || error);
    return NextResponse.json(
      {
        success: false,
        error: rateLimited
          ? 'We received several requests recently. Please try again later.'
          : 'We could not save your request. Please try again.',
      },
      { status: rateLimited ? 429 : 500 }
    );
  }
}
