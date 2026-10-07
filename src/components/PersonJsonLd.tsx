import type { Profile } from "@/lib/content";
import { SITE_URL, isRealValue } from "@/lib/site";

/** schema.org Person for search engines. Placeholder values are left out. */
export function PersonJsonLd({ profile }: { profile: Profile }) {
  const sameAs = [profile.instagram_url, profile.linkedin_url].filter(isRealValue);
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.display_name,
    jobTitle: "Model and Content Creator",
    description: profile.hero_intro ?? undefined,
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    ...(profile.city ? { address: { "@type": "PostalAddress", addressLocality: profile.city, addressCountry: "IN" } } : {}),
    ...(isRealValue(profile.email) ? { email: `mailto:${profile.email}` } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
  return (
    <script
      type="application/ld+json"
      // JSON-LD must be inline; "<" is escaped so content can't close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
