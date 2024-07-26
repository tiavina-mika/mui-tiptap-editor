import { Editor } from "@tiptap/react";
import { useRef } from "react";

type Props = {
  editor: Editor;
  id?: string;
  // headingLabels?: ILabels["headings"];
};
const UploadImage = ({ editor, id = 'uploadImage' }: Props) => {
  const fileUploadRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = () => {
    if (!fileUploadRef.current) return;
    const files = fileUploadRef.current.files;
    if ((files && files.length === 0) || !files) return;
    const file = files[0];
    // const formData = new FormData();

    // formData.append("file", file);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
      const target = readerEvent.target as FileReader;
      const url = target.result;
      
      if (typeof url !== "string") return;
      editor.chain().focus().setImage({ src: url }).run()
    }

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

export default UploadImage;
