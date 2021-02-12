export type TilingOption = 'treemapBinary' | 'treemapDice' | 'treemapSlice' | 'treemapSliceDice' | 'treemapSquarify';

export interface TreemapOptions {
  tiling: TilingOption;
  textField: string;
  sizeField: string;
  colorByField: string;
  labelFields: string[];
  groupByField: string;
}
