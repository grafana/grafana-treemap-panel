import { GrafanaTheme } from '@grafana/data';
import { stylesFactory, useTheme } from '@grafana/ui';
import Tippy from '@tippyjs/react';
import { css } from 'emotion';
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
  const theme = useTheme();
  const styles = getStyles(theme);

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

const getStyles = stylesFactory((theme: GrafanaTheme) => {
  return {
    tooltip: css`
      border-radius: ${theme.border.radius.sm};
      background-color: ${theme.colors.bg2};
      padding: ${theme.spacing.sm};
      box-shadow: 0px 0px 20px ${theme.colors.dropdownShadow};
    `,
  };
});
