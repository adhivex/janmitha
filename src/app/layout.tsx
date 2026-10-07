import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost, Pinyon_Script } from "next/font/google";
import { getHomeContent } from "@/lib/queries";
import { SITE_TITLE, SITE_URL } from "@/lib/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const pinyon = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  // Only used below the fold and in small accents: don't compete with the hero photo.
  preload: false,
});

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getHomeContent();
  const description = profile.tagline ?? "Model and content creator based in Bangalore.";
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: SITE_TITLE, template: "%s | Janmitha" },
    description,
    applicationName: "Janmitha",
    openGraph: {
      type: "website",
      siteName: "Janmitha",
      title: SITE_TITLE,
      description,
      url: "/",
      locale: "en_IN",
    },
    twitter: { card: "summary_large_image", title: SITE_TITLE, description },
  };
}

export const viewport: Viewport = {
  themeColor: "#0B0806",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jost.variable} ${pinyon.variable}`}
    >
      <body className="min-h-dvh bg-ink text-text antialiased">
        {children}
        {/* Vercel Web Analytics: only active when deployed on Vercel. */}
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  );
}
