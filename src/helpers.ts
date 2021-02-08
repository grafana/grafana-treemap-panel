import { FieldConfigProperty, StandardOptionConfig } from '@grafana/data';
import { config } from '@grafana/runtime';
import { gte } from 'semver';

export const measureText = (text: string): number => {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.font = '12px Arial';
    return ctx.measureText(text).width;
  }
  return 0;
};

/**
 * hasCapability returns true if the currently running version of Grafana
 * supports a given feature. Enables graceful degredation for earlier versions
 * that don't support a given capability.
 */
export const hasCapability = (capability: string) => {
  const version = config.buildInfo.version;
  switch (capability) {
    case 'color-scheme':
      return gte(version, '7.3.0');
    case 'standard-options':
      return gte(version, '7.4.0');
    default:
      return false;
  }
};

export const standardOptions = (options: FieldConfigProperty[]): any => {
  const init: Partial<Record<FieldConfigProperty, StandardOptionConfig>> = {};

  return hasCapability('standard-options')
    ? options.reduce((acc, curr) => {
        acc[curr] = {};
        return acc;
      }, init)
    : options;
};
