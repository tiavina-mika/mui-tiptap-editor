/* eslint-disable import/no-named-as-default */
'use client';
import Code from '@tiptap/extension-code';
import Document from '@tiptap/extension-document';
import Heading from '@tiptap/extension-heading';
import Link from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import Paragraph from '@tiptap/extension-paragraph';
import { TableKit } from '@tiptap/extension-table';
import {
  getHierarchicalIndexes,
  TableOfContents,
} from '@tiptap/extension-table-of-contents';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyleKit } from '@tiptap/extension-text-style';
import TipTapTypography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import Youtube from '@tiptap/extension-youtube';
import { Placeholder, Gapcursor } from '@tiptap/extensions';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useMemo } from 'react';

import type { ILabels } from '@/types/labels';
import type { ITextEditorOption } from '@/types/text-editor';
import type {
  CodeBlockWithCopyProps,
  ImageUploadOptions,
} from '@/types/toolbar';
import type { AnyExtension, EditorOptions, EditorEvents } from '@tiptap/react';

import { type ToCItemType } from '@/components/tableOfContent/ToC';
import { getCodeBlockWithCopy } from '@/extensions/CodeBlockWithCopy';
import getCustomImage from '@/extensions/CustomImage';
import { getCustomMention } from '@/extensions/CustomMention';

const extensions = [
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
    underline: false,
    link: false,
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
  /*
   * Each of these dynamic extensions is memoized on its real inputs so the composed
   * `extensions` array below only changes reference when something it depends on actually
   * changes. `useEditor`'s `compareOptions` compares `extensions` by reference element-by-
   * element, so without this, every one of these factories re-running on every render would
   * force `editor.setOptions()` (and a full `view.updateState()`) on every keystroke.
   */
  const placeholderExtension = useMemo(
    () => Placeholder.configure({ placeholder }),
    [placeholder]
  );
  const mentionExtension = useMemo(
    () => getCustomMention({ pathname: userPathname, mentions }),
    [userPathname, mentions]
  );
  const imageExtension = useMemo(
    () =>
      getCustomImage(
        uploadFileOptions,
        uploadFileLabels,
        uploadFileOptions?.maxMediaLegendLength
      ),
    [uploadFileOptions, uploadFileLabels]
  );
  const codeBlockExtension = useMemo(
    () => getCodeBlockWithCopy(codeBlock),
    [codeBlock]
  );
  const tableOfContentsExtension = useMemo(
    () =>
      onChangeTableOfContents
        ? TableOfContents.configure({
          getIndex: getHierarchicalIndexes,
          onUpdate: (contents: ToCItemType[]) => {
            onChangeTableOfContents(contents);
          },
        })
        : null,
    [onChangeTableOfContents]
  );

  const dynamicExtensions = useMemo(
    () =>
      [
        // placeholder extension
        placeholderExtension,
        // user mentions editing extension
        mentionExtension,
        // upload image extension
        imageExtension,
        codeBlockExtension,
        tableOfContentsExtension,
        // default extensions
        ...extensions,
      ] as AnyExtension[],
    [
      placeholderExtension,
      mentionExtension,
      imageExtension,
      codeBlockExtension,
      tableOfContentsExtension,
    ]
  );

  const editor = useEditor({
    content: value,
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    autofocus: false,
    extensions: dynamicExtensions,
    /*
     * The `onUpdate` function in the `useTextEditor` hook is a callback that is triggered whenever the
     * editor content is updated. Here's a breakdown of what it does:
     */
    onUpdate: ({ editor }: EditorEvents['update']) => {
      // serializing the document is real work — skip it entirely when nobody is listening
      if (!onChange) return;

      onChange(editor.getHTML());
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
  /*
   * Risky change: `editable` and `tab` were previously missing from the dependency array below
   * (stale-closure bug — this effect wouldn't fire on a tab/editable change alone). Added them
   * to fix it, but this makes the effect run more often (e.g. on every tab switch), so double
   * check this doesn't cause unwanted `setContent` calls if something looks off later.
   */
  useEffect(() => {
    if (!editor) return;
    if (value && !editable && tab === 'preview') {
      editor.commands.setContent(value);
    }
  }, [editor, value, editable, tab]);

  /**
   * change the editable state of the editor on the fly
   * for every tab change
   */
  /*
   * Risky change: `theme` and `id` were previously listed as dependencies but never read in
   * this effect body — `useTheme()` returns a new object reference on every theme change, so
   * the effect was re-running (and calling `setOptions`/`updateState`) on every theme toggle for
   * no reason. Dropped both from the array below; double check nothing relied on this effect
   * re-running on a theme or `id` change if something looks off later.
   */
  useEffect(() => {
    // preview tab or not editable
    if (editable) {
      const className =
        tab === 'editor'
          ? 'mui-tiptap-input'
          : 'mui-tiptap-input mui-tiptap-input-preview';

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
  }, [editor, tab, editable]);

  return editor;
};
