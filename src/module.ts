import { PanelPlugin, FieldType, FieldConfigProperty } from '@grafana/data';
import { TreemapOptions } from './types';
import { TreemapPanel } from './TreemapPanel';
import { FieldSelectEditor } from './FieldSelectEditor';

export const plugin = new PanelPlugin<TreemapOptions>(TreemapPanel)
  .useFieldConfig({
    standardOptions: [FieldConfigProperty.Decimals, FieldConfigProperty.Unit],
  })
  .setPanelOptions(builder => {
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
      .addCustomEditor({
        id: 'textField',
        path: 'textField',
        name: 'Text from field',
        editor: FieldSelectEditor,
        settings: {
          filterByType: FieldType.string,
        },
      })
      .addCustomEditor({
        id: 'sizeField',
        path: 'sizeField',
        name: 'Size from field',
        editor: FieldSelectEditor,
        settings: {
          filterByType: FieldType.number,
        },
      })
      .addCustomEditor({
        id: 'colorField',
        path: 'colorField',
        name: 'Color from field',
        editor: FieldSelectEditor,
      });
  });
