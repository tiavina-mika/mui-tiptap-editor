import "./textEditorStyles.css";

import {
  EditorContent,
  EditorOptions,
} from '@tiptap/react';

import { useTextEditor } from "@/hooks/useTextEditor";

export type TextEditorProps = {
  className?: string;
  value?: string;
  tab?: 'editor' | 'preview';
} & Partial<EditorOptions>;

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
