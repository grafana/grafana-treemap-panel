// force timezone to UTC to allow tests to work regardless of local timezone
// generally used by snapshots, but can affect specific tests
process.env.TZ = 'UTC';

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
    'default', // Keep default Jest console output
    ['jest-monocart-coverage', {
      name: 'Treemap Panel Jest Unit Tests Coverage',
      reports: [
        'v8',
        'console-summary',
        'lcov'
      ],
      outputDir: './coverage/unit',
      
      // Include all files, even untested ones (show 0% coverage)
      all: './src',
      
      // Filter to only include our TypeScript/JavaScript files
      sourceFilter: (sourcePath) => {
        return sourcePath.startsWith('src/') && 
               (sourcePath.endsWith('.ts') || sourcePath.endsWith('.tsx') || 
                sourcePath.endsWith('.js') || sourcePath.endsWith('.jsx')) &&
               !sourcePath.includes('.test.') &&
               !sourcePath.includes('.spec.') &&
               !sourcePath.includes('__tests__') &&
               !sourcePath.includes('__mocks__') &&
               !sourcePath.endsWith('.d.ts') &&
               !sourcePath.endsWith('/types.ts'); // Exclude type definition files
      },
      
      // Normalize paths to ensure consistency (should already start with 'src/')
      sourcePath: (filePath) => {
        // Ensure all paths start with 'src/' for consistency with E2E reports
        if (!filePath.startsWith('src/') && !filePath.startsWith('/')) {
          return `src/${filePath}`;
        }
        
        // Remove any leading slashes and ensure src/ prefix
        if (filePath.startsWith('/')) {
          const cleanPath = filePath.substring(1);
          return cleanPath.startsWith('src/') ? cleanPath : `src/${cleanPath}`;
        }
        
        return filePath;
      }
    }]
  ]
};
