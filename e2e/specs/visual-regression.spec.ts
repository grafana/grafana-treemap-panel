import path from 'node:path';
import { test, expect } from '@grafana/plugin-e2e';
import dashboardJson from '../../provisioning/dashboards/dashboard.json';

const panelScreenshotOptions = {
  maxDiffPixels: 0,
  stylePath: path.join(__dirname, 'show-panel-only.css'),
};

const { title: dashboardTitle, uid: dashboardUid, panels = [] } = dashboardJson;

const dashboardSlug = dashboardTitle.toLowerCase()
  .replace(/[^a-zA-Z0-9]+/g, ' ')
  .trim()
  .replace(' ', '-');

const dashboardUrl = `http://localhost:3000/d/${dashboardUid}/${dashboardSlug}`;

panels
  .filter(({ title }) => title !== 'Unconfigured panel')
  .forEach(({ title, id }) => {
    test(title, async ({ page }) => {
      await page.goto(
        `${dashboardUrl}?orgId=1&from=now-6h&to=now&timezone=browser&viewPanel=panel-${id}`
      );

      const panel = page.locator(
        `[data-viz-panel-key="panel-${id}"]`
      );
      await expect(panel).toBeVisible();

      await expect(page.getByText('Loading').first())
        .not
        .toBeVisible();

      const panelVisualizationSvg = page.locator(
        `[data-testid="data-testid panel content"] svg`
      );
      await expect(panelVisualizationSvg).toBeVisible();

      const screenshotFilename = `${title.trim().replace(' ', '-')}.png`;
      await expect(page).toHaveScreenshot(screenshotFilename, panelScreenshotOptions);
    });
  });
