import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cacheLife } from "next/cache";
import { ImageResponse } from "next/og";
import { loadGoogleFont } from "@/lib/og/fonts";
import { getHomeContent } from "@/lib/queries";

export const alt = "Janmitha, model and content creator in Bangalore";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function heroDataUrl(heroUrl: string | null) {
  "use cache";
  cacheLife("days");
  try {
    if (heroUrl?.startsWith("http")) {
      const res = await fetch(heroUrl, { signal: AbortSignal.timeout(8000) });
      const type = res.headers.get("content-type") ?? "image/jpeg";
      return `data:${type};base64,${Buffer.from(await res.arrayBuffer()).toString("base64")}`;
    }
    const file = await readFile(join(process.cwd(), "public", heroUrl ?? "/placeholders/hero.jpg"));
    return `data:image/jpeg;base64,${file.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const { profile } = await getHomeContent();
  const name = profile.display_name.toUpperCase();
  const tagline = (profile.tagline ?? "").toUpperCase();
  const eyebrow = `MODEL · CONTENT CREATOR · ${(profile.city ?? "").toUpperCase()}`;
  const [display, body, hero] = await Promise.all([
    loadGoogleFont("Cormorant Garamond", 600, name),
    loadGoogleFont("Jost", 400, tagline + eyebrow),
    heroDataUrl(profile.hero_image_url),
  ]);
  const fonts = [
    ...(display ? [{ name: "Cormorant", data: display, weight: 600 as const, style: "normal" as const }] : []),
    ...(body ? [{ name: "Jost", data: body, weight: 400 as const, style: "normal" as const }] : []),
  ];

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#0B0806", position: "relative" }}>
        {hero && (
          <img
            src={hero}
            alt=""
            width={660}
            height={630}
            style={{ position: "absolute", right: 0, top: 0, width: 660, height: 630, objectFit: "cover", objectPosition: "62% 18%" }}
          />
        )}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            background: "linear-gradient(90deg, #0B0806 45%, rgba(11,8,6,0.82) 66%, rgba(11,8,6,0.1) 100%)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, color: "#CDBDA2", fontSize: 22, letterSpacing: 6, fontFamily: "Jost" }}>
            <div style={{ width: 44, height: 2, background: "#D9B073" }} />
            {eyebrow}
          </div>
          <div style={{ display: "flex", fontFamily: "Cormorant", fontSize: 150, lineHeight: 1, marginTop: 24 }}>
            <span style={{ color: "#F7F1E8" }}>{name.slice(0, 3)}</span>
            <span
              style={{
                backgroundImage: "linear-gradient(110deg, #8F6C36 0%, #D9B073 36%, #F6E2B8 52%, #D9B073 68%, #8F6C36 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {name.slice(3)}
            </span>
          </div>
          <div style={{ color: "#F7F1E8", fontSize: 26, letterSpacing: 10, marginTop: 28, fontFamily: "Jost" }}>{tagline}</div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
