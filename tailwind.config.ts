import aspectRatio from '@tailwindcss/aspect-ratio'
import forms from '@tailwindcss/forms'
import { type Config } from 'tailwindcss'

export default {
	content: ['./app/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			keyframes: {
				gradient: {
					'0%': { 'background-position': '0% 50%' },
					'50%': { 'background-position': '100% 50%' },
					'100%': { 'background-position': '0% 50%' },
				},
			},
			animation: {
				grad: 'gradient 6s ease infinite',
			},
			backgroundSize: {
				'2x': '200%',
			},
			borderRadius: {
				custom: '7px',
			},
			screens: {
				xs: '479px',
			},
			zIndex: {
				1000: '1000',
			},
		},
		colors: {
			transparent: 'transparent',
			background: '#fcf7f4',
			'background-darker': '#F1DACC',
			'background-lighter': '#fefbfa',
			text: '#241c15',
			'text-mid': '#505050',
			'text-light': '#757575',
			'text-lighter': '#BDBDBD',
			black: '#222222',
			white: '#FFFFFF',
			cold: '#0094fe',
			colder: '#005089',
			mid: '#ffe01b',
			warm: '#ff4314',
			'warm-pastel': '#ffebe5',
			warmer: '#e60023',
			contrast: '#7c4dff',
			'contrast-cold': '#BDB0D9',
			'contrast-warm': '#BF0F30',
			highlight: '#3A1AF0',
			'highlight-cold': '#1A02A3',
			// New Colors
			ameixa: '#692340',
			chila: '#FBEECA',
			couve: '#007C89',
			inhame: '#FBCFBD',
			pimenta: '#241C15',
			rabanete: '#F9E0FA',
		},
		fontFamily: {
			sans: [
				'-apple-system',
				'BlinkMacSystemFont',
				'avenir next',
				'avenir',
				'segoe ui',
				'helvetica neue',
				'helvetica',
				'Cantarell',
				'Ubuntu',
				'roboto',
				'noto',
				'arial',
				'sans-serif',
			],
			serif: ['Lato', 'sans-serif'],
		},
	},
	plugins: [aspectRatio, forms],
	future: {
		hoverOnlyWhenSupported: true,
	},
} satisfies Config
