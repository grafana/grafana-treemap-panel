// Derived from https://github.com/marcusolsson/grafana-plugin-support

import {
  FieldConfigProperty,
  StandardOptionConfig,
} from "@grafana/data";
import { config } from "@grafana/runtime";
import { gte } from "semver";

/**
 * hasCapability returns true if the currently running version of Grafana
 * supports a given feature. Enables graceful degredation for earlier versions
 * that don't support a given capability.
 */
const hasCapability = (capability: string) => {
  const version = config.buildInfo.version;
  switch (capability) {
    case "color-scheme":
      return gte(version, "7.3.0");
    case "standard-options-object":
      return gte(version, "7.4.0");
    case "custom-editor-context":
      return gte(version, "7.0.3");
    case "field-config-with-min-max":
      return gte(version, "7.4.0");
    default:
      return false;
  }
};

/**
 * standardOptionsCompat translates the standard options API prior to 7.4 to the
 * new API.
 */
export const standardOptionsCompat = (options: FieldConfigProperty[]): any => {
  if (hasCapability("standard-options-object")) {
    return options.reduce<
      Partial<Record<FieldConfigProperty, StandardOptionConfig>>
    >((acc, curr) => {
      acc[curr] = {};
      return acc;
    }, {});
  }
  return options;
};

