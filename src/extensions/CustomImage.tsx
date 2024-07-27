/**
 *
 * Custom Image Extension
 *
 * inspired by:
 * https://www.codemzy.com/blog/tiptap-drag-drop-image
 * https://github.com/angelikatyborska/tiptap-image-alt-text/tree/main
 * https://angelika.me/2023/02/26/how-to-add-editing-image-alt-text-tiptap/
 * https://github.com/ueberdosis/tiptap/issues/2912
 * https://tiptap.dev/docs/editor/extensions/functionality/filehandler
 *
*/

import TiptapImage from '@tiptap/extension-image'
import { Editor, NodeViewWrapper, NodeViewWrapperProps, ReactNodeViewRenderer } from '@tiptap/react';
import { ClipboardEvent, SyntheticEvent } from 'react';
import { checkFilesNumber, checkIsImage, checkValidMimeType, checkValidFileDimensions, getIsFileSizeValid } from '../utils/app.utils';
import { EditorView } from '@tiptap/pm/view';
import { Slice } from '@tiptap/pm/model';
import { ILabels, ImageUploadOptions } from '../types';
import { Plugin } from '@tiptap/pm/state';
import ImageText from './image/ImageText';

/**
 * function to handle image upload, on drop or paste
 * @param options
 * @param editor
 * @param labels
 * @returns
 */
export const onUpload = (
  {
    // upload callback, should return the image src, used mainly for uploading to a server
    uploadFile,
    // max file size in MB
    maxSize,
    // allowed max number of files
    maxFilesNumber = 5,
    // drop or paste
    type,
    // allowed max width of the image
    imageMaxWidth,
    // allowed max height of the image
    imageMaxHeight,
    // allowed file types to upload
    allowedMimeTypes = null,
  }: ImageUploadOptions,
  // tiptap editor instance
  editor: Editor,
  // custom labels
  labels?: ILabels['upload'],
) => (view: EditorView, event: DragEvent | ClipboardEvent, _: Slice, moved: boolean): boolean | void => {
  // check if event has files
  const hasFiles = type === 'drop'
    ? (event as DragEvent).dataTransfer?.files?.length
    : (event as ClipboardEvent).clipboardData?.files?.length;

  if (!hasFiles) return;

  if (type === 'drop' && moved) return;

  const files = (type === 'drop' ? (event as DragEvent).dataTransfer?.files : (event as ClipboardEvent).clipboardData?.files) || [];

  // check if the number of files is valid
  const { isValid: isFilesNumberValid, message: filesNumberMessage } = checkFilesNumber(files as FileList, maxFilesNumber);
  if (!isFilesNumberValid) {
    window.alert(labels?.maximumNumberOfFiles || filesNumberMessage);
    return;
  }

  if (files.length === 0) return;

  event.preventDefault();

  for (const file of files) {
    // 1. check if the file is an image
    // for now we only support images
    const { isValid: isImage, message: isImageMessage } = checkIsImage(file);
    if (!isImage) {
      window.alert(labels?.shouldBeAnImage || isImageMessage);
      return;
    }

    // 2. check if the mime type is allowed
    const { isValid: isValidMimeTypes, message: isValidMimeTypesMessage } = checkValidMimeType(file, allowedMimeTypes);
    if (!isValidMimeTypes) {
      window.alert(labels?.invalidMimeType || isValidMimeTypesMessage);
      return;
    }

    // 3. file size in MB
    const { isValid: isFileSizeValid, message: isFileSizeValidMessage } = getIsFileSizeValid(file, maxSize);
    if (!isFileSizeValid) {
      window.alert(labels?.fileTooLarge || isFileSizeValidMessage);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (readerEvent: ProgressEvent<FileReader>) => {
      if (!readerEvent.target) return;
      // 4. check if the image dimensions are valid
      const { isValid: isImageDimensionValid, message: isImageDimensionValidMessage } = await checkValidFileDimensions(file, imageMaxWidth, imageMaxHeight);
      if (!isImageDimensionValid) {
        window.alert(labels?.imageMaxSize || isImageDimensionValidMessage);
        return;
      }

      let attrs = { src: readerEvent.target.result as string };
      // default position for paste
      let position = editor.state.selection.anchor;

      // ---------- drop ---------- //
      if (type === 'drop') {
        const dropEvent = event as DragEvent;
        const coordinates = view.posAtCoords({ left: dropEvent.clientX, top: dropEvent.clientY }) as { pos: number; inside: number; };
        position = coordinates.pos;
      }

      // ----- upload callback ----- //
      if (uploadFile) {
        const response = await uploadFile(file);
        if (response) {
          if (typeof response === 'string') {
            // only src attribute
            attrs.src = response;
          } else {
            // other attributes like alt, title, etc
            attrs = { ...attrs, ...response };
          }
        }
      }

      // insert theimage into the editor
      editor.chain().insertContentAt(position, {
        type: 'image',
        attrs,
      }).focus().run();
    }

    reader.readAsDataURL(file);
  }
}

const classes = {
  tiptapImageRootStyle: ({ isRight, isLeft }: { isRight: boolean; isLeft: boolean; }) => {
    const values = {
      display: 'flex',
      flex: 1,
      justifyContent: 'center', // default
      width: 'fit-content',
      position: 'relative' as const,
    };

    if (isRight) {
      values.justifyContent = 'flex-end';
    } else if (isLeft) {
      values.justifyContent = 'flex-start';
    }

    return values
  },
  tiptapImageRoot: {
    '&.ProseMirror-selectednode .tiptap-image-content': {
      outline: '2px solid blue',
    },
  },
}

const getClassName = (selected: boolean): string => {
  // this className is used in the css file
  let className = 'tiptap-image';
  if (selected) {
    className += ' ProseMirror-selectednode';
  }
  return className
}

type Props = {
  maxLegendLength?: number;
} & ILabels['upload'] & NodeViewWrapperProps;

const ImageNode = ({ labels, node, updateAttributes, editor, maxLegendLength, ...props }: Props) => {
  /**
   * update the alt or title attribute
   * @param attr { alt: "Alt" } or { title: "Title" }
   */
  const handleConfirm = async (attr: Record<string, string>) => {
    await updateAttributes(attr);
  }

  const onLoadImage = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    // remove the width and height after the image is loaded
    target.removeAttribute('width');
    target.removeAttribute('height');
  }

  return (
    <NodeViewWrapper
      // className to check if node is selected, used in editor
      className={getClassName(props.selected)}
      // used in editor
      css={classes.tiptapImageRoot}
      data-drag-handle
      // used to display the content outside of the editor library
      style={classes.tiptapImageRootStyle({
        isRight: editor.isActive({ textAlign: "right" }),
        isLeft: editor.isActive({ textAlign: "left" }),
      })}
    >
      <div className="tiptap-image-content" style={{ position: 'relative' }}>
        {/* ------------ image ------------ */}
        <figure>
          <img
            title={node.attrs.title}
            src={node.attrs.src}
            alt={node.attrs.alt}
            // add temporary width and height to show the image while loading
            width="300"
            height="300"
            onLoad={onLoadImage}
          />
          {/* legend */}
          {node.attrs.title && (
            <figcaption style={{ display: 'flex', justifyContent: 'center' }}>
              {node.attrs.title}
            </figcaption>
          )}
        </figure>
        {/* --------- alt editor ---------- */}
        {(editor.options.editable) && (
          <>
            <ImageText
              defaultValue={node.attrs.alt}
              onConfirm={handleConfirm}
              label={labels?.addAltText || 'Add alt text'}
              attrName="alt"
              invalidErrorMessage={labels?.enterValidAltText || 'Please enter a valid alt text'}

            />
            <ImageText
              defaultValue={node.attrs.title}
              onConfirm={handleConfirm}
              label={labels?.addLegendText || 'Add legend'}
              attrName="title"
              invalidErrorMessage={labels?.enterValidLegendText || 'Please enter a valid legend'}
              maxLegendLength={maxLegendLength}
            />
          </>
        )}
      </div>
    </NodeViewWrapper>
  )
}

/**
 * custom image extension to handle image upload
 * it extends the tiptap image extension
 * @NOTE if a callback is provided, it will override the default image upload handler
 * @param options image upload options like file size, number of files, upload callback
 * @param labels custom or override labels
 * @returns
 */
const getCustomImage = (options?: Omit<ImageUploadOptions, 'type'>, labels?: ILabels['upload'], maxLegendLength?: number) => TiptapImage
  .extend({
    defaultOptions: {
      ...TiptapImage.options,
      sizes: ["inline", "block", "left", "right"]
    },
    addNodeView() {
      return ReactNodeViewRenderer(
        (props: any) => <ImageNode {...props} labels={labels} maxLegendLength={maxLegendLength} />,
        { className: 'tiptap-image' }
      );
    },
    addProseMirrorPlugins() {
      const editor = this.editor as Editor;
      return [
        new Plugin({
          props: {
            handleDrop: onUpload({ ...options, type: 'drop' }, editor, labels),
            handlePaste: onUpload({ ...options, type: 'paste' }, editor, labels),
          } as any,
        }),
      ];
    }
  })
  .configure({ allowBase64: true });

export default getCustomImage;
