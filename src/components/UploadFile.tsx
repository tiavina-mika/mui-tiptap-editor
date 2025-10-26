'use client';

import { Editor } from '@tiptap/react';
import { useRef } from 'react';

import type { ILabels } from '@/types/labels';
import type { ImageUploadOptions } from '@/types/toolbar';

import {
  checkIsImage,
  checkValidFileDimensions,
  checkValidMimeType,
  getIsFileSizeValid,
  validateUploadedFile,
} from '@/utils/app.utils';

type Props = {
  editor: Editor;
  id?: string;
  labels?: ILabels['upload'];
} & Partial<ImageUploadOptions>;

const UploadFile = ({
  editor,
  labels,
  id,
  uploadFile,
  maxSize,
  imageMaxWidth,
  imageMaxHeight,
  allowedMimeTypes = null,
}: Props) => {
  const fileUploadRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = () => {
    if (!fileUploadRef.current) return;
    const files = fileUploadRef.current.files;

    if ((files?.length === 0) || !files) return;
    const file = files[0];

    // 1. check if the file is an image
    const { isValid: isImage, message: isImageMessage } = checkIsImage(file);

    if (!isImage) {
      window.alert(labels?.shouldBeAnImage || isImageMessage);
      return;
    }

    // 2. check if the mime type is allowed
    const { isValid: isValidMimeTypes, message: isValidMimeTypesMessage } =
      checkValidMimeType(file, allowedMimeTypes);

    if (!isValidMimeTypes) {
      window.alert(labels?.invalidMimeType || isValidMimeTypesMessage);
      return;
    }

    // 3. file size in MB
    const { isValid: isFileSizeValid, message: isFileSizeValidMessage } =
      getIsFileSizeValid(file, maxSize);

    if (!isFileSizeValid) {
      window.alert(labels?.fileTooLarge || isFileSizeValidMessage);
      return;
    }

    const reader = new FileReader();

    reader.onload = async (readerEvent: ProgressEvent<FileReader>) => {
      const target = readerEvent.target;

      if (!target) return;

      const {
        isValid: isImageDimensionValid,
        message: isImageDimensionValidMessage,
      } = await checkValidFileDimensions(file, imageMaxWidth, imageMaxHeight);

      if (!isImageDimensionValid) {
        window.alert(labels?.imageMaxSize || isImageDimensionValidMessage);
        return;
      }

      // upload the file to the server (API callback)
      const attrs = await validateUploadedFile({
        uploadFile,
        file,
        labels,
        attrs: { src: target.result as string },
      });

      if (!attrs) return;

      // insert the image into the editor
      editor.chain().focus().setImage(attrs).run();
    };
    reader.readAsDataURL(file);
  };

  return (
    <input
      ref={fileUploadRef}
      css={{ display: 'none' }}
      id={id}
      type="file"
      onChange={handleFileUpload}
    />
  );
};

export default UploadFile;
