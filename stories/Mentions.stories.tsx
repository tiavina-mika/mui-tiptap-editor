import type { Meta, StoryObj } from '@storybook/react-vite';

import TextEditor from '../src/pages/TextEditor';

const meta: Meta<typeof TextEditor> = {
  title: 'TextEditor/Mentions',
  component: TextEditor,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
};

export default meta;

const mentions = [
  { label: 'William Shakespeare', value: 'author1' },
  { label: 'Jane Austen', value: 'author2' },
  { label: 'Mark Twain', value: 'author3' },
  { label: 'Charles Dickens', value: 'author4' },
  { label: 'Leo Tolstoy', value: 'author5' },
  { label: 'Fyodor Dostoevsky', value: 'author6' },
  { label: 'Anton Chekhov', value: 'author26' },
  { label: 'Alexander Pushkin', value: 'author27' },
  { label: 'Ivan Turgenev', value: 'author28' },
  { label: 'Nikolai Gogol', value: 'author29' },
  { label: 'Mikhail Bulgakov', value: 'author30' },
  { label: 'Emily Dickinson', value: 'author7' },
  { label: 'Homer', value: 'author9' },
  { label: 'Herman Melville', value: 'author10' },
  { label: 'Oscar Wilde', value: 'author11' },
  { label: 'George Orwell', value: 'author12' },
  { label: 'Mary Shelley', value: 'author13' },
  { label: 'Edgar Allan Poe', value: 'author14' },
  { label: 'H.P. Lovecraft', value: 'author31' },
  { label: 'Charles Baudelaire', value: 'author32' },
  { label: 'Franz Kafka', value: 'author15' },
  { label: 'J.R.R. Tolkien', value: 'author17' },
  { label: 'Ernest Hemingway', value: 'author20' },
  { label: 'Emily Brontë', value: 'author23' },
  { label: 'Arthur Conan Doyle', value: 'author25' },
];

const currentUser = mentions[0];

export const Mentions: StoryObj<typeof TextEditor> = {
  args: {
    placeholder: 'Enter "@" to mention someone...',
    mentions,
    user: currentUser,
  },
};

export const WithCustomUserPathname: StoryObj<typeof TextEditor> = {
  args: {
    placeholder: 'Enter "@" to mention someone, hover over their name to see the user profile link...',
    mentions,
    user: currentUser,
    userPathname: '/profile',
  },
};
