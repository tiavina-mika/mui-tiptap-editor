import type { Meta, StoryObj } from '@storybook/react-vite';

import TextEditor from '../src/pages/TextEditor';

const meta: Meta<typeof TextEditor> = {
  title: 'TextEditor/Table of Content',
  component: TextEditor,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
};

export default meta;

const value = `
  <h2>Table of Contents</h2>
  <h2>Section 1</h2>
  <p>Content for section 1...</p>
  <h3>Section 1.1</h3>
  <p>Content for section 1.1...</p>
  <h4>Section 1.1.1</h4>
  <p>Content for section 1.1.1...</p>
  <h4>Section 1.1.2</h4>
  <p>Content for section 1.1.2...</p>
  <h3>Section 1.2</h3>
  <p>Content for section 1.2...</p>
  <h2>Section 2</h2>
  <p>Content for section 2...</p>
  <h3>Section 2.1</h3>
  <p>Content for section 2.1...</p>
  <h3>Section 2.2</h3>
  <p>Content for section 2.2...</p>
  <h4>Section 2.2.1</h4>
  <p>Content for section 2.2.1...</p>
  <h2>Section 3</h2>
  <p>Content for section 3...</p>
`;

export const TableOfContentInRight: StoryObj<typeof TextEditor> = {
  args: {
    disableTableOfContents: false,
    tableOfContentsPosition: 'right',
    value,
  },
  argTypes: {
    tableOfContentsPosition: {
      control: { type: 'select' },
      options: ['left', 'right'],
    },
  },
};

export const TableOfContentInLeft: StoryObj<typeof TextEditor> = {
  args: {
    disableTableOfContents: false,
    tableOfContentsPosition: 'left',
    value,
  },
  argTypes: {
    tableOfContentsPosition: {
      control: { type: 'select' },
      options: ['left', 'right'],
    },
  },
};
