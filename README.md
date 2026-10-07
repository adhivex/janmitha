# Janmitha: portfolio website

Mobile-first portfolio for Janmitha, model and content creator in Bangalore.
Next.js 16 (App Router, Cache Components) + Tailwind v4 + Supabase.

Design and build specs: `docs/DESIGN_SPEC.md`, `docs/BUILD_PLAN.md`. Agent rules: `CLAUDE.md`.

## What's in it

| Area | Where |
| --- | --- |
| Home page (8 sections) | `src/app/page.tsx`, `src/components/*` |
| Portfolio + lightbox | `/portfolio`, `/portfolio/[slug]`, `src/components/portfolio/*` |
| Enquiry form (Zod, Turnstile, honeypot, Resend) | `src/components/EnquiryForm.tsx`, `src/app/actions/enquiry.ts` |
| Admin (Supabase Auth + `admin_users`) | `/admin`, `src/app/admin/*`, `src/proxy.ts` |
| Content queries (5 min cache, tag revalidation, static fallback) | `src/lib/queries.ts`, `src/lib/content.ts` |
| SEO | metadata in `src/app/layout.tsx`, `opengraph-image.tsx`, `sitemap.ts`, `robots.ts`, JSON-LD in `PersonJsonLd.tsx` |

If Supabase env vars are missing, the public site still renders from `src/lib/content.ts`.

## Run it (on the VPS)

```bash
npm install
npm run db:start          # local Supabase in Docker (ports 55020-55029, firewalled from the internet)
cp .env.example .env.local   # then fill in values from `npx supabase status`
npm run admin:create -- you@example.com   # prints a generated password
npm run build && npx next start -p 3100
```

`npm run db:reset` re-applies `supabase/migrations` and both seeds (`seed.sql`, plus
`seed.dev.sql` demo photos for local use only). `npm run db:types` regenerates
`src/types/database.ts` after a schema change.

Viewing from your own computer without opening any ports:

```bash
ssh -L 3100:localhost:3100 root@<vps-ip>
```

then open http://localhost:3100 (admin at http://localhost:3100/admin).

## Environment

See `.env.example`. Server-only secrets: `SUPABASE_SERVICE_ROLE_KEY` (used only by
`scripts/create-admin.mjs`), `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `REVALIDATE_SECRET`.

- **Resend** not set: enquiries are still saved; email is skipped with a log line.
- **Turnstile** not set: check skipped in development, rejected in production.
  Cloudflare's always-pass test keys are fine for local testing.
- Edits made directly in Supabase (not via /admin) show up within 5 minutes, or immediately with
  `curl -X POST -H "x-revalidate-secret: $REVALIDATE_SECRET" https://<site>/api/revalidate`.

## Going live (Vercel + hosted Supabase)

1. Create a Supabase project, run `supabase/migrations/0001_init.sql` and `supabase/seed.sql`
   (not `seed.dev.sql`).
2. Set the env vars on Vercel with the real Turnstile, Resend and `NEXT_PUBLIC_SITE_URL` values.
3. Create Janmitha's admin login with `npm run admin:create` pointed at the hosted project.
4. Replace placeholders (see below) through `/admin`.

## Placeholders still open

Real photos (hero, About, golden hour, category covers, shoots), her email, Instagram and
LinkedIn handles, showreel and story video URLs, media kit PDF. Confirm the stats
(100K+ / 50+ / 4+) and the brand list with her; use logos only with permission.
