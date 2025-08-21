/**
 * @typedef {Object} SourcePathOptions
 * @property {string} packageName - The package name used for path normalization
 */

/**
 * @typedef {Object} CoverageFilterOptions
 * @property {boolean} [includeTypescriptOnly=false] - Whether to include only TypeScript files
 * @property {boolean} [excludeTypes=true] - Whether to exclude TypeScript declaration files
 * @property {string[]} [additionalExclusions=[]] - Additional patterns to exclude from coverage
 * @property {string} [packageName] - The package name used for path filtration
 */

/**
 * Creates a simplified sourcePath function for normalizing file paths across different test runners.
 * Leverages essential path transformations while relying on monocart's built-in filtering.
 * 
 * @param {SourcePathOptions} [options={}] - Configuration options for path normalization
 * @returns {function(string): string} Function that normalizes file paths to src/ prefixed format
 */
function createSourcePath(options = {}) {
  const sanitizedOptions = sanitizeSourcePathOptions(options);

  return (filePath) => {
    const { packageName } = sanitizedOptions;

    if (filePath.includes(`${packageName}/`)) {
      return filePath.replace(new RegExp(`.*${packageName}/`), 'src/');
    }

    return filePath.startsWith('src/') ? filePath : `src/${filePath}`;
  };
}

/**
 * Creates a monocart-compatible sourceFilter function with explicit filtering logic.
 * This replaces pattern-based filtering with a function to avoid precedence issues.
 * Works for both static analysis (Jest/Node.js) and browser-instrumented (Playwright/E2E) contexts.
 * 
 * @param {CoverageFilterOptions} [options={}] - Configuration options for filtering
 * @returns {function(string): boolean} Function that filters source files based on explicit criteria
 */
function createSourceFilterConfig(options = {}) {
  const sanitizedOptions = sanitizeCoverageFilterOptions(options);
  const { includeTypescriptOnly, excludeTypes, additionalExclusions } = sanitizedOptions;

  return (sourcePath) => {
    if (!sourcePath.startsWith('src/')) {
      return false;
    }

    const validExtensions = includeTypescriptOnly ? ['.ts', '.tsx'] : ['.ts', '.tsx', '.js', '.jsx'];
    const hasValidExtension = validExtensions.some(ext => sourcePath.endsWith(ext));
    if (!hasValidExtension) {
      return false;
    }

    const testPatterns = [
      '.spec.js',
      '.spec.jsx',
      '.spec.ts',
      '.spec.tsx',
      '.test.js',
      '.test.jsx',
      '.test.ts',
      '.test.tsx',
      '__mocks__',
      '__tests__',
    ];
    if (testPatterns.some(pattern => sourcePath.includes(pattern))) {
      return false;
    }

    if (excludeTypes) {
      if (sourcePath.endsWith('.d.ts') || sourcePath.endsWith('/types.ts')) {
        return false;
      }
    }

    const excludePatterns = [
      'node_modules',
      '@popperjs',
      'external',
      'rb-tippyjs-react',
      'semver',
      'tippy.js',
      'webpack',
    ];
    if (excludePatterns.some(pattern => sourcePath.includes(pattern))) {
      return false;
    }

    if (additionalExclusions.some(exclusion => sourcePath.includes(exclusion))) {
      return false;
    }

    return true;
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
 * Sanitizes and validates coverage filter options, providing defaults and checking for required fields.
 * 
 * @param {CoverageFilterOptions} [options={}] - Configuration options to sanitize
 * @returns {CoverageFilterOptions} Sanitized options with defaults applied
 */
function sanitizeCoverageFilterOptions(options = {}) {
  return {
    includeTypescriptOnly: options.includeTypescriptOnly ?? false,
    excludeTypes: options.excludeTypes ?? true,
    additionalExclusions: options.additionalExclusions ?? [],
    ...(options.packageName && { packageName: options.packageName })
  };
}

module.exports = {
  createSourcePath,
  createSourceFilterConfig
};
