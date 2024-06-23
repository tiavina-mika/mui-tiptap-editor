import { ReactNode } from "react";

type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export enum EditorToolbarEnum {
  heading = 'heading',
  bold = 'bold',
  italic = 'italic',
  strike = 'strike',
  link = 'link',
  underline = 'underline',
  image = 'image',
  code = 'code',
  orderedList = 'orderedList',
  bulletList = 'bulletList',
  align = 'align',
  codeBlock = 'codeBlock',
  blockquote = 'blockquote',
  table = 'table',
  history = 'history',
  youtube = 'youtube',
  color = 'color',
  mention = 'mention',
  ai = 'ai'
}

export type IEditorToolbar = `${EditorToolbarEnum}`;

export type IRequiredLabels = {
  editor: {
    editor: string;
    preview: string;
  };
  toolbar: {
    bold: string;
    italic: string;
    strike: string;
    underline: string;
    link: string;
    bulletList: string;
    orderedList: string;
    alignLeft: string;
    alignCenter: string;
    alignRight: string;
    alignJustify: string;
    blockquote: string;
    codeBlock: string;
    table: string;
    youtube: string;
    undo: string;
    redo: string;
    mention: string;
  };
  headings: {
    normalText: string;
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    h5: string;
    h6: string;
  };
  table: {
    table: string;
    insertTable: string;
    addColumnBefore: string;
    addColumnAfter: string;
    deleteColumn: string;
    addRowBefore: string;
    addRowAfter: string;
    deleteRow: string;
    mergeCells: string;
    splitCell: string;
    deleteTable: string;
    toggleHeaderColumn: string;
    toggleHeaderRow: string;
    toggleHeaderCell: string;
    mergeOrSplit: string;
    setCellAttribute: string;
  };
  link: {
    link: string;
    insert: string;
    invalid: string;
    enter: string;
  };
  youtube: {
    link: string;
    insert: string;
    title: string;
    invalid: string;
    enter: string;
    height: string;
    width: string;
  };
};

export type ILabels = DeepPartial<IRequiredLabels>;
