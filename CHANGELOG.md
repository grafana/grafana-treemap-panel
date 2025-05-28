# Changelog

## 2.1.1 (2025-05-28)

[Full changelog](https://github.com/grafana/grafana-treemap-panel/compare/v2.0.1...v2.1.0)

- Fix an issue where the panel would not initialize for anonymous users when Grafana version was hidden

## 2.0.1 (2023-03-31)

[Full changelog](https://github.com/grafana/grafana-treemap-panel/compare/v2.0.0...v2.0.1)

- Fix broken docs and links.
- Updated dependencies
## 2.0.0 (2022-01-28)

[Full changelog](https://github.com/grafana/grafana-treemap-panel/compare/v1.0.0...v2.0.0)

This release bumps the minimum required Grafana to >=8.0. Grafana 8 introduces a new theming engine for panel plugins.

- If you're running a Grafana version before 8.0, you should stay with v1.0.0.
- If you're running Grafana 8.0 or above, you should update to v2.0.0.

## 1.0.0 (2021-11-19)

[Full changelog](https://github.com/grafana/grafana-treemap-panel/compare/v0.9.3...v1.0.0)

### Enhancements

- Upgrade dependencies

## 0.9.3 (2021-11-04)

[Full changelog](https://github.com/grafana/grafana-treemap-panel/compare/v0.9.2...v0.9.3)

### Bug fixes

- Fix tooltip overflow for long labels.

## 0.9.2 (2021-09-05)

[Full changelog](https://github.com/grafana/grafana-treemap-panel/compare/v0.9.1...v0.9.2)

### Bug fixes

- Fix Data Links support for Grafana 8 ([#24](https://github.com/grafana/grafana-treemap-panel/issues/24))

## 0.9.1 (2021-09-01)

[Full changelog](https://github.com/grafana/grafana-treemap-panel/compare/v0.9.0...v0.9.1)

Contains fixes for Grafana 8.

## 0.9.0 (2021-05-18)

[Full changelog](https://github.com/grafana/grafana-treemap-panel/compare/v0.8.0...v0.9.0)

**Important notice:** I've had to rewrite large parts of the plugins for this release. While I don't anticipate any issues with upgrading from a previous version, please backup your dashboards before upgrading.

### Enhancements

- Hierarchical grouping of data ([#16](https://github.com/grafana/grafana-treemap-panel/pull/16))

## 0.8.0 (2021-02-16)

[Full changelog](https://github.com/grafana/grafana-treemap-panel/compare/v0.7.0...v0.8.0)

### Enhancements

- Add option to color by separate field
- Make dimensions clearable
- Add fallback panel for unsupported Grafana versions
- Add wizard for configuring the query

## 0.7.0 (2020-12-10)

[Full changelog](https://github.com/grafana/grafana-treemap-panel/compare/v0.6.1...v0.7.0)

### Enhancements

- **Support for data links:** Add data links in the field options tab. Click an individual tile to reveal the links.
- **Support for multiple queries:** Results gets grouped by each query.
- **Custom labels in tooltip:** Add additional metadata in the tooltip.
- **New Group by dimension:** Replaces the Color dimension. You can now group data separately from the color selection.
- Add Min and Max standard option to enable control of the extents of the color scheme.

## 0.6.1 (2020-11-27)

[Full changelog](https://github.com/grafana/grafana-treemap-panel/compare/v0.6.0...v0.6.1)

### Enhancements

- Updated `@grafana` dependencies from `^7.0.0` to `^7.3.0`
- Improved release process using the new [GitHub workflows](https://github.com/grafana/plugin-workflows) for Grafana plugins
