import { Editor } from '@tiptap/react';
import { useState, ChangeEvent } from 'react';
import { z } from 'zod';

import { TextField } from '@mui/material';
import Dialog from './Dialog';

const linkSchemaField = z.union([
  z
    .string()
    .url()
    .startsWith("https://", { message: 'Please enter a secure URL' }),
  z
    .string()
    .url()
    .startsWith("mailto://", { message: 'Please enter a secure URL' }),
  z.string().startsWith("+")
]);

type Props = {
  editor: Editor;
  open: boolean;
  onClose: () => void;
};
const LinkDialog = ({ editor, open, onClose }: Props) => {
  const [link, setLink] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!editor) {
    return null;
  }

  const handleChangeLink = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setLink(value);
  };

  const handleConfirm = () => {
    const result = linkSchemaField.safeParse(link);
    if (!result.success) {
      const error = JSON.parse((result as any).error?.message);
      setError(error[0]?.message);
      return;
    }

    // cancelled
    if (link === null) {
      return;
    }

    // empty
    if (link === '') {
      (editor.commands as any).unsetLink();
      return;
    }

    // update link
    (editor.commands as any).setLink({ href: link });
    onClose();
  };

  const handleClose = () => {
    (editor.commands as any).unsetLink();
    onClose();
  };

  return (
    <Dialog
      title=""
      open={open}
      onClose={handleClose}
      onPrimaryButtonAction={handleConfirm}
      fullWidth
    >
      <TextField
        label="Link"
        placeholder="Entrer le lien"
        type="url"
        fullWidth
        onChange={handleChangeLink}
        value={link}
        error={!!error}
        helperText={error}
      />
    </Dialog>
  );
};

export default LinkDialog;
