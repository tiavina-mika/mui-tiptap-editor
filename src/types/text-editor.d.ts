import type { ILabels } from './labels';
import type { IEditorToolbar, ImageUploadOptions } from './toolbar';
import type { CSSProperties, ReactNode } from 'react';

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type ImageAttributes = {
  src: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  style?: CSSProperties;
};

/**
 * Option interface for text editor dropdowns, mentions, collaborators, selects, etc.
 */
export interface ITextEditorOption<T = string> {
  /** Label to be displayed */
  label: string;
  /**
   * Value of the option
   * Can be an id, slug, or any unique identifier
   */
  value: T;
  /**
   * Optional icon to be displayed alongside the label
   * Can be a URL string or a ReactNode
   */
  icon?: string | ReactNode;
  /** If true, the option will be hidden from the list */
  hide?: boolean;
}

export type TextEditorProps = {
  /**
   * Input id
   * Used if using multiple editors on the same page, to identify uniquely each editor
   */
  id?: string;
  placeholder?: string;

  /**
   * Input label
   * NOTE: it is placed above the tabs
   */
  label?: ReactNode;

  /**
   * error message to be displayed if any
   */
  error?: string;

  /**
   * Value of the editor
   * It is an html string representing the content of the editor
   * @example '<p>Some text</p>'
   */
  value?: string;

  /**
   * Callback function to be called on change
   * it returns the html string of the editor
   * @param value e.g. '<p>Some text</p>'
   * @return void
   */
  onChange?: (value: string) => void;

  /**
   * Input style to override the default styles
   * It's the responsible of the whole input grey border and border radius
   *
   */
  inputClassName?: string;

  /**
   * Toolbar style to override the default styles
   * It's mainly the responsible of the toolbar border top
   */
  toolbarClassName?: string;

  /**
   * Tabs style to override the default styles
   * The tabs 'editor' and 'preview' style
   */
  tabsClassName?: string;

  /**
   * Tab style to override the default styles
   * Mainly used for the styles of the current selected tab
   */
  tabClassName?: string;

  /**
   * Error message style to override the default styles
   * @example changing the color of the error message or its font size
   */
  errorClassName?: string;

  /*
   * The root class name to override the default styles
   * Can be used to style different parts of the editor (using descendant selectors)
   */
  rootClassName?: string;

  /**
   * Label styles to override the default styles
   * @example changing the color of the label, its font size, color, etc
   */
  labelClassName?: string;

  /**
   * Table of contents container class name
   * @example to set a max height and make it scrollable
   */
  tableOfContentsClassName?: string;

  /**
   * If true, floating menu will be disabled
   */
  withFloatingMenu?: boolean;

  /**
   * If true, bubble menu will be displayed
   */
  withBubbleMenu?: boolean;

  /**
   * Toolbar (each icon) to be displayed
   *
   * Possible values are: [
   * "heading", "bold", "italic", "strike", "link", "underline", "image", "code",
   * "orderedList", "bulletList", "align", "codeBlock", "blockquote", "table",
   * "history", "youtube", "color", "mention"
   * ]
   *
   * @default all
   */
  toolbar?: IEditorToolbar[];

  /**
   * Toolbar (each icon) to be displayed in bubble menu
   *
   * @default ['bold', 'italic', 'underline', 'link']
   */
  bubbleMenuToolbar?: IEditorToolbar[];

  /**
   * Toolbar (each icon) to be displayed in floating menu
   *
   * @default ['bold', 'italic', 'underline', 'link']
   */
  floatingMenuToolbar?: IEditorToolbar[];

  /**
   * User object for collaboration
   * The current user or selected user used for collaboration
   * Mainly an object from database representing the user
   * It should be formatted as ITextEditorOption
   * @example { label: 'John Doe', value: 'some_user_id' }
   */
  user?: ITextEditorOption;

  /**
   * List of users used for mentions
   * Mainly an array of objects from database representing the users
   * It should be formatted as ITextEditorOption[]
   * @example [{ label: 'John Doe', value: 'some_user_id' }, { label: 'James Smith', value: 'some_user_id_2' }, ...]
   * @Note the value should be unique, it's used for profile url
   * @example /profile/:id or /profile/:slug, :id or :slug here is the value
   */
  mentions?: ITextEditorOption[];

  /**
   * User pathname for the mentioned user
   *
   * So the final url will be /profile/:id
   * :id here is the value in mentions array (see above)
   * the final element is something like: <a href="/profile/some_user_id">{mentioned_user}</a>
   * @example /profile
   */
  userPathname?: string;

  /**
   * Override labels, messages, errors
   * It's useful for i18n or changing the default labels
   */
  labels?: ILabels;

  /**
   * Upload file options
   * ex: file size, number of files, allowed mime types, api callback, etc
   */
  uploadFileOptions?: Omit<ImageUploadOptions, 'type'>;

  /**
   * If true, the tabs (editor, preview) will not be displayed
   * @default false
   */
  disableTabs?: boolean;

  /**
   * Position of the toolbar
   * If top, the toolbar will be displayed at the top of the editor
   * If bottom, the toolbar will be displayed at the bottom of the editor
   * @default bottom
   */
  toolbarPosition?: 'top' | 'bottom';
  /**
   * If true, the table of contents will not be displayed
   * @default true
   */
  disableTableOfContents?: boolean;
  /**
   * Position of the table of content
   * @default right
   */
  tableOfContentPosition?: 'left' | 'right' | 'top';
} & Partial<EditorOptions>;
