import { ImageResponse } from "next/og";
import { loadGoogleFont } from "@/lib/og/fonts";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
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
          borderRadius: 14,
          color: "#D9B073",
          fontSize: 50,
          fontFamily: "Cormorant",
          paddingBottom: 4,
        }}
      >
        J
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Cormorant", data: font, weight: 600, style: "normal" }] : [] },
  );
}
