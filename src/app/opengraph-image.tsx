import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const runtime = "edge";
export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          background: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 44,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#ff6261",
          }}
        >
          Revista de acciones culturales
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            fontSize: 210,
            fontWeight: 800,
            lineHeight: 1,
            marginTop: 24,
            color: "#ff6261",
          }}
        >
          <span style={{ marginRight: 8 }}>[</span>olvidos
        </div>
        <div style={{ marginTop: 40, fontSize: 40, color: "#141414" }}>
          Literatura, pensamiento y memoria cultural granadina · Granada, desde 1981
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 24,
            background: "#ff6261",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
