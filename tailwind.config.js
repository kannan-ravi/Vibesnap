/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "profile-banner": "url('./src/assets/profile/Image-01.png')",
      },
    },
  },
  plugins: [],
};
