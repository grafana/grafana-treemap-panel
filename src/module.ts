import { PanelPlugin } from '@grafana/data';
import { TreemapOptions } from './types';
import { TreemapPanel } from './TreemapPanel';

export const plugin = new PanelPlugin<TreemapOptions>(TreemapPanel).useFieldConfig().setPanelOptions(builder => {
  return builder
    .addSelect({
      path: 'tiling',
      name: 'Tiling',
      description: 'Tiling algorithm to use',
      defaultValue: 'treemapSquarify',
      settings: {
        options: [
          { label: 'Binary', value: 'treemapBinary' },
          { label: 'Dice', value: 'treemapDice' },
          { label: 'Slice', value: 'treemapSlice' },
          { label: 'Slice Dice', value: 'treemapSliceDice' },
          { label: 'Squarify', value: 'treemapSquarify' },
        ],
      },
    })
    .addBooleanSwitch({
      path: 'isGrouped',
      name: 'Group values',
      defaultValue: false,
    });
});
