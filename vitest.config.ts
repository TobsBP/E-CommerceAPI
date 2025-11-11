import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		globals: true,
		environment: 'node',
		include: ['src/tests/**/*.test.ts'],
		clearMocks: true,
		coverage: {
			reporter: ['text', 'lcov'],
			provider: 'v8',
		},
		mockReset: true,
	},
})
