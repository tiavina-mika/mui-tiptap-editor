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
import { checkAlt, checkLegend } from '../../utils/app.utils';
import Dialog from '../../components/Dialog';
import Add from '../../icons/Add';
import Close from '../../icons/Close';

type Props = {
  defaultValue: string;
  onConfirm: (value: Record<string, string>) => void;
  label: string;
  attrName?: 'alt' | 'title';
  invalidErrorMessage?: string;
}

const classes = {
  imageTextRoot: (attrName: Props['attrName']) => (theme: Theme) => {
    const values: Record<string, string | number> = {
      position: 'absolute' as const,
      left: 10,
      maxWidth: 'calc(100% - 20px)',
      padding: '0 4px',
      border: '1px solid ' + theme.palette.divider,
      backgroundColor: theme.palette.background.paper,
      overflow: 'hidden',
    };

    if (attrName === 'title') {
      values.bottom = -230;
    } else {
      values.bottom = 10;
    }

    return values;
  },
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

const ImageText = ({
  defaultValue,
  onConfirm,
  label,
  attrName = 'alt',
  invalidErrorMessage
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [clear, setClear] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setValue(defaultValue || '');
  }, [defaultValue])

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const toggleClear = () => setClear(!clear);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const validate = attrName === 'alt' ? checkAlt : checkLegend;
    if (validate(value)) {
      setValue(value);
      return;
    }

    if (!invalidErrorMessage) return;
    setError(invalidErrorMessage);
  }

  const handleConfirm = async () => {
    await onConfirm({ [attrName]: value });
    setOpen(false);
    // if delete this current node (each image)
    // deleteNode();
  }

  // remove the current node
  const handleDelete = async () => {
    await onConfirm({ [attrName]: '' });
    setValue('');
    toggleClear();
  }

  if (clear) return;

  return (
    <>
      <Stack
        css={classes.imageTextRoot(attrName)}
        className='tiptap-legend-text'
        direction="row"
        alignItems="center"
        spacing={0}
      >
        {value && !error
          ? (
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography>{value}</Typography>
              <IconButton size="small" sx={classes.buttonIconSx} type="button" onClick={handleOpen}>
                <Edit />
              </IconButton>
            </Stack>
          ) : (
            <button type="button" onClick={handleOpen} css={[classes.buttonIconSx, classes.addButton]} className="flexRow itemsCenter">
              <Add />
              <Typography>{label}</Typography>
            </button>
          )}
        <IconButton size="small" sx={classes.buttonIconSx} type="button" onClick={handleDelete}>
          <Close />
        </IconButton>
      </Stack>
      {/* error message */}
      {error && (
        <Typography color="error">{error}</Typography>
      )}
      {/* dialog form */}
      <Dialog
        title={label}
        open={open}
        onClose={handleClose}
        onPrimaryButtonAction={handleConfirm}
      >
        <TextField
          value={value}
          onChange={handleChange}
        />
      </Dialog>
    </>
  )
}

export default ImageText;
