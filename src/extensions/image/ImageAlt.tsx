/**
 *
 * Edit image alt text in Tiptap editor
 *
 * inspired by:
 * https://github.com/angelikatyborska/tiptap-image-alt-text/tree/main
 * https://angelika.me/2023/02/26/how-to-add-editing-image-alt-text-tiptap/
 * https://github.com/ueberdosis/tiptap/issues/2912
 * https://tiptap.dev/docs/editor/extensions/functionality/filehandler
 *
*/

import Edit from '../../icons/Edit';
import { IconButton, Stack, TextField, Theme, Typography } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { checkAlt } from '../../utils/app.utils';
import Dialog from '../../components/Dialog';
import Add from '../../icons/Add';
import Close from '../../icons/Close';
import { ILabels } from '../../types';

// check if the image is from tiptap or not
const FROM_TIPTAP = true;

const classes = {
  altContainer: (theme: Theme) => ({
    position: 'absolute' as const,
    bottom: 10,
    left: 10,
    maxWidth: 'calc(100% - 20px)',
    padding: '0 4px',
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
    padding: '4px 4px 4px 12px !important',
    fontSize: '14px !important'
  }
}

/*
  * display only in editable mode
  * NOTE: if displaying the html string outside of the editor, hide this by using css
*/
type Props = {
  labels: ILabels['upload'];
  defaultValue: string;
  onConfirm: (alt: string) => void;
}
const ImageAlt = ({ labels, defaultValue, onConfirm }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [clear, setClear] = useState<boolean>(false);
  const [alt, setAlt] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setAlt(defaultValue || '');
  }, [defaultValue])

  const altLabel = labels?.addAltText || 'Add alt text';

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const toggleClear = () => setClear(!clear);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (checkAlt(value)) {
      setAlt(value);
      return;
    }

    setError(labels?.enterValidAltText || 'Please enter a valid alt text');
  }

  const handleConfirm = async () => {
    await onConfirm(alt);
    setOpen(false);
    // if delete this current node (each image)
    // deleteNode();
  }

  const handleDelete = async () => {
    await onConfirm('');
    setAlt('');
    toggleClear();
  }

  if (clear) return;

  return (
    <>
      <Stack
        css={classes.altContainer}
        className='tiptap-alt-text'
        direction="row"
        alignItems="center"
        spacing={0}
        // this block should not be displayed if not from tiptap, ex: from html string parser
        // hide it using in inline style
        style={!FROM_TIPTAP ? { display: 'none' } : {}}
      >
        {alt && !error
          ? (
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography>{alt}</Typography>
              <IconButton size="small" sx={classes.buttonIconSx} type="button" onClick={handleOpen}>
                <Edit />
              </IconButton>
            </Stack>
          ) : (
            <button type="button" onClick={handleOpen} css={[classes.buttonIconSx, classes.addButton]} className="flexRow itemsCenter">
              <Add />
              <Typography>{altLabel}</Typography>
            </button>
          )}
        <IconButton size="small" sx={classes.buttonIconSx} type="button" onClick={handleDelete}>
          <Close />
        </IconButton>
      </Stack>
      {error && (
        <Typography color="error">{error}</Typography>
      )}
      <Dialog
        title={altLabel}
        open={open}
        onClose={handleClose}
        onPrimaryButtonAction={handleConfirm}
        className='tiptap-alt-text-dialog'
      >
        <TextField
          value={alt}
          onChange={handleChange}
        />
      </Dialog>
    </>
  )
}

export default ImageAlt;
