import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm, FormProvider, Controller } from 'react-hook-form';

import z from 'zod';
import { TextEditor } from 'mui-tiptap-editor';
import { Button } from '@mui/material';

const schema = z.object({
  content: z.string(),
});

type Input = z.infer<typeof schema>;

const Form = () => {
  const form = useForm<Input>({
    resolver: zodResolver(schema),
  });

  const { handleSubmit, control } = form;


  const handleFormSubmit: SubmitHandler<Input> = async values => {
    console.log('values: ', values);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Controller
            name="content"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextEditor
                {...field}
                label="content"
              />
            )}
          />
        <Button
          variant="contained"
          fullWidth
          type="submit"
        />
      </form>
    </FormProvider>
  );
};

export default Form;
