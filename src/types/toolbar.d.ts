import type { ILabels } from './labels';
import type { ImageAttributes } from './text-editor';

export type UploadResponse = ImageAttributes | string | undefined;

export type CodeBlockWithCopyProps = {
  language?: string;
  className?: string;
};

export type ToolbarItem = {
  name: string;
  icon: ReactNode | string;
  iconSize?: number;
  onClick?: (event?: MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  tooltip?: string;
  split?: boolean;
  id?: string;
  group?: string;
  active?: Record<string, any>;
  default?: boolean;
  isActive?: boolean;
  withTooltip?: boolean;
  tooltip?: string;
};

enum EditorToolbarEnum {
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
  upload = 'upload',
  // does not exist yet
  ai = 'ai'
}

export type IEditorToolbar = `${EditorToolbarEnum}`;
export type ToolbarProps = {
  // editor: Editor;
  /**
   * override the default class
   */
  className?: string;
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
   * Custom labels for the toolbar
   */
  labels?: Omit<ILabels, 'editor'>;
  /**
   * upload file options
   * ex: file size, number of files, allowed mime types, api callback, etc
   */
  uploadFileOptions?: TextEditorProps['uploadFileOptions'];

  /**
   * position of the toolbar
   */
  position?: 'top' | 'bottom';
  colorId?: string;
  type?: 'toolbar' | 'floating' | 'bubble';
};

/**
 * Image upload options from drop or paste event
 * the image can be uploaded to the server via an API or saved inside as a base64 string
 */
export type ImageUploadOptions = {
  /**
   * callback function to upload the image
   * it takes a file as an argument
   * it should return directly the uploaded image url (to be used as src)
   * or an object containing the uploaded image data (like url, id, alt, etc.)
   * it is used to upload the image to the server
   * @NOTE if not provided, the image will be uploaded as a base64 string and saved so
   * @param file
   * @returns
   */
  uploadFile?: (file: File) => Promise<UploadResponse>;
  /**
   * maximum size of the image in MB (each image)
   * @default 10mb
   */
  maxSize?: number;
  /**
   * maximum number of files to be uploaded at once
   * @default 5
   */
  maxFilesNumber?: number;
  /**
   * maximum width of the image
   * @default 1920
   */
  imageMaxWidth?: number;
  /**
   * maximum height of the image
   * @default 1080
   */
  imageMaxHeight?: number;
  /**
   * control which mime types are allowed to be uploaded (pasted or dropped)
   * @default all image mime types
   */
  allowedMimeTypes?: string[] | null;
  /**
   * type of the upload event
   */
  type: 'drop' | 'paste';

  /**
   * maximum character length of the image legend
   * @default 100
   */
  maxMediaLegendLength?: number;
};
