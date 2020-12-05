# Treemap for Grafana

[![Build](https://github.com/marcusolsson/grafana-treemap-panel/workflows/CI/badge.svg)](https://github.com/marcusolsson/grafana-treemap-panel/actions?query=workflow%3A%22CI%22)
[![Release](https://github.com/marcusolsson/grafana-treemap-panel/workflows/Release/badge.svg)](https://github.com/marcusolsson/grafana-treemap-panel/actions?query=workflow%3ARelease)
[![Marketplace](https://img.shields.io/badge/dynamic/json?color=orange&label=marketplace&prefix=v&query=%24.items%5B%3F%28%40.slug%20%3D%3D%20%22marcusolsson-treemap-panel%22%29%5D.version&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins)](https://grafana.com/grafana/plugins/marcusolsson-treemap-panel)
[![Downloads](https://img.shields.io/badge/dynamic/json?color=orange&label=downloads&query=%24.items%5B%3F%28%40.slug%20%3D%3D%20%22marcusolsson-treemap-panel%22%29%5D.downloads&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins)](https://grafana.com/grafana/plugins/marcusolsson-treemap-panel)
[![License](https://img.shields.io/github/license/marcusolsson/grafana-treemap-panel)](LICENSE)

A panel plugin for [Grafana](https://grafana.com) to visualize treemaps.

![Screenshot](https://github.com/marcusolsson/grafana-treemap-panel/raw/master/src/img/screenshot.png)

## Configuration

### Query

The Treemap panel expects a query that returns **text** field, and a **number** field.

### Panel options

#### Display

- **Tiling algorithm** determines where to make each split.

#### Dimensions

The dimension options determines what fields to use for each dimension of the visualization.

- **Text** specifies the field to use for identifying each tile. Must be unique.
- **Size** specifies the field to use for the size of each tile. Must be a numeric field.
- **Color** specifies the field to use for the color of each tile.
  - If the field is numeric, each tile is linearly mapped to a color spectrum.
  - If the field is textual, that field is used to group tiles into colored categories.

### Field options

#### Standard options

- **Decimals** and **Unit** sets the textual format of each value.
