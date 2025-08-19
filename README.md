# Treemap for Grafana

[![CI](https://github.com/grafana/grafana-treemap-panel/actions/workflows/push.yml/badge.svg)](https://github.com/grafana/grafana-treemap-panel/actions/workflows/push.yml)
[![CD](https://github.com/grafana/grafana-treemap-panel/actions/workflows/publish.yml/badge.svg)](https://github.com/grafana/grafana-treemap-panel/actions/workflows/publish.yml)
[![License](https://img.shields.io/github/license/grafana/grafana-treemap-panel)](LICENSE)

<!-- Disabled "query not supported" badges.  -->
<!-- [![Marketplace](https://img.shields.io/badge/dynamic/json?logo=grafana&color=F47A20&label=marketplace&prefix=v&query=%24.items%5B%3F%28%40.slug%20%3D%3D%20%22marcusolsson-treemap-panel%22%29%5D.version&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins)](https://grafana.com/grafana/plugins/marcusolsson-treemap-panel) -->
<!-- [![Downloads](https://img.shields.io/badge/dynamic/json?logo=grafana&color=F47A20&label=downloads&query=%24.items%5B%3F%28%40.slug%20%3D%3D%20%22marcusolsson-treemap-panel%22%29%5D.downloads&url=https%3A%2F%2Fgrafana.com%2Fapi%2Fplugins)](https://grafana.com/grafana/plugins/marcusolsson-treemap-panel) -->

More details about this plugin are available in the [README.md](./src/README.md) file, that gets published [here](https://grafana.com/grafana/plugins/marcusolsson-treemap-panel/?tab=overview).

## Development

### Frontend

> [!IMPORTANT]
> Prerequisites
>
> - [Yarn](https://yarnpkg.com)
> - [Docker](https://www.docker.com)

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

   # Exits after running all the tests, generates a coverage report
   yarn test:ci
   ```

5. Spin up a Grafana instance and run the plugin inside it (using Docker)

   ```bash
   yarn server
   ```

6. Run the E2E tests (using Playwright)

   ```bash
   # Runs in a Docker container for consistency, generates a coverage report
   yarn e2e
   ```

   SEE: [./e2e/README.md]()

7. Update the E2E screenshots (using Playwright)

   ```bash
   yarn e2e:update-screenshots
   ```

   SEE: [./e2e/README.md]()

8. Run the linter

   ```bash
   yarn lint

   # or

   yarn lint:fix
   ```

# Using Github actions "publish" workflow

## Publish ([Plugins - CD](https://github.com/grafana/grafana-treemap-panel/actions/workflows/publish.yml))

1. Update the version
   - e.g, run `yarn version <major|minor|patch>`
1. Update the [CHANGELOG](./CHANGELOG.md)
1. Commit and push changes, merge to `main`
1. Release and test plugin for `dev` environments:
   - Go to [Plugins - CD](https://github.com/grafana/grafana-treemap-panel/actions/workflows/publish.yml) and "Run workflow"
     - Leave "use workflow from" as `main`
     - Choose `dev` as the environment to publish to
     - Choose `main` as the branch to publish from
     - It is possible to choose a PR for an earlier test on `dev`
   - Manually test Evaluate the plugin from a dev environment
1. Release and plugin for `prod` environments:
   - Go to [Plugins - CD](https://github.com/grafana/grafana-treemap-panel/actions/workflows/publish.yml) and "Run workflow"
     - Leave "use workflow from" as `main`
     - Choose `prod` as the environment to publish to
     - Choose `main` as the branch to publish from
