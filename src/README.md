<!-- This README file is going to be the one displayed on the Grafana.com website for your plugin. Uncomment and replace the content here before publishing.

Remove any remaining comments before publishing as these may be displayed on Grafana.com -->

# Treemap for Grafana

[![CI](https://github.com/grafana/grafana-treemap-panel/actions/workflows/push.yml/badge.svg)](https://github.com/grafana/grafana-treemap-panel/actions/workflows/push.yml)
[![CD](https://github.com/grafana/grafana-treemap-panel/actions/workflows/publish.yml/badge.svg)](https://github.com/grafana/grafana-treemap-panel/actions/workflows/publish.yml)
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
