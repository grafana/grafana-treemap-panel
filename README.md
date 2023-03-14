# Treemap for Grafana

[![Build](https://github.com/grafana/grafana-treemap-panel/workflows/CI/badge.svg)](https://github.com/grafana/grafana-treemap-panel/actions?query=workflow%3A%22CI%22)
[![Release](https://github.com/grafana/grafana-treemap-panel/workflows/Release/badge.svg)](https://github.com/grafana/grafana-treemap-panel/actions?query=workflow%3ARelease)
[![Marketplace](https://img.shields.io/badge/dynamic/json?logo=grafana&color=F47A20&label=marketplace&prefix=v&query=%24.items%5B%3F%28%40.slug%20%3D%3D%20%22marcusolsson-treemap-panel%22%29%5D.version&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins)](https://grafana.com/grafana/plugins/marcusolsson-treemap-panel)
[![Downloads](https://img.shields.io/badge/dynamic/json?logo=grafana&color=F47A20&label=downloads&query=%24.items%5B%3F%28%40.slug%20%3D%3D%20%22marcusolsson-treemap-panel%22%29%5D.downloads&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins)](https://grafana.com/grafana/plugins/marcusolsson-treemap-panel)
[![License](https://img.shields.io/github/license/grafana/grafana-treemap-panel)](LICENSE)

> **Maintenance**: Now the plugin is being maintained by Grafana Labs. Big thanks to [Marcus Olsson](https://twitter.com/marcusolsson) for the awesome work!

A panel plugin for [Grafana](https://grafana.com) to visualize tree maps.

![Screenshot](https://github.com/grafana/grafana-treemap-panel/raw/main/src/img/screenshot.png)

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
