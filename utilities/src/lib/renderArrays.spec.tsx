import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderArrayItems } from './renderArrays';

// Mock component for testing
const TestComponent = ({ label }: { label: string }) => <div>{label}</div>;

// Tests for renderArrayItems
describe('renderArrayItems', () => {
  it('renders a single item correctly', () => {
    const items = { label: 'Item 1' };
    const result = render(renderArrayItems(TestComponent)(items));
    expect(result.getByText('Item 1')).toBeTruthy();
  });
  it('renders multiple items correctly', () => {
    const items = [{ label: 'Item 1' }, { label: 'Item 2' }];
    const result = render(renderArrayItems(TestComponent)(items));
    expect(result.getByText('Item 1')).toBeTruthy();
    expect(result.getByText('Item 2')).toBeTruthy();
  });
});

const DummyComponent = (props: any) => <div {...props} />;

describe('renderArrayItems', () => {
  it('assigns the correct id when listId is provided', () => {
    // Define some test items and a listId
    const items = [{ text: 'Item 1' }, { text: 'Item 2' }];
    const listId = 'test';

    // Create the renderer using our HOC function
    const renderItems = renderArrayItems(DummyComponent);

    // Render the components by passing in the items and listId in the options
    const renderedComponents = renderItems(items, { listId });

    // Render the output into a container
    render(renderedComponents);

    // Loop over each rendered component and check its id attribute
    renderedComponents.forEach((_, idx) => {
      const expectedId = `list-${listId}_list-item-${idx}`;
      // We use the data-testid attribute that we set in the component for querying
      const listItem = screen.getByTestId(`list-item-#${idx}`);
      expect(listItem).toHaveAttribute('id', expectedId);
    });
  });
});
