/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "profile-banner": "url('./src/assets/profile/Image-01.png')",
        "custom-gradient":
          "linear-gradient(49.1deg, #FFDD55 6.59%, #FF543E 50.03%, #C837AB 93.47%)",
      },
    },
  },
  plugins: [],
};
