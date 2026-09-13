# Techtiten

The Techtiten brand site — a personal software studio site for Arun Kumar, rebuilt from the old
`arun.codes` CRA site as a fresh Next.js (App Router) project.

"Titen" instead of "Titan" is intentional: the brand's whole premise is that imperfect, unfinished
work still ships and still gets better in public.

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Tailwind CSS v4** — dark-only design system, tokens in `src/app/globals.css`
- **Framer Motion** — scroll-triggered reveals (`src/components/Reveal.tsx`)
- **React Three Fiber + drei** — the 3D "titan" hero shape (`src/components/three/TitanShape.tsx`),
  a deliberately distorted icosahedron rather than a clean sphere
- **@fontsource** (Sora, Inter, JetBrains Mono) — self-hosted fonts, no runtime dependency on
  Google Fonts' CDN
- Structured data (`src/lib/schema.ts`) linking a `Person` (Arun Kumar) and `Organization`
  (Techtiten) entity for Google — see the SEO section below

## Content

All real copy and project data lives in one place: `src/data/site.ts`. Edit that file to update
bio, skills, socials, or the project list — every page reads from it, nothing is hardcoded
per-page.

Pages: `/` (home), `/about`, `/portfolio` (+ a `/portfolio/[slug]` case-study page per project),
`/blog` (+ `/blog/[slug]`), and `/admin` — a private, unindexed dashboard for writing posts.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start   # production build
```

## Admin & blog setup

Blog posts live in Firestore, images in Firebase Storage — the existing `devarun-1d87a` Firebase
project (already used by the old admin dashboard) rather than a new one. `/admin` is a real
Firebase Auth login, not a hardcoded password: only the one admin account can create, edit, or
delete posts; everyone else can only read posts whose `status` is `"published"`.

One-time setup in the [Firebase console](https://console.firebase.google.com/project/devarun-1d87a):

1. **Authentication → Sign-in method** — enable **Email/Password**.
2. **Authentication → Users → Add user** — create the one account you'll log into `/admin` with.
3. **Firestore Database** — if not already provisioned, create it (production mode is fine, rules
   below replace the defaults). Then **Rules** tab → paste the contents of `firestore.rules` at
   the repo root, replacing `ADMIN_EMAIL` with the email from step 2 → Publish.
4. **Storage** — if not already provisioned, click "Get started". Then **Rules** tab → paste
   `storage.rules`, same `ADMIN_EMAIL` swap → Publish.

After that, sign in at `/admin` with that email/password to write posts. Posts are Markdown
(rendered with `react-markdown` + GFM, same renderer on `/admin`'s preview and the public
`/blog/[slug]` page), with an optional cover image uploaded straight to Storage.

If you'd rather not hand-edit the rules files in the console every time, `npx firebase-tools`
(after `firebase login` + `firebase use devarun-1d87a`) can deploy both with
`firebase deploy --only firestore:rules,storage:rules` instead.

## Before going live on techtiten.com

- Update `siteUrl` in `src/data/site.ts` once the domain is live (it's already set to
  `https://techtiten.com`).
- Follow Google's Change of Address flow for both `arun.codes` and `www.arun.codes` (verify both
  variants in Search Console, not just one), and keep 301 redirects live for at least 180 days.
- Validate the JSON-LD via [Rich Results Test](https://search.google.com/test/rich-results) after
  deploying.
- Update the GitHub/LinkedIn/X profile links and the Play Store developer display name to mention
  Techtiten too — the on-site structured data only does half the work; off-site consistency is
  what actually builds the entity association in Google over time.
