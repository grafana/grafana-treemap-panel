import React from 'react';
import * as d3 from 'd3';

import { PanelProps, FieldType, getNamedColorPalette, getColorForTheme, DisplayValue } from '@grafana/data';
import { useTheme, Badge } from '@grafana/ui';

import { TreemapOptions } from 'types';

// Tippy
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { followCursor } from 'tippy.js';

interface Props extends PanelProps<TreemapOptions> {}

export const TreemapPanel: React.FC<Props> = ({ options, data, width, height }) => {
  const theme = useTheme();

  const frame = data.series[0];

  // Use the first string field as names.
  const names = frame.fields.find(field => field.type === FieldType.string);

  // Use the first string field as values.
  const values = frame.fields.find(field => field.type === FieldType.number);

  // Use the `category` field as categories.
  // TODO: Let the user choose the field to use for categories.
  const category = frame.fields.find(field => field.name === 'category');

  const palette = getThemePalette(theme);

  // Use the provided display formatter, or fall back to a default one.
  const formatValue = values?.display
    ? values.display
    : (value: number): DisplayValue => ({ numeric: value, text: value.toString() });

  // Convert fields into rows.
  const rows = Array.from({ length: frame.length }).map((v, i) => ({
    name: names?.values.get(i),
    value: values?.values.get(i),
    category: category?.values.get(i),
  }));

  const allCategories = [
    {
      name: 'Origin',
      parent: '',
    },
  ].concat(
    [...new Set(rows.map(row => row.category).concat(['Ungrouped']))].map(c => ({
      name: c,
      parent: 'Origin',
    }))
  );

  // Convert rows to links for the stratify function.
  const links = rows.map((link, i) => ({
    name: link.name,
    value: link.value,
    parent: options.isGrouped ? link.category || 'Ungrouped' : 'Origin',
    category: link.category,
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
                {d.data.parent !== 'Ungrouped' && d.data.parent !== 'Origin' ? (
                  <Badge text={d.data.parent} color={`blue`} />
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
                    fill={options.isGrouped ? colorScale(d.data.category) : palette[0]}
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
