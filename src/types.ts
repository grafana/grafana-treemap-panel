type TilingOption = 'treemapBinary' | 'treemapDice' | 'treemapSlice' | 'treemapSliceDice' | 'treemapSquarify';

export interface TreemapOptions {
  tiling: TilingOption;
  textField: string;
  sizeField: string;
  colorField: string;
}
