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

This section lists the available configuration options that are specific to the Treemap panel.
For common configuration options, refer to the [Grafana visualizations configuration documentation](https://grafana.com/docs/grafana/latest/panels-visualizations/).

### Treemap

The treemap options control the display of the data.

| Option             | Description                          |
|--------------------|--------------------------------------|
| Tiling algorithm | Determines where to make each split. |
| Separator | Set this value to a non-empty string to create a hierarchy as defined by the path defined by the separator. |

### Dimensions

The dimension options determine which fields to use for each dimension of the visualization.

| Option              | Description                                                                                      |
|---------------------|--------------------------------------------------------------------------------------------------|
| Label by          | Field to use for the text label. Defaults to the first textual field. All values must be unique. |
| Size by          | Field to use for size. Defaults to the first numeric field.                                      |
| Color by          | Field to use for color. Defaults to the first numeric field.                                     |
| Group by          | Field to group by.                                                                               |
| Additional labels | Fields to use as labels in the tooltip.                                                          |

