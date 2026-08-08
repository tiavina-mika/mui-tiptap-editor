'use client';

import { IconButton, Tooltip, type Theme } from '@mui/material';
import { useCurrentEditor, useEditorState } from '@tiptap/react';
import { Fragment, memo } from 'react';


import type { ToolbarItem } from '@/types/toolbar';
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

  /*
   * Subscribed individually to the editor's transactions (instead of relying on the parent
   * Toolbar to re-render top-down), so this button only re-renders when its own active state
   * actually changes — combined with `React.memo` below, unrelated buttons stay untouched.
   */
  /*
   * `useEditorState`'s return type is unioned with `null` when `editor` may be null, even
   * though the selector itself always returns a boolean — coerce it back at the call site.
   */
  const isActive = !!useEditorState({
    editor,
    selector: ({ editor }) => !!editor?.isActive(active || name), // the order is important
  });

  // if the menu has an id, we need to use a label (use htmlFor)
  const LabelComponent = id ? 'label' : Fragment;
  // label props if the menu has an id
  const labelProps = id ? { htmlFor: id, css: { cursor: 'pointer' } } : {};

  if (!editor) {
    return null;
  }

  if (!display) return null;

  const component = (
    <span data-testid={name}>
      <IconButton
        css={classes.button(isActive, !!split)}
        disabled={disabled}
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

export default memo(ToolBarIconButton);
