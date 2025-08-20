#!/usr/bin/env node

const { CoverageReport } = require('monocart-coverage-reports');
const { name: PACKAGE_NAME } = require('../package.json');

const INPUT_DIRS = [
  './coverage/unit/raw',
  './coverage/e2e/raw'
];

// SEE: https://github.com/cenfun/monocart-coverage-reports#manual-merging
async function mergeCoverageReports() {
  
  const coverageReport = new CoverageReport({
    name: 'Merged Coverage Report',
    inputDir: INPUT_DIRS,
    outputDir: './coverage-merged',
    reports: [
      ['v8'],
      ['console-details'],
      ['json'],
      ['lcov'],
    ],

    sourceFilter: (sourcePath) => {
      return sourcePath.startsWith('src/') &&
             !sourcePath.includes('node_modules') &&
             !sourcePath.includes('webpack') &&
             !sourcePath.includes('external amd') &&
             !sourcePath.includes('rb-tippyjs-react') &&
             !sourcePath.includes('tippy.js') &&
             !sourcePath.includes('semver') &&
             !sourcePath.includes('@popperjs');
    },

    sourcePath: (filePath, info) => {
      if (filePath.includes(`${PACKAGE_NAME}/`) && !filePath.includes('/src/')) {
        const fileName = filePath.replace(`${PACKAGE_NAME}/`, '');
        return fileName.startsWith('src/') ? fileName : `src/${fileName}`;
      }
      
      if (filePath.includes(`${PACKAGE_NAME}/`) && filePath.includes('/src/')) {
        return filePath.replace(`${PACKAGE_NAME}/`, 'src/');
      }
      
      if (!filePath.startsWith('src/') && !filePath.includes('node_modules') && !filePath.includes('webpack') && !filePath.includes('external')) {
        return `src/${filePath}`;
      }
      
      return filePath;
    },
    // logging: 'debug'
  });

  await coverageReport.generate();
}

if (require.main === module) {
  mergeCoverageReports().catch(console.error);
}