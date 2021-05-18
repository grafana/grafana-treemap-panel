import React, { useState, MouseEvent } from 'react';
import { getFormattedDisplayValue, PanelWizard } from 'grafana-plugin-support';

import { PanelProps, FieldType, Field } from '@grafana/data';
import { ContextMenu, MenuItemsGroup, MenuItem, useTheme } from '@grafana/ui';

import { FrameView, TreemapOptions } from 'types';
import { TreemapTile } from './TreemapTile';

import { buildHierarchy, buildLayout } from './treemap';

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

  const frames: FrameView[] = data.series
    .map((frame) => {
      return {
        name: frame.name,
        refId: frame.refId,
        text: options.textField
          ? frame.fields.find((f) => f.name === options.textField)
          : frame.fields.find((f) => f.type === 'string'),
        size: options.sizeField
          ? frame.fields.find((f) => f.name === options.sizeField)
          : frame.fields.find((f) => f.type === 'number'),
        color: options.colorByField
          ? frame.fields.find((f) => f.name === options.colorByField)
          : frame.fields.find((f) => f.type === 'number'),
        groupBy: frame.fields.find((f) => f.name === options.groupByField),
        labels:
          options.labelFields
            ?.map((_) => frame.fields.find((f) => f.name === _))
            .filter((_) => _)
            .map((_) => _ as Field<any>) ?? [],
      };
    })
    // Only use frames with proper fields.
    .filter((frame) => frame.text && frame.size && frame.color);

  // Ensure that we have the data we need.
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

  const hierarchy = buildHierarchy(frames);
  const root = buildLayout(hierarchy, width, height, tiling);

  return (
    <>
      {showContextMenu &&
        renderContextMenu(contextMenuPos, contextMenuLabel, contextMenuGroups, () => setShowContextMenu(false))}
      <svg width={width} height={height}>
        {root.descendants().map((d, i) => {
          // Hide root node.
          if (i === 0) {
            return null;
          }

          const node = d.data;

          if (node.frame) {
            const textValue = node.frame.text!.values.get(node.frame.valueRowIndex!);
            const sizeValue = node.frame.size!.values.get(node.frame.valueRowIndex!);
            const colorValue = node.frame.color!.values.get(node.frame.valueRowIndex!);

            const valueText = getFormattedDisplayValue(node.frame.size!.display!(sizeValue));
            const fillColor = node.frame.color!.display!(colorValue).color!;

            const labels =
              node.frame.valueRowIndex !== undefined
                ? node.frame.labels
                    ?.map((_) => _!.display!(_!.values.get(node.frame!.valueRowIndex!)))
                    .map((_) => getFormattedDisplayValue(_))
                : [];

            const onClick = (e: MouseEvent<SVGElement>) => {
              setContextMenuPos({ x: e.clientX, y: e.clientY });
              setShowContextMenu(true);
              setContextMenuLabel(<small>{`${textValue}: ${valueText}`}</small>);
              setContextMenuGroups([
                {
                  items: node.frame!.size!.getLinks!({ valueRowIndex: node.frame!.valueRowIndex }).map<MenuItem>(
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
            };

            return (
              <TreemapTile
                key={i}
                x={d.x0}
                y={d.y0}
                width={d.x1 - d.x0}
                height={d.y1 - d.y0}
                label={node.name}
                value={valueText}
                labels={labels ?? []}
                color={fillColor}
                onClick={onClick}
                opacity={1}
              />
            );
          }

          return (
            <TreemapTile
              key={i}
              x={d.x0}
              y={d.y0}
              width={d.x1 - d.x0}
              height={d.y1 - d.y0}
              label={node.name}
              value={''}
              labels={[]}
              color={theme.colors.text}
              opacity={0.05}
            />
          );
        })}
      </svg>
    </>
  );
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
