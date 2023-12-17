/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        logo: ["Acme", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
      },
      colors: {
        primary: "#242325",
        secondary: "#F2F4FF",
        yellow: "#FFDD4A",
        green: "#087E8B",
      },
      backgroundImage: {
        "bg-video": "url('assets/videos/bg-video.mp4')",
      },
    },
  },
  plugins: [],
};
