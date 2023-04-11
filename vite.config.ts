import { readdirSync, renameSync, rmSync } from 'fs'
import { defineConfig } from 'vite'
import { resolve } from 'path'

const pages = readdirSync(resolve(__dirname, 'src/pages'))

export default defineConfig({
	plugins: [
		{
			name: 'mpa-copy',
			closeBundle() {
				pages.forEach(path => {
					renameSync(
						resolve(__dirname, 'dist/src/pages', path, 'index.html'),
						resolve(__dirname, 'dist', path === 'index' ? '' : path, 'index.html')
					)
				})
				rmSync(resolve(__dirname, 'dist/src'), { recursive: true })
			},
		},
	],
	build: {
		rollupOptions: {
			input: Object.fromEntries(
				pages.map(path => [path, resolve(__dirname, 'src/pages', path, 'index.html')])
			),
		},
	},
})
