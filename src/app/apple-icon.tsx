import { ImageResponse } from "next/og";
import { loadGoogleFont } from "@/lib/og/fonts";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const font = await loadGoogleFont("Cormorant Garamond", 600, "J");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0806",
          color: "#D9B073",
          fontSize: 140,
          fontFamily: "Cormorant",
          paddingBottom: 10,
        }}
      >
        J
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Cormorant", data: font, weight: 600, style: "normal" }] : [] },
  );
}
