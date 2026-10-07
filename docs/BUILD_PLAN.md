# Build Plan

Work phase by phase. Finish and verify each phase (`npm run build`, check at 390 / 768 / 1280px) before starting the next. Commit after each phase.

## Phase 0: Scaffold
- `npx create-next-app@latest` (TypeScript, Tailwind, App Router, ESLint, `src/` dir, import alias `@/*`).
- Install: `@supabase/supabase-js @supabase/ssr zod react-hook-form @hookform/resolvers resend framer-motion lucide-react`.
- Load fonts with `next/font/google` (Cormorant Garamond, Jost, Pinyon Script) and expose as CSS variables.
- Put design tokens from `docs/DESIGN_SPEC.md` in `tailwind.config.ts` and `globals.css` (colors, gold gradients, glass utility, keyframes, reduced-motion block).
- Copy `public/placeholders/*` into the project.
- **Done when:** blank page renders with correct fonts and background; build passes.

## Phase 1: Static home page
Build all 8 sections from the spec as server components with a typed `lib/content.ts` fallback (copy exactly as written in the spec). Small client components only where needed: mobile menu sheet, brand marquee, showreel dialog.
- Components: `Header`, `Hero`, `StatsBar`, `BrandMarquee`, `About`, `PortfolioRail`, `Collaborations`, `Philosophy`, `Contact`, `Footer`.
- **Done when:** page matches the spec at 390px and degrades gracefully to 1280px; no horizontal scroll; keyboard and reduced-motion checks pass; Lighthouse mobile 90+.

## Phase 2: Supabase
- Create a Supabase project. Run `supabase/migrations/0001_init.sql`, then `supabase/seed.sql`.
- Add `.env.local` from `.env.example`.
- `lib/supabase/server.ts` and `client.ts` (using `@supabase/ssr`); typed queries in `lib/queries.ts` for profile, stats, brands, categories, items, services.
- Replace static content with queries; keep the static fallback when env vars are missing or a query fails.
- Revalidate content with ISR (`revalidate = 300`) and an on-demand revalidate route for after admin edits.
- Generate DB types: `npx supabase gen types typescript --project-id <id> > src/types/database.ts`.
- **Done when:** editing a row in Supabase changes the site after revalidation.

## Phase 3: Enquiry form
- Zod schema (name 2 to 100, brand up to 120, email valid, message 10 to 2000) shared by client and server.
- Server action: verify Cloudflare Turnstile token, validate, insert into `enquiries`, send email to `ENQUIRY_TO_EMAIL` via Resend, send a short auto-reply to the sender.
- Inline success and error states; disable the button while submitting; honeypot field as a second spam layer.
- **Done when:** a test enquiry lands in the table and in the inbox; invalid input shows clear errors; no secrets in the client bundle.

## Phase 4: Portfolio pages
- `/portfolio` with category filter chips, responsive masonry/grid, `next/image`, accessible lightbox (focus trap, Esc, arrow keys, swipe on touch).
- `/portfolio/[slug]` for each category; link from the home rail and "View All".
- **Done when:** photos load progressively with no layout shift; lightbox is fully keyboard accessible.

## Phase 5: Admin
- `/admin` protected by Supabase Auth plus the `admin_users` table (middleware redirect when not an admin).
- Screens: Profile (all text fields), Stats, Brands, Services (add, edit, reorder, hide), Portfolio (upload to the `portfolio` Storage bucket, set category, caption, order, featured), Enquiries (list, mark replied or booked).
- Mobile friendly: she will use this from her phone.
- **Done when:** she can add a new shoot photo and see it on the site without code changes.

## Phase 6: Polish and launch
- SEO: metadata, Open Graph image, JSON-LD `Person`, sitemap, robots.
- Analytics (Vercel Analytics or Plausible). Custom domain on Vercel. Error pages (404, 500) in the same style.
- Replace placeholders: real photos, email, social handles, showreel URL, media kit PDF; confirm stats and brand list with Janmitha.
- Final audit: Lighthouse, axe accessibility check, test on a real phone.
