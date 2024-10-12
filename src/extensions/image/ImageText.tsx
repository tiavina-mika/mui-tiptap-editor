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
import {
  IconButton, Stack, TextField, Theme, Typography,
} from '@mui/material';
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
  maxLegendLength?: number;
};

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

    if (attrName === 'title') { // title (label)
      values.top = 10;
    }
    else { // alt
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
    fontSize: '14px !important',
  },
};

/*
 * display only in editable mode
 * NOTE: if displaying the html string outside of the editor, hide this by using css
 */

const ImageText = ({
  defaultValue,
  onConfirm,
  label,
  attrName = 'alt',
  invalidErrorMessage,
  maxLegendLength = 100,
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isClear, setIsClear] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setValue(defaultValue || '');
  }, [defaultValue]);

  const handleOpen = () => {
    setOpen(true);
    setError('');
  };
  const handleClose = () => setOpen(false);

  const toggleClear = () => setIsClear(!isClear);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    let isValidInput;
    let errorMessage;

    if (attrName === 'alt') {
      const { isValid, message } = checkAlt(value);

      isValidInput = isValid;
      errorMessage = message;
    }
    else {
      const { isValid, message } = checkLegend(value, maxLegendLength);

      isValidInput = isValid;
      errorMessage = message;
    }
    console.log('🚀 ~ handleChange ~ errorMessage:', errorMessage);

    if (isValidInput) {
      setValue(value);
      setError('');
      return;
    }
    setError(invalidErrorMessage || errorMessage);
  };

  const handleConfirm = async () => {
    await onConfirm({ [attrName]: value });
    setOpen(false);
    /*
     * if delete this current node (each image)
     * deleteNode();
     */
  };

  // remove the current node
  const handleDelete = async () => {
    await onConfirm({ [attrName]: '' });
    setValue('');
    toggleClear();
  };

  if (isClear) return;

  return (
    <>
      <Stack
        alignItems="center"
        className="tiptap-legend-text"
        css={classes.imageTextRoot(attrName)}
        direction="row"
        spacing={0}
      >
        {value && !error
          ? (
            <Stack alignItems="center" direction="row" spacing={2}>
              <Typography>{value}</Typography>
              <IconButton
                size="small"
                sx={classes.buttonIconSx}
                type="button"
                onClick={handleOpen}
              >
                <Edit />
              </IconButton>
            </Stack>
          ) : (
            <button
              className="flexRow itemsCenter"
              css={[classes.buttonIconSx, classes.addButton]}
              type="button"
              onClick={handleOpen}
            >
              <Add />
              <Typography>{label}</Typography>
            </button>
          )}
        <IconButton
          size="small"
          sx={classes.buttonIconSx}
          type="button"
          onClick={handleDelete}
        >
          <Close />
        </IconButton>
      </Stack>
      {/* dialog form */}
      <Dialog
        fullWidth
        maxWidth="xs"
        open={open}
        title={label}
        onClose={handleClose}
        onPrimaryButtonAction={handleConfirm}
      >
        <TextField
          fullWidth
          error={!!error}
          helperText={error || (attrName === 'title' ? `${value.length}/${maxLegendLength}` : '')}
          value={value}
          onChange={handleChange}
          {...(attrName === 'title' ? { rows: 4, multiline: true } : {})}
        />
      </Dialog>
    </>
  );
};

export default ImageText;
