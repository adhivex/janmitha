# Janmitha Portfolio Website

Premium, mobile-first portfolio site for **Janmitha**, a model and content creator based in **Bangalore** (with an IT/software background). Its job: help her win new modeling and brand-collaboration projects. Modeling and brand work lead; the IT background is a quiet differentiator, never the headline.

Read these before writing code:
- `docs/DESIGN_SPEC.md`: tokens, layout, copy, animations (the source of truth for the look)
- `docs/BUILD_PLAN.md`: phased build with acceptance checks
- `supabase/migrations/0001_init.sql` and `supabase/seed.sql`: database, security rules, seed content

## Stack
- Next.js (App Router) + TypeScript, Tailwind CSS, Framer Motion (optional, CSS keyframes are fine)
- shadcn/ui + Radix only where it adds accessibility (dialog, sheet menu)
- Supabase: Postgres (content + enquiries), Storage (photos), Auth (admin login)
- Forms: React Hook Form + Zod + Next.js server action; email via Resend; Cloudflare Turnstile for spam protection
- Fonts via `next/font/google`: Cormorant Garamond, Jost, Pinyon Script
- Deploy: Vercel

## Hard rules
1. **Mobile first.** Design for a 390px viewport, then enhance at `md` (768px) and up. Never ship horizontal page scroll.
2. **Match the design spec exactly**: colors, type, spacing, radii, copy. Do not restyle or "improve" the look without being asked.
3. **No invented facts.** Stats (100K+ reach, 50+ collabs, 4+ years) and the brand list come from the client's reference and must be confirmed by her. Anything unknown is a visible placeholder like `[HER EMAIL]`, `[HANDLE]`, never made-up content.
4. **Content comes from Supabase**, with a typed static fallback (`lib/content.ts`) so the site still renders if env vars are missing.
5. **Accessibility:** real `<a>`, `<button>`, `<label>` + `<input>`; `aria-label` on icon-only buttons; touch targets at least 44px; text contrast at least 4.5:1; respect `prefers-reduced-motion` (turn off shimmer, marquee, float, entrance animations).
6. **Performance:** `next/image` for all photos with correct `sizes`; hero image `priority`; no layout shift; target Lighthouse 90+ on mobile for performance, accessibility, SEO.
7. **Security:** the public can only read content tables and insert into `enquiries`. Never expose the service-role key to the client. Validate enquiries on the server (Zod) and verify Turnstile before inserting.
8. **Photos are placeholders** (`public/placeholders/`, low-res crops from the reference). Build so real photos can be swapped via Supabase Storage with no code changes.
9. No emoji in the UI. Icons are inline SVG or lucide-react, stroke style.

## Commands (once scaffolded)
- `npm run dev`: local dev
- `npm run build`: must pass before any task is called done
- `npm run lint` and `npm run typecheck`
- `npm run db:start` / `db:reset` / `db:types`: local Supabase stack (ports 55020-55029)
- `npm run admin:create -- <email> [password]`: add an admin login

## Definition of done for any task
- Works and looks right at 390px, 768px and 1280px
- `npm run build` passes, no TypeScript or lint errors
- Keyboard navigable, visible focus states
- Short summary of what changed and any placeholders still open
