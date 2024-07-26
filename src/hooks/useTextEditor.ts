import {  useTheme } from '@mui/material';
import { Color } from '@tiptap/extension-color';
import Document from '@tiptap/extension-document';
import Link from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import Text from '@tiptap/extension-text';
import TextStyle from '@tiptap/extension-text-style';
import TipTapTypography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import Gapcursor from "@tiptap/extension-gapcursor";
import TextAlign from "@tiptap/extension-text-align";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Youtube from "@tiptap/extension-youtube";
import BubbleMenu from '@tiptap/extension-bubble-menu';
import { createLowlight, common } from "lowlight";
import {
  useEditor,
  EditorOptions,
  AnyExtension,
  EditorEvents,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import Heading from '@tiptap/extension-heading';
import { ILabels, ImageUploadOptions, ITextEditorOption } from '../types.d';
import getCustomImage from '../extensions/CustomImage';
import { getCustomMention } from '../extensions/CustomMention';

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] } as any),
  Document,
  Paragraph,
  Text,
  TipTapTypography,
  Underline,
  Link.configure({
    protocols: [
      "https",
      "mailto",
      {
        scheme: "tel",
        optionalSlashes: true
      }
    ],
    HTMLAttributes: {
      // Change rel to different value
      // Allow search engines to follow links(remove nofollow)
      rel: 'noopener noreferrer',
      // Remove target entirely so links open in current tab
      target: null,
    },
  }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    // history: false, // important because history will now be handled by Y.js
    codeBlock: false
  }),
  Heading.configure({
    HTMLAttributes: {
      class: 'custom-heading',
    },
    levels: [1, 2, 3, 3, 4, 5, 6],
  }),
  Table.configure({
    resizable: true
  }),
  TableRow,
  TableHeader,
  TableCell,
  Gapcursor,
  Youtube,
  TextAlign.configure({
    types: ["heading", "paragraph", "table", "image"]
  }),
  CodeBlockLowlight.configure({
    lowlight: createLowlight(common),
    defaultLanguage: "javascript"
  }),
  BubbleMenu.configure({
    element: document.querySelector('.bubble-menu'),
  } as any),
  // History
];

export type TextEditorProps = {
  placeholder?: string;
  onChange?: (value: string) => void;
  value?: string;
  tab: 'editor' | 'preview';
  user?: ITextEditorOption;
  mentions?: ITextEditorOption[];
  // url for user profile
  userPathname?: string;
  uploadImageOptions?: Omit<ImageUploadOptions, 'type'>;
  uploadImageLabels?: ILabels['imageUpload'];
} & Partial<EditorOptions>;

export const useTextEditor = ({
  placeholder,
  onChange,
  value,
  tab,
  user,
  mentions,
  uploadImageOptions,
  uploadImageLabels,
  userPathname,
  editable = true,
  ...editorOptions
}: TextEditorProps) => {
  const theme = useTheme();

  const editor = useEditor({
    content: value,
    extensions: [
      // placeholder extension
      Placeholder.configure({
        placeholder,
      }),
      // user mentions editing extension
      getCustomMention({ pathname: userPathname, mentions }),
      // upload image extension
      getCustomImage(uploadImageOptions, uploadImageLabels).configure({
        allowBase64: true
      }),
      ...extensions,
    ] as AnyExtension[],
    /* The `onUpdate` function in the `useTextEditor` hook is a callback that is triggered whenever the
    editor content is updated. Here's a breakdown of what it does: */
    onUpdate: ({ editor }: EditorEvents['update']) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    ...editorOptions,
  });

  // set initial value for edition even if it's already set (below)
  useEffect(() => {
    if (!editor) return;
    // if (editor.isDestroyed) return;
    if (!(value && editor.isEmpty)) return;
    editor.commands.setContent(value);
    // !important: to avoid update for each taping, the value should be excluded from the dependencies
  }, [editor]);


  // useEffect(() => {
  //   editor?.off("selectionUpdate");
  //   editor?.on("selectionUpdate", (editor) => {
  //     const html = editor.editor.getHTML();
  //     onChange?.(html);
  //   });
  // }, [editor, value]);

  /**
   * change the editable state of the editor on the fly
   * for every tab change
   */
  useEffect(() => {
    // preview tab or not editable
    if (editable) {
      const className = tab === 'editor' ? 'mui-tiptap-input' : 'mui-tiptap-input mui-tiptap-input-preview';
      // editor tab
      editor?.setOptions({
        editable: tab === 'editor',
        editorProps: {
          attributes: {
            class: className
          },
        },
      });
      return ;
    };

    editor?.setOptions({
      editable: false,
      editorProps: {
        attributes: {
          class: 'mui-tiptap-input mui-tiptap-input-preview'
        },
      },
    });
  }, [editor, tab, editable, theme]);

  return editor;
};
