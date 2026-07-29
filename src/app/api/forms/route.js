import { NextResponse } from 'next/server';

/**
 * POST /api/forms
 * Universal KHG Form Submission Handler
 * Upserts contact into GHL via PIT token, adds notes, logs to Supabase
 * Env vars required: GHL_PIT_TOKEN, GHL_LOCATION_ID, NEXT_PUBLIC_BRAND_KEY
 */

const GHL_API = 'https://services.leadconnectorhq.com';
const ALLOWED_FORM_TYPES = new Set(['inquiry', 'group_pricing']);

export async function POST(request) {
  try {
    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > 25000) {
      return NextResponse.json({ error: 'Submission is too large' }, { status: 413 });
    }
    const body = await request.json();
    const { formType, name, email, phone, source, fields = {}, website, consent, requestId } = body;
    if (website) return NextResponse.json({ success: true }, { status: 202 });

    if (!formType || !name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: formType, name, email' },
        { status: 400 }
      );
    }
    if (
      typeof formType !== 'string' || !ALLOWED_FORM_TYPES.has(formType) ||
      typeof name !== 'string' || name.trim().length > 120 ||
      typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      (phone && (typeof phone !== 'string' || phone.length > 40)) ||
      !fields || typeof fields !== 'object' || Array.isArray(fields) ||
      Object.keys(fields).length > 30 ||
      JSON.stringify(fields).length > 4000 ||
      Object.values(fields).some(value => typeof value === 'string' && value.length > 2000) ||
      consent !== true ||
      typeof requestId !== 'string' || !/^[a-zA-Z0-9-]{8,80}$/.test(requestId)
    ) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }

    const formTag = `form_${formType}`;
    const timestamp = new Date().toISOString();
    const durableReceipt = await persistSubmission({
      formType, name, email, phone, source, fields, requestId, timestamp,
    });
    if (!durableReceipt) {
      return NextResponse.json(
        { error: 'We could not safely save your request. Please try again.' },
        { status: 503 }
      );
    }
    const pitToken = process.env.GHL_PIT_TOKEN;
    const locationId = process.env.GHL_LOCATION_ID;
    if (!pitToken || !locationId) {
      console.error('Missing GHL_PIT_TOKEN or GHL_LOCATION_ID');
      return NextResponse.json(
        { error: 'Your request was saved, but delivery is delayed. Please try again or contact us directly.' },
        { status: 503 }
      );
    }

    const notesLines = [
      `=== ${formType.toUpperCase().replace(/_/g, ' ')} SUBMISSION ===`,
      `Submitted: ${timestamp}`,
      `Source: ${source || 'Website'}`,
      `Receipt: ${requestId}`,
      '',
      ...Object.entries(fields).map(([k, v]) => `${k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${v}`),
    ];
    const notesText = notesLines.join('\n');

    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const contactPayload = {
      firstName,
      lastName,
      email,
      phone: phone || undefined,
      locationId,
      source: `KHG Form: ${formType.replace(/_/g, ' ')}`,
      tags: [formTag, 'website_form', `form_${timestamp.split('T')[0]}`],
    };
    Object.keys(contactPayload).forEach(k => {
      if (contactPayload[k] === undefined) delete contactPayload[k];
    });

    const contactRes = await fetch(`${GHL_API}/contacts/upsert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${pitToken}`,
        'Version': '2021-07-28',
      },
      body: JSON.stringify(contactPayload),
    });

    if (!contactRes.ok) {
      console.error('GHL contact upsert failed:', contactRes.status);
      return NextResponse.json({ error: 'We could not safely save your request. Please try again.' }, { status: 502 });
    }
    const contactData = await contactRes.json();
    const contactId = contactData?.contact?.id;
    if (!contactId) {
      console.error('GHL contact upsert returned no contact id');
      return NextResponse.json({ error: 'We could not safely save your request. Please try again.' }, { status: 502 });
    }
    const noteRes = await fetch(`${GHL_API}/contacts/${contactId}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${pitToken}`,
        'Version': '2021-07-28',
      },
      body: JSON.stringify({ body: notesText }),
    });
    if (!noteRes.ok) {
      console.error('GHL note creation failed:', noteRes.status);
      return NextResponse.json({ error: 'Your contact was saved, but the request details were not. Please try again.' }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully. Our team will be in touch.',
      receiptId: requestId,
    });
  } catch (err) {
    console.error('Form API error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function persistSubmission({ formType, name, email, phone, source, fields, requestId, timestamp }) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
    return false;
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/quote_requests?on_conflict=reference`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      Prefer: 'resolution=ignore-duplicates,return=minimal',
    },
    body: JSON.stringify({
      brand_key: 'infinity',
      name,
      email,
      phone: phone || null,
      organization: fields.business_name || fields.company || null,
      details: JSON.stringify({ formType, intent: fields.intent || 'general', fields }),
      reference: requestId,
      workflow_status: 'submitted',
      consent_at: timestamp,
      source_page: source || 'website',
      utm: {},
    }),
  });
  if (response.ok || response.status === 409) return true;
  console.error('Durable receipt persistence failed:', response.status);
  return false;
}
