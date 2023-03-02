import { Field, FieldType, PanelProps } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { getFormattedDisplayValue, PanelWizard } from './grafana-plugin-support/src';
import React, { MouseEvent, useState } from 'react';
import { FrameView, TreemapOptions } from 'types';
import { ContextMenu, MenuGroup } from './ContextMenu';
import { buildHierarchy, buildLayout } from './treemap';
import { TreemapTile } from './TreemapTile';

interface Props extends PanelProps<TreemapOptions> {}

/**
 * TreemapPanel uses the treemap library from D3.js to draw a treemap in a panel.
 */
export const TreemapPanel: React.FC<Props> = ({ options, data, width, height }) => {
  const { tiling } = options;

  // State for context menu.
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [contextMenuLabel, setContextMenuLabel] = useState<React.ReactNode | string>('');
  const [contextMenuGroups, setContextMenuGroups] = useState<MenuGroup[]>([]);
  const [showContextMenu, setShowContextMenu] = useState(false);

  const theme = useTheme2().v1;

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
          url={'https://github.com/grafana/grafana-treemap-panel'}
        />
      </div>
    );
  }

  const hierarchy = buildHierarchy(frames);
  const root = buildLayout(hierarchy, width, height, tiling);

  return (
    <>
      {showContextMenu && (
        <ContextMenu
          x={contextMenuPos.x}
          y={contextMenuPos.y}
          onClose={() => setShowContextMenu(false)}
          renderMenuItems={() => contextMenuGroups}
          renderHeader={() => contextMenuLabel}
        />
      )}
      <svg width={width} height={height}>
        {root.descendants().map((d: any, i: any) => {
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
                    ?.map((_: any) => _!.display!(_!.values.get(node.frame!.valueRowIndex!)))
                    .map((_: any) => getFormattedDisplayValue(_))
                : [];

            const onClick = (e: MouseEvent<SVGElement>) => {
              setContextMenuPos({ x: e.clientX, y: e.clientY });
              setShowContextMenu(true);
              setContextMenuLabel(<small>{`${textValue}: ${valueText}`}</small>);
              setContextMenuGroups([
                {
                  label: 'Data links',
                  items: node.frame!.size!.getLinks!({ valueRowIndex: node.frame!.valueRowIndex }).map((link: any) => {
                    return {
                      label: link.title,
                      ariaLabel: link.title,
                      url: link.href,
                      target: link.target,
                      icon: link.target === '_self' ? 'link' : 'external-link-alt',
                      onClick: link.onClick,
                    };
                  }),
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
