-- Seed content taken from the approved design.
-- Values in [BRACKETS] are placeholders: replace in Supabase or the /admin page.
-- Stats and brand names come from the client's reference: confirm before launch.

insert into public.profile (
  id, display_name, hero_eyebrow, hero_intro, tagline, bio, beyond_frame, city,
  email, instagram_url, linkedin_url, showreel_url, story_video_url, media_kit_url,
  philosophy_headline, philosophy_sub, philosophy_quote
) values (
  1,
  'Janmitha',
  'MODEL · CONTENT CREATOR · BRAND FACE',
  'A model and content creator who brings style, a sharp mind and purpose to every brand story.',
  'Beauty. Intelligence. Impact.',
  'I''m Janmitha, a model and content creator. I love fashion, storytelling and purpose, and believe in continuous learning, creative freedom and using my platform to inspire positivity.',
  'With a background in IT and software, I understand products, platforms and audiences, which makes me an easy, informed partner for brands.',
  'Bangalore',
  '[HER EMAIL]',
  'https://instagram.com/[HANDLE]',
  'https://linkedin.com/in/[HANDLE]',
  null,
  null,
  null,
  'Creating a Brighter and Bolder Tomorrow',
  'Through fashion, technology and purpose.',
  'Style is a form of self-expression and I choose to express with purpose.'
)
on conflict (id) do nothing;

insert into public.stats (label, value, sort_order) values
  ('SOCIAL REACH', '100K+', 1),
  ('BRAND COLLABS', '50+', 2),
  ('YEARS MODELING', '4+', 3);

insert into public.brands (name, sort_order) values
  ('Tanishq', 1), ('Swarovski', 2), ('Nykaa', 3), ('Ajio', 4),
  ('Myntra', 5), ('Amazon', 6), ('Flipkart', 7);

insert into public.services (title, description, sort_order) values
  ('Brand Campaigns', 'Fashion, jewellery and beauty shoots, lookbooks and ad films.', 1),
  ('Content & Reels', 'Instagram reels, UGC and product storytelling in her own voice.', 2),
  ('Tech & Gadget Brands', 'Product launches presented with real understanding, not just a script.', 3),
  ('Purpose Projects', 'Cause-led campaigns that put positivity and impact first.', 4);

insert into public.portfolio_categories (slug, title, sort_order) values
  ('fashion-modeling', 'Fashion & Modeling', 1),
  ('brand-campaigns', 'Brand Campaigns', 2),
  ('lifestyle', 'Lifestyle', 3),
  ('editorials', 'Editorials', 4)
on conflict (slug) do nothing;

-- Cover photos and portfolio items are added through /admin (Storage bucket: portfolio).
-- Placeholder images live in /public/placeholders until real photography is uploaded.
