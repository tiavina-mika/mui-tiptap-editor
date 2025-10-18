import { INITIAL_VIEWPORTS } from 'storybook/viewport';

import type { Preview } from '@storybook/react-vite';


const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: 'todo',
    },
    initialGlobals: {
      viewport: { value: 'tablet', isRotated: false },
    },
    viewport: {
      options: INITIAL_VIEWPORTS,
    },
  },
};

export default preview;
