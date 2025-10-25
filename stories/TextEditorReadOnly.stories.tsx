import type { Meta, StoryObj } from '@storybook/react-vite';

import TextEditorReadOnly from '../src/pages/TextEditorReadOnly';

const meta: Meta<typeof TextEditorReadOnly> = {
  title: 'TextEditor',
  component: TextEditorReadOnly,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
};

export default meta;

export const ReadOnly: StoryObj<typeof TextEditorReadOnly> = {
  args: {
    value: '<p>Hello world!</p>',
  },
};
