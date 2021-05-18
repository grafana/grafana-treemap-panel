import React, { MouseEvent } from 'react';

import { useTheme, Badge } from '@grafana/ui';
import { measureText } from 'grafana-plugin-support';
import { css, cx } from 'emotion';

// Tippy
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { followCursor } from 'tippy.js';

interface Props {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  value: string;
  labels: string[];
  onClick?: (event: MouseEvent<SVGGElement>) => void;
  color: string;
  opacity: number;
}

export const TreemapTile = ({ x, y, width, height, label, value, labels, onClick, color, opacity }: Props) => {
  const theme = useTheme();

  const styles = {
    text: css`
      font-size: ${theme.typography.size.base};
      font-weight: 500;
    `,
  };

  const textWidth = measureText(label, theme.typography.size.base)?.width ?? 0;
  const margin = { top: 20, left: 10, bottom: 10, right: 10 };

  const textFitsHorizontally = textWidth + margin.left + margin.right < width;
  const textFitsVertically = margin.top + margin.bottom < height;
  const textFitsInRect = textFitsHorizontally && textFitsVertically;

  const tooltipContent = (
    <div>
      <div>
        {label}
        <br />
        {value}
      </div>

      {labels.map((_, key) => (
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
      ))}
    </div>
  );
  return (
    <Tippy content={tooltipContent} followCursor={true} plugins={[followCursor]} animation={false}>
      <g
        className={cx({
          [css`
            cursor: pointer;
          `]: !!onClick,
        })}
        onClick={onClick}
      >
        <rect
          x={x}
          y={y}
          rx={theme.border.radius.sm}
          ry={theme.border.radius.sm}
          width={width}
          height={height}
          fill={color}
          opacity={opacity}
        />
        {textFitsInRect && (
          <text
            className={styles.text}
            x={x + margin.left}
            y={y + margin.top}
            fill={opacity < 1 ? theme.colors.text : theme.colors.panelBg}
          >
            {label}
          </text>
        )}
      </g>
    </Tippy>
  );
};
