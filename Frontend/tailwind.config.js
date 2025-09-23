/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "#ecfdf5",
                    100: "#d1fae5",
                    200: "#a7f3d0",
                    300: "#6ee7b7",
                    400: "#34d399",
                    500: "#22c55e", // Main brand green
                    600: "#16a34a",
                    700: "#15803d",
                    800: "#166534",
                    900: "#14532d",
                },
                secondary: {
                    50: "#eff6ff",
                    100: "#dbeafe",
                    200: "#bfdbfe",
                    300: "#93c5fd",
                    400: "#60a5fa",
                    500: "#3b82f6", // Blue accent
                    600: "#2563eb",
                    700: "#1d4ed8",
                    800: "#1e40af",
                    900: "#1e3a8a",
                },
            },
            boxShadow: {
                glass: "0 10px 30px -10px rgba(0,0,0,0.35)",
                "glass-hover": "0 20px 40px -15px rgba(0,0,0,0.4)",
            },
            backdropBlur: {
                xs: "2px",
            },
            keyframes: {
                "slide-in": {
                    "0%": {
                        transform: "translateX(100%)",
                        opacity: "0",
                    },
                    "100%": {
                        transform: "translateX(0)",
                        opacity: "1",
                    },
                },
                "slide-out": {
                    "0%": {
                        transform: "translateX(0)",
                        opacity: "1",
                    },
                    "100%": {
                        transform: "translateX(100%)",
                        opacity: "0",
                    },
                },
                float: {
                    "0%, 100%": { 
                        transform: "translateY(0)" 
                    },
                    "50%": { 
                        transform: "translateY(-8px)" 
                    }
                },
                wiggle: {
                    "0%, 100%": { 
                        transform: "rotate(-2deg)" 
                    },
                    "50%": { 
                        transform: "rotate(2deg)" 
                    }
                },
                typing: {
                    "0%": { 
                        opacity: "0.2" 
                    },
                    "50%": { 
                        opacity: "1" 
                    },
                    "100%": { 
                        opacity: "0.2" 
                    }
                },
                pulseGlow: {
                    "0%": { 
                        opacity: "0.3", 
                        transform: "scale(1)" 
                    },
                    "70%": { 
                        opacity: "0.06", 
                        transform: "scale(1.5)" 
                    },
                    "100%": { 
                        opacity: "0", 
                        transform: "scale(1.9)" 
                    }
                }
            },
            animation: {
                "slide-in": "slide-in 0.3s ease-out forwards",
                "slide-out": "slide-out 0.3s ease-in forwards",
                float: "float 5s ease-in-out infinite",
                wiggle: "wiggle 6s ease-in-out infinite",
                typing: "typing 1.2s ease-in-out infinite",
                pulseGlow: "pulseGlow 2.5s ease-out infinite"
            }
        },
    },
    plugins: [],
};