import { withComponentShowcase } from '@monorepo-demo/utilities';
import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { Icon } from './Icon';
import { svgs } from './svgs';

const meta: Meta<typeof Icon> = {
  component: Icon,
  title: 'Icon',
};
export default meta;
type Story = StoryObj<typeof Icon>;

export const ExampleIcon = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByTestId('arrow-block-left')).toBeTruthy();
  },
};

const icons = Object.keys(svgs);

export const IconsGlossary: Story = {
  render: (args) =>
    withComponentShowcase(<Icon {...args} />)('type', icons, true, {
      showPropName: false,
    }),
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    icons.forEach((icon) => {
      expect(canvas.getByTestId(icon)).toBeTruthy();
    });
  },
};
