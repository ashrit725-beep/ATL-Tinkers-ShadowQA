/** @type {import('tailwindcss').Config} */
module.exports = {
  blocklist: ["overline"],
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        canvas: "#FBF9F5",
        surface: "#F3EFE8",
        line: "#E5DFD5",
        ink: "#1C1917",
        ink2: "#57534E",
        mute: "#A8A29E",
        brass: "#B45309",
        amber: "#C26723",
        forest: "#1C3829",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
      },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },
      keyframes: {
        rise: { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },
      animation: { rise: "rise 0.5s cubic-bezier(0.16, 1, 0.3, 1) both" },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
