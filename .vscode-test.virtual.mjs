import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
    tests: [{
        files: 'out/**/__test__/**/*.test.js',
        version: '1.125.0',
        launchArgs: ['--disable-gpu'],
        mocha: {
            timeout: 60_000,
        },
    }],
    coverage: {
        exclude: ['out/**/__test__/**', 'out/extension.js'],
        reporter: ['text', 'html', 'json'],
        output: 'coverage',
    },
});
