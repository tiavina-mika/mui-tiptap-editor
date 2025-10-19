import type { IEditorToolbar } from './toolbar';

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface ITextEditorOption<T = string> {
  label: string;
  value: T;
  icon?: string | ReactNode;
  hide?: boolean;
}

export type TextEditorProps = {
  /**
   * input id
   * used if using multiple editors on the same page, to identify uniquely each editor
   */
  id?: string;
  placeholder?: string;

  /**
   * input label
   * NOTE: it is placed above the tabs
   */
  label?: ReactNode;

  /**
   * error message to be displayed if any
   */
  error?: string;

  /**
   * value of the editor
   * it's an html string, eg: <p>hello world</p>
   */
  value?: string;

  /**
   * callback function to be called on change
   * it returns the html string of the editor, eg: <p>hello world</p>
   */
  onChange?: (value: string) => void;

  /**
   * input style override
   * it's the responsible of the whole input grey border and border radius
   *
   */
  inputClassName?: string;

  /**
   * toolbar style override,
   * it's mainly the responsible of the toolbar border top
   */
  toolbarClassName?: string;

  /**
   * tabs style override
   * the tabs 'editor' and 'preview' style
   */
  tabsClassName?: string;

  /**
   * tab style override
   * mainly used for the styles of the current selected tab
   */
  tabClassName?: string;

  /**
   * error message style override
   * eg: changing the color of the error message
   * or its font size
   */
  errorClassName?: string;

  /*
   * root class name
   * it's the main class name of the all the editor
   * label, tabs, input, toolbar, etc
   */
  rootClassName?: string;

  /**
   * label styles override
   * eg: changing the color of the label, its font size, color, etc
   */
  labelClassName?: string;

  /**
   * table of contents container class name
   */
  tableOfContentsClassName?: string;

  /**
   * if true, floating menu will be disabled
   */
  withFloatingMenu?: boolean;

  /**
   * if true, bubble menu will be displayed
   */
  withBubbleMenu?: boolean;

  /**
   * toolbar (each icon) to be displayed
   *
   * possible values are: [
   * "heading", "bold", "italic", "strike", "link", "underline", "image", "code",
   * "orderedList", "bulletList", "align", "codeBlock", "blockquote", "table",
   * "history", "youtube", "color", "mention"
   * ]
   *
   * default values is all the above
   */
  toolbar?: IEditorToolbar[];

  /**
   * toolbar (each icon) to be displayed in bubble menu
   *
   * @default ['bold', 'italic', 'underline', 'link']
   */
  bubbleMenuToolbar?: IEditorToolbar[];

  /**
   * toolbar (each icon) to be displayed in floating menu
   *
   * @default ['bold', 'italic', 'underline', 'link']
   */
  floatingMenuToolbar?: IEditorToolbar[];

  /**
   * user object for collaboration
   * the current user or selected user used for collaboration
   *
   * @example { label: 'John Doe', value: 'some_user_id' }
   */
  user?: ITextEditorOption;

  /**
   * list of users used for mentions
   *
   * eg. [{ label: 'John Doe', value: 'some_user_id' }, { label: 'James Smith', value: 'some_user_id_2' }, ...]
   * NOTE: the value should be unique, it's used for profile url
   * ex: /profile/:id or /profile/:slug, :id or :slug here is the value
   */
  mentions?: ITextEditorOption[];

  /**
   * user pathname for the mentioned user
   *
   * so the final url will be /profile/:id
   * :id here is the value in mentions array (see above)
   * the final element is something like: <a href="/profile/some_user_id">{mentioned_user}</a>
   * @example /profile
   */
  userPathname?: string;

  /**
   * override labels
   * it's useful for i18n or changing the default labels
   */
  labels?: ILabels;

  /**
   * upload file options
   * ex: file size, number of files, allowed mime types, api callback, etc
   */
  uploadFileOptions?: Omit<ImageUploadOptions, 'type'>;

  /**
   * if true, the tabs (editor, preview) will not be displayed
   * @default false
   */
  disableTabs?: boolean;

  /**
   * position of the toolbar
   * if top, the toolbar will be displayed at the top of the editor
   * if bottom, the toolbar will be displayed at the bottom of the editor
   * @default bottom
   */
  toolbarPosition?: 'top' | 'bottom';
  /**
   * if true, the table of contents will not be displayed
   * @default true
   */
  disableTableOfContents?: boolean;
  /**
   * Position of the table of content
   * @default right
   */
  tableOfContentPosition?: 'left' | 'right' | 'top';
} & Partial<EditorOptions>;
