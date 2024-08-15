import "../index.css";

import {
  EditorContent,
} from '@tiptap/react';

import { useTextEditor } from "../hooks/useTextEditor";

type TextEditorProps = {
  className?: string;
  value?: string;
};

const TextEditorReadOnly = ({
  value,
  className,
  ...editorOptions
}: TextEditorProps) => {
  const editor = useTextEditor({
    value,
    tab: 'preview',
    editable: false,
    ...editorOptions
  })

  return <EditorContent editor={editor} className={className} />;
};

export default TextEditorReadOnly;
