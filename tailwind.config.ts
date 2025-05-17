
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace'],
			},
			colors: {
				// Original colors
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				pitchsync: {
					50: '#EBF8FF',
					100: '#BEE3F8',
					200: '#90CDF4',
					300: '#63B3ED',
					400: '#4299E1',
					500: '#3182CE',
					600: '#2B6CB0',
					700: '#2A4365',
					800: '#1A365D',
					900: '#0F172A',
				},
				teal: {
					100: '#E6FFFA',
					200: '#B2F5EA',
					300: '#81E6D9',
					400: '#4FD1C5',
					500: '#38B2AC',
					600: '#319795',
					700: '#2C7A7B',
					800: '#285E61',
					900: '#234E52',
				},
				// Web3 Futuristic theme colors
				neon: {
					purple: '#9b87f5',
					blue: '#33c3f0',
					pink: '#d946ef',
					green: '#4ade80',
					cyan: '#22d3ee',
					yellow: '#facc15',
				},
				cyber: {
					dark: '#1a1f2c',
					darker: '#0f1015',
					light: '#8e9196',
					accent: '#7e69ab',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'pulse-glow': {
					'0%, 100%': { 
						opacity: '1',
						boxShadow: '0 0 5px 2px var(--glow-color, rgba(155, 135, 245, 0.4))'
					},
					'50%': { 
						opacity: '0.6',
						boxShadow: '0 0 15px 5px var(--glow-color, rgba(155, 135, 245, 0.7))'
					}
				},
				'floating': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				'blob': {
					'0%': { transform: 'translate(0px, 0px) scale(1)' },
					'33%': { transform: 'translate(30px, -50px) scale(1.1)' },
					'66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
					'100%': { transform: 'translate(0px, 0px) scale(1)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'pulse-glow': 'pulse-glow 3s infinite',
				'floating': 'floating 3s ease-in-out infinite',
				'blob': 'blob 7s infinite'
			},
			boxShadow: {
				'neon': '0 0 5px 2px var(--glow-color, rgba(155, 135, 245, 0.6))',
				'neon-hover': '0 0 15px 5px var(--glow-color, rgba(155, 135, 245, 0.9))',
				'glass': '0 4px 24px -2px rgba(0, 0, 0, 0.2)',
			},
			backdropBlur: {
				'xs': '2px',
			},
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function({ addUtilities }) {
			const newUtilities = {
				'.animation-delay-2000': {
					'animation-delay': '2s',
				},
				'.animation-delay-4000': {
					'animation-delay': '4s',
				},
				'.glass-effect': {
					'background': 'rgba(17, 18, 23, 0.7)',
					'backdrop-filter': 'blur(10px)',
					'border': '1px solid rgba(255, 255, 255, 0.1)',
				},
				'.text-glow': {
					'text-shadow': '0 0 10px var(--glow-color, rgba(155, 135, 245, 0.7))',
				},
				'.text-glow-sm': {
					'text-shadow': '0 0 5px var(--glow-color, rgba(155, 135, 245, 0.5))',
				},
				'.border-glow': {
					'box-shadow': '0 0 5px var(--glow-color, rgba(155, 135, 245, 0.3))',
					'border': '1px solid var(--border-color, rgba(155, 135, 245, 0.3))',
				},
				'.gradient-text': {
					'background-clip': 'text',
					'-webkit-background-clip': 'text',
					'color': 'transparent',
				}
			};
			addUtilities(newUtilities);
		}
	],
} satisfies Config;
