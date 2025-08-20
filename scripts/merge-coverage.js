#!/usr/bin/env node

const { CoverageReport } = require('monocart-coverage-reports');
const { createSourcePath, createInstrumentedSourceFilter } = require('./utils/coverage');

const INPUT_DIRS = [
  './coverage/unit/raw',
  './coverage/e2e/raw'
];

// SEE: https://github.com/cenfun/monocart-coverage-reports#manual-merging
async function mergeCoverageReports() {

  const coverageReport = new CoverageReport({
    name: `Coverage Report - Merged (${INPUT_DIRS.length}) coverage reports`,
    inputDir: INPUT_DIRS,
    outputDir: './coverage-merged',
    reports: [
      ['v8'],
      ['console-details'],
      ['json'],
      ['lcov'],
    ],

    sourceFilter: createInstrumentedSourceFilter(),
    sourcePath: createSourcePath(),
    // logging: 'debug'
  });

  await coverageReport.generate();
}

if (require.main === module) {
  mergeCoverageReports().catch(console.error);
}

