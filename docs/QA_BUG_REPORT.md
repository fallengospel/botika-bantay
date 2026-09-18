# BotikaBantay - QA Bug Report

**Date:** September 18, 2026  
**Version:** 0.1.0 (MVP)  
**QA Engineer:** Automated Code Review  
**Status:** All critical/high issues FIXED, medium/low tracked for future sprints

---

## FIXED (Critical & High Priority)

### CRITICAL

| # | Bug | File | Status |
|---|-----|------|--------|
| 1 | Schema table creation order - `prices` references `users` before it exists | `supabase/schema.sql` | FIXED |
| 2 | Missing INSERT RLS policy on `prices` table - web API POST silently fails | `supabase/schema.sql` | FIXED |
| 3 | Mobile env var mismatch - `EXPO_PUBLIC_*` vs `NEXT_PUBLIC_*` | `apps/mobile/src/services/supabase.ts` | FIXED |
| 4 | Seed script env var mismatch - uses `SUPABASE_URL` instead of `NEXT_PUBLIC_SUPABASE_URL` | `scripts/seed.ts` | FIXED |
| 5 | `lucide-react` missing from mobile dependencies | `apps/mobile/package.json` | FIXED |
| 6 | Medicine detail shows "not found" when medicine exists but has no prices | `apps/web/app/medicines/[id]/page.tsx` | FIXED |
| 7 | `request.json()` uncaught in API routes - invalid JSON causes 500 | `apps/web/app/api/prices/route.ts`, `apps/web/app/api/verification/route.ts` | FIXED |

### HIGH

| # | Bug | File | Status |
|---|-----|------|--------|
| 8 | Tailwind config doesn't scan `components/` directory - styles purged | `apps/web/tailwind.config.js` | FIXED |
| 9 | Homepage search bar is non-functional - no submit handler | `apps/web/app/page.tsx` | FIXED |
| 10 | "Tunay Check" card on web home is dead (not clickable) | `apps/web/app/page.tsx` | FIXED |
| 11 | Badge CSS classes (`badge-fresh`, `badge-stale`, `badge-very-stale`) missing | `apps/web/app/globals.css` | FIXED |
| 12 | PWA manifest references `.png` icons that don't exist | `apps/web/public/manifest.json` | FIXED |
| 13 | `apple-touch-icon` references `.png` but file is `.svg` | `apps/web/app/layout.tsx` | FIXED |
| 14 | NearbyScreen hardcodes Supabase URL in `fetch()` | `apps/mobile/src/screens/NearbyScreen.tsx` | FIXED |
| 15 | NearbyScreen uses web-only `/api/branches` route in React Native | `apps/mobile/src/screens/NearbyScreen.tsx` | FIXED |
| 16 | No price validation on POST `/api/prices` - accepts negative/zero prices | `apps/web/app/api/prices/route.ts` | FIXED |
| 17 | Copyright year hardcoded to 2024 | `apps/web/app/page.tsx` | FIXED |

---

## REMAINING (Medium & Low Priority - Tracked for Future Sprints)

### MEDIUM

| # | Bug | File | Priority |
|---|-----|------|----------|
| 18 | `lib/supabase.ts` functions never used (dead code) | `apps/web/lib/supabase.ts` | Medium |
| 19 | No pagination on API endpoints - unbounded result sets | `apps/web/app/api/medicines/route.ts` | Medium |
| 20 | No CSRF protection on POST endpoints | `apps/web/app/api/prices/route.ts` | Medium |
| 21 | No rate limiting on verification endpoint | `apps/web/app/api/verification/route.ts` | Medium |
| 22 | `generateId()` uses `Math.random()` - not cryptographically secure | `packages/shared/src/utils/index.ts` | Medium |
| 23 | `calculateDistance` duplicated in 4 places | Multiple files | Medium |
| 24 | Shared types use `Date` but Supabase returns strings | `packages/shared/src/types/index.ts` | Medium |
| 25 | No `error.tsx` or `loading.tsx` boundary files in Next.js routes | `apps/web/app/` | Medium |
| 26 | Medicine detail page can't distinguish "not found" from "network error" | `apps/web/app/medicines/[id]/page.tsx` | Medium |
| 27 | `verifyMedicine` doesn't handle second query error properly | `apps/mobile/src/services/supabase.ts` | Medium |

### LOW

| # | Bug | File | Priority |
|---|-----|------|----------|
| 28 | No `aria-label` on search inputs | `apps/web/app/page.tsx`, `apps/web/components/search/SearchBar.tsx` | Low |
| 29 | No skip-to-content link for accessibility | `apps/web/app/layout.tsx` | Low |
| 30 | `console.log` left in production service worker registration | `apps/web/app/layout.tsx` | Low |
| 31 | No pull-to-refresh on mobile FlatLists | `apps/mobile/src/screens/MedicinesScreen.tsx` | Low |
| 32 | All screens use `any` for navigation props - no type safety | `apps/mobile/src/screens/*.tsx` | Low |
| 33 | Mobile `app.json` missing `privacy` key and iOS permission descriptions | `apps/mobile/app.json` | Low |
| 34 | Expo SDK 50 is outdated (current is 52+) | `apps/mobile/package.json` | Low |
| 35 | Service worker caches API responses - stale price data possible | `apps/web/public/sw.js` | Low |
| 36 | Root `lint` script references ESLint without config | `package.json` | Low |
| 37 | No monorepo `workspaces` field in root `package.json` | `package.json` | Low |

---

## Summary

- **Fixed:** 17 issues (7 Critical, 10 High)
- **Tracked:** 20 issues (11 Medium, 9 Low)
- **Total:** 37 issues identified and documented

All critical and high-priority issues that blocked core functionality have been resolved. Medium and low issues are tracked for future sprints and do not block the current MVP deployment.
