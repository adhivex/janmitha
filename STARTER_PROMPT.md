# Starter prompt for Claude Code

## How to start
1. Create an empty folder, e.g. `janmitha-site`, and copy this whole kit into it (keep `CLAUDE.md`, `docs/`, `supabase/`, `public/placeholders/`, `.env.example`).
2. Open a terminal in that folder and run `claude`.
3. Paste the prompt below.

## Prompt

```
Read CLAUDE.md, docs/DESIGN_SPEC.md and docs/BUILD_PLAN.md first.

Build the Janmitha portfolio website, phase by phase, starting with Phase 0 (scaffold)
and Phase 1 (static home page). Follow the design spec exactly: tokens, copy, sections,
motion. Mobile first at 390px, then enhance at md (768px) and up.

Rules:
- Use the exact copy from the spec. Never invent stats, brands or contact details; keep
  [PLACEHOLDER] values visible where information is missing.
- Use the placeholder photos in public/placeholders/ with next/image.
- Keep content in lib/content.ts for now, shaped to match the Supabase tables in
  supabase/migrations/0001_init.sql so Phase 2 is a drop-in swap.
- Respect prefers-reduced-motion, keep touch targets at least 44px, use real
  links/buttons/labels.

When Phase 1 is done: run npm run build, check 390 / 768 / 1280px, and give me a short
summary of what you built and which placeholders are still open. Then stop and wait for
my go-ahead before starting Phase 2 (Supabase).
```

## Prompts for later phases

**Phase 2 (Supabase)**
```
Start Phase 2. I have created the Supabase project and run 0001_init.sql and seed.sql;
the keys are in .env.local. Replace the static content with Supabase queries (server
components, ISR revalidate 300), keep the static fallback if env vars are missing, and
generate database types. Do not expose the service-role key to the client.
```

**Phase 3 (Enquiry form)**
```
Start Phase 3. Wire the Contact form: shared Zod schema, server action that verifies
Cloudflare Turnstile, inserts into the enquiries table, emails ENQUIRY_TO_EMAIL via
Resend and sends a short auto-reply. Add a honeypot field, inline success/error states
with aria-live, and make sure no secrets reach the client bundle.
```

**Phase 4 (Portfolio pages)**
```
Start Phase 4. Build /portfolio (category filter chips, responsive grid, accessible
lightbox with focus trap, Esc, arrow keys and swipe) and /portfolio/[slug]. Link them
from the home rail and "View All".
```

**Phase 5 (Admin)**
```
Start Phase 5. Build /admin protected by Supabase Auth plus the admin_users table. It
must work well on a phone. Screens: Profile, Stats, Brands, Services, Portfolio (upload
to the portfolio Storage bucket, category, caption, order, featured) and Enquiries
(list, mark replied/booked). Revalidate the public pages after each edit.
```

**Phase 6 (Polish and launch)**
```
Start Phase 6. Add metadata, Open Graph image, JSON-LD Person schema, sitemap, robots,
analytics and styled 404/500 pages. Then run a Lighthouse and axe audit on mobile and
fix anything below 90 or any accessibility violation.
```

## Before launch (client to-do)
- Real high-resolution photos (hero, About, four category covers, golden-hour photo)
- Confirm stats (100K+ reach, 50+ collaborations, 4+ years) and the brand list; use logos only with permission
- Her email, Instagram and LinkedIn links, showreel / story video URLs, media kit PDF
- Add her Supabase user id to `admin_users` so she can log in to `/admin`
