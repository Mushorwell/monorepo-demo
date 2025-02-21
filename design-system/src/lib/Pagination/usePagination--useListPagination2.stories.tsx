import type { Meta, StoryObj } from '@storybook/react';
import { useListPagination2 } from './usePagination';
import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof useListPagination2> = {
  component: useListPagination2,
  title: 'useListPagination2',
};
export default meta;
type Story = StoryObj<typeof useListPagination2>;

export const Primary = {
  args: {
    items: '',
    itemsPerPage: 0,
  },
};

export const Heading: Story = {
  args: {
    items: '',
    itemsPerPage: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to useListPagination2!/gi)).toBeTruthy();
  },
};
