import { expect, jest } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { BaseBtn } from './baseBtn';

const meta: Meta<typeof BaseBtn> = {
  component: BaseBtn,
  title: 'BaseBtn',
};
export default meta;
type Story = StoryObj<typeof BaseBtn>;

export const Primary = {
  args: {
    children: 'hello there!!',
    onClick: () => console.log('Clicked "hello there" button'),
  },
};

export const ButtonClick: Story = {
  args: {
    ...Primary.args,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByText(/hello there!!/gi);
    expect(btn).toBeTruthy();
    const consoleSpy = jest.spyOn(console, 'log');
    await userEvent.click(btn);
    expect(consoleSpy).toHaveBeenCalledWith('Clicked "hello there" button');
    consoleSpy.mockRestore();
  },
};
