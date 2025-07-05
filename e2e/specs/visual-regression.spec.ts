import path from 'node:path';
import { test, expect } from '@grafana/plugin-e2e';
import dashboardJson from '../../provisioning/dashboards/dashboard.json';

const panelScreenshotOptions = {
  maxDiff: 0.01,
  stylePath: path.join(__dirname, '..', 'css', 'show-panel-only.css'),
};

const { title: dashboardTitle, uid: dashboardUid, panels = [] } = dashboardJson;

const dashboardSlug = dashboardTitle.toLowerCase()
  .replace(/[^a-zA-Z0-9]+/g, ' ')
  .trim()
  .replace(' ', '-');

const grafanaUrl = process.env.GRAFANA_URL || 'http://localhost:3000';
const dashboardUrl = `${grafanaUrl}/d/${dashboardUid}/${dashboardSlug}`;

panels
  .filter(({ title }) => title !== 'Unconfigured panel')
  .forEach(({ title, id }) => {
    test(title, async ({ page }) => {
      await page.goto(
        `${dashboardUrl}?orgId=1&from=now-6h&to=now&timezone=browser&viewPanel=panel-${id}&kiosk`
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


      const panelSvgElement = page.locator(
        `[data-testid="data-testid panel content"]`
      );

      const path = `${title.trim().replace(' ', '-')}.png`;
      await panelSvgElement.screenshot({ path });

      await expect(panelSvgElement).toHaveScreenshot(path, panelScreenshotOptions);
    });
  });
