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
            alignItems: "center",
            marginTop: "auto",
            fontSize: 28,
            color: "rgba(33,25,52,0.5)",
          }}
        >
        <svg
          width="46"
          height="46"
          viewBox="0 0 40 40"
          style={{ marginRight: 14 }}
        >
          <path
            d="M2.5 11c7-6.5 14.5-6.5 17.5 0s10.5 6.5 17.5 0"
            fill="none"
            stroke="#211934"
            strokeWidth="3.6"
            strokeLinecap="round"
          />
          <path d="M4 12h11.5L9.75 27z" fill="#F2A93B" />
          <path d="M14.5 13.5h11L20 28.5z" fill="#3F7C59" />
          <path d="M24.5 12H36l-5.75 15z" fill="#F2A93B" />
        </svg>
          elcumplede.com · Invitá con un link y mirá quién confirma
        </div>
      </div>
    ),
    size
  );
}
