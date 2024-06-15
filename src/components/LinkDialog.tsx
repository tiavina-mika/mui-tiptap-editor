import { Editor } from '@tiptap/react';
import { useState, ChangeEvent } from 'react';

import { TextField } from '@mui/material';
import Dialog from './Dialog';
import { checkIsValidUrl } from '../utils/app.utils';

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
    if (!link) {
      setError('Please enter a link');
      return;
    }
    const isValidUrl = checkIsValidUrl(link);
    if (!isValidUrl) {
      setError('Invalid URL');
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
    (editor.commands as any)?.unsetLink();
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
