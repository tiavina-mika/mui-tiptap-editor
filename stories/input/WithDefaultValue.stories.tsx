import type { Meta, StoryObj } from '@storybook/react-vite';

import TextEditor from '../../src/pages/TextEditor';

const meta: Meta<typeof TextEditor> = {
  title: 'Input/Default Value',
  component: TextEditor,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
};

export default meta;

export const DefaultValue: StoryObj<typeof TextEditor> = {
  args: {
    value: `
      <h2>Welcome to the Editor</h2>
      <p>This editor supports <strong>rich text</strong> formatting, including:</p>
      <ul>
        <li><em>Italic</em></li>
        <li><u>Underline</u></li>
        <li><strong>Bold</strong></li>
        <li>Lists</li>
        <li><a href="https://mui.com/" target="_blank">Links</a></li>
        <li>Tables</li>
        <li>Images</li>
        <li>YouTube Videos</li>
      </ul>
      <table border="1" cellpadding="4">
        <tr>
          <th>Name</th>
          <th>Role</th>
        </tr>
        <tr>
          <td>Alice</td>
          <td>Developer</td>
        </tr>
        <tr>
          <td>Bob</td>
          <td>Designer</td>
        </tr>
      </table>
      <p>Here is an image:</p>
      <img src="https://mui.com/static/logo.png" alt="MUI Logo" width="120" />
      <p>Try editing this content or add your own!</p>
    `,
  },
};

export const WithCodeDefaultValue: StoryObj<typeof TextEditor> = {
  args: {
    value: `
      <h1>Sample Code Snippet</h1>
      <pre><code class="language-javascript">
        // Function to add two numbers
        const add = (a, b) => {
          return a + b;
        };

        // Example usage
        console.log(add(5, 3)); // Output: 8
      </code></pre>
      <p>This is a simple JavaScript function that adds two numbers and logs the result to the console.</p>
    `,
  },
};
