import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {}, // Auto-generates from types
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'Button',
    variant: 'contained',
    size: 'medium',
    color: 'primary',
  },
};
