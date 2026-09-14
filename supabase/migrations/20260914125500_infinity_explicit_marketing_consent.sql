drop policy if exists "Infinity public quote submissions" on public.infinity_quote_requests;

create policy "Infinity public quote submissions"
  on public.infinity_quote_requests
  for insert
  to anon, authenticated
  with check (
    workflow_status = 'submitted'
    and assigned_to is null
    and internal_notes is null
    and user_id is null
    and assigned_team = 'Infinity Water Sales'
    and reference ~ '^INFINITY-[0-9]{8}-[A-Z0-9]{10}$'
    and char_length(btrim(inquiry_type)) between 2 and 80
    and char_length(btrim(name)) between 2 and 120
    and char_length(email) between 5 and 254
    and email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+[.][A-Z]{2,}$'
    and (organization is null or char_length(organization) <= 200)
    and (phone is null or char_length(phone) <= 50)
    and (details is null or char_length(details) <= 5000)
    and (source_page is null or char_length(source_page) <= 500)
    and jsonb_typeof(utm) = 'object'
    and (
      (
        inquiry_type = 'email_updates'
        and contact_consent is true
        and marketing_consent is true
        and consent_at is not null
        and consent_at >= now() - interval '10 minutes'
        and consent_at <= now() + interval '1 minute'
        and source_page = 'Infinity Water website conversion layer'
      )
      or
      (
        inquiry_type <> 'email_updates'
        and contact_consent is false
        and marketing_consent is false
        and consent_at is null
      )
    )
  );
