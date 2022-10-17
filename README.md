# Treemap for Grafana

[![Marketplace](https://img.shields.io/badge/dynamic/json?logo=grafana&color=F47A20&label=marketplace&prefix=v&query=%24.items%5B%3F%28%40.slug%20%3D%3D%20%22marcusolsson-treemap-panel%22%29%5D.version&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins)](https://grafana.com/grafana/plugins/marcusolsson-treemap-panel)
[![Downloads](https://img.shields.io/badge/dynamic/json?logo=grafana&color=F47A20&label=downloads&query=%24.items%5B%3F%28%40.slug%20%3D%3D%20%22marcusolsson-treemap-panel%22%29%5D.downloads&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins)](https://grafana.com/grafana/plugins/marcusolsson-treemap-panel)
[![License](https://img.shields.io/github/license/marcusolsson/grafana-treemap-panel)](LICENSE)

A panel plugin for [Grafana](https://grafana.com) to visualize treemaps.

![Screenshot](https://github.com/grafana/grafana-treemap-panel/raw/main/src/img/screenshot.png)

## Maintenance

If you'd still like to propose a new feature, [create a new Discussion](https://github.com/grafana/grafana-treemap-panel/discussions/new?category=ideas). If you'd like to contribute a feature, please let us know before you start working on it.

## Configuration

This section lists the available configuration options for the Treemap panel.

### Panel options

#### Dimensions

The dimension options determines what fields to use for each dimension of the visualization.

| Option              | Description                                                                                      |
|---------------------|--------------------------------------------------------------------------------------------------|
| _Label by_          | Field to use for the text label. Defaults to the first textual field. All values must be unique. |
| _Size by_           | Field to use for size. Defaults to the first numeric field.                                      |
| _Color by_          | Field to use for color. Defaults to the first numeric field.                                     |
| _Group by_          | Field to group by.                                                                               |
| _Additional labels_ | Fields to use as labels in the tooltip.                                                          |

#### Display

| Option             | Description                          |
|--------------------|--------------------------------------|
| _Tiling algorithm_ | Determines where to make each split. |

### Field options

| Option      | Description                                                                                                 |
|-------------|-------------------------------------------------------------------------------------------------------------|
| _Separator_ | Set this value to a non-empty string to create a hierarchy as defined by the path defined by the separator. |
