# Treemap for Grafana

[![CI](https://github.com/grafana/grafana-treemap-panel/actions/workflows/push.yml/badge.svg)](https://github.com/grafana/grafana-treemap-panel/actions/workflows/push.yml)
[![CD](https://github.com/grafana/grafana-treemap-panel/actions/workflows/publish.yml/badge.svg)](https://github.com/grafana/grafana-treemap-panel/actions/workflows/publish.yml)
[![License](https://img.shields.io/github/license/grafana/grafana-treemap-panel)](LICENSE)

<!-- Disabled "query not supported" badges.  -->
<!-- [![Marketplace](https://img.shields.io/badge/dynamic/json?logo=grafana&color=F47A20&label=marketplace&prefix=v&query=%24.items%5B%3F%28%40.slug%20%3D%3D%20%22marcusolsson-treemap-panel%22%29%5D.version&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins)](https://grafana.com/grafana/plugins/marcusolsson-treemap-panel) -->
<!-- [![Downloads](https://img.shields.io/badge/dynamic/json?logo=grafana&color=F47A20&label=downloads&query=%24.items%5B%3F%28%40.slug%20%3D%3D%20%22marcusolsson-treemap-panel%22%29%5D.downloads&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins)](https://grafana.com/grafana/plugins/marcusolsson-treemap-panel) -->

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


## Development

### Frontend

1. Install dependencies

   ```bash
   yarn install
   ```

2. Build plugin in development mode and run in watch mode

   ```bash
   yarn dev
   ```

3. Build plugin in production mode

   ```bash
   yarn build
   ```

4. Run the tests (using Jest)

   ```bash
   # Runs the tests and watches for changes, requires git init first
   yarn test

   # Exits after running all the tests
   yarn test:ci
   ```

5. Spin up a Grafana instance and run the plugin inside it (using Docker)

   ```bash
   yarn server
   ```

6. Run the E2E tests (using Playwright)

   ```bash
   # Spins up a Grafana instance first that we tests against
   yarn server

   # If you wish to start a certain Grafana version. If not specified will use latest by default
   GRAFANA_VERSION=11.3.0 npm run server

   # Starts the tests
   yarn e2e
   ```

7. Run the linter

   ```bash
   yarn lint

   # or

   yarn lint:fix
   ```

# Distributing your plugin

When distributing a Grafana plugin either within the community or privately the plugin must be signed so the Grafana application can verify its authenticity. This can be done with the `@grafana/sign-plugin` package.

_Note: It's not necessary to sign a plugin during development. The docker development environment that is scaffolded with `@grafana/create-plugin` caters for running the plugin without a signature._

## Initial steps

Before signing a plugin please read the Grafana [plugin publishing and signing criteria](https://grafana.com/legal/plugins/#plugin-publishing-and-signing-criteria) documentation carefully.

`@grafana/create-plugin` has added the necessary commands and workflows to make signing and distributing a plugin via the grafana plugins catalog as straightforward as possible.

Before signing a plugin for the first time please consult the Grafana [plugin signature levels](https://grafana.com/legal/plugins/#what-are-the-different-classifications-of-plugins) documentation to understand the differences between the types of signature level.

1. Create a [Grafana Cloud account](https://grafana.com/signup).
2. Make sure that the first part of the plugin ID matches the slug of your Grafana Cloud account.
   - _You can find the plugin ID in the `plugin.json` file inside your plugin directory. For example, if your account slug is `acmecorp`, you need to prefix the plugin ID with `acmecorp-`._
3. Create a Grafana Cloud API key with the `PluginPublisher` role.
4. Keep a record of this API key as it will be required for signing a plugin

## Signing a plugin

### Using Github actions release workflow

If the plugin is using the github actions supplied with `@grafana/create-plugin` signing a plugin is included out of the box. The [release workflow](./.github/workflows/release.yml) can prepare everything to make submitting your plugin to Grafana as easy as possible. Before being able to sign the plugin however a secret needs adding to the Github repository.

1. Please navigate to "settings > secrets > actions" within your repo to create secrets.
2. Click "New repository secret"
3. Name the secret "GRAFANA_API_KEY"
4. Paste your Grafana Cloud API key in the Secret field
5. Click "Add secret"

#### Push a version tag

To trigger the workflow we need to push a version tag to github. This can be achieved with the following steps:

1. Run `yarn version <major|minor|patch>`
2. Run `git push origin main --follow-tags`

## Learn more

Below you can find source code for existing app plugins and other related documentation.

- [Basic panel plugin example](https://github.com/grafana/grafana-plugin-examples/tree/master/examples/panel-basic#readme)
- [`plugin.json` documentation](https://grafana.com/developers/plugin-tools/reference/plugin-json)
- [How to sign a plugin?](https://grafana.com/developers/plugin-tools/publish-a-plugin/sign-a-plugin)
