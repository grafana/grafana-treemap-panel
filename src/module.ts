import { PanelPlugin, FieldType, FieldConfigProperty } from '@grafana/data';
import { TreemapOptions } from './types';
import { TreemapPanel } from './TreemapPanel';
import { FieldSelectEditor } from './FieldSelectEditor';

export const plugin = new PanelPlugin<TreemapOptions>(TreemapPanel)
  .useFieldConfig({
    standardOptions: [FieldConfigProperty.Decimals, FieldConfigProperty.Unit, FieldConfigProperty.Mappings],
  })
  .setPanelOptions(builder => {
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
        name: 'Text',
        description: 'Field to use for text. Defaults to the first textual field.',
        editor: FieldSelectEditor,
        category: ['Dimensions'],
        settings: {
          filterByType: FieldType.string,
        },
      })
      .addCustomEditor({
        id: 'sizeField',
        path: 'sizeField',
        name: 'Size',
        description: 'Field to use for size. Defaults to the first numeric field.',
        editor: FieldSelectEditor,
        category: ['Dimensions'],
        settings: {
          filterByType: FieldType.number,
        },
      })
      .addCustomEditor({
        id: 'colorField',
        path: 'colorField',
        name: 'Color',
        description: 'Field to use for color. Defaults to the first numeric field.',
        category: ['Dimensions'],
        editor: FieldSelectEditor,
      });
  });
