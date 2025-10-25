import type { Meta, StoryObj } from '@storybook/react-vite';

import TextEditor from '../../src/pages/TextEditor';

const meta: Meta<typeof TextEditor> = {
  title: 'Input',
  component: TextEditor,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
};

export default meta;

export const Simple: StoryObj<typeof TextEditor> = {
  args: {
    placeholder: 'Start typing here...',
  },
};

export const WithInputLabel: StoryObj<typeof TextEditor> = {
  args: {
    placeholder: 'Start typing here...',
    label: 'Description',
  },
};

export const WithError: StoryObj<typeof TextEditor> = {
  args: {
    placeholder: 'Start typing here...',
    error: 'This field is required',
  },
};

export const WithoutTabs: StoryObj<typeof TextEditor> = {
  args: {
    placeholder: 'Start typing here...',
    disableTabs: true,
  },
};
