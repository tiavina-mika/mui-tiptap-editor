import type { Meta, StoryObj } from '@storybook/react-vite';

import ReadWithoutEditorComponent from './components/ReadWithoutEditor';

const meta: Meta<typeof ReadWithoutEditorComponent> = {
  title: 'TextEditor/Read Without Editor',
  component: ReadWithoutEditorComponent,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
};

export default meta;

export const ReadWithoutEditor: StoryObj<typeof ReadWithoutEditorComponent> = {
  args: {},
};
