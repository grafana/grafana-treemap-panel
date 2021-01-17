# Treemap for Grafana

[![Build](https://github.com/marcusolsson/grafana-treemap-panel/workflows/CI/badge.svg)](https://github.com/marcusolsson/grafana-treemap-panel/actions?query=workflow%3A%22CI%22)
[![Release](https://github.com/marcusolsson/grafana-treemap-panel/workflows/Release/badge.svg)](https://github.com/marcusolsson/grafana-treemap-panel/actions?query=workflow%3ARelease)
[![Marketplace](https://img.shields.io/badge/dynamic/json?color=orange&label=marketplace&prefix=v&query=%24.items%5B%3F%28%40.slug%20%3D%3D%20%22marcusolsson-treemap-panel%22%29%5D.version&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins)](https://grafana.com/grafana/plugins/marcusolsson-treemap-panel)
[![Downloads](https://img.shields.io/badge/dynamic/json?color=orange&label=downloads&query=%24.items%5B%3F%28%40.slug%20%3D%3D%20%22marcusolsson-treemap-panel%22%29%5D.downloads&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins)](https://grafana.com/grafana/plugins/marcusolsson-treemap-panel)
[![License](https://img.shields.io/github/license/marcusolsson/grafana-treemap-panel)](LICENSE)
[![Twitter](https://img.shields.io/twitter/follow/marcusolsson?color=%231DA1F2&label=twitter&style=plastic)](https://twitter.com/marcusolsson)

A panel plugin for [Grafana](https://grafana.com) to visualize treemaps.

![Screenshot](https://github.com/marcusolsson/grafana-treemap-panel/raw/master/src/img/screenshot.png)

## Configuration

This section lists the available configuration options for the Treemap panel.

### Panel options

#### Dimensions

The dimension options determines what fields to use for each dimension of the visualization.

| Option | Description |
|--------|-------------|
| _Text_ | Field to use for the text. Must be unique. Defaults to the first textual field. |
| _Size_ | Field to use for size. Defaults to the first numeric field. |
| _Group by_ | Field to group by. |
| _Labels_ | Fields to use as labels in the tooltip. |

#### Display

| Option | Description |
|--------|-------------|
| _Tiling algorithm_ | Determines where to make each split. |
