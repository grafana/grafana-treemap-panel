import React, { useState } from 'react';
import * as d3 from 'd3';
import { TilingOption } from './types';
import { getFormattedDisplayValue, measureText, PanelWizard } from 'grafana-plugin-support';
import { css } from 'emotion';

import {
  PanelProps,
  MappingType,
  ValueMap,
  RangeMap,
  ValueMapping,
  Field,
  ArrayVector,
  FieldType,
} from '@grafana/data';
import { useTheme, Badge, ContextMenu, MenuItemsGroup, MenuItem } from '@grafana/ui';

import { TreemapOptions } from 'types';

// Tippy
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { followCursor } from 'tippy.js';

const originNodeId = 'Origin';

interface Props extends PanelProps<TreemapOptions> {}

/**
 * TreemapPanel uses the treemap library from D3.js to draw a treemap in a panel.
 */
export const TreemapPanel: React.FC<Props> = ({ options, data, width, height }) => {
  const { tiling } = options;

  // State for context menu.
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [contextMenuLabel, setContextMenuLabel] = useState<React.ReactNode | string>('');
  const [contextMenuGroups, setContextMenuGroups] = useState<MenuItemsGroup[]>([]);
  const [showContextMenu, setShowContextMenu] = useState(false);

  const theme = useTheme();

  const frames = data.series
    .map((frame) => {
      return {
        textField: options.textField
          ? frame.fields.find((f) => f.name === options.textField)
          : frame.fields.find((f) => f.type === 'string'),
        sizeByField: options.sizeField
          ? frame.fields.find((f) => f.name === options.sizeField)
          : frame.fields.find((f) => f.type === 'number'),
        colorByField: options.colorByField
          ? frame.fields.find((f) => f.name === options.colorByField)
          : frame.fields.find((f) => f.type === 'number'),
        groupByField: frame.fields.find((f) => f.name === options.groupByField),
        refId: frame.refId,
        labels: options.labelFields?.map((_) => frame.fields.find((f) => f.name === _)) ?? [],
      };
    })
    // Only use frames with proper fields.
    .filter((frame) => frame.textField && frame.sizeByField && frame.colorByField)
    // Apply value mappings to fields.
    .map((frame) => ({
      ...frame,
      textField: applyValueMappings(frame.textField),
      sizeByField: applyValueMappings(frame.sizeByField),
      labels: frame.labels.map(applyValueMappings),
    }));

  if (frames.length === 0) {
    return (
      <div style={{ width, height }}>
        <PanelWizard
          schema={[
            { description: 'Tile label', type: FieldType.string },
            { description: 'Tile size', type: FieldType.number },
          ]}
          fields={data.series.length > 0 ? data.series[0].fields : []}
          url={'https://github.com/marcusolsson/grafana-treemap-panel'}
        />
      </div>
    );
  }

  // Create the groups for the treemap.
  const groups: Array<{ name: string; parent: string }> = [
    { name: originNodeId, parent: '' },
    // Add the refIds as parent nodes.
    ...data.series.map((_) => _.refId!).map((refId) => ({ name: refId, parent: originNodeId })),
    // Add categories for all the unique values in the groupBy field using the
    // refId as the parent node.
    ...frames
      .map((fields) => ({
        refId: fields.refId,
        values: fields.groupByField ? [...new Set(fields.groupByField.values.toArray())] : [],
      }))
      .flatMap((_) => _.values!.map((value) => ({ name: value.toString(), parent: _.refId! })))
      .map((_) => ({ ..._, name: JSON.stringify(_) })),
  ];

  // Create the nodes for the treemap.
  const nodes: TreemapNode[] = frames.flatMap((fields) =>
    Array.from({ length: fields.textField?.values.length! }).map(
      (_, i): TreemapNode => ({
        name: fields.textField!.values.get(i)!,
        parent: fields.groupByField
          ? JSON.stringify({
              name: fields.groupByField!.values.get(i).toString(),
              parent: fields.refId,
            })
          : originNodeId,

        textField: fields.textField,
        sizeByField: fields.sizeByField,
        colorByField: fields.colorByField,
        labelFields: fields.labels,

        valueRowIndex: i,
      })
    )
  );

  const root = buildTreemap({ width, height, tiling, groups, nodes });

  const margin = { top: 20, left: 10, bottom: 10, right: 10 };

  return (
    <>
      {showContextMenu
        ? renderContextMenu(contextMenuPos, contextMenuLabel, contextMenuGroups, () => setShowContextMenu(false))
        : null}
      <svg width={width} height={height}>
        <g>
          {root
            .leaves()
            .filter((d) => !(isNaN(d.x0) || isNaN(d.x1) || isNaN(d.y0) || isNaN(d.y1)))
            .filter((d) => d.data.textField && d.data.sizeByField && d.data.colorByField)
            .map((d, i) => {
              const node = d.data;
              const sizeValue = node.sizeByField!.values.get(node.valueRowIndex!);
              const colorValue = node.colorByField!.values.get(node.valueRowIndex!);

              const innerWidth = d.x1 - d.x0;
              const innerHeight = d.y1 - d.y0;

              const textWidth = measureText(node.name, '12px')?.width ?? 0;

              const textFitsHorizontally = textWidth + margin.left + margin.right < innerWidth;
              const textFitsVertically = margin.top + margin.bottom < innerHeight;
              const textFitsInRect = textFitsHorizontally && textFitsVertically;
              const valueText = getFormattedDisplayValue(node.sizeByField!.display!(sizeValue));
              const tooltipContent = (
                <div>
                  <div>
                    {node.name}
                    <br />
                    {valueText}
                  </div>
                  {node.valueRowIndex !== undefined
                    ? node.labelFields
                        ?.map((_) => _!.display!(_!.values.get(node.valueRowIndex!)))
                        .map((_) => getFormattedDisplayValue(_))
                        .map((_, key) => (
                          <Badge
                            key={key}
                            className={css`
                              margin-right: ${theme.spacing.xs};
                              &:last-child {
                                margin-right: 0;
                              }
                            `}
                            text={_ ?? ''}
                            color="blue"
                          />
                        ))
                    : null}
                </div>
              );

              return (
                <Tippy key={i} content={tooltipContent} followCursor={true} plugins={[followCursor]} animation={false}>
                  <g
                    className={css`
                      cursor: pointer;
                    `}
                    onClick={(e) => {
                      setContextMenuPos({ x: e.clientX, y: e.clientY });
                      setShowContextMenu(true);
                      setContextMenuLabel(
                        <small>
                          {node.textField!.values.get(node.valueRowIndex!)}: {valueText}
                        </small>
                      );
                      setContextMenuGroups([
                        {
                          items: node.sizeByField!.getLinks!({ valueRowIndex: node.valueRowIndex }).map<MenuItem>(
                            (link) => {
                              return {
                                label: link.title,
                                url: link.href,
                                target: link.target,
                                icon: link.target === '_self' ? 'link' : 'external-link-alt',
                                onClick: link.onClick,
                              };
                            }
                          ),
                        },
                      ]);
                    }}
                  >
                    <rect
                      x={d.x0}
                      y={d.y0}
                      rx={theme.border.radius.sm}
                      ry={theme.border.radius.sm}
                      width={innerWidth}
                      height={innerHeight}
                      fill={node.colorByField!.display!(colorValue).color!}
                    />
                    {textFitsInRect ? (
                      <text
                        x={d.x0 + margin.left}
                        y={d.y0 + margin.top}
                        fontSize="12px"
                        fontWeight="500"
                        fill={theme.colors.panelBg}
                      >
                        {node.name}
                      </text>
                    ) : null}
                  </g>
                </Tippy>
              );
            })}
        </g>
      </svg>
    </>
  );
};

const applyValueMappings = (field?: Field): Field | undefined => {
  if (field) {
    const copy = field?.values.toArray();
    const values = copy?.map((val) => mapFieldValue(val, field.config.mappings ?? []));
    field.values = new ArrayVector(values);
  }
  return field;
};

const mapFieldValue = (value: string | number, mappings: ValueMapping[]): string | number | undefined => {
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

interface TreemapBuilderOptions {
  groups: TreemapNode[];
  nodes: TreemapNode[];
  tiling: TilingOption;
  width: number;
  height: number;
}

type TreemapNode = {
  // Required
  name: string;
  parent: string;

  // Metadata
  textField?: Field<string>;
  sizeByField?: Field<number>;
  colorByField?: Field<number>;
  labelFields?: Array<Field<number> | undefined>;
  valueRowIndex?: number;
};

/**
 * buildTreemap constructs the D3 treemap.
 */
const buildTreemap = ({
  groups,
  nodes,
  tiling,
  width,
  height,
}: TreemapBuilderOptions): d3.HierarchyRectangularNode<TreemapNode> => {
  const stratify = d3
    .stratify<TreemapNode>()
    .id((d) => d.name)
    .parentId((d) => d.parent);

  const root = stratify([...groups, ...nodes]);

  // Sum and sort values.
  root
    .sum((d) => {
      // Only leaves have a row index. We ignore groups for now.
      if (d.valueRowIndex === undefined) {
        return 0;
      }
      return d.sizeByField!.values.get(d.valueRowIndex!);
    })
    .sort((a, b) => b.value! - a.value!);

  let treemap = d3.treemap<TreemapNode>().tile(d3[tiling]).size([width, height]).round(true).padding(4);

  return treemap(root);
};

const renderContextMenu = (
  pos: { x: number; y: number },
  label: React.ReactNode | string,
  items: MenuItemsGroup[],
  onClose: () => void
) => {
  const contextContentProps = {
    x: pos.x,
    y: pos.y,
    onClose,
    items,
    renderHeader: () => label,
  };

  return <ContextMenu {...contextContentProps} />;
};
