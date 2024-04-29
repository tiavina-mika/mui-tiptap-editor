import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm, FormProvider, Controller } from 'react-hook-form';

import z from 'zod';
import { TextEditor, TextEditorReadOnly } from 'mui-tiptap-editor';
import { Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';

const schema = z.object({
  content: z.string(),
});

type Input = z.infer<typeof schema>;

const WithHookForm = () => {
  const [value, setValue] = useState<string>('');

  const form = useForm<Input>({
    resolver: zodResolver(schema),
    defaultValues: { content: '' }

  });

  const { handleSubmit, control } = form;


  const handleFormSubmit: SubmitHandler<Input> = async values => {
    setValue(values.content);
  };

  return (
    <Stack spacing={2}>
      {/* form */}
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Stack spacing={2}>
            <Controller
                name="content"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextEditor
                    {...field}
                    label="Content"
                  />
                )}
              />
              {/* buttons */}
              <Stack direction="row" spacing={3}>
                <Button
                  variant="contained"
                  type="submit"
                >
                  Submit
                </Button>
            </Stack>
          </Stack>
        </form>
      </FormProvider>

      {/* result */}
      {value && (
        <Stack>
          <Typography variant="h6">
            Result:
          </Typography>
          <TextEditorReadOnly value={value} />
        </Stack>
      )}
    </Stack>
  );
};

export default WithHookForm;
