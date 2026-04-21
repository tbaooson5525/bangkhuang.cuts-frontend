import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary-shadcn))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary-shadcn))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // ── Sidebar tokens ──
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background, var(--background)))",
          foreground: "hsl(var(--sidebar-foreground, var(--foreground)))",
          primary: "hsl(var(--sidebar-primary, var(--primary-shadcn)))",
          "primary-foreground":
            "hsl(var(--sidebar-primary-foreground, var(--primary-foreground)))",
          accent: "hsl(var(--sidebar-accent, var(--accent)))",
          "accent-foreground":
            "hsl(var(--sidebar-accent-foreground, var(--accent-foreground)))",
          border: "hsl(var(--sidebar-border, var(--border)))",
          ring: "hsl(var(--sidebar-ring, var(--ring)))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "snow-4": "var(--radius-4)",
        "snow-8": "var(--radius-8)",
        "snow-12": "var(--radius-12)",
        "snow-16": "var(--radius-16)",
        "snow-20": "var(--radius-20)",
        "snow-24": "var(--radius-24)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      width: {
        sidebar: "var(--sidebar-width)",
        "sidebar-collapsed": "var(--sidebar-width-collapsed)",
        rightbar: "var(--rightbar-width)",
      },
      transitionDuration: { 250: "250ms" },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "none" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease both",
        "slide-in-left": "slide-in-left 0.25s cubic-bezier(0.4,0,0.2,1)",
        "slide-in-right": "slide-in-right 0.25s cubic-bezier(0.4,0,0.2,1)",
      },
    },
  },
  plugins: [],
};
export default config;
