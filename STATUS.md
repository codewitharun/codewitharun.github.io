# Techtiten portfolio: status

_Last updated: 26 Oct 2026 (Cowork)._

## Now
- `main` clean. Last merge PR #33 (26 Oct): `/apps` preview image, shorter home description, `store_click` analytics on every store link.
- Done 26 Oct: app page SEO (titles, `MobileApplication` + breadcrumb JSON-LD, h2s), help/privacy pill buttons, app icon as tab icon, old arun.codes links fixed in 3 posts, both app pages in Search Console.

## Next
1. Run `techtiten.com/apps` through LinkedIn Post Inspector.
2. Firebase Analytics: mark `store_click` as a key event.
3. ~2 Nov: search "EzySplit app" / "FitPrep app", check Search Console › Performance.

## Ideas (not started)
- Real numbers on app pages (installs, groups)
- Long-tail posts: "Splitwise alternative India", "split a Goa trip", "Indian high-protein meal plan"
- Studymark waitlist page
- Blog drafts ready in `~/Work/Personal/Blog-Posts` (EzySplit UPI post, FitPrep Pro post)

## Key facts
- Next.js 16.3 (read `node_modules/next/dist/docs/` before coding), Tailwind v4, Vercel deploys main.
- Projects live in `src/content/projects.ts`; blog posts live in the admin (`/admin`, Firestore `devarun-1d87a`, ImageKit images).
- Related app per post is picked in the admin; nothing auto-applies.

## Log
- 26 Oct 2026: SEO + OG + store_click shipped; STATUS.md/AGENTS.md added.
