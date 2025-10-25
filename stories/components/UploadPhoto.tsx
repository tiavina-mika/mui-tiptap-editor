import type { TextEditorProps } from '@/types';

import TextEditor from '@/pages/TextEditor';

const UploadPhoto = ({
  maxFilesNumber = 1,
  allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'],
  maxSize = 5,
  imageMaxWidth = 1980,
  imageMaxHeight = 1080,
}: TextEditorProps['uploadFileOptions']) => {
  // API call to upload file
  const uploadFile = async (file: File) => {
    const formData = new FormData();

    formData.append('file', file);
    const response = await fetch('https://api.escuelajs.co/api/v1/files/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    return { id: data.filename, src: data.location };
  };

  return (
    <TextEditor
      content=""
      // content="<img alt='Cute cat' src='https://png.pngtree.com/png-clipart/20230511/ourmid/pngtree-isolated-cat-on-white-background-png-image_7094927.png' />"
      id="upload-image"
      uploadFileOptions={{
        uploadFile,
        maxSize,
        maxFilesNumber,
        allowedMimeTypes,
        imageMaxWidth,
        imageMaxHeight,
      }}
    />
  );
};

export default UploadPhoto;
