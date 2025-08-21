#!/usr/bin/env node

const { CoverageReport } = require('monocart-coverage-reports');
const { glob } = require('glob');
const fs = require('fs');
const path = require('path');
const { createSourcePath, createSourceFilterConfig } = require('./utils/coverage');

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
      ['html'],
      ['json'],
      ['lcov'],
    ],

    sourceFilter: createSourceFilterConfig({ 
      packageName: 'marcusolsson-treemap-panel',
      includeTypescriptOnly: true,
      excludeTypes: true
    }),
    sourcePath: createSourcePath({ packageName: 'marcusolsson-treemap-panel' }),
    // logging: 'debug'
  });

  await coverageReport.generate();
  
  const mergedDir = path.join(process.cwd(), 'coverage-merged');
  const targetDir = path.join(process.cwd(), 'coverage');
  
  const filesToCopy = [
    'index.html',
    'coverage-data.js',
    'coverage-final.json'
  ];
  
  try {
    for (const file of filesToCopy) {
      const sourcePath = path.join(mergedDir, file);
      const targetPath = path.join(targetDir, file);
      
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, targetPath);
      }
    }
    
    const assetsSourceDir = path.join(mergedDir, 'assets');
    const assetsTargetDir = path.join(targetDir, 'assets');
    
    if (fs.existsSync(assetsSourceDir)) {
      if (!fs.existsSync(assetsTargetDir)) {
        fs.mkdirSync(assetsTargetDir, { recursive: true });
      }
      
      const assetFiles = fs.readdirSync(assetsSourceDir);
      for (const assetFile of assetFiles) {
        const assetSourcePath = path.join(assetsSourceDir, assetFile);
        const assetTargetPath = path.join(assetsTargetDir, assetFile);
        fs.copyFileSync(assetSourcePath, assetTargetPath);
      }
    }
  } catch (error) {
    console.warn(`⚠️ Could not copy merged report files:`, error.message);
  }
}

if (require.main === module) {
  mergeCoverageReports().catch(console.error);
}
