const { name: PACKAGE_NAME } = require('../../package.json');

/**
 * Creates a sourcePath function for normalizing file paths across different test runners.
 * This ensures all coverage reports use consistent src/ prefixed paths for both static and instrumented contexts.
 */
function createSourcePath() {
  return (filePath) => {
    if (filePath.includes(`${PACKAGE_NAME}/`) && !filePath.includes('/src/')) {
      const fileName = filePath.replace(`${PACKAGE_NAME}/`, '');
      return fileName.startsWith('src/') ? fileName : `src/${fileName}`;
    }

    if (filePath.includes(`${PACKAGE_NAME}/`) && filePath.includes('/src/')) {
      return filePath.replace(`${PACKAGE_NAME}/`, 'src/');
    }

    if (filePath.startsWith('/')) {
      const cleanPath = filePath.substring(1);
      return cleanPath.startsWith('src/') ? cleanPath : `src/${cleanPath}`;
    }

    if (!filePath.startsWith('src/') &&
      !filePath.includes('node_modules') &&
      !filePath.includes('webpack') &&
      !filePath.includes('external')) {
      return `src/${filePath}`;
    }

    return filePath;
  };
}

/**
 * Creates a sourceFilter function for static analysis contexts.
 * Example: when is collected from Jest running on Node.js or merging coverage reports.
 */
function createStaticSourceFilter(options = {}) {
  const {
    includeTypescriptOnly = false,
    excludeTypes = true,
    additionalExclusions = []
  } = options;

  return (sourcePath) => {
    if (!sourcePath.startsWith('src/')) {
      return false;
    }

    if (includeTypescriptOnly) {
      const isTypeScriptFile = sourcePath.endsWith('.ts') || sourcePath.endsWith('.tsx');
      if (!isTypeScriptFile) {
        return false;
      }
    } else {
      const isSourceFile = sourcePath.endsWith('.ts') || sourcePath.endsWith('.tsx') ||
        sourcePath.endsWith('.js') || sourcePath.endsWith('.jsx');
      if (!isSourceFile) {
        return false;
      }
    }

    const standardExclusions = [
      'node_modules',
      'webpack',
      'external amd',
      '.test.',
      '.spec.',
      '__tests__',
      '__mocks__',
      'rb-tippyjs-react',
      'tippy.js',
      'semver',
      '@popperjs'
    ];

    if (excludeTypes) {
      standardExclusions.push('.d.ts');
      if (sourcePath.endsWith('/types.ts')) {
        return false;
      }
    }

    const allExclusions = [...standardExclusions, ...additionalExclusions];
    for (const exclusion of allExclusions) {
      if (sourcePath.includes(exclusion)) {
        return false;
      }
    }

    return true;
  };
}

/**
 * Creates a sourceFilter for browser-instrumented coverage contexts.
 * Example: when coverage is collected from bundled module.js files in Chrome via Playwright E2E.
 */
function createInstrumentedSourceFilter() {
  return (sourcePath) => {
    // NOTE: For browser-instrumented coverage, we need to detect project files from
    //       runtime-generated paths that may include package prefixes or webpack transforms.
    // NOTE: Include TypeScript files that are either:
    //       1. In OUR project's src/ directories (not external ones)  
    //       2. Root-level files in our plugin (detected by package name)
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
  };
}

module.exports = {
  createSourcePath,
  createStaticSourceFilter,
  createInstrumentedSourceFilter,
  PACKAGE_NAME
};
