import type { PluginOptions } from '@grafana/plugin-e2e';
import { defineConfig, devices } from '@playwright/test';
import { dirname } from 'node:path';

const pluginE2eAuth = `${dirname(require.resolve('@grafana/plugin-e2e'))}/auth`;
import { name as PACKAGE_NAME } from '../package.json';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<PluginOptions>({
  testDir: '/app/e2e/specs',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { host: '0.0.0.0', port: 9323 }],
    ['monocart-reporter', {
      name: 'Treemap Panel E2E Coverage',
      outputDir: './playwright-report/monocart',
      coverage: {
        reports: ['v8', 'html', 'json', 'text-summary', 'lcov'],
        outputDir: './coverage/e2e/',
        all: './src',
        baseDir: './',
        sourceFilter: (sourcePath) => {
          // Include TypeScript files that are either:
          // 1. In OUR project's src/ directories (not external ones)
          // 2. Root-level files in our plugin
          const isTypeScriptFile = sourcePath.endsWith('.ts') || sourcePath.endsWith('.tsx');
          const isOurSrcDirectory = sourcePath.startsWith('src/') ||
            (sourcePath.includes(PACKAGE_NAME) && sourcePath.includes('/src/'));
          const isRootPluginFile = sourcePath.includes(PACKAGE_NAME) &&
            !sourcePath.includes('node_modules/') &&
            !sourcePath.includes('webpack/') &&
            !sourcePath.includes('external ') &&
            !sourcePath.includes('/src/') &&  // Root files don't have /src/ in path
            !sourcePath.includes('grafana-plugin-support/');

          return isTypeScriptFile &&
            (isOurSrcDirectory || isRootPluginFile) &&
            !sourcePath.includes('.test.') &&
            !sourcePath.includes('.spec.') &&
            !sourcePath.includes('__tests__') &&
            !sourcePath.includes('__mocks__') &&
            !sourcePath.endsWith('.d.ts');
        },

        // NOTE: We must normalize paths to start with 'src/' instead of the
        //       package name for interoperability with Jest test reports.
        sourcePath: (filePath) => {
          if (filePath.includes(PACKAGE_NAME) && !filePath.includes('/src/')) {
            const fileName = filePath.split('/').pop();
            return `src/${fileName}`;
          }

          if (filePath.includes(`${PACKAGE_NAME}/grafana-plugin-support/`)) {
            return filePath.replace(`${PACKAGE_NAME}/`, 'src/');
          }

          if (filePath.includes(`${PACKAGE_NAME}/src/`)) {
            return filePath.replace(`${PACKAGE_NAME}/`, '');
          }

          return filePath;
        }
      }
    }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.GRAFANA_URL || 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    viewport: { width: 1280, height: 720 },
  },

  /* Configure projects for major browsers */
  projects: [
    // 1. Login to Grafana and store the cookie on disk for use in other tests.
    {
      name: 'auth',
      testDir: pluginE2eAuth,
      testMatch: [/.*\.js/],
    },
    // 2. Run tests in Google Chrome. Every test will start authenticated as admin user.
    {
      name: 'chromium',
      testDir: '/app/e2e/specs',
      testMatch: '**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/admin.json',
      },
      dependencies: ['auth'],
    },
  ],
});
