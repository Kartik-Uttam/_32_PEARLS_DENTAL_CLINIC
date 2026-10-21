# 32 Pearls Dental Care

A responsive, static-hosted clinic website with real Supabase appointment enquiries and a protected clinic workspace. No React, Node.js, Express, package installation, build step, or custom backend is required.

## Files

- `index.html`: the complete application, with labelled inline CSS and vanilla JavaScript, the clinic website, booking workflow, and admin dashboard.
- `admin.html`: the separate administrator entry URL. It opens `index.html#admin`, where the shared application checks Supabase Auth and administrator authorisation before fetching any records. The redirect is not a security boundary; RLS is.
- `supabase-config.js`: the only project-specific browser configuration file.
- `supabase-schema.sql`: database tables, constraints, indexes, least-privilege grants, administrator allowlist, and RLS policies.
- `supabase-security-tests.sql`: optional transactional database permission tests, using synthetic data and a final rollback.
- `_headers`: Netlify security and cache headers.
- `vercel.json`: equivalent static-hosting configuration for Vercel.

Application styles and behaviour are intentionally kept inside the single `index.html` rather than duplicated in `style.css`, `script.js`, `admin.css`, or `admin.js`. Search for `Admin UI`, `DOMContentLoaded`, or a named function to find the relevant section. Configuration and SQL remain separate.

## What Is Ready

- Sticky navigation, accessible mobile menu, full-width photographic hero, responsive layouts, scroll reveals, hover transitions, interactive treatment details, FAQ accordion, review-information carousel with pause controls, and WhatsApp links.
- Appointment form with matching client/database validation, phone normalisation, consent, click protection, loading feedback, errors, and database-confirmed success only.
- A sessionless public Supabase client for anonymous inserts. It never requests inserted patient data back.
- Email/password admin login; protected allowlist authorisation; all-time counts; server-side name/phone search; status/preferred-date filters; pagination; enquiry details; and status updates with concurrent-edit protection.
- Database policies, not just hidden UI, protect all patient reads and updates. Browser deletion is deliberately unavailable. A cancellation status change asks for confirmation.
- Administrator sessions are kept in tab-scoped `sessionStorage`, not `localStorage`; patient enquiries are never stored in browser persistence. The workspace locks after 15 minutes of inactivity and clears displayed records on logout/navigation away.
- Status changes do not send emails, SMS, WhatsApp messages, or automatic confirmations. Clinic staff must contact the patient separately.

## 1. Create a Supabase Project

1. Open https://supabase.com/dashboard and create a project in the clinic's organisation.
2. Use a strong database password and keep it private. Choose an appropriate region after the clinic reviews its data-handling requirements.
3. Wait for the database and Auth services to become available.
4. Keep the Data API enabled. Its exposed schemas must include `public` and must **not** include `private`.
5. Use a fresh project or review any existing grants, functions, and policies before installing this schema. Existing permissive policies from another application must not be left on the appointments table.

## 2. Find the Public Connection Details

1. In the project's **Connect** dialog, find the project URL and the **publishable** key. They are also available in the project's API settings/API Keys area.
2. The URL normally looks like `https://PROJECT_REF.supabase.co`.
3. A current publishable key starts with `sb_publishable_`. A legacy `anon` key also works.
4. Never copy a `sb_secret_...` key, a `service_role` key, a database password, or an admin password into this project.

## 3. Install the Schema and Policies

1. Open the Supabase **SQL Editor** as the project owner.
2. Paste all of `supabase-schema.sql` and run it.
3. Confirm that `public.appointments` exists and RLS is enabled. RLS must also be enabled on `private.clinic_admins`.
4. The public website is allowed to insert only the seven patient-facing fields. The database generates the ID, `pending` status, and timestamp.
5. Anonymous users have no select, update, or delete privilege. Authenticated users can read/update only if the protected allowlist contains their Auth user ID; updates are restricted to `status`.
6. The script may be rerun to restore its named policies/grants without deleting enquiries or administrators. It is not a migration system for arbitrary pre-existing table structures. Review future schema changes before applying them.

There is no `clinic_settings` table because no variable clinic settings or confirmed hours were supplied. The provided contact information is explicit page content; unconfirmed opening hours are not invented.

## 4. Create and Authorise the Clinic Administrator

Authentication and authorisation are two different setup steps. A successful email/password login alone does not grant access.

1. In **Authentication > Providers / Sign In**, enable the email/password provider.
2. Disable **Allow new users to sign up** in the Auth user-signup settings. The public booking form does not need an Auth user or anonymous Auth sign-in.
3. In **Authentication > Users > Add user**, choose **Create new user**, not an invitation flow. Enter the intended administrator email and a unique strong password. Confirm/auto-confirm that user using the dashboard. This implementation does not provide invite-link, password-recovery-link, or public signup screens.
4. In the SQL Editor, run the following, replacing the placeholder with that exact user's email:

```sql
insert into private.clinic_admins (user_id)
select id from auth.users
where lower(email) = lower('YOUR_ADMIN_EMAIL@example.com')
on conflict (user_id) do nothing;
```

5. Verify that the intended account, and no unintended accounts, appears:

```sql
select users.id, users.email
from private.clinic_admins as admins
join auth.users as users on users.id = admins.user_id;
```

6. To revoke administrator permission, delete that user's allowlist row through the SQL Editor. New database requests will be denied even if their Auth session has not yet expired:

```sql
delete from private.clinic_admins
where user_id = 'ACTUAL_AUTH_USER_UUID';
```

7. Do not create a public role picker or trust `user_metadata` for permissions. Do not grant browser clients access to the `private` schema or allowlist.
8. Handle administrator account recovery, password changes, access reviews, and user removal through the clinic owner's Supabase administration process. Use strong unique passwords and protect the Supabase owner account with MFA. Requiring MFA inside the clinic app would need an additional enrollment/challenge UI and matching database policies; this app currently implements password authentication as requested.

## 5. Add the Public Configuration

Edit only the two values in `supabase-config.js`:

```js
window.CLINIC_SUPABASE_CONFIG = Object.freeze({
  SUPABASE_URL: 'https://YOUR_PROJECT_REF.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'YOUR_SUPABASE_PUBLISHABLE_KEY'
});
```

Replace the placeholders with the actual project URL and publishable key. These two values are intended to be visible in the browser; database grants and RLS provide the security. The code also rejects identifiable secret/service-role keys, but that guardrail cannot make an exposed secret safe. Rotate any accidentally exposed secret immediately.

This is a static site. Netlify/Vercel environment variables do not automatically replace JavaScript file contents. There is deliberately no build-time substitution or server secret here. Use the appropriate public configuration file for each deployment environment.

## 6. Preview and Test a Patient Request

1. Use your editor's static preview/Live Server extension, or deploy a preview to Netlify/Vercel. Open an HTTP/HTTPS URL, not a `file://` URL. No Node.js server is needed.
2. Load the website and check the browser console/network panel for blocked CDN scripts or configuration errors.
3. Test an empty name, a short/invalid phone number, an invalid optional email, a past date, and unchecked consent. These should prevent submission.
4. Use synthetic contact details for testing, not a real patient's information. A ten-digit Indian mobile number is normalised to `+91...`; international numbers require their country code. Indian mobile numbers must start with 6, 7, 8, or 9.
5. Leave optional preferences blank, or choose a future date and a time. No opening hours or time-slot availability are implied.
6. Submit once. The button becomes disabled while the request is in progress. Success appears only after Supabase returns a successful insert response.
7. The success state says the request is not yet a confirmed appointment. A 30-second UI cooldown discourages accidental repeated requests.
8. Disconnect the network or use an invalid public project URL and test again. There must be no success state. For ambiguous network failures, the message warns that the enquiry may have arrived and asks the patient to contact the clinic before retrying.
9. With the placeholder configuration, the form clearly reports that online requests are not connected and no request was sent. There is no fake-success fallback, demo data, or localStorage database.

## 7. Verify Persistence in Supabase

1. In the Supabase Table Editor, open `appointments` using the owner's dashboard access.
2. Find the synthetic request. Verify the generated UUID, normalised phone, server timestamp, supplied optional values, and `pending` status.
3. Refresh the website and the Table Editor. The record remains in PostgreSQL.
4. Open the deployed site on another device and sign in as an authorised administrator. The same records should load from Supabase, not from browser storage.

The public form never lists previously submitted enquiries and never chains `.select()` onto its insert. This is intentional.

## 8. Verify Anonymous and Non-Admin Restrictions

Run the following in the browser console on the deployed website. Use only the public project configuration:

```js
const visitor = supabase.createClient(
  CLINIC_SUPABASE_CONFIG.SUPABASE_URL,
  CLINIC_SUPABASE_CONFIG.SUPABASE_PUBLISHABLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storageKey: 'permission-test' } }
);
const readTest = await visitor.from('appointments').select('*');
console.log(readTest.error); // Expected: permission denied. No patient data.
```

Also verify these scenarios:

- An anonymous insert that explicitly supplies `status`, even `pending`, must fail because that column is not granted for public insertion.
- An anonymous insert supplying `id` or `created_at` must fail.
- Anonymous updates/deletes must fail.
- Direct anonymous calls to `is_clinic_admin` must fail.
- A valid Auth account that is not on the allowlist must not see patient data. The admin page refuses entry; direct authenticated selects return no rows under RLS, and updates match no rows.
- A browser client must not be able to add itself to `private.clinic_admins`.
- Allowlisted administrators can update status, but cannot edit patient data fields or delete records through the browser API.

For repeatable database assertions, paste **all** of `supabase-security-tests.sql` into the SQL Editor after creating an administrator. It checks RLS, valid public inserts, generated/pending fields, denied public reads/updates/deletes/field overrides, invalid input, non-admin isolation, allowlist protection, admin status updates, and protected-column restrictions. It impersonates database roles and ends in `rollback`, so synthetic data and test updates do not remain. Review its notices/errors. These SQL tests do not test email/password authentication; test that separately in the browser.

## 9. Use the Admin Dashboard

1. Open `/admin.html` or select **Clinic Admin** in the footer.
2. Sign in with the manually created, allowlisted email/password account.
3. The app checks the current Auth user with Supabase and calls the protected `is_clinic_admin` RPC before requesting appointments.
4. Confirm that all-time counts and the enquiry table load. There is no sample-data fallback.
5. Search by patient name or phone. Search and filtering run against Supabase; pagination requests 15 records at a time.
6. Use **Status** and **Preferred date** to filter requests. The date filter applies to the patient's preferred date, not the received date. Received timestamps and requested times are displayed using Bengaluru/IST conventions.
7. Select **View** to read optional email, message, preferences, and the enquiry reference. Patient text is rendered with `textContent`, not HTML.
8. Change the status dropdown. The update is saved to PostgreSQL before reloading the table. If another staff member already changed the same record, the update does not silently overwrite their status.
9. Confirm cancellation when prompted. The status change does not itself notify a patient or book a calendar slot. Contact the patient separately.
10. Test **Clear filters**, **Refresh**, **Previous/Next**, empty results, offline error handling, logout, and a non-allowlisted test login.
11. Sign out when finished. Test that records disappear and are not restored by the browser Back button without a new authorisation check.

Browser deletion is intentionally omitted. For retention-related removal, the clinic owner must review and delete the appropriate record in the Supabase dashboard/SQL Editor after verifying the request and any applicable retention obligations. Do not grant blanket browser DELETE access just to implement a cleanup button.

## 10. Deploy With HTTPS

### Netlify

1. Commit the static project files to a repository, or use Netlify's manual drag-and-drop deployment.
2. For a repository import, leave **Build command** empty and set **Publish directory** to the project root (`.`). No framework preset or Node build is needed.
3. Include `index.html`, `admin.html`, `supabase-config.js`, and `_headers`. The SQL/readme files are documentation and contain no live secrets, but may be kept outside the publish directory if you prepare a smaller deployment folder.
4. Netlify supplies an HTTPS URL. Add your custom domain and enable HTTPS if needed.
5. In Supabase Auth URL configuration, set **Site URL** to the production HTTPS origin. Set allowed redirect URLs deliberately if you later add recovery/invitation/OAuth flows. Password sign-in in this app does not depend on redirects.
6. Test the form, `/admin.html`, login, permissions, status persistence, and mobile navigation on the production URL.

### Vercel

1. Import the repository into Vercel.
2. Select **Other** as the framework, leave build/install commands empty/disabled, and use the project root as the static output directory.
3. Include `vercel.json` so the response headers are applied. No serverless Node.js functions are required.
4. Deploy, use the provided HTTPS URL, and configure your domain if needed.
5. Set the production Site URL in Supabase Auth and repeat the same end-to-end tests on the deployed origin.

Security headers include `nosniff`, anti-framing, a restrictive device Permissions Policy, and suitable cache handling. A strict CSP requires hashes/nonces for inline code plus rules for Tailwind's runtime, Google Fonts, photography, the Supabase project origin, and the Google Maps frame; it is not falsely advertised as configured. All third-party resources are loaded over HTTPS. The Supabase client uses its official browser-compatible UMD distribution, pinned to version 2.117.3; Tailwind is loaded from the required browser CDN. Review dependency updates before changing the pinned version and rerun the browser/security checks after upgrading.

## Before Accepting Real Patient Enquiries

- Have the clinic confirm all eight treatment categories and the wording before publication. Update the page, select options, treatment descriptions, and SQL treatment constraint together if the list changes.
- Verify the supplied address, phone, 4.9/5 rating, and 154-review count. The Google links use an honest name/address search; the clinic should verify the matched listing and supply a verified Place ID if it wants a direct listing/reviews link.
- Replace representative stock photographs with approved actual clinic photography when available. Current imagery is explicitly labelled illustrative, including in its alternative text. Do not present stock people or facilities as the actual team, patients, or clinic.
- No actual patient quotes were supplied, so the animated review section only presents the supplied rating/review count and links to Google. It does not invent testimonials, qualifications, certifications, prices, hours, or medical outcomes.
- Agree a clinic-owned retention/deletion policy, access-review process, and appropriate privacy notice before going live. The included privacy summary is operational information, not a certification of legal compliance. Review relevant Indian data-protection and medical-record obligations with a qualified adviser.
- Public appointment inserts are intentionally permitted. The honeypot, validation, loading lock, and cooldown are not server-enforced spam prevention. If abuse protection is needed, add a Supabase Edge Function that verifies CAPTCHA/Turnstile and rate limits requests, then revoke direct public table inserts and route the form through that verified endpoint. A CAPTCHA rendered only in the browser is not sufficient. That extra service is not silently assumed to exist here.
- Consider the Supabase project plan's backup, availability, quotas, logs, and retention settings. RLS protects database access, not the availability of external services or a compromised administrator device.
- Do not collect payment information, files, health records, or identification documents through this enquiry form.
- Do not claim that a submitted request is a confirmed visit, or that changing a status automatically contacted the patient.

## Accessibility and Browser Checks

Test at 320px, 375px, 768px, 1024px, and desktop widths. Check keyboard navigation, visible focus, native modal Escape/focus behaviour, form labels/errors, the FAQ's expanded states, mobile menu, and reduced-motion settings. The review carousel pauses for keyboard focus/hover and has explicit pause controls; reduced motion disables automatic cycling by default. The Google Maps iframe has a title and an external directions alternative.

Use current Chrome, Edge, Firefox, or Safari. The app uses native `<dialog>`, `inert`, modern CSS, Unicode-aware search sanitisation, IntersectionObserver, and Intl time-zone formatting. If the photography, map, or CDN is blocked by network policy, call and WhatsApp links remain alternatives; online operations fail honestly when their dependencies cannot load.

## Verification Status

The implementation and SQL have been statically reviewed. No Supabase project credentials or live database were provided, and this coding environment does not provide a browser or SQL execution runtime. Consequently, real inserts, Auth sessions, RLS assertions, visual/browser checks, and deployment have **not** been executed here. Run the provided setup, database smoke tests, and browser checklist before accepting live patient data. Nothing in the UI reports a successful booking merely because the form validated.

## Excel export and WhatsApp buttons

These additions are in the administrator workspace only. The public website, booking form, database schema, RLS policies, and grants are unchanged. You do not need to rerun either SQL file for these features.

### Export to Excel

1. Sign in as an authorised clinic administrator. Set the existing search, status, and preferred-date filters, or clear them to export all enquiries.
2. Select **Export to Excel**. The app captures the filters at that moment and fetches every matching enquiry from Supabase in batches of up to 500, not just the 15 visible rows. It continues even if the project's API row limit returns smaller batches.
3. Wait for the loading/progress message. A failed batch or failed administrator-permission check stops the export without downloading a partial file. Logging out, locking the workspace, or leaving the admin workspace cancels the export.
4. The normal download is a real `appointments-YYYY-MM-DD.xlsx` workbook. The filename date and received date/time tags use `Asia/Kolkata`. Received Date is `DD/MM/YYYY`; Received Time is `hh:mm AM/PM`. Preferred dates use `DD/MM/YYYY`, preferred times use `hh:mm AM/PM` in IST, and unspecified optional values are blank.
5. Columns are: Received Date, Received Time, Patient Name, Phone, Email, Treatment, Preferred Date, Preferred Time, Message, Status, Enquiry ID.
6. SheetJS is loaded on demand over HTTPS from `https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js`, pinned to **0.18.5** with the cdnjs-published SHA-512 integrity hash. No spreadsheet files are imported or parsed. This is the older release available on cdnjs, not a claim that it is the latest SheetJS release; review upstream security advisories before enabling additional SheetJS capabilities or changing versions.
7. If the library cannot load within 12 seconds, or workbook generation is unavailable, the app explicitly reports a fallback to `appointments-YYYY-MM-DD.csv`. CSV uses UTF-8 with a BOM, quoted fields, escaped double quotes, and CRLF record separators for Excel compatibility. A result beyond Excel's worksheet row limit also falls back to CSV rather than truncating records.
8. Formula-like values beginning with `=`, `+`, `-`, or `@`, including after leading whitespace/control characters, are prefixed with an apostrophe. This includes `+91...` phone numbers. The XLSX cells are text, not formulas. The protection changes only the exported representation, not the database record. Do not remove the prefixes and execute content from an untrusted patient message as formulas.
9. A **Download requested** message means the browser was asked to download a fully generated file. Check your browser's download location or permissions; the app cannot verify that the operating system saved the file.

Exports capture the newest matching server timestamp before batching, exclude records newer than that boundary, and are sorted newest first. This avoids relying on the browser's clock to decide which existing enquiries to fetch. The captured export filters are not changed if you edit the on-screen controls during the export. Multiple batch queries are not a single transactional database snapshot: concurrent status changes or owner-side deletion can change the matching set while it is being fetched. Avoid concurrent editing if you need a consistent administrative report.

Downloaded spreadsheets contain patient contact information. Store them only on clinic-approved devices, avoid shared Downloads folders, and apply the clinic's retention/deletion policy. Signing out cannot revoke a file that has already been downloaded.

### Configure the doctor's WhatsApp number

1. Keep the existing Supabase URL and publishable key. In `supabase-config.js`, replace only the new `CLINIC_WHATSAPP_NUMBER` placeholder with the doctor/owner's intended WhatsApp destination, using **digits only, including the country code**, with no `+`, spaces, punctuation, or leading international access prefix. An Indian destination has the shape `919XXXXXXXXX`; replace the X characters with the actual digits.
2. This option is a public contact setting, not an authentication credential. Do not put any WhatsApp Business API token, webhook secret, service-role key, or other secret in this file.
3. Deploy the updated file and reload the admin workspace. If the setting is missing, invalid, or still a placeholder, **Send on WhatsApp** is hidden and the dashboard says **WhatsApp number not configured**. **Message patient** can still be used with a valid patient number.
4. In a table row or the **View** details dialog, choose **Send on WhatsApp** to open a draft addressed to the configured doctor/owner. The draft includes patient name, phone, treatment, preferred date/time, message, received date/time tagged IST, status, and enquiry ID. **Refresh** first if another staff member may have updated the record.
5. Choose **Message patient** to open a draft addressed to that patient's normalised phone number. The polite acknowledgement says the request was received and the clinic will confirm an available date/time; it does not claim a confirmed appointment. Review whether the draft is appropriate for the record's current status before sending.
6. Both actions open `https://wa.me/...` in a new tab/app with URL-encoded draft text. Staff must verify the recipient, review the text, and tap **Send**. The website does not automatically send WhatsApp messages, verify a WhatsApp account exists, or record delivery/read receipts.

Only share enquiry details with the intended authorised doctor/owner. Opening a WhatsApp link puts its draft in a third-party URL/app and potentially browser history. Obtain any consent required by the clinic's privacy process. Keep staff devices and WhatsApp accounts protected.

### Pending-request indicator

While an authorised workspace is unlocked and the tab is visible, the app checks the all-clinic **pending** count about every 60 seconds, independently of table filters. It does not fetch patient details for this indicator. A count increase since the last successful table refresh displays **N new pending requests** with **Refresh enquiries**. A count decrease also offers a refresh. Failed checks show an error, not a made-up new-request count.

This is a net-count indicator, not an exact list of unseen enquiry IDs. Simultaneous arrivals/status changes can cancel each other out, and moving an older enquiry back to pending also raises the count. Use **Refresh enquiries** to load current records; your existing filters remain active. Polling pauses and aborts its in-flight query while the tab is hidden, resumes with a check when visible, and stops on logout/lock/navigation away. Background checks do not reset the existing 15-minute inactivity timer. No patient data or indicator history is stored in `localStorage`.

## Automatic Google Sheet rows with Make.com (optional)

This is an optional, clinic-configured **Supabase Database Webhook -> Make -> Google Sheets** integration. It does not run in the browser or require changes to the supplied SQL policies. Do not post patient information to a public Make webhook directly from `index.html` or expose the webhook URL/shared secret in frontend code.

**Patient-data warning:** The Google Sheet, Make scenario, webhook queue/execution logs, and any alerts can contain patient data. The Google and Make accounts must be owned by the clinic, protected with MFA where available, and shared only with authorised staff. Disable public/link sharing. Review provider terms, processing locations, permissions, log retention, and the clinic's privacy obligations before activating it. RLS cannot protect copies already sent to Google, Make, or WhatsApp.

### Create the sheet and Make webhook

1. In the clinic-owned Google account, create a spreadsheet and an `Appointments` tab. Put these exact headings, in order, in row 1, columns A through K:

```text
Received Date | Received Time | Patient Name | Phone | Email | Treatment | Preferred Date | Preferred Time | Message | Status | Enquiry ID
```

2. Put each heading in its own cell, not the entire line in one cell. Set the sheet's timezone to `Asia/Kolkata` and its locale appropriately. Format patient/contact/message/reference columns as **Plain text**; keeping all eleven columns as text also preserves the explicit date/time strings.
3. In the clinic-owned Make account, create a new scenario. Add **Webhooks > Custom webhook**, choose **Add**, and give it a clinic-specific name. Copy the generated HTTPS URL into a private clinic setup note, not into the repository.
4. Open the webhook's **Advanced settings**, set **Get request headers** to **Yes**, and leave **JSON pass-through** off so JSON fields are available for mapping. Enable **Get request HTTP method** if you also want to filter for POST. Do not connect a Google Sheets write module until the secret filter below is in place.
5. Use a password manager to generate a separate, long random shared secret, for example at least 32 random bytes/64 hexadecimal characters. Keep its actual value only in the private Supabase webhook configuration and the Make filter. It is **not** your Supabase publishable key, secret key, service-role key, or database password.

### Create the Supabase INSERT-only Database Webhook

1. In the clinic owner's Supabase dashboard, open **Integrations > Database Webhooks** (some dashboard versions list this under Database). Enable Database Webhooks/`pg_net` if prompted, then create a new **Database Webhook**, not an Auth Hook or a platform-management webhook.
2. Select schema `public`, table `appointments`, and event **INSERT only**. Leave **UPDATE** and **DELETE** unchecked. This optional webhook adds an asynchronous database trigger; it does not require disabling RLS or changing any client grant.
3. Select **HTTP Request**, method **POST**, and paste the private Make HTTPS webhook URL. Add `Content-Type: application/json` and a custom header named `x-clinic-webhook-secret` whose value is the random secret from the previous step. Do not use the dashboard's **Add auth header with service key** shortcut: Make does not need Supabase credentials.
4. Save the webhook. Use **Run once** in Make and submit a clearly fake booking through the existing public form, with synthetic optional values so all fields are detected. Verify the synthetic row exists in Supabase before expecting a webhook. The received JSON has top-level `type: "INSERT"`, `schema: "public"`, `table: "appointments"`, `record: {...}`, and `old_record: null`. The patient fields are inside **record**, not top-level fields.
5. In Make, inspect the captured webhook bundle. If a field or request header is missing, use **Detect new values/Redetermine data structure**, ensure **Get request headers** is still on, and send another synthetic insert. Do not use real patient information to discover field mappings.

### Verify the secret before writing any row

1. Add a filter on the route immediately after **Custom webhook**, before any Google Sheets module or alert module.
2. Require that the incoming `x-clinic-webhook-secret` header exists and is **exactly equal** to the non-empty random shared secret you configured in Supabase. Select the actual request-header token from the captured bundle. When Make exposes headers as a Name/Value array, the following expression extracts its first matching value; replace module `1` if your webhook has a different module number:

```text
{{first(map(1.`__IMTHEADERS__`; "value"; "name"; "x-clinic-webhook-secret"))}}
```

3. In that same filter, add **AND** conditions: `type` equals `INSERT`, `schema` equals `public`, `table` equals `appointments`, and `record.id` exists/is not empty. If you enabled HTTP method extraction, require `POST` as well. Do not use the secret in a URL query string, and do not allow missing/blank header values to match a blank stored secret.
4. If Make offers **API Key authentication** on Custom webhooks, you may additionally enable it and configure its distinct `x-make-apikey` header in Supabase for early request rejection. That reserved header is sanitised from Make's mapped output; use `x-clinic-webhook-secret` for the explicit filter described above. Keep all actual values private and rotate them if exposed.
5. Test a synthetic webhook call with the custom header omitted, then with the wrong value. Neither may reach the Google Sheets/alert modules. A filter prevents downstream processing; by itself it does not prevent invalid requests appearing in Make's webhook queue/logs or change the default HTTP Accepted response. Review who can view scenario settings/logs, which can contain the custom-header secret.

### Map the Google Sheets row

1. After the filter, add **Google Sheets > Add a Row**. Connect the clinic-owned Google account and select the spreadsheet and `Appointments` tab. Set **Table contains headers** to Yes, select columns A:K as needed, and set **Value input option** to **Raw**, not User entered. Raw preserves phone/reference text and prevents patient input such as `=1+1` being evaluated as a formula in the sheet.
2. Map fields using the following table. `1` means the Custom webhook module. Insert the actual Make mapping tokens rather than typing `record.patient_name` as literal text. Use empty values for null optional fields.

| Google Sheet Column | Make Mapping |
| --- | --- |
| Received Date | `formatDate(1.record.created_at; "DD/MM/YYYY"; "Asia/Kolkata")` |
| Received Time | `formatDate(1.record.created_at; "hh:mm A"; "Asia/Kolkata")` |
| Patient Name | `1.record.patient_name` |
| Phone | `1.record.phone` |
| Email | `1.record.email` |
| Treatment | `1.record.treatment` |
| Preferred Date | `1.record.preferred_date` (date-only `YYYY-MM-DD`, or explicitly format as `DD/MM/YYYY`) |
| Preferred Time | `1.record.preferred_time` (IST preference, typically `HH:mm`) |
| Message | `1.record.message` |
| Status | `1.record.status` |
| Enquiry ID | `1.record.id` |

3. `record.created_at` is an ISO-8601 timestamp with a timezone offset. Make normally coerces that ISO value into a date for `formatDate`. If your captured field is treated as text and fails, use `parseDate` with a format matching that actual ISO timestamp, including its fractional seconds and offset, before `formatDate`; do not discard the `Z`/offset or reinterpret the UTC clock as IST. For an example value `2026-01-15T04:30:00.123+00:00`, this is `formatDate(parseDate(1.record.created_at; "YYYY-MM-DDTHH:mm:ss.SSSZ"); "hh:mm A"; "Asia/Kolkata")`. That example must produce **15/01/2026** and **10:00 AM** for the two received columns.
4. If you want Preferred Date/Time to match the downloadable workbook exactly, format a non-empty date with `formatDate(parseDate(1.record.preferred_date; "YYYY-MM-DD"; "Asia/Kolkata"); "DD/MM/YYYY"; "Asia/Kolkata")` and a non-empty time with `formatDate(parseDate(1.record.preferred_time; "HH:mm"; "Asia/Kolkata"); "hh:mm A"; "Asia/Kolkata")`. Guard both optional fields with `ifempty`/a conditional so blanks do not cause parsing errors. These are requested preferences, not a confirmed booking or an available calendar slot.
5. For workflows that later export the Google Sheet as CSV, additionally neutralise formula-leading `=`, `+`, `-`, and `@` in exported patient strings with an apostrophe, as the website does. Raw input protects the sheet write; it does not guarantee every future external spreadsheet import is safe.

### Test and activate

1. Use **Run once** in Make and submit another fake enquiry through the existing form. Confirm exactly one corresponding Supabase record and one Google Sheet row, with the same enquiry ID, correct IST received tags, and optional fields. Verify that an acknowledgement is never presented as an appointment confirmation.
2. Test the missing/wrong-secret cases again after adding the sheet module: no row or alert should be created. Verify that updating an existing status in the admin dashboard does **not** append a new row, because the webhook listens to INSERT only.
3. Consider duplicate delivery/replays before activation. For stronger duplicate protection, enable **sequential processing** in the Make scenario, add **Google Sheets > Search Rows** for `record.id` in the Enquiry ID column before **Add a Row**, enable continuation when no results are found if that setting is present, and add a filter allowing the add only when no matching row is found. Test the same synthetic ID twice. A simple append module alone is not an exactly-once guarantee; reconcile by enquiry ID and review partial-run retries.
4. Save and turn on the scenario's instant/as-data-arrives execution. Monitor Make's execution history/errors/credit limits and Supabase webhook/`pg_net` responses. An HTTP Accepted response is not proof that Google Sheets wrote a row. A failed downstream delivery does not roll back a saved appointment request; Supabase remains the source of truth.
5. This INSERT-only scenario does not backfill historical enquiries, mirror later status changes, or propagate deletions. Use an admin export for historical records and maintain a clinic-owned process to correct/remove downstream copies. Do not weaken RLS to make a sheet integration easier.

Reference documentation: https://supabase.com/docs/guides/database/webhooks, https://apps.make.com/gateway, https://apps.make.com/google-sheets-modules, and https://help.make.com/date-and-time-functions. Dashboard wording and plan features can change; verify the captured fields and filters in the clinic's own account.

## Optional alerts

After the verified-header filter, Make can also run an **Email/Gmail/SMTP > Send an email** action or a **Telegram Bot > Send a message** action. Use clinic-owned connections, approved private recipients/chats, and minimal information such as an enquiry ID and a request to check the admin workspace. Keep SMTP passwords, bot tokens, and other integration secrets in Make's private connections, never in the static site's configuration. Review alert errors and costs separately from the database insert.

Fully automatic WhatsApp notifications are a separate WhatsApp Business integration, typically involving paid/metered usage through Meta WhatsApp Cloud API, Twilio, WATI, Interakt, or another approved provider. Business-initiated notifications generally need patient opt-in and pre-approved message templates, with rules depending on the conversation window and provider. Provider onboarding, template approval, credentials, billing, and server-side handling are **not included** here. The site's two WhatsApp buttons only prepare drafts for staff to tap Send.

## Download the updated project ZIP

The **Download project ZIP** action is in the admin page footer and also works from the admin sign-in screen, without Supabase login. It downloads `32-pearls-dental-care.zip` containing the eight current static project files, including this guide and the unchanged SQL/hosting files. It fetches source files, not the rendered admin DOM, Supabase records, Auth sessions, browser storage, or generated patient exports. The public URL/key and configured doctor's contact number in `supabase-config.js` are included; do not put secrets in any source file.

Use an HTTP/HTTPS static preview that serves all eight files. Opening `index.html` through `file://` will not work. Some production hosts consume/hide `_headers` or `vercel.json` rather than serving them; in that case the action clearly fails and does not download a partial project. Run it from your local static preview instead. No extra library, build step, backend, or ninth source file is needed. The archive uses standard ZIP store entries with CRC-32 checksums.

This editing environment cannot execute an archive tool or attach a pre-generated ZIP, so the archive is generated by the browser action rather than supplied as a falsely claimed existing attachment. If you prefer your operating system's archive tool, select the eight source files and compress them, or run one of these commands locally from the project folder:

```powershell
Compress-Archive -Path index.html,admin.html,supabase-config.js,supabase-schema.sql,supabase-security-tests.sql,README.md,_headers,vercel.json -DestinationPath 32-pearls-dental-care.zip -Force
```

```sh
zip 32-pearls-dental-care.zip index.html admin.html supabase-config.js supabase-schema.sql supabase-security-tests.sql README.md _headers vercel.json
```

## Admin additions: verification checklist

- Export more than one visible page and more than 500 synthetic matching records; compare the enquiry ID set and count with Supabase. Repeat with each search/status/date filter and with a lower Supabase API row cap.
- Confirm the XLSX opens as a genuine workbook, uses the eleven required columns, shows correct IST midnight/date-boundary conversions, and preserves optional blanks, quotes, commas, newlines, and non-English names.
- Test formula-leading synthetic fields such as `=1+1`, `+123`, `-1`, `@name`, and a tab followed by `=1+1`. In XLSX and CSV they must remain inert text with the protective apostrophe, not executable formulas.
- Block the pinned cdnjs XLSX URL before its first load and confirm the explicit BOM-equipped CSV fallback. Separately fail a Supabase batch mid-export: no partial spreadsheet or CSV may download.
- Start an export, then log out, revoke allowlist access, navigate away, or let the workspace lock: no stale export should download. After a valid export, a browser download prompt is not proof that the file was saved.
- Leave the doctor's number as a placeholder, then configure the actual permitted destination. Verify both table/detail actions, international patient-number normalisation, correct recipients and IST tags, URL-encoded multiline text, and manual-only sending on desktop and mobile WhatsApp.
- Submit a fake pending request while an admin is visible. After about 60 seconds, check the net-count banner and Refresh action. Hide the tab and inspect Network to confirm no further polling while hidden; return and check it resumes. Confirm background polls do not postpone the 15-minute inactivity lock and no queries continue after logout/lock.
- Use keyboard and mobile views to check the new toolbar/actions, visible focus, status announcements, and details-dialog controls. Confirm the public site design and booking behaviour remain unchanged.
- Download and extract the project ZIP from a local static preview. Verify all eight files are present and match the served source; no patient data or sessions should be included. Test a missing/blocked file to confirm no partial archive is downloaded.
- If enabling Make, test the positive and wrong/missing-header cases, IST mapping, duplicate prevention, error paths, account/sharing permissions, and log retention using synthetic bookings only.

The additions have been statically reviewed, and the SheetJS CDN version/hash and integration guidance checked against documentation. This environment has no live Supabase credentials, browser/JavaScript test runner, Make/Google account, or archive runtime. Runtime export/CSV/ZIP generation, WhatsApp app opening, timer behaviour, responsive rendering, Auth/RLS integration, and optional Make delivery therefore remain **unverified here**. Complete the checklist in the clinic's environment before using real patient data.