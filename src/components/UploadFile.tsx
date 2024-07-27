import { Editor } from "@tiptap/react";
import { useRef } from "react";
import { checkIsImage, checkValidFileDimensions, checkValidMimeType, getIsFileSizeValid } from "../utils/app.utils";
import { ILabels, ImageUploadOptions, UploadResponse } from "../types";

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

  const handleFileUpload = async () => {
    if (!fileUploadRef.current) return;
    const files = fileUploadRef.current.files;
    if ((files && files.length === 0) || !files) return;
    const file = files[0];

    // 1. check if the file is an image
    const { isValid: isImage, message: isImageMessage } = checkIsImage(file);
    if (!isImage) {
      window.alert(labels?.shouldBeAnImage || isImageMessage);
      return;
    }

    // 2. check if the mime type is allowed
    const { isValid: isValidMimeTypes, message: isValidMimeTypesMessage } = checkValidMimeType(file, allowedMimeTypes);
    if (!isValidMimeTypes) {
      window.alert(labels?.invalidMimeType || isValidMimeTypesMessage);
      return;
    }

    // 3. file size in MB
    const { isValid: isFileSizeValid, message: isFileSizeValidMessage } = getIsFileSizeValid(file, maxSize);
    if (!isFileSizeValid) {
      window.alert(labels?.fileTooLarge || isFileSizeValidMessage);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (readerEvent: ProgressEvent<FileReader>) => {
      const target = readerEvent.target;
      if (!target) return;

      const { isValid: isImageDimensionValid, message: isImageDimensionValidMessage } = await checkValidFileDimensions(file, imageMaxWidth, imageMaxHeight);
      if (!isImageDimensionValid) {
        window.alert(labels?.imageMaxSize || isImageDimensionValidMessage);
        return;
      }

      let attrs: UploadResponse = { src: target.result as string };

      // upload the file to the server (API callback)
      if (uploadFile) {
        const response = await uploadFile(file);

        if (response) {
          if (typeof response === 'string') {
            // if the response is a string, we assume it's the image src
            attrs.src = response;
          } else {
            // image attributes
            attrs = { ...attrs, ...response };
          }
        }
      }

      // insert the image into the editor
      editor.chain().focus().setImage(attrs).run();
    }
    reader.readAsDataURL(file);
  }

  return (
    <input
      ref={fileUploadRef}
      css={{ display: 'none' }}
      type="file"
      onChange={handleFileUpload}
      id={id}
    />
  );
};

export default UploadFile;
