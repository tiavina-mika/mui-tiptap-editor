import "../index.css";

import {
  EditorContent,
} from '@tiptap/react';

import { useTextEditor } from "@/hooks/useTextEditor";

type TextEditorProps = {
  className?: string;
  value?: string;
  tab?: 'editor' | 'preview';
};

const TextEditorReadOnly = ({
  value,
  className,
  tab = 'preview',
  ...editorOptions
}: TextEditorProps) => {
  const editor = useTextEditor({
    value,
    tab,
    editable: false,
    ...editorOptions
  })

  return <EditorContent editor={editor} className={className} />;
};

export default TextEditorReadOnly;
