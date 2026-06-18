import { FieldType, PanelProps } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { getFormattedDisplayValue, PanelWizard } from './grafana-plugin-support/src';
import React, { MouseEvent, useState } from 'react';
import { FrameView, TreemapOptions } from 'types';
import { ContextMenu, MenuGroup } from './ContextMenu';
import { buildHierarchy, buildLayout } from './treemap';
import { TreemapTile } from './TreemapTile';
import { buildFrameViews } from './frameSelection';

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

  const theme = useTheme2();

  const frames: FrameView[] = buildFrameViews(data.series as any, options);

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
            const textValue = node.frame.text!.values[node.frame.valueRowIndex!];
            const sizeValue = node.frame.size!.values[node.frame.valueRowIndex!];
            const colorValue = node.frame.color!.values[node.frame.valueRowIndex!];

            const valueText = getFormattedDisplayValue(node.frame.size!.display!(sizeValue));
            const fillColor = node.frame.color!.display!(colorValue).color ?? theme.colors.text.primary;

            const labels =
              node.frame.valueRowIndex !== undefined
                ? node.frame.labels
                    ?.map((_: any) => _!.display!(_!.values[node.frame!.valueRowIndex!]))
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
              color={theme.colors.text.primary}
              opacity={0.05}
            />
          );
        })}
      </svg>
    </>
  );
};
