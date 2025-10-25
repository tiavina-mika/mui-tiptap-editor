import type { Meta, StoryObj } from '@storybook/react-vite';

import CustomStylesComponent from '../components/CustomStyles';

const meta: Meta<typeof CustomStylesComponent> = {
  title: 'Input/Custom Styles',
  component: CustomStylesComponent,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
};

export default meta;

export const CustomStyles: StoryObj<typeof CustomStylesComponent> = {
  args: {
    rootClassName: 'custom-root',
    labelClassName: 'custom-label',
    inputClassName: 'custom-input',
    toolbarClassName: 'custom-toolbar',
    tabsClassName: 'custom-tabs',
    tabClassName: 'custom-tab',
    errorClassName: 'custom-error',
    value: '<p>This is an example of a custom styled Text Editor.</p>',
    error: 'This is a custom styled error message.',
  },
};
