import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm, FormProvider, Controller } from 'react-hook-form';

import z from 'zod';
import { TextEditor, TextEditorReadOnly } from 'mui-tiptap-editor';
import { Button, Stack } from '@mui/material';
import { useState } from 'react';

const schema = z.object({
  content: z.string(),
});

type Input = z.infer<typeof schema>;

const Form = () => {
  const [value, setValue] = useState<string>('');

  const form = useForm<Input>({
    resolver: zodResolver(schema),
  });

  const { handleSubmit, control } = form;


  const handleFormSubmit: SubmitHandler<Input> = async values => {
    setValue(values.content);
  };

  return (
    <Stack spacing={2}>
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
              <div>
                <Button
                  variant="contained"
                  type="submit"
                >
                  Submit
                </Button>
              </div>
          </Stack>
        </form>
      </FormProvider>

      {value && (
        <TextEditorReadOnly value={value} />
      )}
    </Stack>
  );
};

export default Form;
