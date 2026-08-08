/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B0D0F",
        surface: "#111417",
        card: "#171B1F",
        border: "#22272B",
        primary: { DEFAULT: "#C8FF3D", dark: "#a8d82f", ink: "#10120a" },
        txt: { DEFAULT: "#E8ECEE", sec: "#899197", mut: "#687177" },
        stat: { avail: "#C8FF3D", reserved: "#F2C94C", charging: "#6CCBFF", error: "#FF6B6B" }
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"]
      },
      borderRadius: { xl2: "1rem" },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.02), 0 8px 24px rgba(0,0,0,0.3)"
      }
    }
  },
  plugins: []
}
