import { Field } from '@grafana/data';

export type TilingOption = 'treemapBinary' | 'treemapDice' | 'treemapSlice' | 'treemapSliceDice' | 'treemapSquarify';

export interface TreemapOptions {
  tiling: TilingOption;
  textField: string;
  sizeField: string;
  colorByField: string;
  labelFields: string[];
  groupByField: string;
}

export interface TreemapFieldConfig {
  separator: string;
}

export interface FrameView {
  name?: string;
  text?: Field<string>;
  size?: Field<number>;
  color?: Field<number>;
  groupBy?: Field<any>;
  labels: Array<Field<any>>;

  valueRowIndex?: number;
}
