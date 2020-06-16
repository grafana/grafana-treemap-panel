type TilingOption = 'treemapBinary' | 'treemapDice' | 'treemapSlice' | 'treemapSliceDice' | 'treemapSquarify';

export interface TreemapOptions {
  tiling: TilingOption;
  isGrouped: boolean;
}
