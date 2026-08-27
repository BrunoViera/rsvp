import { ImageResponse } from "next/og";

export const alt = "El cumple de";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#FFF8EC",
          color: "#211934",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#3F7C59" }}>
          Gratis, sin tarjeta
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.1,
            marginTop: 20,
            maxWidth: 900,
          }}
        >
          El cumple de tu hijo, sin perseguir a nadie por WhatsApp
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            fontSize: 28,
            color: "rgba(33,25,52,0.5)",
          }}
        >
          elcumplede.com · Invitá con un link y mirá quién confirma
        </div>
      </div>
    ),
    size
  );
}
