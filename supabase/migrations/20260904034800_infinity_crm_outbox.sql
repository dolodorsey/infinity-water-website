-- INFINITY WATER ONLY
-- Durable CRM delivery queue for Infinity Water website leads.
-- This migration intentionally does not reference or modify any other brand namespace.

create table public.infinity_crm_outbox (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null unique references public.infinity_quote_requests(id) on delete cascade,
  reference text not null unique,
  location_id text not null default 'OQcKgzwCYdUYLSjZnRBE'
    check (location_id = 'OQcKgzwCYdUYLSjZnRBE'),
  idempotency_key text not null unique,
  status text not null default 'pending'
    check (status in ('pending', 'leased', 'retry', 'delivered', 'dead_letter')),
  attempts integer not null default 0 check (attempts >= 0),
  next_attempt_at timestamptz not null default now(),
  lease_token uuid,
  lease_expires_at timestamptz,
  ghl_contact_id text,
  last_error_class text,
  last_error_message text check (last_error_message is null or char_length(last_error_message) <= 2000),
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (idempotency_key = 'infinity_crm:' || reference)
);

comment on table public.infinity_crm_outbox is
  'Infinity Water-only durable CRM delivery queue. No browser read/write policy.';

create index infinity_crm_outbox_ready_idx
  on public.infinity_crm_outbox (next_attempt_at, created_at)
  where status in ('pending', 'retry');

create index infinity_crm_outbox_lease_idx
  on public.infinity_crm_outbox (lease_expires_at)
  where status = 'leased';

alter table public.infinity_crm_outbox enable row level security;

revoke all on table public.infinity_crm_outbox from public, anon, authenticated;
grant all on table public.infinity_crm_outbox to service_role;

create or replace function public.queue_infinity_crm_job()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.infinity_crm_outbox (
    lead_id,
    reference,
    location_id,
    idempotency_key
  ) values (
    new.id,
    new.reference,
    'OQcKgzwCYdUYLSjZnRBE',
    'infinity_crm:' || new.reference
  )
  on conflict (lead_id) do nothing;

  return new;
end;
$$;

revoke all on function public.queue_infinity_crm_job() from public, anon, authenticated;
grant execute on function public.queue_infinity_crm_job() to service_role;

drop trigger if exists infinity_quote_requests_queue_crm on public.infinity_quote_requests;
create trigger infinity_quote_requests_queue_crm
after insert on public.infinity_quote_requests
for each row execute function public.queue_infinity_crm_job();

-- Backfill any Infinity leads accepted before this queue existed.
insert into public.infinity_crm_outbox (
  lead_id,
  reference,
  location_id,
  idempotency_key
)
select
  id,
  reference,
  'OQcKgzwCYdUYLSjZnRBE',
  'infinity_crm:' || reference
from public.infinity_quote_requests
on conflict (lead_id) do nothing;
