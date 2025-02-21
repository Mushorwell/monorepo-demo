import type { Meta, StoryObj } from '@storybook/react';
import { nextControl } from './usePagination';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof nextControl> = {
  component: nextControl,
  title: 'nextControl',
};
export default meta;
type Story = StoryObj<typeof nextControl>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to nextControl!/gi)).toBeTruthy();
  },
};
