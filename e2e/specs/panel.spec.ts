import { test, expect } from '../fixtures/coverage';

test('should display "Configure your query" wizard in case panel data is empty', async ({
  gotoPanelEditPage,
  readProvisionedDashboard,
}) => {
  const dashboard = await readProvisionedDashboard({ fileName: 'dashboard.json' });
  const panelEditPage = await gotoPanelEditPage({ dashboard, id: '1' });
  await expect(panelEditPage.panel.locator).toContainText('Configure your query');
});

// TODO: Make equivalent tests for our panel
// test('should display circle when data is passed to the panel', async ({
//   panelEditPage,
//   readProvisionedDataSource,
//   page,
// }) => {
//   const ds = await readProvisionedDataSource({ fileName: 'datasources.yml' });
//   await panelEditPage.datasource.set(ds.name);
//   await panelEditPage.setVisualization('Tree Map');
//   await expect(page.getByTestId('simple-panel-circle')).toBeVisible();
// });

// test('should display series counter when "Show series counter" option is enabled', async ({
//   gotoPanelEditPage,
//   readProvisionedDashboard,
//   page,
// }) => {
//   const dashboard = await readProvisionedDashboard({ fileName: 'dashboard.json' });
//   const panelEditPage = await gotoPanelEditPage({ dashboard, id: '1' });
//   const options = panelEditPage.getCustomOptions('Tree Map');
//   const showSeriesCounter = options.getSwitch('Show series counter');

//   await showSeriesCounter.check();
//   await expect(page.getByTestId('simple-panel-series-counter')).toBeVisible();
// });
