#!/usr/bin/env node

const { CoverageReport } = require('monocart-coverage-reports');
const { glob } = require('glob');
const { createSourcePath, createInstrumentedSourceFilter } = require('./utils/coverage');

const RAW_COVERAGE_PATTERN = 'coverage/*/raw';

// SEE: https://github.com/cenfun/monocart-coverage-reports#manual-merging
async function mergeCoverageReports() {
  const inputDirs = await glob(RAW_COVERAGE_PATTERN, {
    cwd: process.cwd(),
    onlyDirectories: true
  });

  if (inputDirs.length === 0) {
    console.warn(
      `⚠️  No raw coverage found in: ${RAW_COVERAGE_PATTERN} ... make sure your coverage reports have been generated first.`
    );
    process.exit(1);
  }

  const coverageReport = new CoverageReport({
    name: `Coverage Report - Merged (${inputDirs.length}) coverage reports`,
    inputDir: inputDirs,
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
