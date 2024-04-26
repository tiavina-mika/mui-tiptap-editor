import {
  Stack,
} from "@mui/material";
import { Editor } from "@tiptap/react";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import Dialog from "@/components/Dialog";
import TextFieldInput from "../TextFieldInput";

const youtubeSchema = z.object({
  url: z.string().url(),
  width: z.number(),
  height: z.number()
});

type YoutubeInput = z.infer<typeof youtubeSchema>;

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

  const { t } = useTranslation('cms');

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
    const result = youtubeSchema.safeParse(values);
    if (!result.success) {
      const errorsResult = JSON.parse((result as any).error?.message);
      errorsResult.forEach((error: Record<string, any>) => {
        setErrors((prev) => ({
          ...prev,
          [error.validation]: error.message
        }));
      });
      return;
    }

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
      title={t('youtubeLink')}
      open={open}
      toggle={handleClose}
      onPrimaryButtonAction={handleConfirm}
      fullWidth
    >
      <Stack spacing={3}>
        <TextFieldInput
          name="url"
          fixedLabel
          label={t('link')}
          placeholder={t('enterTheLink')}
          variant="outlined"
          type="url"
          fullWidth
          onChange={handleChange}
          value={values.url}
          error={!!errors?.url}
          helperText={errors?.url}
        />
        <TextFieldInput
          name="width"
          label={t('width')}
          variant="outlined"
          type="number"
          fullWidth
          onChange={handleChange}
          value={values.width}
          error={!!errors?.width}
          helperText={errors?.width}
        />
        <TextFieldInput
          name="height"
          label={t('height')}
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
