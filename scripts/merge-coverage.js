#!/usr/bin/env node

const { CoverageReport } = require('monocart-coverage-reports');

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
    ],
    sourcePath: (filePath, info) => {
      console.info('filePath', filePath);
      return filePath;
    },
    // logging: 'debug'
  });

  await coverageReport.generate();
}

if (require.main === module) {
  mergeCoverageReports().catch(console.error);
}