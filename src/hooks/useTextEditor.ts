'use client';
import { useTheme } from '@mui/material';
import Document from '@tiptap/extension-document';
import Link from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import TipTapTypography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Youtube from '@tiptap/extension-youtube';
import { Placeholder, Gapcursor } from '@tiptap/extensions';
import Code from '@tiptap/extension-code';
import { useEditor } from '@tiptap/react';
import type { AnyExtension, EditorOptions, EditorEvents } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import Heading from '@tiptap/extension-heading';
import { getHierarchicalIndexes, TableOfContents } from '@tiptap/extension-table-of-contents';
import type {
  CodeBlockWithCopyProps, ILabels, ImageUploadOptions, ITextEditorOption,
} from '../types.d';
import getCustomImage from '../extensions/CustomImage';
import { getCustomMention } from '../extensions/CustomMention';
import { getCodeBlockWithCopy } from '../extensions/CodeBlockWithCopy';
import { TableKit } from '@tiptap/extension-table';
import { TextStyleKit, Color } from '@tiptap/extension-text-style';
import { type ToCItemType } from '../components/tableOfContent/ToC';

const extensions = [
  Color.configure({ types: ['textStyle', ListItem.name] }),
  TextStyleKit.configure({ types: [ListItem.name] } as any),
  Document,
  Paragraph,
  Text,
  TipTapTypography,
  Underline,
  Code.configure({
    HTMLAttributes: {
      class: 'inline-code',
    },
  }),
  Link.configure({
    openOnClick: false,
    protocols: [
      'https',
      'mailto',
      {
        scheme: 'tel',
        optionalSlashes: true,
      },
    ],
    HTMLAttributes: {
      /*
       * Change rel to different value
       * Allow search engines to follow links(remove nofollow)
       */
      rel: 'noopener noreferrer',
      // Remove target entirely so links open in current tab
      target: null,
    },
  }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` because marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` because marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    // disable the following nodes, since we already have our own
    codeBlock: false,
    code: false,
    paragraph: false,
    document: false,
    gapcursor: false,
    heading: false,
    text: false,
  }),
  Heading.configure({
    HTMLAttributes: {
      class: 'custom-heading',
    },
    levels: [1, 2, 3, 3, 4, 5, 6],
  }),
  TableKit.configure({
    table: { resizable: true },
  }),
  Gapcursor,
  Youtube,
  TextAlign.configure({
    types: ['heading', 'paragraph', 'table', 'image'],
  }),
  /*
   * BubbleMenu.configure(typeof document !== 'undefined' && {
   *   element: document.querySelector('.bubble-menu'),
   * } as any),
   */
];

export type TextEditorProps = {
  /**
   * input placeholder
   * @default ''
   */
  placeholder?: string;
  /**
   * when the editor content changes
   * @type {(value: string) => void}
   * @default undefined
   * @param value
   * @returns
   */
  onChange?: (value: string) => void;
  /**
   * value of the editor
   * @default '''
   * @type {string}
   * @example '<p>Some text</p>'
   */
  value?: string;
  /**
   * tabs to show in the editor
   * or the preview tab
   * @default 'editor'
   */
  tab: 'editor' | 'preview';
  /**
   * current user
   * @default undefined
   * @type {ITextEditorOption}
   * @example { label: 'John Doe', value: 'some_user_id' }
   */
  user?: ITextEditorOption;
  /**
   * list of users used for mentions
   * @default undefined
   * @type {ITextEditorOption[]}
   * @example [{ label: 'John Doe', value: 'some_user_id' }, { label: 'James Smith ', value: 'some_user_id_2' }]
   */
  mentions?: ITextEditorOption[];
  /**
   * user profile pathname
   * @default '/profile'
   */
  userPathname?: string;
  /**
   * options for uploading images
   * @default undefined
   * @type {ImageUploadOptions}
   */
  uploadFileOptions?: Omit<ImageUploadOptions, 'type'>;
  /**
   * override the default labels
   * @default undefined
   * @type {ILabels}
   */
  uploadFileLabels?: ILabels['upload'];
  /**
   * if using multiple editors on the same page, add unique id
   * @default 'color'
   * @type {string}
   */
  id?: string;
  /**
   * props for the block code extension
   */
  codeBlock?: CodeBlockWithCopyProps;

  onChangeTableOfContents?: (items: ToCItemType[]) => void;
} & Partial<EditorOptions>;

export const useTextEditor = ({
  placeholder,
  onChange,
  value,
  tab,
  user,
  mentions,
  uploadFileOptions,
  uploadFileLabels,
  userPathname,
  editable = true,
  codeBlock,
  id,
  onChangeTableOfContents,
  ...editorOptions
}: TextEditorProps) => {
  const theme = useTheme();

  const editor = useEditor({
    content: value,
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    autofocus: false,
    extensions: [
      // placeholder extension
      Placeholder.configure({
        placeholder,
      }),
      // user mentions editing extension
      getCustomMention({ pathname: userPathname, mentions }),
      // upload image extension
      getCustomImage(uploadFileOptions, uploadFileLabels, uploadFileOptions?.maxMediaLegendLength),
      getCodeBlockWithCopy(codeBlock),
      onChangeTableOfContents ? TableOfContents.configure({
        getIndex: getHierarchicalIndexes,
        onUpdate: (contents: ToCItemType[]) => {
          onChangeTableOfContents(contents);
        },
      }) : null,
      // default extensions
      ...extensions,
    ] as AnyExtension[],
    /*
     * The `onUpdate` function in the `useTextEditor` hook is a callback that is triggered whenever the
     * editor content is updated. Here's a breakdown of what it does:
     */
    onUpdate: ({ editor }: EditorEvents['update']) => {
      const html = editor.getHTML();

      onChange?.(html);
    },
    ...editorOptions,
  });

  /**
   * EDITABLE = true
   * this updates the editor content on every value change
   * set initial value for edition even if it's already set (below)
   */
  useEffect(() => {
    if (!editor) return;
    // if (editor.isDestroyed) return;
    if (!(value && editor.isEmpty)) return;

    editor.commands.setContent(value);
  }, [editor, value]);

  /**
   * EDITABLE = false
   * this updates the editor content on every value change for readonly mode
   * it's useful for content that changed externally
   * @example tab change
   */
  useEffect(() => {
    if (!editor) return;
    if (value && !editable && tab === 'preview') {
      editor.commands.setContent(value);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, value]);

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
          attributes: { class: className },
        },
      });
      return;
    }

    editor?.setOptions({
      editable: false,
      editorProps: {
        attributes: {
          class: 'mui-tiptap-input mui-tiptap-input-preview',
        },
      },
    });
  }, [editor, tab, editable, theme, id]);

  return editor;
};
