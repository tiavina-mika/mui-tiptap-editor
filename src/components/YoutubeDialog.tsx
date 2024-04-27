import {
  Stack,
  TextField,
} from "@mui/material";
import { Editor } from "@tiptap/react";
import { ChangeEvent, useState } from "react";
import Dialog from "@/components/Dialog";
import { checkIsValidYoutubeUrl } from '@/utils/app.utils';

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
};
const YoutubeDialog = ({ editor, open, onClose }: Props) => {
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
      title="Youtube link"
      open={open}
      toggle={handleClose}
      onPrimaryButtonAction={handleConfirm}
      fullWidth
    >
      <Stack spacing={3}>
        <TextField
          name="url"
          label="Link"
          placeholder="Enter the link"
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
          label="Width"
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
          label="Height"
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
