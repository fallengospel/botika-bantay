# BotikaBantay - Deployment Process

## Branching Strategy

```
testing → staging → main
  ↓          ↓        ↓
Vercel     Vercel   Vercel
(test)     (staging) (production)
```

### Branches

| Branch | Purpose | Deployed To | Protection |
|--------|---------|-------------|------------|
| `testing` | Feature development & initial QA | Vercel (test URL) | None — push freely |
| `staging` | Integration testing & comprehensive QA | Vercel (staging URL) | Requires PR from `testing` |
| `main` | Production — only tested code | Vercel (production URL) | Requires PR from `staging` |

### Workflow

```
1. Create feature branch from `testing`
   git checkout -b feat/my-feature testing

2. Develop & commit to feature branch

3. Push to `testing` for initial testing
   git push origin feat/my-feature
   # Auto-deploys to test URL
   # Run smoke tests manually or via CI

4. Merge to `testing` after initial QA passes
   git checkout testing
   git merge feat/my-feature
   git push origin testing

5. Create PR: testing → staging
   - Requires all API tests to pass
   - Requires manual QA sign-off
   - Staging URL auto-deploys

6. Run comprehensive tests on staging
   - Full regression testing
   - Edge case testing
   - Performance check

7. Create PR: staging → main
   - Requires staging tests to pass
   - Requires staging deployment to be stable for 24h+
   - Production URL updates

8. Deploy to production
   - Tag release
   - Monitor for 1h
   - Rollback if issues found
```

### Pre-Deploy Checklist (Every Deploy)

Before merging to `staging`:
- [ ] All API endpoints return correct responses
- [ ] All pages render without errors (HTTP 200)
- [ ] Search, filter, pagination work
- [ ] Auth flow works (login, register, logout)
- [ ] Price submission creates records
- [ ] Outlier detection flags correctly
- [ ] Scanner finds medicines by barcode and name
- [ ] Admin dashboard loads and moderates
- [ ] No TypeScript errors (`npx next build`)
- [ ] No console errors in browser

Before merging to `main`:
- [ ] All staging tests pass
- [ ] No regression from previous production version
- [ ] Supabase migrations applied (if any)
- [ ] Environment variables verified on Vercel
- [ ] Lighthouse score acceptable (>80)
- [ ] Mobile responsiveness checked

### Testing Commands

```bash
# API smoke tests
curl -s http://localhost:3000/api/medicines | python3 -c "import sys,json;print(len(json.load(sys.stdin)),'medicines')"
curl -s http://localhost:3000/api/branches | python3 -c "import sys,json;print(len(json.load(sys.stdin)),'branches')"
curl -s -X POST http://localhost:3000/api/verification -H 'Content-Type:application/json' -d '{"scannedCode":"4800000000012"}'

# Build check
cd apps/web && npx next build

# Page smoke test
for p in / /medicines /scanner /nearby /submit /admin /login /register /report; do
  curl -s -o /dev/null -w "%{http_code} $p\n" http://localhost:3000$p
done
```

### Rollback Process

If production has issues:
1. Revert the merge commit on `main`
2. Force push to `main`
3. Vercel auto-deploys the previous version
4. Notify team
5. Fix on `testing`, go through full cycle again

### Environment URLs

| Environment | URL | Vercel Project |
|-------------|-----|----------------|
| Testing | `https://web-testing.vercel.app` | botika-bantay-testing |
| Staging | `https://web-staging.vercel.app` | botika-bantay-staging |
| Production | `https://web-eight-xi-tc0dhj19wa.vercel.app` | kaiba-corp/web |

### Release Tagging

```bash
# After successful production deploy
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```
