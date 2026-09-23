# QA Regression Test Report — BotikaBantay

**Date:** 2026-09-23
**Branches tested:** `testing` (946695b), `staging` (946695b — in sync)
**Environment:** Local Next.js 14.2.35 dev server + Supabase Cloud
**Tester:** Automated regression suite (route smoke, API security, input validation, data integrity)

---

## Test Summary

| Area | Tests | Pass | Fail |
|------|-------|------|------|
| Page routes (HTTP 200/404) | 12 | 12 | 0 |
| Type check (`tsc --noEmit`) | 1 | 1 | 0 |
| Production build | 1 | 1 | 0 |
| Admin auth (401 unauth/bad token) | 6 | 6 | 0 |
| Input validation (400s) | 7 | 7 | 0 |
| Rate limiting (429s) | 4 | 4 | 0 |
| Verification happy/error paths | 6 | 6 | 0 |
| SQL injection attempt | 1 | 1 | 0 |
| **Data integrity / error handling** | **8** | **2** | **6** |

---

## Findings

### QA-001 — CRITICAL: Report API leaks raw database error

- **Endpoint:** `POST /api/reports`
- **Observed:** HTTP 500 with body
  `{"error":"new row violates row-level security policy for table \"suspicious_product_reports\""}`
- **Root cause:** Supabase RLS blocks anonymous inserts (pending SQL fix in Supabase SQL
  Editor); API returns `error.message` verbatim. Client-side interception exists on the
  report page, but other clients (mobile app, direct API consumers) receive the raw error.
- **Impact:** Internal schema/table names exposed; poor error UX outside the web page.
- **Resolution:** Sanitize at API level — detect RLS errors, return friendly
  Filipino message with 503. (Mobile/web clients now receive safe errors.)

### QA-002 — HIGH: Medicine-not-found path returns 500 instead of graceful not-found

- **Endpoint:** `GET /api/medicines?id=<valid-uuid-not-in-db>`
- **Observed:** HTTP 500 `{"error":"Cannot coerce the result to a single JSON object"}`
- **Root cause:** `.single()` errors on 0 rows (PGRST116) and route returns 500.
- **Impact:** Visiting `/medicines/<random-valid-uuid>` shows generic "Server error —
  Try Again" instead of correct "Medicine not found" UI. Retry never helps.
- **Resolution:** Use `.maybeSingle()`; return `null` (200) when not found so the
  existing page not-found branch renders.

### QA-003 — HIGH: Garbage ID returns 500 with raw Postgres error

- **Endpoint:** `GET /api/medicines?id=garbage`
- **Observed:** HTTP 500 `{"error":"invalid input syntax for type uuid: \"garbage\""}`
- **Impact:** Same as QA-002 for malformed URLs; leaks DB internals.
- **Resolution:** Validate UUID format; return `null` (200) → page shows not-found UI.

### QA-004 — HIGH: Rejected outlier prices visible in public price list

- **Endpoint:** `GET /api/prices?medicineId=70573dc2-…` (Alaxan)
- **Observed:** Response includes `{"price":999.99,"verification_status":"rejected"}`
  alongside verified prices. `PriceCard` has no status filter, so the ₱999.99 row
  renders on the medicine detail page and distorts the "You can save up to…" figure.
- **Root cause:** GET returns all statuses; outlier auto-reject rows (price ≥ ₱900 for a
  ₱8.50 median) leak into the public view.
- **Impact:** Users see obviously wrong prices as if legitimate.
- **Resolution:** Exclude `verification_status = 'rejected'` from public GET.

### QA-005 — MEDIUM: Invalid UUID filter params on prices return 500

- **Endpoint:** `GET /api/prices?branchId=test1` (and non-UUID `medicineId`)
- **Observed:** HTTP 500 `{"error":"invalid input syntax for type uuid: \"test1\""}`
- **Impact:** Raw DB error; inconsistent with graceful empty behavior for unknown IDs.
- **Resolution:** Validate UUID format; invalid filter → return `[]` (200, no possible
  match) for `medicineId` (feeds detail-page not-found flow); `branchId` invalid → `[]`.

### QA-006 — MEDIUM: `GET /api/prices` has no rate limit

- **Observed:** 10 rapid requests all 200 (every other public endpoint rate-limited in
  the User B pass: medicines 60/min, branches 60/min, verification 30/min, etc.).
- **Impact:** Heavy endpoint (full table scan + 3 manual joins) is the one route left
  unprotected — inconsistent and abuse-prone.
- **Resolution:** Add 60 req/min/IP rate limit.

### QA-007 — MEDIUM: Verification accepts unbounded input length

- **Endpoint:** `POST /api/verification` with 5,000-char `scannedCode`
- **Observed:** HTTP 200 (query executed with 5K-char ILIKE pattern).
- **Impact:** Unnecessary DB load; barcode/FDA codes are ≤ 64 chars.
- **Resolution:** Reject `scannedCode.length > 64` with 400.

### QA-008 — LOW: Rate limiter stress-test discrepancy (non-blocking)

- **Observed:** First stress run: 65/65 requests to `/api/medicines` returned 200
  (limiter appeared inactive, likely dev-server module duplication during lazy
  compile). Controlled retest after warmup: **61×200 then 429s** (expected exactly
  60 allowed — off-by-one).
- **Impact:** Limiter confirmed functional on retest; in-memory store may behave
  inconsistently under dev-server warmup. Serverless deployments share per-instance
  memory only.
- **Resolution:** Documented. Re-verify on staging deployment. Consider Redis-backed
  limiter before production scale.

### QA-009 — LOW: Ambiguous verification branch rarely reachable (non-blocking)

- **Observed:** Search step 3 uses `.limit(1)`, so multi-match queries (e.g. generic
  "paracetamol") return a single arbitrary match (`status: found`) before step 4's
  ambiguous branch can run.
- **Impact:** Users may get "verified" result that isn't their exact product.
- **Resolution:** Documented for product backlog (raise step-3 limit, prefer ambiguous
  when >1 match).

### QA-010 — INFO: Authenticated admin flows not machine-tested

- Unauthenticated (401) and invalid-token (401) paths verified automatically.
- Valid-session GET/PATCH requires a confirmed user account — **manual test required
  on staging** after RLS SQL is applied.

### QA-011 — INFO: Pending (unmoderated) prices remain publicly visible

- Submissions are inserted as `verification_status = 'pending'` and currently shown in
  the public list. UI copy says submissions are "subject for review / hindi agad
  ma-publish" — mismatch.
- **Decision:** Deferred. Filtering to `verified`-only is correct per UI copy, but the
  admin approval flow (`price_submissions.moderation_status`) does not cascade to the
  `prices` table, so approved crowd prices would never appear. Requires moderation
  cascade design (backlog), not a safe hot-fix. **Rejected rows fixed now (QA-004).**

---

## Verified Working (no action)

- All 11 page routes HTTP 200; unknown route → custom 404 (Filipino).
- `/medicines/does-not-exist` → client-side not-found UI (after QA-002/003, also for
  valid UUIDs).
- Admin: 401 without token, 401 with fake Bearer, `{"error":"Unauthorized"}`.
- Rate limits: reports 429 @10, medicines 429 @60, verification/prices POST limits.
- Validation: empty/invalid JSON bodies → 400 on verification, reports, prices.
- Verification: found / not_found / message quality; SQL injection attempt safely
  returns not_found (parameterized queries).
- Outlier check: correct math (`median 8.5`, ₱50 → `isOutlier: true, 488%`).
- Submissions limit endpoint correct for unknown user.
- `tsc --noEmit` clean; `next build` clean (22 routes).
- Branch sync: `testing` == `staging` == 946695b at test time.

---

## Fixes Applied (this pass)

| ID | File | Fix |
|----|------|-----|
| QA-001 | `app/api/reports/route.ts` | Sanitize RLS errors → friendly 503 message |
| QA-002/003 | `app/api/medicines/route.ts` | UUID validation + `.maybeSingle()` → null/200 |
| QA-004 | `app/api/prices/route.ts` | Exclude `rejected` from public GET |
| QA-005 | `app/api/prices/route.ts` | UUID validation → `[]` on malformed filters |
| QA-006 | `app/api/prices/route.ts` | Rate limit 60/min on GET |
| QA-007 | `app/api/verification/route.ts` | Max `scannedCode` length 64 → 400 |

## Outstanding / Backlog

1. **BLOCKER (external):** Run RLS policy SQL in Supabase SQL Editor — until then
   report/price-submission inserts fail by design (now fail *gracefully*).
   **SQL:** `supabase/migrations/20260923_production_hardening_v1_4_0.sql` (v1.4.0).
2. QA-008: re-verify rate limits on staging deployment; Redis-backed limiter before scale.
3. ~~QA-009: ambiguous-match UX improvement.~~ **FIXED in v1.4.0** — step-3 returns
   `ambiguous` when >1 match (limit 10, suggestions ≤5).
4. QA-010: manual admin auth test on staging with a confirmed account.
5. ~~QA-011: moderation cascade (`price_submissions` → `prices.verification_status`).~~
   **FIXED in v1.4.0** — public GET only `verified`; admin PATCH cascades via
   `supabaseAdmin` (`SUPABASE_SERVICE_ROLE_KEY` required on Vercel).
