import { toolbarOptions } from 'stories/utils.storybook';

import type { Meta, StoryObj } from '@storybook/react-vite';

import TextEditor from '../../src/pages/TextEditor';

const meta: Meta<typeof TextEditor> = {
  title: 'Toolbar/Menus',
  component: TextEditor,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
};

export default meta;


export const BubbleMenus: StoryObj<typeof TextEditor> = {
  args: {
    placeholder: 'Start typing here...',
    enableBubbleMenu: true,
    bubbleMenuToolbar: ['bold', 'italic', 'link'],
  },
  argTypes: {
    bubbleMenuToolbar: {
      control: { type: 'check' },
      options: toolbarOptions,
    },
  },
};

export const FloatingMenus: StoryObj<typeof TextEditor> = {
  args: {
    placeholder: 'Start typing here...',
    enableFloatingMenu: true,
    floatingMenuToolbar: ['bold', 'italic', 'link'],
  },
  argTypes: {
    floatingMenuToolbar: {
      control: { type: 'check' },
      options: toolbarOptions,
    },
  },
};
