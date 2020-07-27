import React from 'react';
import * as d3 from 'd3';
import { css, cx } from 'emotion';

import {
  PanelProps,
  FieldType,
  getNamedColorPalette,
  getColorForTheme,
  DisplayValue,
  MappingType,
  ValueMap,
  RangeMap,
  ValueMapping,
  Field,
  ArrayVector,
} from '@grafana/data';
import { useTheme, Badge, Icon } from '@grafana/ui';

import { TreemapOptions } from 'types';

// Tippy
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { followCursor } from 'tippy.js';

const docsUrl = 'https://grafana.com/grafana/plugins/marcusolsson-treemap-panel';

// Selecting the same field for text and color creates duplicate nodes. This
// prefix is used to make the strings used for color unique. The prefix is only
// used for generating the tree, and is trimmed before presentation.
const colorNodePrefix = '$color_';

const originNodeId = 'Origin';
const ungroupedNodeId = 'Ungrouped';

interface Props extends PanelProps<TreemapOptions> {}

export const TreemapPanel: React.FC<Props> = ({ options, data, width, height }) => {
  const theme = useTheme();

  const frame = data.series[0];

  const textField = frame.fields.find(field =>
    options.textField ? field.name === options.textField : field.type === FieldType.string
  );
  const sizeField = frame.fields.find(field =>
    options.sizeField ? field.name === options.sizeField : field.type === FieldType.number
  );
  const colorField = frame.fields.find(field =>
    options.colorField ? field.name === options.colorField : field.type === FieldType.number
  );

  const success = css`
    color: ${theme.palette.brandSuccess};
  `;
  if (!textField || !sizeField) {
    return (
      <div style={{ overflow: 'hidden', height: '100%' }}>
        <p>To get started, create a query that returns:</p>
        <p>
          <div>
            <span className={cx({ [success]: !!textField })}>
              <Icon name={textField ? 'check-circle' : 'circle'} />
            </span>
            <span style={{ marginLeft: 5 }}>A text field</span>
          </div>
          <div>
            <span className={cx({ [success]: !!sizeField })}>
              <Icon name={sizeField ? 'check-circle' : 'circle'} />
            </span>
            <span style={{ marginLeft: 5 }}>A number field</span>
          </div>
        </p>
        <a href={docsUrl} style={{ color: theme.colors.linkExternal }}>
          Read the documentation
        </a>
      </div>
    );
  }

  if (frame.length === 0) {
    return <p>Query returned an empty result.</p>;
  }

  const isGrouped = colorField?.type !== FieldType.number;

  const palette = getThemePalette(theme);

  // Use the provided display formatter, or fall back to a default one.
  const formatValue = sizeField?.display
    ? sizeField.display
    : (value: number): DisplayValue => ({ numeric: value, text: value.toString() });

  // Apply value mappings.
  const mappedTextField = withMappedValues(textField, textField?.config.mappings ?? []);
  const mappedSizeField = withMappedValues(sizeField, sizeField?.config.mappings ?? []);
  const mappedColorField = withMappedValues(colorField, colorField?.config.mappings ?? []);

  // Convert fields into rows.
  const rows = Array.from({ length: frame.length }).map((v, i) => ({
    text: mappedTextField?.values.get(i),
    size: mappedSizeField?.values.get(i),
    color: mappedColorField?.values.get(i),
  }));

  const allCategories = [
    {
      name: originNodeId,
      parent: '',
    },
  ].concat(
    [...new Set(rows.map(row => row.color).concat([ungroupedNodeId]))].map(c => ({
      name: colorNodePrefix + c,
      parent: originNodeId,
    }))
  );

  // Convert rows to links for the stratify function.
  const links = rows.map((link, i) => ({
    name: link.text,
    value: link.size,
    parent: isGrouped ? colorNodePrefix + link.color || ungroupedNodeId : originNodeId,
    category: link.color,
  }));

  const root = d3
    .stratify()
    .id((d: any) => d.name)
    .parentId((d: any) => d.parent)([...allCategories, ...links]);

  // Sum and sort values.
  root
    .sum((d: any) => {
      return d.value;
    })
    .sort((a: any, b: any) => b.value - a.value);

  const margin = { top: 20, left: 10, bottom: 10, right: 10 };

  let treemap = d3
    .treemap()
    .tile(d3[options.tiling])
    .size([width, height])
    .round(true)
    .padding(4);

  treemap(root);

  // Create a scale for mapping categories to a color.
  const colorScale = d3
    .scaleOrdinal<string>()
    .domain(allCategories.map(c => c.name))
    .range(getThemePalette(theme));

  const colorScale2 = d3
    .scaleLinear<string>()
    .domain([sizeField?.config.min ?? 0, sizeField?.config.max ?? 0])
    .range([theme.palette.white, palette[0]]);

  return (
    <svg width={width} height={height}>
      <g>
        {root
          .leaves()
          .filter((d: any) => !(isNaN(d.x0) || isNaN(d.x1) || isNaN(d.y0) || isNaN(d.y1)))
          .map((d: any, i: number) => {
            const innerWidth = d.x1 - d.x0;
            const innerHeight = d.y1 - d.y0;

            // Format value for the tooltip.
            const displayValue = formatValue(d.data.value);
            let displayText = displayValue.suffix ? displayValue.text + ' ' + displayValue.suffix : displayValue.text;

            const textFitsHorizontally = measureText(d.data.name) + margin.left + margin.right < innerWidth;
            const textFitsVertically = margin.top + margin.bottom < innerHeight;
            const textFitsInRect = textFitsHorizontally && textFitsVertically;

            const tooltipContent = (
              <div>
                <div>{d.data.name}</div>
                <div>{displayText}</div>
                {/* Only display badge if the data has been explicitly grouped. */}
                {d.data.parent !== ungroupedNodeId && d.data.parent !== originNodeId ? (
                  <Badge text={d.data.parent.replace(colorNodePrefix, '')} color={`blue`} />
                ) : null}
              </div>
            );

            return (
              <Tippy key={i} content={tooltipContent} followCursor={true} plugins={[followCursor]} animation={false}>
                <g>
                  <rect
                    x={d.x0}
                    y={d.y0}
                    rx={3}
                    ry={3}
                    width={innerWidth}
                    height={innerHeight}
                    fill={isGrouped ? colorScale(d.data.category) : colorScale2(d.data.category)}
                  />
                  {textFitsInRect ? (
                    <text x={d.x0 + margin.left} y={d.y0 + margin.top} fill={theme.palette.white}>
                      {d.data.name}
                    </text>
                  ) : null}
                </g>
              </Tippy>
            );
          })}
      </g>
    </svg>
  );
};

const getThemePalette = (theme: any): string[] => {
  const colors: string[] = [];
  for (let entry of getNamedColorPalette()) {
    colors.push(getColorForTheme(entry[1][0], theme.type));
  }
  return colors;
};

const measureText = (text: string): number => {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.font = '14px Arial';
    return ctx.measureText(text).width;
  }
  return 0;
};

const withMappedValues = (field: Field | undefined, mappings: ValueMapping[]): Field | undefined => {
  if (field) {
    const copy = field?.values.toArray();
    const values = copy?.map(val => mapFieldValue(val, mappings));
    field.values = new ArrayVector(values);
  }
  return field;
};

const mapFieldValue = (value: string | number, mappings: ValueMapping[]): any => {
  let res;
  if (mappings.length === 0) {
    return value;
  }
  for (let mapping of mappings) {
    if (typeof value === 'number') {
      if (mapping.type === MappingType.ValueToText) {
        const valueMap = mapping as ValueMap;
        res = value.toString() === valueMap.value ? +valueMap.text : value;
      } else if (mapping.type === MappingType.RangeToText) {
        const rangeMap = mapping as RangeMap;
        const inRange = +rangeMap.from <= value && value < +rangeMap.to;
        res = inRange ? rangeMap.to : value;
      }
    } else if (typeof value === 'string') {
      if (mapping.type === MappingType.ValueToText) {
        const valueMap = mapping as ValueMap;
        res = value.toString() === valueMap.value ? valueMap.text : value;
      } else if (mapping.type === MappingType.RangeToText) {
        // Can't map a string to a numeric range.
        res = value;
      }
    }
  }
  return res;
};
