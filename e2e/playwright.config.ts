import type { PluginOptions } from '@grafana/plugin-e2e';
import { defineConfig, devices } from '@playwright/test';
import { dirname } from 'node:path';

const pluginE2eAuth = `${dirname(require.resolve('@grafana/plugin-e2e'))}/auth`;
const { name: PACKAGE_NAME } = require('../package.json');
const { createSourcePath, createSourceFilterConfig } = require('../scripts/utils/coverage');

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
      name: 'Treemap panel E2E tests',
      outputDir: './playwright-report/monocart',
      coverage: {
        outputDir: 'coverage/e2e/',
        reports: [
          ['v8'],
          ['html'],
          ['json'],
          ['text-summary'],
          ['lcov'],
          ['raw'],
        ],
        all: './src',
        baseDir: './',
        sourceFilter: createSourceFilterConfig({ 
          packageName: 'marcusolsson-treemap-panel',
          includeTypescriptOnly: true,
          excludeTypes: true 
        }),
        sourcePath: createSourcePath({ packageName: 'marcusolsson-treemap-panel' })
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
