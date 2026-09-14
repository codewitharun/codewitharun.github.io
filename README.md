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

Blog posts and projects live in Firestore — the existing `devarun-1d87a` Firebase project (already
used by the old admin dashboard) rather than a new one. `/admin` is a real Firebase Auth login, not
a hardcoded password: only the one admin account can create, edit, or delete posts/projects;
everyone else can only read posts/projects whose `status`/`published` field marks them public.

One-time setup in the [Firebase console](https://console.firebase.google.com/project/devarun-1d87a):

1. **Authentication → Sign-in method** — enable **Email/Password**.
2. **Authentication → Users → Add user** — create the one account you'll log into `/admin` with.
3. **Firestore Database** — if not already provisioned, create it (production mode is fine, rules
   below replace the defaults). Then **Rules** tab → paste the contents of `firestore.rules` at
   the repo root, replacing `ADMIN_EMAIL` with the email from step 2 → Publish.

If you'd rather not hand-edit the rules file in the console every time, `npx firebase-tools` (after
`firebase login` + `firebase use devarun-1d87a`) can deploy it with
`firebase deploy --only firestore:rules` instead.

After that, sign in at `/admin` with that email/password to write posts. Posts are authored with a
Tiptap rich text editor (`src/components/admin/RichTextEditor.tsx`) that produces sanitized HTML,
rendered as-is (via `isomorphic-dompurify`) on the public `/blog/[slug]` page.

**Images** (post covers, inline post images, project covers) upload through
[ImageKit](https://imagekit.io) rather than Firebase Storage — Firebase Storage isn't used by this
project at all after that account got blocked. The upload flow is: the admin editor posts the file
to this app's own `/api/upload-image` route (`src/app/api/upload-image/route.ts`), which uses the
ImageKit Node SDK server-side to upload and returns the public URL, saved as a plain string on the
Firestore document — same shape as before, just a different storage backend. This needs one
environment variable, which must never be committed:

```bash
# .env.local (gitignored) — get this from the ImageKit dashboard →
# Developer Options → API Keys → Private Key
IMAGEKIT_PRIVATE_KEY=private_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Also add `IMAGEKIT_PRIVATE_KEY` to the Vercel project's Environment Variables (Settings →
Environment Variables) so production uploads work too — `.env.local` only applies locally.

Note: deleting a post/project doesn't currently delete its image from ImageKit (the Firestore
document only stores the URL, not the ImageKit `fileId` deletion needs) — clean up stray files from
the ImageKit Media Library directly, or ask for `fileId` tracking to be added if that matters.

Before any of the three upload paths above (cover image, inline post image, project image) actually
hits `/api/upload-image`, `src/lib/imageUpload.ts` compresses the file client-side (via
`browser-image-compression`) down to roughly 800KB and 2000px on the long edge, unless it's already
smaller, a GIF (compressing would kill the animation), or an SVG (already tiny/vector). This is what
keeps a 4-5MB iPhone photo or screenshot from being stored — and served to every visitor — at full
size.

## Analytics

Firebase Analytics (GA4, `measurementId` in `src/lib/firebase-analytics.ts`) is wired up: every route change
fires a `page_view` event via `src/components/AnalyticsTracker.tsx`, mounted once in the root layout.
It only initializes in the browser and only if `firebase/analytics`'s `isSupported()` check passes
(so it no-ops during SSR, in ad-blocked browsers, or unsupported environments, rather than throwing).

"Realtime" isn't a separate thing that needed building — it's a live view, in the Firebase console
under **Analytics → Realtime**, over these same `page_view` events, and it updates within seconds of
a real visit. The historical reports (Analytics → Reports) fill in over the following 24-48 hours as
Google processes the data. If the console shows no data at all after a real visit, double check
**Project Settings → Integrations → Google Analytics** is linked for `devarun-1d87a` — the
`measurementId` already being in the config strongly suggests it is, but it's the one thing that has
to be set up from the console rather than code.

## Contact form

The "Get in touch" section on `/` (`src/components/ContactForm.tsx`) writes straight to Firestore's
`messages` collection with no auth — visitors submit name, email, phone, and a message. A hidden
honeypot field filters out the simplest bots. `/admin`'s **Messages** tab
(`src/components/admin/MessageList.tsx`) lists them newest-first with a read/unread indicator
(opening a message marks it read), search, an unread filter, and reply-by-email/call shortcuts.

This only works once `firestore.rules` is redeployed — the `messages` match block is new, and the
existing rules default-deny everything not explicitly allowed. Same process as any other rules
change: paste the file into the Firebase console's Rules tab (swap in your real admin email for
`ADMIN_EMAIL`) or run `firebase deploy --only firestore:rules`. Until that's done, the form will
fail with a permission error on submit.

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
