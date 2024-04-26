import { IconButton } from '@mui/material';
import { Editor } from '@tiptap/react';
import { useState, ChangeEvent } from 'react';
import { z } from 'zod';

import Dialog from '../../../Dialog';
import TextFieldInput from '../TextFieldInput';

const linkSchemaField = z.string().url().min(5, { message: 'Must be 10 or more characters long' });

type Props = {
  editor: Editor;
  className?: string;
};
const LinkButton = ({ editor, className }: Props) => {
  const [openLinkDialog, setOpenLinkDialog] = useState<boolean>(false);
  const [link, setLink] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!editor) {
    return null;
  }

  const toggleLinkDialog = () => setOpenLinkDialog(!openLinkDialog);

  const handleChangeLink = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setLink(value);
  };

  const handleConfirm = () => {
    const validation = linkSchemaField.safeParse(link);
    if (!validation.success) {
      setError('Lien invalide');
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
    toggleLinkDialog();
  };

  const handleClose = () => {
    (editor.commands as any).unsetLink();
    toggleLinkDialog();
  };

  return (
    <>
      <IconButton onClick={toggleLinkDialog} className={className}>
        <img alt="link" src="/icons/link.svg" />
      </IconButton>
      <Dialog
        title=""
        open={openLinkDialog}
        onClose={handleClose}
        onPrimaryButtonAction={handleConfirm}
        fullWidth
      >
        <TextFieldInput
          placeholder="Lien"
          type="url"
          fullWidth
          onChange={handleChangeLink}
          value={link}
          error={!!error}
          helperText={error}
        />
      </Dialog>
    </>
  );
};

export default LinkButton;
