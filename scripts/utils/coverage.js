/**
 * @typedef {Object} SourcePathOptions
 * @property {string} packageName - The package name used for path normalization
 */

/**
 * @typedef {Object} FilterOptions
 * @property {boolean} [includeTypescriptOnly=false] - Whether to include only TypeScript files
 * @property {boolean} [excludeTypes=true] - Whether to exclude TypeScript declaration files
 * @property {string[]} [additionalExclusions=[]] - Additional patterns to exclude from coverage
 * @property {string} [packageName] - The package name used for path filtration
 */

/**
 * Creates a sourcePath function for normalizing file paths across different test runners.
 * This ensures all coverage reports use consistent src/ prefixed paths for both static and instrumented contexts.
 * 
 * @param {SourcePathOptions} [options={}] - Configuration options for path normalization
 * @returns {function(string): string} Function that normalizes file paths to src/ prefixed format
 */
function createSourcePath(options = {}) {
  const sanitizedOptions = sanitizeSourcePathOptions(options);

  return (filePath) => {
    const { packageName } = sanitizedOptions;

    if (filePath.includes(`${packageName}/`) && !filePath.includes('/src/')) {
      const fileName = filePath.replace(`${packageName}/`, '');
      return fileName.startsWith('src/') ? fileName : `src/${fileName}`;
    }

    if (filePath.includes(`${packageName}/`) && filePath.includes('/src/')) {
      return filePath.replace(`${packageName}/`, 'src/');
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
 * Example: when coverage is collected from Jest running on Node.js or merging coverage reports.
 * 
 * @param {FilterOptions} [options={}] - Configuration options for filtering
 * @returns {function(string): boolean} Function that filters source files based on static analysis criteria
 */
function createStaticSourceFilter(options = {}) {
  const sanitizedOptions = sanitizeFilterOptions(options);
  const { includeTypescriptOnly, excludeTypes, additionalExclusions } = sanitizedOptions;

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
 * 
 * @param {FilterOptions} [options={}] - Configuration options for filtering (requires packageName)
 * @returns {function(string): boolean} Function that filters source files based on browser instrumentation criteria
 */
function createInstrumentedSourceFilter(options = {}) {
  const sanitizedOptions = sanitizeFilterOptions(options, true);

  return (sourcePath) => {
    const { packageName } = sanitizedOptions;

    // NOTE: For browser-instrumented coverage, we need to detect project files from
    //       runtime-generated paths that may include package prefixes or webpack transforms.
    // NOTE: Include TypeScript files that are either:
    //       1. In OUR project's src/ directories (not external ones)  
    //       2. Root-level files in our plugin (detected by package name)
    const isTypeScriptFile = sourcePath.endsWith('.ts') || sourcePath.endsWith('.tsx');
    const isOurSrcDirectory = sourcePath.startsWith('src/') ||
      (sourcePath.includes(packageName) && sourcePath.includes('/src/'));
    const isRootPluginFile = sourcePath.includes(packageName) &&
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

/**
 * Sanitizes and validates source path options, providing defaults and checking for required fields.
 * 
 * @param {SourcePathOptions} [options={}] - Configuration options to sanitize
 * @returns {SourcePathOptions} Sanitized options with required fields validated
 * @throws {Error} When required packageName option is missing
 */
function sanitizeSourcePathOptions(options = {}) {
  if (!options?.packageName) {
    throw new Error('Missing mandatory option: `packageName` ...')
  }
  
  return {
    packageName: options.packageName
  };
}

/**
 * Sanitizes and validates filter options, providing defaults and checking for required fields.
 * 
 * @param {FilterOptions} [options={}] - Configuration options to sanitize
 * @param {boolean} [requirePackageName=false] - Whether packageName is required
 * @returns {FilterOptions} Sanitized options with defaults applied
 * @throws {Error} When required packageName option is missing (if requirePackageName is true)
 */
function sanitizeFilterOptions(options = {}, requirePackageName = false) {
  if (requirePackageName && !options?.packageName) {
    throw new Error('Missing mandatory option: `packageName` ...')
  }
  
  return {
    includeTypescriptOnly: options.includeTypescriptOnly ?? false,
    excludeTypes: options.excludeTypes ?? true,
    additionalExclusions: options.additionalExclusions ?? [],
    ...(options.packageName && { packageName: options.packageName })
  };
}

module.exports = {
  createSourcePath,
  createStaticSourceFilter,
  createInstrumentedSourceFilter
};
