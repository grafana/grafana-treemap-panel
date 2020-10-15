# Treemap for Grafana

[![License](https://img.shields.io/github/license/marcusolsson/grafana-treemap-panel)](LICENSE)
[![PRs welcome!](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contribute)

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
