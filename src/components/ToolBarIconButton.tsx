'use client';

import { IconButton, Tooltip } from '@mui/material';
import { useCurrentEditor } from '@tiptap/react';
import { Fragment } from 'react';


import type { ToolbarItem } from '@/types';
import type { Theme } from '@emotion/react';
import type { ReactNode } from 'react';

import { getBorderColor } from '@/utils/app.utils';

import Icon from './Icon';

const classes = {
  button: (isActive: boolean, split: boolean) => (theme: Theme) => {
    let backgroundColor = 'transparent';
    const isLightMode = theme.palette.mode === 'light';

    if (isActive) {
      if (isLightMode) {
        backgroundColor = theme.palette.grey[100];
      } else {
        backgroundColor = theme.palette.grey[800];
      }
    }

    return {
      position: 'relative' as const,
      borderRadius: 0,
      border: 'none',
      borderRight: split ? `1px solid ${getBorderColor(theme)}` : 'none',
      cursor: 'pointer',
      height: 24,
      width: 24,
      padding: 18,
      backgroundColor,
      '&.Mui-disabled': {
        opacity: 0.4,
      },
    };
  },
  splittedBorder: (theme: Theme) => {
    return {
      borderRight: '1px solid ' + getBorderColor(theme),
    };
  },
};

type Props = ToolbarItem & {
  children?: ReactNode;
  display?: boolean;
};
const ToolBarIconButton = ({
  disabled,
  id,
  active,
  name,
  icon,
  iconSize,
  onClick,
  split,
  children,
  withTooltip = false,
  tooltip,
  display = false,
}: Props) => {
  const { editor } = useCurrentEditor();

  // if the menu has an id, we need to use a label (use htmlFor)
  const LabelComponent = id ? 'label' : Fragment;
  // label props if the menu has an id
  const labelProps = id ? { htmlFor: id, css: { cursor: 'pointer' } } : {};

  if (!editor) {
    return null;
  }

  if (!display) return null;

  const component = (
    <span>
      <IconButton
        disabled={disabled}
        css={classes.button(
          editor.isActive(active || name), // the order is important
          !!split
        )}
        onClick={onClick}
      >
        <LabelComponent {...labelProps}>
          {/* <Icon size={iconSize}>{icon}</Icon> */}
          <Icon size={iconSize}>
            {typeof icon === 'string' ? (<img alt={name} src={icon} width={iconSize} />) : (
              icon
            )}
          </Icon>
        </LabelComponent>
        {/* component used with label */}
        {children}
      </IconButton>
    </span>
  );

  return withTooltip ? (
    <Tooltip arrow title={tooltip || ''}>
      {component}
    </Tooltip>
  ) : (
    component
  );
};

export default ToolBarIconButton;
