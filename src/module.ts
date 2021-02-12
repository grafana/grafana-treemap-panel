import { PanelPlugin, FieldType, FieldConfigProperty } from '@grafana/data';
import { TreemapOptions } from './types';
import { TreemapPanel } from './TreemapPanel';
import { FieldSelectEditor } from 'grafana-plugin-support';
import { standardOptionsCompat, getPanelPluginOrFallback } from 'grafana-plugin-support';

export const plugin = getPanelPluginOrFallback(
  'marcusolsson-treemap-panel',
  new PanelPlugin<TreemapOptions>(TreemapPanel)
    .useFieldConfig({
      standardOptions: standardOptionsCompat([
        FieldConfigProperty.Decimals,
        FieldConfigProperty.Unit,
        FieldConfigProperty.Mappings,
        FieldConfigProperty.Min,
        FieldConfigProperty.Max,
        FieldConfigProperty.Color,
        FieldConfigProperty.Thresholds,
        FieldConfigProperty.Links,
      ]),
    })
    .setPanelOptions((builder) => {
      return builder
        .addSelect({
          path: 'tiling',
          name: 'Tiling algorithm',
          description: 'Determines where to make each split.',
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
        .addCustomEditor({
          id: 'textField',
          path: 'textField',
          name: 'Label by',
          description:
            'Field to use for the text label. Defaults to the first textual field. All values must be unique.',
          editor: FieldSelectEditor,
          category: ['Dimensions'],
          settings: {
            filterByType: [FieldType.string],
          },
        })
        .addCustomEditor({
          id: 'sizeField',
          path: 'sizeField',
          name: 'Size by',
          description: 'Field to use for size. Defaults to the first numeric field.',
          editor: FieldSelectEditor,
          category: ['Dimensions'],
          settings: {
            filterByType: [FieldType.number],
          },
        })
        .addCustomEditor({
          id: 'colorByField',
          path: 'colorByField',
          name: 'Color by',
          description: 'Field to use for color. Defaults to the first numeric field.',
          editor: FieldSelectEditor,
          category: ['Dimensions'],
          settings: {
            filterByType: [FieldType.number],
          },
        })
        .addCustomEditor({
          id: 'groupByField',
          path: 'groupByField',
          name: 'Group by',
          description: 'Field to group by.',
          category: ['Dimensions'],
          editor: FieldSelectEditor,
        })
        .addCustomEditor({
          id: 'labelFields',
          path: 'labelFields',
          name: 'Additional labels',
          description: 'Fields to use as labels in the tooltip.',
          category: ['Dimensions'],
          editor: FieldSelectEditor,
          settings: {
            multi: true,
          },
        });
    })
);
