create table public.infinity_quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  inquiry_type text not null,
  name text not null,
  email text not null,
  organization text,
  phone text,
  details text,
  reference text not null unique,
  workflow_status text not null default 'submitted',
  consent_at timestamptz,
  source_page text,
  utm jsonb not null default '{}'::jsonb,
  assigned_to uuid,
  internal_notes text,
  user_id uuid,
  assigned_team text not null default 'Infinity Water Sales',
  constraint infinity_quote_inquiry_type_check check (char_length(btrim(inquiry_type)) between 2 and 80),
  constraint infinity_quote_name_check check (char_length(btrim(name)) between 2 and 120),
  constraint infinity_quote_email_check check (char_length(email) between 5 and 254 and email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+[.][A-Z]{2,}$'),
  constraint infinity_quote_org_check check (organization is null or char_length(organization) <= 200),
  constraint infinity_quote_phone_check check (phone is null or char_length(phone) <= 50),
  constraint infinity_quote_details_check check (details is null or char_length(details) <= 5000),
  constraint infinity_quote_reference_check check (reference ~ '^INFINITY-[0-9]{8}-[A-Z0-9]{10}$'),
  constraint infinity_quote_workflow_check check (workflow_status in ('submitted','contacted','qualified','closed_won','closed_lost')),
  constraint infinity_quote_source_check check (source_page is null or char_length(source_page) <= 500),
  constraint infinity_quote_utm_check check (jsonb_typeof(utm) = 'object'),
  constraint infinity_quote_team_check check (assigned_team = 'Infinity Water Sales')
);

create index infinity_quote_requests_created_at_idx
  on public.infinity_quote_requests (created_at desc);
create index infinity_quote_requests_email_idx
  on public.infinity_quote_requests (lower(email));
create index infinity_quote_requests_status_idx
  on public.infinity_quote_requests (workflow_status, created_at desc);

alter table public.infinity_quote_requests enable row level security;

revoke all on table public.infinity_quote_requests from anon, authenticated;
grant insert on table public.infinity_quote_requests to anon, authenticated;
grant all on table public.infinity_quote_requests to service_role;

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
  );
