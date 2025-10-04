'use client';

import { Theme } from '@emotion/react';
import { IconButton } from '@mui/material';
import { Editor } from '@tiptap/react';
import {
  Fragment,
} from 'react';

import { ToolbarItem } from '../types.d';
import {
  getBorderColor,
} from '../utils/app.utils';

import Icon from '../icons/Icon';

const classes = {
  button: (isActive: boolean, split: boolean) => (theme: Theme) => {
    let backgroundColor = 'transparent';
    const isLightMode = theme.palette.mode === 'light';

    if (isActive) {
      if (isLightMode) {
        backgroundColor = theme.palette.grey[100];
      }
      else {
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

type Props = {
  editor: Editor;
  menu: ToolbarItem;
}
const ToolBarIconButton = ({
  editor,
  menu
}: Props) => {
  // if the menu has an id, we need to use a label (use htmlFor)
  const LabelComponent = menu.id ? 'label' : Fragment;
  // label props if the menu has an id
  const labelProps = menu.id ? { htmlFor: menu.id, css: { cursor: 'pointer' } } : {};

  return (
    <span>
      <IconButton
        disabled={menu.disabled}
        css={classes.button(
          editor.isActive(menu.active || menu.name), // the order is important
          !!menu.split
        )}
        onClick={menu.onClick}
      >
        <LabelComponent {...labelProps}>
          <Icon size={menu.iconSize}>
            <menu.icon />
          </Icon>
        </LabelComponent>
        {/* component used with label */}
        {menu.component}
      </IconButton>
    </span>
  );
};

export default ToolBarIconButton;
