import type { Meta, StoryObj } from '@storybook/react';
import { prevControl } from './usePagination';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof prevControl> = {
  component: prevControl,
  title: 'prevControl',
};
export default meta;
type Story = StoryObj<typeof prevControl>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to prevControl!/gi)).toBeTruthy();
  },
};
