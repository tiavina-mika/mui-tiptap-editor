import {
  Stack,
  TextField,
} from "@mui/material";
import { Editor } from "@tiptap/react";
import { ChangeEvent, useState } from "react";
import Dialog from "./Dialog";
import { checkIsValidYoutubeUrl } from '../utils/app.utils';
import { ILabels } from "../types";

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

const validateForm = (values: YoutubeInput): YoutubeValidation => {
  return {
    url: {
      validation: checkIsValidYoutubeUrl(values.url),
      error: 'Invalid youtube URL'
    },
    width: {
      validation: typeof values.width === 'number' && values.width > 0,
      error: 'Width must be greater than 0'
    },
    height: {
      validation: typeof values.height === 'number' && values.height > 0,
      error: 'Height must be greater than 0'
    },
  }
}

const initialValues = {
  url: "",
  width: 640,
  height: 480
};

type Props = {
  editor: Editor;
  open: boolean;
  onClose: () => void;
  labels?: ILabels['youtube'];
};
const YoutubeDialog = ({ editor, open, onClose, labels }: Props) => {
  const [values, setValues] = useState<YoutubeInput>(initialValues);
  const [errors, setErrors] = useState<Record<string, string> | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValues(
      (prev: YoutubeInput): YoutubeInput => ({
        ...prev,
        [event.target.name]: event.target.value
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
          [key]: result[key as keyof YoutubeValidation].error
        }));
        hasError = true;
      }
    });

    if (hasError) return;

    if (!values.url) return;
    editor.commands.setYoutubeVideo({
      src: values.url,
      width: Math.max(320, values.width),
      height: Math.max(180, values.height)
    });
    handleClose();
  };

  return (
    <Dialog
      title={labels?.title || 'Insert Youtube Video'}
      open={open}
      onClose={handleClose}
      onPrimaryButtonAction={handleConfirm}
      fullWidth
    >
      <Stack spacing={3}>
        <TextField
          name="url"
          label={labels?.link || 'Link'}
          placeholder={labels?.insert || 'Enter the link'}
          variant="outlined"
          type="url"
          fullWidth
          onChange={handleChange}
          value={values.url}
          error={!!errors?.url}
          helperText={errors?.url}
        />
        <TextField
          name="width"
          label={labels?.width || 'Width'}
          variant="outlined"
          type="number"
          fullWidth
          onChange={handleChange}
          value={values.width}
          error={!!errors?.width}
          helperText={errors?.width}
        />
        <TextField
          name="height"
          label={labels?.height || 'Height'}
          variant="outlined"
          type="number"
          fullWidth
          onChange={handleChange}
          value={values.height}
          error={!!errors?.height}
          helperText={errors?.height}
        />
      </Stack>
    </Dialog>
  );
};

export default YoutubeDialog;
