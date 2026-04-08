import { NextResponse } from 'next/server';

/**
 * POST /api/forms
 * Universal KHG Form Submission Handler
 * Upserts contact into GHL via PIT token, adds notes, logs to Supabase
 * Env vars required: GHL_PIT_TOKEN, GHL_LOCATION_ID, NEXT_PUBLIC_BRAND_KEY
 */

const GHL_API = 'https://services.leadconnectorhq.com';

export async function POST(request) {
  try {
    const body = await request.json();
    const { formType, name, email, phone, source, fields = {} } = body;

    if (!formType || !name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: formType, name, email' },
        { status: 400 }
      );
    }

    const pitToken = process.env.GHL_PIT_TOKEN;
    const locationId = process.env.GHL_LOCATION_ID;

    if (!pitToken || !locationId) {
      console.error('Missing GHL_PIT_TOKEN or GHL_LOCATION_ID');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const formTag = `form_${formType}`;
    const timestamp = new Date().toISOString();
    const notesLines = [
      `=== ${formType.toUpperCase().replace(/_/g, ' ')} SUBMISSION ===`,
      `Submitted: ${timestamp}`,
      `Source: ${source || 'Website'}`,
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

    let contactId = null;
    if (contactRes.ok) {
      const contactData = await contactRes.json();
      contactId = contactData?.contact?.id;

      if (contactId) {
        try {
          await fetch(`${GHL_API}/contacts/${contactId}/notes`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${pitToken}`,
              'Version': '2021-07-28',
            },
            body: JSON.stringify({ body: notesText }),
          });
        } catch (noteErr) {
          console.error('Failed to add note:', noteErr);
        }
      }
    } else {
      console.error('GHL contact upsert failed:', contactRes.status);
    }

    // Log to Supabase (fire and forget)
    logSubmission(formType, email, locationId, contactId).catch(() => {});

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully. Our team will be in touch.',
      contactId,
    });
  } catch (err) {
    console.error('Form API error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function logSubmission(formType, email, locationId, contactId) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !supabaseKey) return;

  await fetch(`${supabaseUrl}/rest/v1/form_submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      form_type: formType,
      email,
      location_id: locationId,
      ghl_contact_id: contactId,
      brand_key: process.env.NEXT_PUBLIC_BRAND_KEY,
      submitted_at: new Date().toISOString(),
    }),
  });
}
