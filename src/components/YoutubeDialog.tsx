'use client';

import { Stack, TextField } from '@mui/material';
import { Editor } from '@tiptap/react';
import { useState } from 'react';

import type { ILabels } from '@/types/labels';
import type { ChangeEvent } from 'react';

import { checkIsValidYoutubeUrl } from '@/utils/app.utils';

import Dialog from './Dialog';

type YoutubeInput = {
  url: string;
  width: number;
  height: number;
};

type YoutubeValidation = {
  [x in keyof YoutubeInput]: {
    validation: boolean;
    error: string;
  };
};

/**
 * Validate form values
 * @param values
 * @returns
 */
const validateForm = (values: YoutubeInput): YoutubeValidation => {
  return {
    url: {
      validation: checkIsValidYoutubeUrl(values.url),
      error: 'Invalid youtube URL',
    },
    width: {
      validation: typeof values.width === 'number' && values.width > 0,
      error: 'Width must be greater than 0',
    },
    height: {
      validation: typeof values.height === 'number' && values.height > 0,
      error: 'Height must be greater than 0',
    },
  };
};

const initialValues = {
  url: '',
  width: 640,
  height: 480,
};

type Props = {
  editor: Editor;
  open: boolean;
  onClose: () => void;
  labels?: ILabels['youtube'];
};
const YoutubeDialog = ({
  editor, open, onClose, labels,
}: Props) => {
  const [values, setValues] = useState<YoutubeInput>(initialValues);
  const [errors, setErrors] = useState<Record<string, string> | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValues(
      (prev: YoutubeInput): YoutubeInput => ({
        ...prev,
        [event.target.name]: event.target.value,
      })
    );
  };

  const handleClose = () => {
    onClose();
    setValues(initialValues);
    setErrors(null);
  };

  if (!editor) {
    return null;
  }

  const handleConfirm = () => {
    const result: YoutubeValidation = validateForm(values);
    let hasError = false;

    Object.keys(result).forEach((key) => {
      if (!result[key as keyof YoutubeValidation].validation) {
        setErrors((prev) => ({
          ...prev,
          [key]: result[key as keyof YoutubeValidation].error,
        }));
        hasError = true;
      }
    });

    if (hasError) return;

    if (!values.url) return;
    editor.commands.setYoutubeVideo({
      src: values.url,
      width: Math.max(320, values.width),
      height: Math.max(180, values.height),
    });
    handleClose();
  };

  return (
    <Dialog
      fullWidth
      open={open}
      title={labels?.title || 'Insert Youtube Video'}
      onClose={handleClose}
      onPrimaryButtonAction={handleConfirm}
    >
      <Stack spacing={3}>
        <TextField
          fullWidth
          error={!!errors?.url}
          helperText={errors?.url}
          label={labels?.link || 'Link'}
          name="url"
          placeholder={labels?.insert || 'Enter the link'}
          type="url"
          value={values.url}
          variant="outlined"
          onChange={handleChange}
        />
        <TextField
          fullWidth
          error={!!errors?.width}
          helperText={errors?.width}
          label={labels?.width || 'Width'}
          name="width"
          type="number"
          value={values.width}
          variant="outlined"
          onChange={handleChange}
        />
        <TextField
          fullWidth
          error={!!errors?.height}
          helperText={errors?.height}
          label={labels?.height || 'Height'}
          name="height"
          type="number"
          value={values.height}
          variant="outlined"
          onChange={handleChange}
        />
      </Stack>
    </Dialog>
  );
};

export default YoutubeDialog;
