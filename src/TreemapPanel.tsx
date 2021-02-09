import React, { useState } from 'react';
import * as d3 from 'd3';
import { TilingOption } from './types';
import { measureText } from 'grafana-plugin-support';
import { css } from 'emotion';

import {
  PanelProps,
  MappingType,
  ValueMap,
  RangeMap,
  ValueMapping,
  Field,
  ArrayVector,
  DisplayValue,
} from '@grafana/data';
import { useTheme, Badge, ContextMenu, MenuItemsGroup, MenuItem, InfoBox } from '@grafana/ui';

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
      const textField = options.textField
        ? frame.fields.find((f) => f.name === options.textField)
        : frame.fields.find((f) => f.type === 'string');

      const sizeField = options.sizeField
        ? frame.fields.find((f) => f.name === options.sizeField)
        : frame.fields.find((f) => f.type === 'number');

      const groupByField = frame.fields.find((f) => f.name === options.groupByField);

      const labelFields = options.labelFields?.map((_) => frame.fields.find((f) => f.name === _)) ?? [];

      return {
        label: textField,
        value: sizeField,
        groupBy: groupByField,
        refId: frame.refId,
        labels: labelFields,
      };
    })
    .map((frame) => ({
      ...frame,
      text: withMappedValues(frame.label, frame.label?.config.mappings ?? []),
      value: withMappedValues(frame.value, frame.value?.config.mappings ?? []),
      labels: frame.labels.map((_) => withMappedValues(_, _?.config.mappings ?? [])),
    }))
    .filter((frame) => frame.text && frame.value);

  if (frames.length === 0) {
    return (
      <div style={{ width, height, overflow: 'hidden' }}>
        <InfoBox
          title="Unable to graph data"
          url="https://github.com/marcusolsson/grafana-treemap-panel"
          severity="error"
          style={{ width: '100%' }}
        >
          <p>
            Update your query to return at least:
            <ul style={{ marginLeft: 20, marginTop: 10 }}>
              <li>A text field</li>
              <li>A number field</li>
            </ul>
          </p>
        </InfoBox>
      </div>
    );
  }

  // Create the groups for the treemap.
  const groups = [
    { name: originNodeId, parent: '' },
    // Add the refIds as parent nodes.
    ...data.series.map((_) => _.refId!).map((refId) => ({ name: refId, parent: originNodeId })),
    // Add categories for all the unique values in the groupBy field using the
    // refId as the parent node.
    ...frames
      .map((fields) => ({
        refId: fields.refId,
        values: fields.groupBy ? [...new Set(fields.groupBy.values.toArray())] : [],
      }))
      .flatMap((_) => _.values!.map((value) => ({ name: value.toString(), parent: _.refId! })))
      .map((_) => ({ ..._, name: JSON.stringify(_) })),
  ];

  // Create the nodes for the treemap.
  const nodes = frames.flatMap((fields) =>
    Array.from({ length: fields.text?.values.length! }).map(
      (_, i): TreemapNode => ({
        name: fields.text!.values.get(i)!,
        value: fields.value!.values.get(i)!,
        parent: fields.groupBy
          ? JSON.stringify({
              name: fields.groupBy!.values.get(i).toString(),
              parent: fields.refId,
            })
          : originNodeId,
        textField: fields.text!,
        sizeField: fields.value!,
        labelFields: fields.labels!,
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
            .filter((d) => d.data.textField && d.data.sizeField)
            .map((d, i) => {
              const node = d.data;

              const innerWidth = d.x1 - d.x0;
              const innerHeight = d.y1 - d.y0;

              const textFitsHorizontally =
                (measureText(node.name, '12px')?.width ?? 0) + margin.left + margin.right < innerWidth;
              const textFitsVertically = margin.top + margin.bottom < innerHeight;
              const textFitsInRect = textFitsHorizontally && textFitsVertically;
              const valueText = getFormattedDisplayValue(node.sizeField!.display!(node.value));
              const tooltipContent = (
                <div>
                  <div>
                    {node.name}
                    <br />
                    {valueText}
                  </div>
                  {node.valueRowIndex
                    ? node.labelFields
                        ?.map((_) => _?.display!(_?.values.get(node.valueRowIndex!)))
                        .map((_) => getFormattedDisplayValue(_!))
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
                  {/* Only display badge if the data has been explicitly grouped.
                  {node.parent !== ungroupedNodeId && node.parent !== originNodeId ? (
                    <Badge text={JSON.parse(node.parent).name} color="blue" />
                  ) : null} */}
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
                          items: node.sizeField!.getLinks!({ valueRowIndex: node.valueRowIndex }).map<MenuItem>(
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
                      fill={node.sizeField!.display!(node.value).color!}
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

const withMappedValues = (field: Field | undefined, mappings: ValueMapping[]): Field | undefined => {
  if (field) {
    const copy = field?.values.toArray();
    const values = copy?.map((val) => mapFieldValue(val, mappings));
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
  name: string;
  parent: string;

  value?: number;
  textField?: Field<string>;
  sizeField?: Field<number>;
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
      return d.value!;
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

const getFormattedDisplayValue = (displayValue?: DisplayValue): string => {
  return displayValue ? `${displayValue.prefix ?? ''}${displayValue.text}${displayValue.suffix ?? ''}` : '';
};
