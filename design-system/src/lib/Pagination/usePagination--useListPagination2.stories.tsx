import { renderArrayItems } from '@monorepo-demo/utilities';
import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { BaseBtn } from '../Buttons';
import { useListPagination2 } from './usePagination';

const mockList = [
  { id: '1', children: 'This is item 1' },
  { id: '2', children: 'This is item 2' },
  { id: '3', children: 'This is item 3' },
  { id: '4', children: 'This is item 4' },
  { id: '5', children: 'This is item 5' },
  { id: '6', children: 'This is item 6' },
  { id: '7', children: 'This is item 7' },
  { id: '8', children: 'This is item 8' },
  { id: '9', children: 'This is item 9' },
  { id: '10', children: 'This is item 10' },
  { id: '11', children: 'This is item 11' },
  { id: '12', children: 'This is item 12' },
  { id: '13', children: 'This is item 13' },
  { id: '14', children: 'This is item 14' },
  { id: '15', children: 'This is item 15' },
];

const Comp = (props: { id: string; children: string }) => (
  <div id={props.id}>{props.children}</div>
);

const PaginatedListComponent = ({
  items,
  itemsPerPage,
}: {
  items: { id: string; children: string }[];
  itemsPerPage: number;
}) => {
  const {
    pages,
    currentPage,
    pageItems,
    prevControl,
    nextControl,
    setCurrentPage,
  } = useListPagination2({
    items,
    itemsPerPage,
  });

  console.log({ pages, currentPage, pageItems, prevControl, nextControl });

  return (
    <>
      <ul style={{ color: 'black' }}>{renderArrayItems(Comp)(pageItems)}</ul>
      <div
        style={{
          display: 'grid',
          gridAutoFlow: 'column',
          gap: '.5rem',
          justifyContent: 'center',
        }}
      >
        <BaseBtn
          onClick={() =>
            prevControl &&
            prevControl.onClick &&
            prevControl.onClick(currentPage)
          }
        >
          {prevControl?.label}
        </BaseBtn>
        {renderArrayItems(BaseBtn)(
          pages.map((page) => ({
            children: page.label,
            onClick: page.onClick as any,
          }))
        )}
        <BaseBtn
          onClick={() =>
            nextControl &&
            nextControl.onClick &&
            nextControl.onClick(currentPage)
          }
        >
          {nextControl?.label}
        </BaseBtn>
      </div>
    </>
  );
};

const meta: Meta<typeof useListPagination2> = {
  component: BaseBtn,
  title: 'useListPagination2',
};
export default meta;
type Story = StoryObj<typeof useListPagination2>;

export const Default = {
  args: {
    items: mockList,
    itemsPerPage: 5,
  },
  render: (args: { items: any[]; itemsPerPage: number }) => {
    return <PaginatedListComponent {...args} />;
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
function withItems(Comp: any) {
  throw new Error('Function not implemented.');
}
