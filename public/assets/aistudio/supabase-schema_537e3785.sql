-- 32 Pearls Dental Care: run in the Supabase SQL Editor as the project owner.
-- Intended for a fresh project. Rerunning preserves records and the allowlist.
-- Never run this with a public browser client or disable patient-table RLS.

begin;

-- Keep this schema OUT of the Data API's exposed schemas.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema public to anon, authenticated;

create table if not exists private.clinic_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table private.clinic_admins enable row level security;
revoke all on table private.clinic_admins from public, anon, authenticated;
comment on table private.clinic_admins is
  'Protected administrator allowlist. Only the project owner manages it through the SQL Editor. No client policies or grants.';

-- No user-supplied arguments or editable user_metadata are trusted.
-- A pinned empty search_path and fully qualified names prevent object shadowing.
create or replace function public.is_clinic_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from private.clinic_admins as administrators
    where administrators.user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_clinic_admin() from public, anon, authenticated;
grant execute on function public.is_clinic_admin() to authenticated;

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  phone text not null,
  email text,
  treatment text,
  preferred_date date,
  preferred_time text,
  message text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),

  constraint appointments_name_valid check (
    char_length(btrim(patient_name)) between 2 and 100
    and patient_name = btrim(patient_name)
    and patient_name !~ '[[:cntrl:]]'
  ),
  constraint appointments_phone_valid check (
    phone ~ '^[+][1-9][0-9]{7,14}$'
    and (phone not like '+91%' or phone ~ '^[+]91[6-9][0-9]{9}$')
  ),
  constraint appointments_email_valid check (
    email is null or (
      char_length(email) <= 254
      and email = btrim(email)
      and email ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
    )
  ),
  constraint appointments_treatment_valid check (
    treatment is null or treatment in (
      'Dental fillings', 'Root canal treatment', 'Teeth cleaning',
      'Teeth whitening', 'Dental crowns', 'Tooth extraction',
      'General dentistry', 'Preventive care', 'Not sure / other enquiry'
    )
  ),
  -- Compare to the date the record was received, not a moving current_date.
  constraint appointments_date_valid check (
    preferred_date is null or (
      preferred_date >= (created_at at time zone 'Asia/Kolkata')::date
      and preferred_date <= date '2100-12-31'
    )
  ),
  constraint appointments_time_valid check (
    preferred_time is null or preferred_time ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'
  ),
  constraint appointments_message_valid check (
    message is null or char_length(message) between 1 and 1000
  ),
  constraint appointments_status_valid check (
    status in ('pending', 'confirmed', 'completed', 'cancelled')
  )
);

comment on table public.appointments is
  'Appointment enquiries, not confirmed bookings. Contains personal contact information. Do not expose public reads.';

create index if not exists appointments_created_at_idx
  on public.appointments (created_at desc, id desc);
create index if not exists appointments_status_created_at_idx
  on public.appointments (status, created_at desc);
create index if not exists appointments_preferred_date_idx
  on public.appointments (preferred_date, created_at desc);
create index if not exists appointments_phone_idx
  on public.appointments (phone);

alter table public.appointments enable row level security;
alter table public.appointments force row level security;

-- Revoke both table-level and column-level privileges before granting the minimum.
revoke all on table public.appointments from public, anon, authenticated;
revoke all (id, patient_name, phone, email, treatment, preferred_date,
  preferred_time, message, status, created_at)
  on public.appointments from public, anon, authenticated;

drop policy if exists appointment_public_insert on public.appointments;
drop policy if exists appointment_admin_select on public.appointments;
drop policy if exists appointment_admin_update on public.appointments;

create policy appointment_public_insert
  on public.appointments
  for insert
  to anon
  with check (status = 'pending');

create policy appointment_admin_select
  on public.appointments
  for select
  to authenticated
  using ((select public.is_clinic_admin()));

create policy appointment_admin_update
  on public.appointments
  for update
  to authenticated
  using ((select public.is_clinic_admin()))
  with check ((select public.is_clinic_admin()));

-- Visitors cannot choose IDs, timestamps, or status, even by bypassing the form.
grant insert (patient_name, phone, email, treatment, preferred_date,
  preferred_time, message)
  on public.appointments to anon;

-- A signed-in account still needs allowlist membership to match either policy.
grant select on public.appointments to authenticated;
grant update (status) on public.appointments to authenticated;

-- Intentionally no DELETE grant/policy, public SELECT, or authenticated INSERT.
-- The public form uses a separate, sessionless anonymous client.
notify pgrst, 'reload schema';

commit;

-- NEXT: create an email/password user in Authentication > Users, then run this
-- separately, replacing the email. Never give patients public sign-up access.
--
-- insert into private.clinic_admins (user_id)
-- select id from auth.users
-- where lower(email) = lower('YOUR_ADMIN_EMAIL@example.com')
-- on conflict (user_id) do nothing;
--
-- Confirm that exactly the intended user is allowed:
-- select users.id, users.email
-- from private.clinic_admins as admins
-- join auth.users as users on users.id = admins.user_id;
--
-- To revoke an administrator (takes effect for new database operations):
-- delete from private.clinic_admins where user_id = 'USER_UUID_HERE';