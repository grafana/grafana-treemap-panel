import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';
import Tippy from 'rb-tippyjs-react';
import React from 'react';
import { followCursor } from 'tippy.js';

interface Props {
  content: React.ReactNode;
  children?: React.ReactElement<any>;
}

/**
 * Tooltip encapsulates Tippy into a API similar to the Grafana Tooltip.
 */
export const Tooltip = ({ content, children }: Props) => {
  const styles = useStyles2(getStyles);

  return (
    <Tippy
      maxWidth={'100%'}
      followCursor={true}
      plugins={[followCursor]}
      content={content}
      animation={false}
      className={styles.tooltip}
    >
      {children}
    </Tippy>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  tooltip: css`
    border-radius: ${theme.shape.radius.default};
    background-color: ${theme.components.tooltip.background};
    padding: ${theme.spacing(1)};
    box-shadow: ${theme.shadows.z3};
  `,
});
