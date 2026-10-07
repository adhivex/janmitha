-- LOCAL DEVELOPMENT ONLY. Do not run against production.
-- Demo portfolio items that point at the placeholder photos in /public/placeholders
-- so /portfolio has something to show before real shoots are uploaded via /admin.

insert into public.portfolio_items (category_id, image_url, alt_text, is_featured, sort_order)
select c.id, v.image_url, v.alt_text, v.is_featured, v.sort_order
from (values
  ('fashion-modeling', '/placeholders/fashion-modeling.jpg', 'Janmitha, fashion portrait (placeholder)', true, 1),
  ('fashion-modeling', '/placeholders/hero.jpg', 'Janmitha, studio portrait in black (placeholder)', false, 2),
  ('fashion-modeling', '/placeholders/about.jpg', 'Janmitha, outdoor portrait (placeholder)', false, 3),
  ('brand-campaigns', '/placeholders/brand-campaigns.jpg', 'Janmitha in bridal jewellery (placeholder)', true, 1),
  ('lifestyle', '/placeholders/lifestyle.jpg', 'Janmitha, relaxed lifestyle portrait (placeholder)', true, 1),
  ('lifestyle', '/placeholders/philosophy.jpg', 'Janmitha at golden hour (placeholder)', false, 2),
  ('editorials', '/placeholders/editorials.jpg', 'Janmitha, black and white editorial (placeholder)', true, 1)
) as v(slug, image_url, alt_text, is_featured, sort_order)
join public.portfolio_categories c on c.slug = v.slug;
