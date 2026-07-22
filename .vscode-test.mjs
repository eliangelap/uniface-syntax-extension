import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
    files: 'out/**/__test__/**/*.test.js',
});
