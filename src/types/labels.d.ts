import type { IToolbar } from './toolbar';

interface IEditor {
  editor: string;
  preview: string;
}

interface IHeadings {
  normalText: string;
  h1: string;
  h2: string;
  h3: string;
  h4: string;
  h5: string;
  h6: string;
}

interface ITable {
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
}

interface ILink {
  link: string;
  invalid: string;
}

interface IYoutube {
  link: string;
  insert: string;
  title: string;
  invalid: string;
  enter: string;
  height: string;
  width: string;
}

interface IUpload {
  maximumNumberOfFiles: string;
  fileTooLarge: string;
  addAltText: string;
  enterValidAltText: string;
  invalidMimeType: string;
  shouldBeAnImage: string;
  addLegendText: string;
  enterValidLegendText: string;
  imageMaxSize: string;
  invalidImageUrl: string;
  noImageUrl: string;
}

interface ITableOfContents {
  label: string;
  noContentLabel: string;
}

type IRequiredLabels = {
  /**
   * Editor and Preview tabs labels
   */
  editor: IEditor;
  /**
   * Toolbar button labels (bold, italic, link, etc.)
   */
  toolbar: IToolbar;
  /**
   * Headings labels (H1, H2, H3, etc.)
   */
  headings: IHeadings;
  /**
   * Table labels (add row, delete column, etc.)
   */
  table: ITable;
  /**
   * Link labels, messages, etc.
   */
  link: ILink;
  /**
   * Youtube labels, messages, etc.
   */
  youtube: IYoutube;
  /**
   * Upload labels, messages, etc.
   */
  upload: IUpload;
  /**
   * Table of Contents labels
   */
  tableOfContent: ITableOfContents;
};

export type ILabels = DeepPartial<IRequiredLabels>;
