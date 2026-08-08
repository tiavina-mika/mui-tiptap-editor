'use client';

import {
  Menu, MenuItem, Fade, Button,
} from '@mui/material';
import { Editor, useEditorState } from '@tiptap/react';
import { memo, useMemo, useState } from 'react';

import type { ILabels } from '@/types/labels';
import type { Theme } from '@mui/material';
import type { Level } from '@tiptap/extension-heading';
import type { MouseEvent } from 'react';

import ChevronDown from '@/assets/icons/chevron-down.svg';
import { getBorderColor } from '@/utils/app.utils';

import Icon from './Icon';

const options: Level[] = [1, 2, 3, 4, 5, 6];

const classes = {
  heading: (split: boolean) => (theme: Theme) => ({
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRight: split ? `1px solid ${getBorderColor(theme)}` : 'none',
  }),
  button: (isActive: boolean) => (theme: Theme) => ({
    backgroundColor: 'transparent',
    fontWeight: 500,
    paddingLeft: 8,
    paddingRight: 8,
    textTransform: 'capitalize' as const,
    // TODO: may be changed later
    border: isActive ? '0px solid gray !important' : 'none !important',
    borderRight: `1px solid ${theme.palette.grey[300]}`,
    fontSize: 14,
    lineHeight: 1,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  }),
  menuItem: (isActive: boolean, fontSize: number) => (theme: Theme) => ({
    backgroundColor: isActive ? theme.palette.grey[100] : 'transparent',
    fontSize,
  }),
};

type Props = {
  editor: Editor;
  headingLabels?: ILabels['headings'];
  split?: boolean;
};
const Heading = ({ editor, headingLabels, split = false }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selected, setSelected] = useState(0);

  /*
   * Single reactive selector instead of 6 (button) + 6 (menu items) separate `isActive` calls
   * recomputed on every render — only re-renders this component when the active heading level
   * actually changes.
   */
  const { isActive, activeLevel } = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => {
      const level = options.find((option) =>
        currentEditor?.isActive('heading', { level: option }));

      return { isActive: !!level, activeLevel: level ?? null };
    },
  });

  // get label for selected heading
  const selectedLabel = useMemo(() => {
    const heading = options.find((option) => option === selected);

    if (heading) {
      if (headingLabels?.[`h${heading}`]) {
        return headingLabels[`h${heading}`];
      }
      return `Heading ${heading}`;
    }

    if (headingLabels?.normalText) {
      return headingLabels.normalText;
    }
    return 'Normal text';
  }, [selected, headingLabels]);

  const handleOpenHeadingMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleSelectHeading = (heading: Level) => {
    editor.chain().focus().toggleHeading({ level: heading }).run();
    setSelected(heading);
    handleClose();
  };

  const handleSelectNormalText = () => {
    editor.chain().focus().setParagraph().run();
    setSelected(0);
    handleClose();
  };

  return (
    <span css={classes.heading(split)}>
      {/* button */}
      <Button
        className="flexRow center"
        color="inherit"
        css={classes.button(isActive)}
        type="button"
        variant="text"
        onClick={handleOpenHeadingMenu}
      >
        <span css={{ marginRight: 8 }}>{selectedLabel}</span>
        {/* chevron icon */}
        <Icon>
          <img alt="chevron down" src={ChevronDown} />
        </Icon>
      </Button>
      {/* menu */}
      <Menu
        anchorEl={anchorEl}
        id="select-heading-menu"
        open={Boolean(anchorEl)}
        slots={{ transition: Fade }}
        slotProps={{
          list: {
            'aria-labelledby': 'select-heading-button',
          },
        }}
        onClose={handleClose}
      >
        {/* normal text option */}
        <MenuItem onClick={handleSelectNormalText}>
          {headingLabels?.normalText || 'Normal text'}
        </MenuItem>
        {/* heading options */}
        {options.map((option, index) => (
          <MenuItem
            key={index}
            css={classes.menuItem(
              activeLevel === option, // isActive
              (10 - index) * 3 // fontSize is decreasing
            )}
            onClick={() => handleSelectHeading(option)}
          >
            {/* override labels or default ones */}
            {headingLabels?.[`h${option}`] || `Heading ${option}`}
          </MenuItem>
        ))}
      </Menu>
    </span>
  );
};

export default memo(Heading);
