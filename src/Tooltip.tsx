import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';
import Tippy from '@tippyjs/react';
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
    border-radius: ${theme.v1.border.radius.sm};
    background-color: ${theme.v1.colors.bg2};
    padding: ${theme.v1.spacing.sm};
    box-shadow: 0px 0px 20px ${theme.v1.colors.dropdownShadow};
  `,
});
