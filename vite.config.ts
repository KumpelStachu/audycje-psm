import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				klasa4: resolve(__dirname, 'klasa-4/index.html'),
				klasa5: resolve(__dirname, 'klasa-5/index.html'),
				klasa6: resolve(__dirname, 'klasa-6/index.html'),
			},
		},
	},
})
