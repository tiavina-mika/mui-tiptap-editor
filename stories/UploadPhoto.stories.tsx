import type { Meta, StoryObj } from '@storybook/react-vite';

import UploadPhotoComponent from './components/UploadPhoto';


const meta: Meta<typeof UploadPhotoComponent> = {
  title: 'TextEditor/UploadPhoto',
  component: UploadPhotoComponent,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
};

export default meta;


export const UploadPhoto: StoryObj<typeof UploadPhotoComponent> = {
  args: {
    placeholder: 'Drag and drop a photo, or click to select a file to upload...',
    maxSize: 5,
    maxFilesNumber: 1,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    imageMaxWidth: 1980,
    imageMaxHeight: 1080,
  },
};
