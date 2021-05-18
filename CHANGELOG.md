# Changelog

## 0.9.0 (2021-05-18)

[Full changelog](https://github.com/marcusolsson/grafana-treemap-panel/compare/v0.8.0...v0.9.0)

**Important notice:** I've had to rewrite large parts of the plugins for this release. While I don't anticipate any issues with upgrading from a previous version, please backup your dashboards before upgrading.

### Enhancements

- Hierarchical grouping of data ([#16](https://github.com/marcusolsson/grafana-treemap-panel/pull/16))

## 0.8.0 (2021-02-16)

[Full changelog](https://github.com/marcusolsson/grafana-treemap-panel/compare/v0.7.0...v0.8.0)

### Enhancements

- Add option to color by separate field
- Make dimensions clearable
- Add fallback panel for unsupported Grafana versions
- Add wizard for configuring the query

## 0.7.0 (2020-12-10)

[Full changelog](https://github.com/marcusolsson/grafana-treemap-panel/compare/v0.6.1...v0.7.0)

### Enhancements

- **Support for data links:** Add data links in the field options tab. Click an individual tile to reveal the links.
- **Support for multiple queries:** Results gets grouped by each query.
- **Custom labels in tooltip:** Add additional metadata in the tooltip.
- **New Group by dimension:** Replaces the Color dimension. You can now group data separately from the color selection.
- Add Min and Max standard option to enable control of the extents of the color scheme.

## 0.6.1 (2020-11-27)

[Full changelog](https://github.com/marcusolsson/grafana-treemap-panel/compare/v0.6.0...v0.6.1)

### Enhancements

- Updated `@grafana` dependencies from `^7.0.0` to `^7.3.0`
- Improved release process using the new [GitHub workflows](https://github.com/grafana/plugin-workflows) for Grafana plugins
