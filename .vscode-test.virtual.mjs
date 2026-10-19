import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
    files: 'out/**/__test__/**/*.test.js',
    version: '1.125.0',
    launchArgs: ['--disable-gpu'],
    mocha: {
        timeout: 60_000,
    },
});
