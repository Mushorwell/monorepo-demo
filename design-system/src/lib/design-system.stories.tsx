import type { Meta, StoryObj } from '@storybook/react';
import { DesignSystem } from './design-system';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof DesignSystem> = {
  component: DesignSystem,
  title: 'DesignSystem',
};
export default meta;
type Story = StoryObj<typeof DesignSystem>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to DesignSystem!/gi)).toBeTruthy();
  },
};
