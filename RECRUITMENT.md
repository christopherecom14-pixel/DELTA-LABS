# Internship recruitment system

The public application page is `/careers/internships` and is the canonical URL for ads. The recruiter dashboard is at `/admin/recruitment`. Both are part of the existing Next.js app. The only new dependencies are `mongodb` and `zod`.

## How it fits together

| Piece | Where |
| --- | --- |
| Landing page (static, prerendered) | `app/careers/internships/page.tsx` |
| Multi-step form (client) | `app/careers/internships/_components/` |
| Shared config: departments, questions, pipeline, scoring | `lib/recruitment/config.ts` |
| Validation, shared by browser and server | `lib/recruitment/schema.ts` |
| Submission API | `app/api/careers/applications/route.ts` |
| Data layer: create, duplicates, query, updates, retention | `lib/server/applications.ts` |
| Admin auth: scrypt passwords, DB sessions, roles | `lib/server/auth.ts` |
| CV storage (MongoDB GridFS, private) | `lib/server/cv-storage.ts` |
| Dashboard pages and server actions | `app/admin/` |
| CV download, CSV export, retention cron | `app/api/admin/…`, `app/api/cron/retention` |
| Analytics helpers (GA4 + Meta Pixel events, UTM capture) | `lib/analytics.ts` |

### Database collections

- **`internship_applications`** holds one document per application. It includes denormalised fields used for filtering (`department`, `status`, `emailNormalized`, `phoneNormalized`, `cityNormalized`, `skillsNormalized`, …). It also holds the screening answers together with a snapshot of each question, plus the UTM attribution, scores, interview details, `duplicateRefs` and `retainUntil`. Indexes are created automatically on first connection (see `lib/server/db.ts`).
- **`internship_activity`** is the history for each applicant: submission, status changes, notes, scores, interview changes and duplicate flags.
- **`internship_cvs.files` / `.chunks`** store the PDFs in GridFS. They can only be reached through the authenticated `/api/admin/applications/:id/cv` route.
- **`admin_users`** and **`admin_sessions`** store dashboard users and their sessions. A TTL index expires sessions.
- **`rate_limits`** holds the fixed-window counters. A TTL index removes old ones.

### Roles

| Role | Can |
| --- | --- |
| viewer | View applicants, CVs and history |
| recruiter | Everything a viewer can, plus change status, score, schedule interviews, add notes and export CSV |
| admin | Everything a recruiter can, plus manage team access, permanently delete applications and run the retention purge |

Every page, server action and API route checks the session and role on the server.

## Deployment

1. **Create a MongoDB database.** A MongoDB Atlas free or shared cluster is enough. Allow connections from your hosting provider.
2. **Set environment variables** in the hosting dashboard. `.env.example` lists them all. These are required:
   - `MONGODB_URI`, `MONGODB_DATABASE`
   - `SESSION_SECRET` and `CRON_SECRET`. Generate each with `openssl rand -hex 32`.
   - `NEXT_PUBLIC_SITE_URL=https://deltalabs.tech`
   - `NEXT_PUBLIC_GA4_ID`, if GA4 should run. It must be set **before** building.
   - `RESEND_API_KEY`, `RECRUITMENT_FROM_EMAIL` and `RECRUITMENT_NOTIFY_EMAIL`, if acknowledgement emails should be sent. The sender domain has to be verified in Resend. Without these variables, emails are skipped and nothing else is affected.
3. **Deploy** as usual (`npm run build`).
4. **Create the first admin:**
   ```bash
   node --env-file=.env.local scripts/create-admin.mjs subhan@deltalabs.tech "Muhammad Subhan" admin
   ```
   The script asks for a password (12 or more characters). Run it again with the same email to reset a password. After that, add other people from **Team** in the dashboard.
5. **Retention clean-up** runs automatically once a day, the first time someone opens the dashboard that day. To run it on a fixed schedule as well (for example from a Railway cron service or any external scheduler), call:
   ```bash
   curl -H "Authorization: Bearer $CRON_SECRET" https://deltalabs.tech/api/cron/retention
   ```
6. **Meta Events Manager:** turn **off** *Automatic advanced matching* for the Pixel. If it is left on, the Pixel scrapes form fields such as email and phone, which goes against the rule of not sending applicant contact details to ad platforms. Use the `Lead` event as the conversion for the internship campaign.
7. **Ads:** point ads at `https://deltalabs.tech/careers/internships?utm_source=facebook&utm_medium=paid_social&utm_campaign=<name>&utm_content=<ad>`. For Instagram placements, use `utm_source=instagram`.

### Hosting notes

- Hosted on Railway (service `DELTA-LABS`, auto-deploys from `main`). CV uploads are capped at **4 MB**.
- Rate limiting uses the client IP from `x-real-ip` / `x-forwarded-for`. Railway sets these headers. Behind Cloudflare, set `CLIENT_IP_HEADER=cf-connecting-ip`. Only trust a header that your proxy overwrites.
- The admin area is marked `noindex` and is disallowed in `robots.txt`. GA4 never loads on `/admin`.

## Analytics events

| When | GA4 | Meta Pixel |
| --- | --- | --- |
| Page view | `internship_page_view` | `ViewContent` |
| Apply button / department card | `internship_apply_click` (`cta_location`, `department`) | `InternshipApplyClick` |
| First interaction with the form (once per session) | `internship_form_start` | `InternshipFormStart` |
| Department chosen (step 2) | `internship_department_selected` | `InternshipDepartmentSelected` |
| Each step completed | `internship_form_step` | — |
| **Server confirmed the application was saved** | `generate_lead` | `Lead` (with `eventID` for de-duplication) |

`Lead` fires only after the API returns a reference. It fires once per submission: the session guard plus `eventID` prevent double counting from retries, double clicks or refreshes.

Only the department id, step number and CTA location are sent to analytics. Names, contact details, CVs, screening answers and salary expectations never are. UTMs, `fbclid` and `gclid` are kept on the device for 30 days and saved with the application. They appear in the dashboard and in the CSV export, and you can filter applicants by UTM source.

## Testing checklist

Run against a staging database before the first ad goes live.

**Applicant flow (test on a phone)**
- [ ] `/careers/internships?utm_source=facebook&utm_campaign=test` loads quickly with no horizontal scrolling
- [ ] "Apply for internship" scrolls to the form; "Apply for SEO" preselects SEO in step 2
- [ ] Pressing Continue on an empty step shows inline errors and moves focus to the first one
- [ ] Reloading mid-form restores the draft and shows "Start over"
- [ ] Choosing Graphic Design makes a portfolio or Behance link required; "Experienced" makes work experience required
- [ ] A non-PDF file or a PDF over 4 MB is rejected with a clear message
- [ ] Step 4 shows the question for the chosen department; step 5 shows the stipend before the questions
- [ ] Review shows every answer, Edit returns to the right step, and submitting without consent is blocked
- [ ] Double-clicking Submit creates exactly **one** application; the success screen shows a `DL-YYMM-XXXXX` reference
- [ ] The acknowledgement email arrives (if Resend is configured)

**Analytics**
- [ ] Meta Pixel Helper / Events Manager Test Events shows `PageView`, `ViewContent`, `InternshipApplyClick`, `InternshipFormStart` and exactly one `Lead` after submitting
- [ ] GA4 DebugView shows the matching events and `generate_lead`
- [ ] No event parameters contain names, emails, phone numbers or answers

**Dashboard**
- [ ] `/admin/recruitment` redirects to sign-in when signed out; a wrong password is rejected
- [ ] The new applicant appears with the correct UTM source; search by name, email, phone or reference works
- [ ] Filters (department, experience, availability, city, skill, UTM source, duplicates) and sorting work
- [ ] Submitting again with the same email or phone shows "Possible duplicate" on both records
- [ ] Status, scores (out of 100), interview details and notes save and appear in the activity history
- [ ] View CV opens the PDF; CSV export downloads and opens correctly in Excel or Google Sheets
- [ ] A **viewer** can't edit or export; only an **admin** sees Team, Delete and the retention purge
- [ ] Sign out, then confirm the CV and export URLs return 401
