import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
    files: 'out/**/__test__/**/*.test.js',
    version: '1.130.0',
});
