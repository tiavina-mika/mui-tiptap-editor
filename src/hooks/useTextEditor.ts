import { css } from '@emotion/css';
import { Theme } from '@emotion/react';
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
import { createLowlight, common } from "lowlight";
import {
  useEditor,
  EditorOptions,
  AnyExtension,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { useEffect } from 'react';
import Heading from '@tiptap/extension-heading';

const classes = {
  input: (theme: Theme, editable = true) =>
    css({
      borderRadius: 6,
      borderTopLeftRadius: 0,
      border: editable ? '1px solid ' + theme.palette.grey[400] : 'none',
      paddingLeft: editable ? 16 : 0,
      paddingRight: editable ? 16 : 0,
      minHeight: editable ? 150 : 'initial',
      '& p.is-editor-empty:first-child::before': {
        content: 'attr(data-placeholder)',
        float: 'left',
        height: 0,
        pointerEvents: 'none',
        color: theme.palette.grey[300],
        fontFamily: 'Product Sans Regular',
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '157.143%' /* 157.143% */,
      },
    }),
};

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
    types: ["heading", "paragraph"]
  }),
  CodeBlockLowlight.configure({
    lowlight: createLowlight(common),
    defaultLanguage: "javascript"
  })
];

export type TextEditorProps = {
  placeholder?: string;
  onChange?: (value: string) => void;
  value?: string;
  tab: 'editor' | 'preview';
} & Partial<EditorOptions>;

export const useTextEditor = ({
  placeholder,
  onChange,
  value,
  tab,
  editable = true,
  ...editorOptions
}: TextEditorProps) => {
  const theme = useTheme();

  const editor = useEditor({
    content: value,
    extensions: [
      Placeholder.configure({
        placeholder,
      }),
      ...extensions,
    ] as AnyExtension[],
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    ...editorOptions,
  });

  // set initial value for edition even if it's already set (below)
  useEffect(() => {
    if (!(editor && value)) return;
    editor.commands.setContent(value);
    // !important: to avoid update for each taping, the value should be excluded from the dependencies
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  /**
   * change the editable state of the editor on the fly
   * for every tab change
   */
  useEffect(() => {
    // preview tab or not editable
    if (!editable) {
      editor?.setOptions({
        editable: false,
        editorProps: {
          attributes: {
            class: 'mui-tiptap-input mui-tiptap-input-preview'
          },
        },
      });
      return;
    };

    // editor tab
    editor?.setOptions({
      editable: tab === 'editor',
      editorProps: {
        attributes: {
          class: 'mui-tiptap-input'
        },
      },
    });
  }, [editor, tab, editable, theme]);

  return editor;
};
