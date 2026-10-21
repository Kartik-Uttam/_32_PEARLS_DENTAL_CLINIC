-- Optional real-database smoke tests. Configure at least one admin first.
-- Run this entire file in Supabase SQL Editor AS THE PROJECT OWNER.
-- It uses synthetic data, impersonates database roles, and ROLLS BACK all writes.
-- Passing these tests does not replace end-to-end browser/Auth testing.

begin;

do $$
begin
  if not exists (select 1 from private.clinic_admins) then
    raise exception 'Set up an authorised clinic administrator before running these tests.';
  end if;
  if not (select relrowsecurity from pg_class where oid = 'public.appointments'::regclass)
    or not (select relrowsecurity from pg_class where oid = 'private.clinic_admins'::regclass) then
    raise exception 'FAIL: RLS must be enabled on both tables.';
  end if;
end;
$$;

select set_config('pearls.test_marker', 'RLS TEST ' || gen_random_uuid()::text, true);
select set_config('pearls.test_admin', (select user_id::text from private.clinic_admins limit 1), true);

set local role anon;

-- Anonymous visitors can insert valid fields without reading the row back.
insert into public.appointments (patient_name, phone, message)
values (current_setting('pearls.test_marker'), '+919000000001', 'Synthetic test only. Transaction will be rolled back.');

do $$
begin
  begin
    perform id from public.appointments limit 1;
    raise exception 'FAIL: anonymous SELECT was allowed.';
  exception when insufficient_privilege then
    raise notice 'PASS: anonymous SELECT denied.';
  end;
  begin
    update public.appointments set status = 'confirmed';
    raise exception 'FAIL: anonymous UPDATE was allowed.';
  exception when insufficient_privilege then
    raise notice 'PASS: anonymous UPDATE denied.';
  end;
  begin
    delete from public.appointments;
    raise exception 'FAIL: anonymous DELETE was allowed.';
  exception when insufficient_privilege then
    raise notice 'PASS: anonymous DELETE denied.';
  end;
  begin
    insert into public.appointments (patient_name, phone, status)
    values ('Synthetic invalid status', '+919000000001', 'confirmed');
    raise exception 'FAIL: anonymous status override was allowed.';
  exception when insufficient_privilege then
    raise notice 'PASS: anonymous status override denied by column privileges.';
  end;
  begin
    insert into public.appointments (id, patient_name, phone)
    values (gen_random_uuid(), 'Synthetic invalid ID', '+919000000001');
    raise exception 'FAIL: anonymous ID override was allowed.';
  exception when insufficient_privilege then
    raise notice 'PASS: anonymous ID override denied.';
  end;
  begin
    insert into public.appointments (patient_name, phone, created_at)
    values ('Synthetic invalid timestamp', '+919000000001', now());
    raise exception 'FAIL: anonymous timestamp override was allowed.';
  exception when insufficient_privilege then
    raise notice 'PASS: anonymous timestamp override denied.';
  end;
  begin
    insert into public.appointments (patient_name, phone) values (' ', '+919000000001');
    raise exception 'FAIL: blank patient name was allowed.';
  exception when check_violation then
    raise notice 'PASS: blank patient name rejected.';
  end;
  begin
    insert into public.appointments (patient_name, phone) values ('Synthetic invalid phone', '123');
    raise exception 'FAIL: invalid phone was allowed.';
  exception when check_violation then
    raise notice 'PASS: invalid phone rejected.';
  end;
  begin
    insert into public.appointments (patient_name, phone, treatment)
    values ('Synthetic invalid treatment', '+919000000001', 'Unapproved treatment');
    raise exception 'FAIL: arbitrary treatment value was allowed.';
  exception when check_violation then
    raise notice 'PASS: arbitrary treatment value rejected.';
  end;
  begin
    insert into public.appointments (patient_name, phone, preferred_date)
    values ('Synthetic invalid date', '+919000000001', current_date - 10);
    raise exception 'FAIL: past preferred date was allowed.';
  exception when check_violation then
    raise notice 'PASS: past preferred date rejected.';
  end;
end;
$$;

reset role;
select set_config('pearls.test_id', (select id::text from public.appointments where patient_name = current_setting('pearls.test_marker')), true);
do $$
begin
  if current_setting('pearls.test_id', true) is null or current_setting('pearls.test_id', true) = '' then
    raise exception 'FAIL: valid anonymous insert did not persist within the transaction.';
  end if;
  if (select status from public.appointments where id = current_setting('pearls.test_id')::uuid) <> 'pending' then
    raise exception 'FAIL: anonymous insert did not receive pending status.';
  end if;
  raise notice 'PASS: valid anonymous insert saved with generated ID and pending status.';
end;
$$;

-- Simulate an authenticated identity that is NOT on the allowlist.
select set_config('request.jwt.claim.sub', gen_random_uuid()::text, true);
select set_config('request.jwt.claims', json_build_object('sub', current_setting('request.jwt.claim.sub'), 'role', 'authenticated')::text, true);
set local role authenticated;

do $$
declare
  affected integer;
begin
  if public.is_clinic_admin() then raise exception 'FAIL: non-admin granted administrator membership.'; end if;
  if exists (select 1 from public.appointments) then raise exception 'FAIL: non-admin can read patient records.'; end if;
  update public.appointments set status = 'confirmed' where id = current_setting('pearls.test_id')::uuid;
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'FAIL: non-admin updated a record.'; end if;
  raise notice 'PASS: authenticated non-admin sees no records and cannot update them.';
  begin
    insert into private.clinic_admins (user_id) values (auth.uid());
    raise exception 'FAIL: user could add themselves to the allowlist.';
  exception when insufficient_privilege then
    raise notice 'PASS: client cannot modify the administrator allowlist.';
  end;
  begin
    delete from public.appointments where id = current_setting('pearls.test_id')::uuid;
    raise exception 'FAIL: non-admin DELETE was allowed.';
  exception when insufficient_privilege then
    raise notice 'PASS: authenticated DELETE denied.';
  end;
end;
$$;

reset role;
select set_config('request.jwt.claim.sub', current_setting('pearls.test_admin'), true);
select set_config('request.jwt.claims', json_build_object('sub', current_setting('pearls.test_admin'), 'role', 'authenticated')::text, true);
set local role authenticated;

do $$
declare
  affected integer;
begin
  if not public.is_clinic_admin() then raise exception 'FAIL: allowlisted admin not recognised.'; end if;
  if not exists (select 1 from public.appointments where id = current_setting('pearls.test_id')::uuid) then
    raise exception 'FAIL: admin cannot read the synthetic enquiry.';
  end if;
  update public.appointments set status = 'confirmed' where id = current_setting('pearls.test_id')::uuid;
  get diagnostics affected = row_count;
  if affected <> 1 then raise exception 'FAIL: admin update did not affect exactly one record.'; end if;
  if (select status from public.appointments where id = current_setting('pearls.test_id')::uuid) <> 'confirmed' then
    raise exception 'FAIL: status update was not saved.';
  end if;
  raise notice 'PASS: allowlisted admin can read and update status.';
  begin
    update public.appointments set patient_name = 'Changed name' where id = current_setting('pearls.test_id')::uuid;
    raise exception 'FAIL: admin changed a protected patient field.';
  exception when insufficient_privilege then
    raise notice 'PASS: admin browser updates are limited to status.';
  end;
  begin
    update public.appointments set status = 'invalid' where id = current_setting('pearls.test_id')::uuid;
    raise exception 'FAIL: invalid status was allowed.';
  exception when check_violation then
    raise notice 'PASS: invalid status rejected.';
  end;
  begin
    delete from public.appointments where id = current_setting('pearls.test_id')::uuid;
    raise exception 'FAIL: admin browser DELETE was allowed.';
  exception when insufficient_privilege then
    raise notice 'PASS: admin browser DELETE intentionally disabled.';
  end;
end;
$$;

reset role;
rollback;
-- All synthetic data and test changes have been discarded.