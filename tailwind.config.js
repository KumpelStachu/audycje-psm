/** @type {import('tailwindcss').Config} */
export default {
	content: ['**/*.html', '**/*.ts'],
	plugins: [require('daisyui')],
	daisyui: {
		themes: ['pastel'],
	},
}
