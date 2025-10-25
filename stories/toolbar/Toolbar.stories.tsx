import type { Meta, StoryObj } from '@storybook/react-vite';

import TextEditor from '../../src/pages/TextEditor';
import { toolbarOptions } from '../utils.storybook';

const meta: Meta<typeof TextEditor> = {
  title: 'Toolbar',
  component: TextEditor,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
};

export default meta;


export const SelectedToolbar: StoryObj<typeof TextEditor> = {
  args: {
    placeholder: 'Start typing here...',
    toolbar: ['bold', 'italic', 'underline'],
  },
  argTypes: {
    toolbar: {
      control: { type: 'check' },
      options: toolbarOptions,
    },
  },
};

export const ToolbarPosition: StoryObj<typeof TextEditor> = {
  args: {
    placeholder: 'Start typing here...',
    toolbarPosition: 'bottom',
  },
  argTypes: {
    toolbarPosition: {
      control: { type: 'select' },
      options: ['top', 'bottom'],
    },
  },
};
