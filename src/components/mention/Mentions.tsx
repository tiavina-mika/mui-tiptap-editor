import { Theme } from '@emotion/react';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { SuggestionProps } from '@tiptap/suggestion';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { ITextEditorOption } from '../../types.d';

const classes = {
  list: (theme: Theme) => ({
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: 'relative' as const,
    overflow: 'auto',
    maxHeight: 300,
    '& ul': { padding: 0 },
  }),
  item: (theme: Theme) => ({
    '& .MuiTypography-root': {
      color: theme.palette.grey[800],
    },
  }),
};
type Props = {
  command: (value: { id: ITextEditorOption }) => void;
} & SuggestionProps<ITextEditorOption>; // items should be an select option
const Mentions = forwardRef<any, Props>(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = items[index];

    if (item) {
      // this id is accessible via node.attrs.id.label (id = option) in Mention config
      command({ id: item });
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + items.length - 1) % items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [items]);

  useImperativeHandle(ref, (): { onKeyDown: ({ event }: { event: KeyboardEvent }) => boolean } => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }): boolean => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <List css={classes.list}>
      {items.length ? (
        items.map((item: ITextEditorOption, index: number) => (
          <ListItem disablePadding key={index}>
            <ListItemButton
              onClick={() => selectItem(index)}
              className={`item ${index === selectedIndex ? 'is-selected' : ''}`}>
              <ListItemText primary={item.label} css={classes.item} />
            </ListItemButton>
          </ListItem>
        ))
      ) : (
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary="No results" />
          </ListItemButton>
        </ListItem>
      )}
    </List>
  );
});

export default Mentions;
