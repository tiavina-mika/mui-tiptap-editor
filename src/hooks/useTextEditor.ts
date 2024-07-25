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
import Mention, { MentionOptions } from "@tiptap/extension-mention";
import BubbleMenu from '@tiptap/extension-bubble-menu';
import { createLowlight, common } from "lowlight";
import {
  useEditor,
  EditorOptions,
  AnyExtension,
  mergeAttributes,
  EditorEvents,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapImage from '@tiptap/extension-image';
import { useEffect } from 'react';
import Heading from '@tiptap/extension-heading';
import { Node } from '@tiptap/pm/model';
import getSuggestion from '../components/mention/suggestions';
import { ITextEditorOption } from '../types.d';

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
  TiptapImage,
  TextAlign.configure({
    types: ["heading", "paragraph", "table", "image"]
  }),
  CodeBlockLowlight.configure({
    lowlight: createLowlight(common),
    defaultLanguage: "javascript"
  }),
  BubbleMenu.configure({
    element: document.querySelector('.bubble-menu'),
  } as any),
  // History
];
const getCustomMention = (pathname = "/users") => {
  return Mention.extend({
    // use a link (with url) instead of the default span
    renderHTML({ node, HTMLAttributes }: Record<string, any>) {
      return [
        "a",
        mergeAttributes(
          { href: `${pathname}/${HTMLAttributes["data-id"]}` },
          this.options.HTMLAttributes,
          HTMLAttributes
        ),
        (this.options as any)?.renderLabel({
          options: this.options,
          node
        })
      ];
    },
    // the attribute should be user id for exemple
    addAttributes() {
      return {
        id: {
          default: null,
          parseHTML: (element: HTMLElement) => element.getAttribute("data-id"),
          renderHTML: (attributes: any) => {
            if (!attributes.id?.value) {
              return {};
            }

            return {
              "data-id": attributes.id.value
            };
          }
        }
      };
    }
  });
}

export type TextEditorProps = {
  placeholder?: string;
  onChange?: (value: string) => void;
  value?: string;
  tab: 'editor' | 'preview';
  user?: ITextEditorOption;
  mentions?: ITextEditorOption[];
  // url for user profile
  userPathname?: string;
} & Partial<EditorOptions>;

export const useTextEditor = ({
  placeholder,
  onChange,
  value,
  tab,
  user,
  mentions,
  editable = true,
  userPathname,
  ...editorOptions
}: TextEditorProps) => {
  const theme = useTheme();

  const editor = useEditor({
    content: value,
    extensions: [
      // placeholder extension
      Placeholder.configure({
        placeholder,
      }),
      // collaborative editing extensions
      getCustomMention(userPathname).configure({
        HTMLAttributes: {
          class: "mention"
        },
        renderLabel({ options, node }: {
          options: MentionOptions;
          node: Node;
      }) {
          return `${options.suggestion.char}${
            node.attrs.label ?? node.attrs.id.label
          }`;
        },
        suggestion: getSuggestion(mentions)
      }),
      ...extensions,
    ] as AnyExtension[],
    /* The `onUpdate` function in the `useTextEditor` hook is a callback that is triggered whenever the
    editor content is updated. Here's a breakdown of what it does: */
    onUpdate: ({ editor }: EditorEvents['update']) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    editorProps: {
      handleDrop: function(view, event, slice, moved) {
        console.log('event: ', event);
        console.log('view: ', view);
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) { // if dropping external files
          let file = event.dataTransfer.files[0]; // the dropped file
          let filesize = ((file.size/1024)/1024).toFixed(4); // get the filesize in MB
          if ((file.type === "image/jpeg" || file.type === "image/png") && parseInt(filesize) < 10) { // check valid image type under 10MB
            console.log('filesize: ', filesize);
            // check the dimensions
            let _URL = window.URL || window.webkitURL;
            let img = new Image(); /* global Image */
            const src = _URL.createObjectURL(file);
            img.src = src;
            console.log('src: ', src);
            img.onload = function () {
              console.log("on load");
              if (this.width > 5000 || this.height > 5000) {
                window.alert("Your images need to be less than 5000 pixels in height and width."); // display alert
              } else {
                  const { schema } = view.state;
                  const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                  const node = schema.nodes.image.create({ src }); // creates the image element
                  const transaction = view.state.tr.insert(coordinates.pos, node); // places it in the correct position
                  return view.dispatch(transaction);
                console.log('upload the image');
                // valid image so upload to server
                // uploadImage will be your function to upload the image to the server or s3 bucket somewhere
                // uploadImage(file).then(function(response) { // response is the image url for where it has been saved
                //   // pre-load the image before responding so loading indicators can stay
                //   // and swaps out smoothly when image is ready
                //   let image = new Image();
                //   image.src = response;
                //   image.onload = function() {
                //     // place the now uploaded image in the editor where it was dropped
                //     const { schema } = view.state;
                //     const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                //     const node = schema.nodes.image.create({ src: response }); // creates the image element
                //     const transaction = view.state.tr.insert(coordinates.pos, node); // places it in the correct position
                //     return view.dispatch(transaction);
                //   }
                // }).catch(function(error) {
                //   if (error) {
                //     window.alert("There was a problem uploading your image, please try again.");
                //   }
                // });
              }
            };
          } else {
            window.alert("Images need to be in jpg or png format and less than 10mb in size.");
          }
          return true; // handled
        }
        return false; // not handled use default behaviour
      }
    },
    ...editorOptions,
  });

  // set initial value for edition even if it's already set (below)
  useEffect(() => {
    if (!editor) return;
    // if (editor.isDestroyed) return;
    if (!(value && editor.isEmpty)) return;
    editor.commands.setContent(value);
    // !important: to avoid update for each taping, the value should be excluded from the dependencies
  }, [editor]);


  // useEffect(() => {
  //   editor?.off("selectionUpdate");
  //   editor?.on("selectionUpdate", (editor) => {
  //     const html = editor.editor.getHTML();
  //     onChange?.(html);
  //   });
  // }, [editor, value]);

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
          attributes: {
            class: className
          },
        },
      });
      return ;
    };

    editor?.setOptions({
      editable: false,
      editorProps: {
        attributes: {
          class: 'mui-tiptap-input mui-tiptap-input-preview'
        },
      },
    });
  }, [editor, tab, editable, theme]);

  return editor;
};
