alter table public.infinity_quote_requests
  add column if not exists contact_consent boolean not null default false,
  add column if not exists marketing_consent boolean not null default false;

comment on column public.infinity_quote_requests.contact_consent is
  'Explicit contact consent captured by an approved Infinity Water intake surface. Defaults false; do not infer from submission.';

comment on column public.infinity_quote_requests.marketing_consent is
  'Explicit Infinity Water marketing consent. Defaults false and remains separate from inquiry response handling.';
