# Design Spec: Janmitha Portfolio

Look: **dark luxury editorial**. Near-black ground, champagne-gold gradient accents, frosted-glass surfaces, high-contrast serif headlines, one cream "About" band for contrast. Mobile-first at 390px; content max-width 1200px centered.

## 1. Tokens

### Colors
| Token | Value | Use |
|---|---|---|
| `ink` | `#0B0806` | page background |
| `ink-raised` | `#15100B` / `#1A130D` | contact card, card placeholder bg |
| `cream` | `#F4ECDF` | About section background |
| `cream-card` | `#EADFCB` (border `#D4BC93`) | "Beyond the Frame" card |
| `text` | `#F7F1E8` | primary text on dark |
| `text-soft` | `#E6DAC5` | body on dark |
| `text-muted` | `#CDBDA2` | labels, captions on dark |
| `text-faint` | `#B9AA92` / `#A99B85` | scroll hint, footer |
| `ink-text` | `#1A130B` | text on gold buttons; headings on cream `#14100B` |
| `cream-body` | `#3A2F22`, labels `#6B5A44`, italic accent `#9A6F2E` | text on cream |
| `gold` (accent) | `#D9B073` | single tweakable accent |
| `gold-line` | `rgba(217,176,115,0.24)` to `0.5` | hairlines, borders |
| `glass-bg` | `rgba(26,19,13,0.55)` | glass surfaces |
| `glass-border` | `rgba(255,255,255,0.13)` | glass borders |

Gradients (build from the accent `A`):
- **Gold text:** `linear-gradient(110deg, #8F6C36 0%, A 36%, #F6E2B8 52%, A 68%, #8F6C36 100%)`, `background-size: 220% 100%`, `background-clip: text`, transparent text, shimmer animation (below).
- **Gold button:** `linear-gradient(135deg, #F3DDB0 0%, A 48%, #B98A4A 100%)`, text `#1A130B`.

Glass surface = glass-bg + `backdrop-filter: blur(18px) saturate(140%)` + 1px glass-border.

### Typography
- **Display:** Cormorant Garamond (400/500/600/700 + italic). Headlines, numerals, quotes.
- **Body/UI:** Jost 300/400/500.
- **Script:** Pinyon Script, signatures and "Let's Collaborate" only.
- **Eyebrow style:** Jost 11px, uppercase, letter-spacing 0.34em, color text-muted, preceded by a 28px x 1px gold line.

| Element | Mobile | md+ |
|---|---|---|
| Hero name "JANMITHA" ("JAN" white, "MITHA" gold shimmer) | 68px / 0.9 line-height, nowrap | 150px |
| Section H2 | 44 to 54px, Cormorant 500, line-height ~1 | scale up ~1.3x |
| Hero body | 16px / 1.6 | same |
| Row titles (collaborations) | 28px Cormorant 500 | same |
| Stat numerals | 40px Cormorant 600, gold shimmer | same |
| Labels | 10 to 12px, tracking 0.16 to 0.3em | same |

### Shape and spacing
- Pills: `border-radius: 999px`. Cards: 26px. Glass captions: 18px. Contact card: 32px. Quote card: 24px.
- Section padding: 20 to 24px horizontal on mobile; vertical rhythm 44 to 60px.
- Buttons: min-height 52 to 56px; icon-circle buttons 36 to 50px. Hover lift: `translateY(-2px)` + gold glow `0 14px 34px rgba(217,176,115,.38)`.
- Breakpoint: `md` = 768px.

## 2. Motion (all CSS; disable under `prefers-reduced-motion`)
| Name | Behavior |
|---|---|
| `shimmer` | gold text gradient position 0% to -220%, 8s linear infinite |
| `fade-up` | opacity 0 + translateY(20px) to rest, 1s `cubic-bezier(.2,.7,.2,1)`, staggered delays .1/.25/.4/.55s on hero items (load-time, not scroll-driven) |
| `pulse` | 8px gold dot, ring expands and fades, 2.2s infinite |
| `float` | translateY 0 to -8px, 6s ease-in-out infinite (quote card, About badge) |
| `marquee` | track translateX 0 to -50%, 40s linear infinite, pauses on hover; list rendered twice for seamless loop; edge fade mask `transparent, #000 12%, #000 88%, transparent` |
| `scroll-line` | 1px x 34px gold line scales in and out, 2.6s infinite |
| Gallery card hover | image `scale(1.07)` over .8s |
| Row hover | left padding 4px to 12px |

## 3. Sections (in order)

### 3.1 Hero (min-height ~790px, `id="top"`)
- Background: portrait photo top-right (mobile 92% width, md 56%), height ~720px, `object-position: 62% 18%`, bottom fade mask (`#000 62%` to transparent). Overlay `linear-gradient(90deg, ink 12%, rgba(11,8,6,.6) 52%, transparent)` for text legibility. Soft gold radial glow top-right.
- **Header:** glass pill, `JANMITHA` wordmark (Cormorant 600, 19px, tracking .34em), gold pill button "Let's Connect" with up-right arrow, menu icon button (two-line hamburger). Menu opens a full-screen sheet with links: About, Portfolio, Collaborate, Contact.
- Status chip (glass, pulsing dot): **OPEN FOR COLLABORATIONS**
- Eyebrow: `MODEL · CONTENT CREATOR · BRAND FACE`
- H1: **JAN** + **MITHA**
- Tagline (15px, tracking .38em, 3 lines): `BEAUTY.` / `INTELLIGENCE.` / `IMPACT.`
- Body: "A model and content creator who brings style, a sharp mind and purpose to every brand story."
- Location line with pin icon: `BASED IN BANGALORE`
- Buttons: primary "Explore My World" (gold, links to `#gallery`); ghost "Showreel" with round play icon (opens showreel dialog if `profile.showreel_url` set, else hidden or disabled).
- Floating glass quote card (right, ~top 600px on mobile, float animation): italic "More than a look, it's a mindset." + Pinyon Script "Janmitha" in gold.
- Bottom center: `SCROLL` + animated line.

### 3.2 Stats (overlaps hero bottom, z above)
Glass card, radius 26, 3 equal columns with gold hairline dividers. Gold-shimmer numerals + 10px tracked labels:
`100K+ SOCIAL REACH` · `50+ BRAND COLLABS` · `4+ YEARS MODELING` (from `stats` table; **client must confirm**).

### 3.3 Brand marquee
Eyebrow centered: `BRANDS I'VE WORKED WITH`. Hairlines top and bottom. Brand names in Cormorant italic 500, 32px, color `#EADFCB`, separated by a small gold star. Names (confirm with client; use logos only with permission): Tanishq, Swarovski, Nykaa, Ajio, Myntra, Amazon, Flipkart.

### 3.4 About (cream band, `id="story"`)
- Stacks on mobile; on md two columns (image ~44%, text ~56%), vertically centered.
- Image: **arch** (`border-radius: 220px 220px 28px 28px`), 4:5, width 82% (max 420px), soft shadow; offset 1px gold arch outline behind it (shifted up-left); floating black pill badge bottom-right: `AUTHENTIC · VERSATILE · REAL` with gold dot.
- Eyebrow `01 / ABOUT` (cream variant, color `#6B5A44`)
- H2: "More than" / italic gold-brown "a look."
- Body: "I'm Janmitha, a model and content creator. I love fashion, storytelling and purpose, and believe in continuous learning, creative freedom and using my platform to inspire positivity."
- **Beyond the Frame card** (cream-card, code icon): label `BEYOND THE FRAME`; text: "With a background in IT and software, I understand products, platforms and audiences, which makes me an easy, informed partner for brands."
- Dark pill button "Know My Story" (scrolls to `#contact` for now).

### 3.5 Portfolio (`id="gallery"`)
- Eyebrow `02 / PORTFOLIO`; H2 "A Glimpse Into" / gold-shimmer italic "My World"; ghost pill "View All" (links to `/portfolio`).
- **Mobile:** horizontal scroll-snap rail, cards 236px wide, 3:4, radius 26, gap 14, hidden scrollbar. **md+:** 4-column grid.
- Card: photo, index number (`01`..`04`, Cormorant 20px) top-left, glass caption bar at bottom with category label (tracking .16em) and a round gold arrow button.
- Categories: `FASHION & MODELING`, `BRAND CAMPAIGNS`, `LIFESTYLE`, `EDITORIALS` (from `portfolio_categories`). Each links to `/portfolio/[slug]`.

### 3.6 Work With Me
Eyebrow `03 / WORK WITH ME`; H2 "Ways we can" / gold-shimmer italic "collaborate". Numbered editorial rows (1 column on mobile, 2 columns on md), each: gold number, Cormorant 28px title, 14px muted description, circular arrow button, top hairline; whole row links to `#contact`.
1. **Brand Campaigns:** Fashion, jewellery and beauty shoots, lookbooks and ad films.
2. **Content & Reels:** Instagram reels, UGC and product storytelling in her own voice.
3. **Tech & Gadget Brands:** Product launches presented with real understanding, not just a script.
4. **Purpose Projects:** Cause-led campaigns that put positivity and impact first.

### 3.7 Philosophy
Full-bleed golden-hour photo with top and bottom fade to ink. Eyebrow `04 / MY PHILOSOPHY`. H2: "Creating a Brighter and *Bolder* Tomorrow" (Bolder = gold shimmer italic). Sub: "Through fashion, technology and purpose." Ghost pill with play icon "WATCH MY STORY" (opens `story_video_url` dialog). Glass quote card bottom-right: large gold opening quote mark + italic "Style is a form of self-expression and I choose to express with purpose."

### 3.8 Contact (`id="contact"`)
Card: radius 32, 1px gold border (50%), gold radial glow top-left, subtle outer glow.
- Pinyon Script "Let's Collaborate" (60px, gold shimmer)
- Location line: pin + `BASED IN BANGALORE`
- Pills: Fashion · Technology · Lifestyle · Positive Impact
- **Enquiry form** (labels visible, 12px tracked caps): Your Name, Brand / Company (2 columns on md), Email, Tell me about the project (textarea). Fields: 48px min height, radius 14, translucent fill, gold focus ring. Submit "Send Enquiry" (gold). Success and error states shown inline (`aria-live="polite"`).
- Secondary: ghost "Media Kit" (download from `profile.media_kit_url`).
- Social circles (50px, gold border): Instagram, LinkedIn, Email.
- Footer line: `© JANMITHA · BEAUTY. INTELLIGENCE. IMPACT.`

## 4. Extra pages (phase 3+)
- `/portfolio`: category filter chips + masonry grid + lightbox (keyboard accessible).
- `/portfolio/[slug]`: category gallery.
- `/admin` (Supabase Auth, admin only): edit profile, stats, brands, services; upload photos; reorder; view and mark enquiries.

## 5. SEO and sharing
Title: "Janmitha | Model, Content Creator & Brand Face, Bangalore". Meta description from `profile.tagline`. Open Graph image from hero photo. JSON-LD `Person` (name, jobTitle "Model and Content Creator", address locality Bangalore, sameAs social links). `sitemap.xml`, `robots.txt`.
