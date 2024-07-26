/**
 *
 * Custom Image Extension
 *
 * inspired by:
 * https://github.com/angelikatyborska/tiptap-image-alt-text/tree/main
 * https://angelika.me/2023/02/26/how-to-add-editing-image-alt-text-tiptap/
 * https://github.com/ueberdosis/tiptap/issues/2912
 * https://tiptap.dev/docs/editor/extensions/functionality/filehandler
 *
*/

import TiptapImage from '@tiptap/extension-image'
import { Editor, NodeViewWrapper, NodeViewWrapperProps, ReactNodeViewRenderer } from '@tiptap/react';
import Edit from '../icons/Edit';
import { IconButton, Stack, TextField, Theme, Typography } from '@mui/material';
import { ChangeEvent, ClipboardEvent, useEffect, useState } from 'react';
import { checkAlt } from '../utils/app.utils';
import Dialog from '../components/Dialog';
import Add from '../icons/Add';
import Close from '../icons/Close';
import { EditorView } from '@tiptap/pm/view';
import { Slice } from '@tiptap/pm/model';
import { ILabels, ImageUploadOptions } from '../types';
import { Plugin } from '@tiptap/pm/state';

// check if the image is from tiptap or not
const FROM_TIPTAP = true;

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
    uploadImage,
    // max file size in MB
    maxSize = 10,
    // max number of files
    maxFilesNumber = 5,
    // drop or paste
    type,
    // allowed file types to upload
    allowedMimeTypes = null,
  }: ImageUploadOptions,
  // tiptap editor instance
  editor: Editor,
  // custom labels
  labels?: ILabels['imageUpload'],
) => (view: EditorView, event: DragEvent | ClipboardEvent, _: Slice, moved: boolean): boolean | void => {
  // default labels
  const {
    maximumNumberOfFiles = `You can only upload ${maxFilesNumber} images at a time.`,
    fileTooLarge = `Images need to be less than ${maxSize}mb in size.`,
    invalidMimeType = 'Invalid file type',
  } = labels || {};

  // check if event has files
  const hasFiles = type === 'drop'
    ? (event as DragEvent).dataTransfer?.files?.length
    : (event as ClipboardEvent).clipboardData?.files?.length;

  if (!hasFiles) return;

  if (type === 'drop' && moved) return;

  const images = (type === 'drop' ? (event as DragEvent).dataTransfer?.files : (event as ClipboardEvent).clipboardData?.files) || [];

  if (images.length > maxFilesNumber) {
    window.alert(maximumNumberOfFiles);
    return;
  }

  if (images.length === 0) return;

  event.preventDefault();

  // const { schema } = view.state;

  for (const image of images) {
    // file size in MB
    const fileSize = ((image.size / 1024) / 1024).toFixed(4);

    if (!/image/i.test(image.type)) {
      window.alert(invalidMimeType);
      return;
    }
    
    if (
      (allowedMimeTypes && allowedMimeTypes.length && !allowedMimeTypes.includes(image.type))
      || Array.isArray(allowedMimeTypes) && allowedMimeTypes.length === 0
    ) {
      window.alert(invalidMimeType);
      return;
    }

    // check valid image type under 10MB
    if (+fileSize > maxSize) {
      window.alert(fileTooLarge);
      return;
    }

    const reader = new FileReader();

    reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
      if (!readerEvent.target) return;
      // const node = schema.nodes.image.create({
      //   src: readerEvent.target.result
      // });

      // --------------------------- //
      // ---------- drop ---------- //
      // --------------------------- //
      if (type === 'drop') {
        const dropEvent = event as DragEvent;
        const coordinates = view.posAtCoords({ left: dropEvent.clientX, top: dropEvent.clientY }) as { pos: number; inside: number; };

        // if using the plugin, use this commented code
        // const transaction = view.state.tr.insert(
        //   coordinates.pos,
        //   node
        // );
        // view.dispatch(transaction);

        editor.chain().insertContentAt(coordinates.pos, {
          type: 'image',
          attrs: {
            src: readerEvent.target.result,
          },
        }).focus().run();
        return;
      }

      // --------------------------- //
      // ---------- paste ---------- //
      // --------------------------- //
        // if using the plugin, use this commented code
      // const transaction = view.state.tr.replaceSelectionWith(node);
      // view.dispatch(transaction);

      editor.chain().insertContentAt(editor.state.selection.anchor, {
        type: 'image',
        attrs: {
          src: readerEvent.target.result,
        },
      }).focus().run();
    }
    reader.readAsDataURL(image);
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
      '&.ProseMirror-selectednode .tiptap-image-content': {
        outline: '2px solid blue',
      },
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
  altContainer: (theme: Theme) => ({
    position: 'absolute' as const,
    bottom: 10,
    left: 10,
    maxWidth: 'calc(100% - 20px)',
    padding: '0 4px',
    border: '1px solid ' + theme.palette.divider,
    backgroundColor: theme.palette.background.paper,
    overflow: 'hidden',
  }),
  buttonIconSx: {
    '& svg': { width: 18 },
  },
  addButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    borderRadius: 4,
    padding: '4px 4px 4px 12px !important',
    fontSize: '14px !important'
  }
}

const getClassName = (selected: boolean): string => {
  // this className is used in the css file
  let className = 'tiptap-image';
  if (selected) {
    className += ' ProseMirror-selectednode';
  }
  return className
}

type Props = ILabels['imageUpload'] & NodeViewWrapperProps;

const ImageNode = ({ labels, node, updateAttributes, editor, ...props }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [clear, setClear] = useState<boolean>(false);
  const [alt, setAlt] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setAlt(node.attrs.alt || '');
  }, [node.attrs.alt])

  const altLabel = labels?.addAltText || 'Add alt text';

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const toggleClear = () => setClear(!clear);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (checkAlt(value)) {
      setAlt(value);
      return;
    }

    setError(labels?.enterValidAltText || 'Please enter a valid alt text');
  }

  const onConfirm = async () => {
    await updateAttributes({ alt });
    setOpen(false);
    // if delete this current node (each image)
    // deleteNode();
  }

  const handleDelete = () => {
    updateAttributes({ alt: '' });
    setAlt('');
    toggleClear();
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
        <img src={node.attrs.src} alt={alt} />
        {/* ------------ alt ------------ */}
        {/*
          * display only in editable mode
          * NOTE: if displaying the html string outside of the editor, hide this by using css
        */}
        {(!clear && editor.options.editable) && (
          <>
            <Stack
              css={classes.altContainer}
              className='tiptap-alt-text'
              direction="row"
              alignItems="center"
              spacing={0}
              // this block should not be displayed if not from tiptap, ex: from html string parser
              // hide it using in inline style
              style={!FROM_TIPTAP ? { display: 'none' } : {}}
            >
            {alt && !error
              ? (
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography>{alt}</Typography>
                  <IconButton size="small" sx={classes.buttonIconSx} type="button" onClick={handleOpen}>
                    <Edit />
                  </IconButton>
                </Stack>
              ) : (
                <button type="button" onClick={handleOpen} css={[classes.buttonIconSx, classes.addButton]} className="flexRow itemsCenter">
                  <Add />
                  <Typography>{altLabel}</Typography>
                </button>
              )}
              <IconButton size="small" sx={classes.buttonIconSx} type="button" onClick={handleDelete}>
                <Close />
              </IconButton>
            </Stack>
            {error && (
              <Typography color="error">{error}</Typography>
            )}
          </>
        )}
      </div>
      <Dialog
        title={altLabel}
        open={open}
        onClose={handleClose}
        onPrimaryButtonAction={onConfirm}
        className='tiptap-alt-text-dialog'
      >
        <TextField
          value={alt}
          onChange={handleChange}
        />
      </Dialog>
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
const getCustomImage = (options?: Omit<ImageUploadOptions, 'type'>, labels?: ILabels['imageUpload']) => TiptapImage.extend({
  defaultOptions: {
    ...TiptapImage.options,
    sizes: ["inline", "block", "left", "right"]
  },
  addNodeView() {
    return ReactNodeViewRenderer(
      (props: any) => <ImageNode {...props} labels={labels} />,
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

export default getCustomImage;
