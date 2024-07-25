import Image from '@tiptap/extension-image'
import { NodeViewWrapper, NodeViewWrapperProps, ReactNodeViewRenderer } from '@tiptap/react';
import Edit from '../icons/Edit';
import { Button, IconButton, Stack, TextField, Theme, Typography } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { checkAlt } from '../utils/app.utils';
import Dialog from '../components/Dialog';
import Add from '../icons/Add';

const classes = {
  tiptapImageRoot: {
    width: 'fit-content',
    position: 'relative' as const,
  },
  altContainer: (theme: Theme) => ({
    position: 'absolute' as const,
    bottom: 10,
    left: 10,
    maxWidth: 'calc(100% - 20px)',
    padding: '0 0.5em',
    border: '1px solid ' + theme.palette.divider,
    backgroundColor: theme.palette.background.paper,
    overflow: 'hidden',
  }),
  buttonIconSx: {
    '& svg': { width: 18 },
  },
  addButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    borderRadius: 4,
    padding: '4px 12px !important',
    fontSize: '14px !important'
  }
}
const getClassName = (selected: boolean): string => {
  // this className is used in the css file
  let className = 'tiptap-image';
  if (selected) {
    className += ' ProseMirror-selectednode';
  }
  return className
}

const ImageNode = (props: NodeViewWrapperProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [alt, setAlt] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setAlt(props.node.attrs.alt || '');
  }, [props.node.attrs.alt])

  const { updateAttributes } = props
  const { src } = props.node.attrs

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (checkAlt(value)) {
      setAlt(value);
      return;
    }

    setError('Please enter a valid alt text');
  }

  const onConfirm = async () => {
    await updateAttributes({ alt });
    setOpen(false)
  }

  return (
    <NodeViewWrapper className={getClassName(props.selected)} data-drag-handle css={classes.tiptapImageRoot}>
      <img src={src} alt={alt} />
      {alt && !error
        ? (
          <Stack css={classes.altContainer} className='alt-text-indicator' direction="row" alignItems="center" spacing={2}>
            <Typography>{alt}</Typography>
            <IconButton size="small" sx={classes.buttonIconSx} type="button" onClick={handleOpen}>
              <Edit />
            </IconButton>
          </Stack>
        ) : (
          <button type="button" onClick={handleOpen} css={[classes.buttonIconSx, classes.addButton, classes.altContainer]} className="flexRow itemsCenter">
            <Add />
            <Typography>Add alt</Typography>
          </button>
        )}
        {error && (
          <Typography color="error">{error}</Typography>
        )}
      <Dialog
        title="Add Alt"
        open={open}
        onClose={handleClose}
        onPrimaryButtonAction={onConfirm}
      >
        <TextField
          label="Alt text"
          value={alt}
          onChange={handleChange}
        />
      </Dialog>
    </NodeViewWrapper>
  )
}

const CustomImage = Image.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ImageNode)
  }
})

export default CustomImage;
