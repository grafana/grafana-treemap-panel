// force timezone to UTC to allow tests to work regardless of local timezone
// generally used by snapshots, but can affect specific tests
process.env.TZ = 'UTC';

const { createSourcePath, createSourceFilterConfig } = require('./scripts/utils/coverage');

module.exports = {
  // Jest configuration provided by Grafana scaffolding
  ...require('./.config/jest.config'),
  
  // Enable coverage with V8 provider for monocart reports
  collectCoverage: true,
  coverageProvider: 'v8',
  coverageReporters: ['none'], // Monocart reporter will handle reports
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx,js,jsx}',
    '!src/**/*.spec.{ts,tsx,js,jsx}',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
    '!src/**/types.ts', // Exclude type definition files
  ],
  
  // Custom reporters
  reporters: [
    'default',
    ['jest-monocart-coverage', {
      name: 'Coverage Report - Treemap panel Jest unit tests',
      outputDir: './coverage/unit',
      reports: [
        ['v8'],
        ['console-summary'],
        ['lcov'],
        ['json'],
        ['raw'],
      ],
      all: './src',
      sourceFilter: createSourceFilterConfig({ 
        excludeTypes: true, 
        packageName: 'marcusolsson-treemap-panel',
        includeTypescriptOnly: false
      }),
      sourcePath: createSourcePath({ packageName: 'marcusolsson-treemap-panel' })
    }]
  ]
};
