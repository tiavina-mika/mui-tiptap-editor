
import type { ToolbarIcons } from '../../src/types/toolbar';
import type { Meta, StoryObj } from '@storybook/react-vite';

import TextEditor from '../../src/pages/TextEditor';

const meta: Meta<typeof TextEditor> = {
  title: 'Toolbar/Custom Icons',
  component: TextEditor,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
};

export default meta;
// use svg icons from https://icons8.com/icons
const icons: ToolbarIcons = {
  // svg icon urls
  bold: {
    src: 'https://img.icons8.com/ios-filled/50/000000/bold.png',
    size: 14,
  },
  italic: {
    src: 'https://img.icons8.com/ios-filled/50/000000/italic.png',
    size: 16,
  },
  link: {
    src: 'https://img.icons8.com/ios-filled/50/000000/link--v1.png',
    size: 16,
  },
  underline: {
    src: 'https://img.icons8.com/ios-filled/50/000000/underline.png',
    size: 14,
  },
  upload: {
    src: 'https://img.icons8.com/ios-filled/50/000000/image--v1.png',
    size: 16,
  },
  table: {
    src: 'https://img.icons8.com/ios-filled/50/000000/table.png',
    size: 16,
  },
  blockquote: {
    src: 'https://img.icons8.com/ios-filled/50/000000/quote-left.png',
    size: 18,
  },
  alignLeft: {
    src: 'https://img.icons8.com/ios-filled/50/000000/align-left.png',
    size: 16,
  },
  alignCenter: {
    src: 'https://img.icons8.com/ios-filled/50/000000/align-center.png',
    size: 16,
  },
  alignRight: {
    src: 'https://img.icons8.com/ios-filled/50/000000/align-right.png',
    size: 16,
  },
  alignJustify: {
    src: 'https://img.icons8.com/ios-filled/50/000000/align-justify.png',
    size: 16,
  },
  bulletList: {
    src: 'https://img.icons8.com/ios-filled/50/000000/bulleted-list--v1.png',
    size: 16,
  },
  orderedList: {
    src: 'https://img.icons8.com/ios-filled/50/000000/numbered-list.png',
    size: 16,
  },
  undo: {
    src: 'https://img.icons8.com/ios-filled/50/000000/undo.png',
    size: 18,
  },
  redo: {
    src: 'https://img.icons8.com/ios-filled/50/000000/redo.png',
    size: 18,
  },
  codeBlock: {
    src: 'https://img.icons8.com/ios-filled/50/000000/code.png',
    size: 16,
  },
  mention: {
    src: 'https://img.icons8.com/ios-filled/50/000000/at-sign.png',
    size: 18,
  },
  youtube: {
    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="red" viewBox="0 0 24 24"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.117C19.379 3.5 12 3.5 12 3.5s-7.379 0-9.391.569A2.994 2.994 0 0 0 .502 6.186C0 8.2 0 12 0 12s0 3.8.502 5.814a2.994 2.994 0 0 0 2.107 2.117C4.621 20.5 12 20.5 12 20.5s7.379 0 9.391-.569a2.994 2.994 0 0 0 2.107-2.117C24 15.8 24 12 24 12s0-3.8-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
    size: 17,
  },
};

export const CustomIcons: StoryObj<typeof TextEditor> = {
  args: {
    placeholder: 'Start typing here...',
    icons,
    toolbarPosition: 'top',
  },
};
