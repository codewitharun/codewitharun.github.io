<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:arun-agent-rules -->
# Techtiten portfolio (techtiten.com): Next.js 16 + Tailwind v4 on Vercel.

## Working with Arun (every agent: Claude Code, Cowork, Codex, Cursor)

**Start of every session**
1. Read `STATUS.md` in this repo (what we're doing now, next step, open questions).
2. Check the real state: `git status`, current branch, `git fetch` then HEAD vs `origin/main`. If it doesn't match STATUS.md, say so before working.

**End of every session** (or when Arun says "update notes")
- Update `STATUS.md`: rewrite **Now** and **Next**, tick or add **Open to-dos**, add one dated line at the top of **Log**. Keep it under ~150 lines; move old log lines out if it grows.
- STATUS.md is committed with the work, so it travels to every device and branch.

**How Arun works**
- Casual, like a best friend ("bro" is fine). **Never call him "sir".** Short messages, sharp work, honest: if unsure or wrong, say so plainly.
- Usually you write the code and Arun ships it. Give one-line commands and check the repo state first.
- Ship flow: new branch from `origin/main` -> PR -> merge. **A merge to `main` deploys to production.** Never push straight to `main`.
- `git add` exact files, never `-A`. Never commit `.env*`, keys, keystores, service-account JSONs or `.env.example`.
- New native packages need a store build; they can't ship as an OTA update.
- No real UPI IDs, names or emails of friends in screenshots or marketing: dummy data only.
- Public framing: these are hobby apps under the brand **Techtiten** (spelled that way on purpose). Never call them freelance work.
<!-- END:arun-agent-rules -->
