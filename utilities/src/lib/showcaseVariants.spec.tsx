import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest'; // Importing from Vitest
import {
  GeneralShowcaseTemplate,
  VariantsType,
  withComponentShowcase,
} from './showcaseVariants';

// ... existing imports ...

describe('GeneralShowcaseTemplate', () => {
  it('renders the component with variations', () => {
    const TestComponent = ({ label }: { label: string }) => <div>{label}</div>;
    const variations = ['Variant 1', 'Variant 2'];

    const { getByText } = render(
      GeneralShowcaseTemplate(
        <TestComponent label="Test" />,
        'label',
        variations
      )
    );

    // Check if both variants are rendered
    // expect(getByText('Test')).toBeTruthy();
    expect(getByText('Variant 1')).toBeTruthy();
    expect(getByText('Variant 2')).toBeTruthy();
  });
});

// ... existing tests ...

describe('withComponentShowcase', () => {
  it('renders the component with variations', () => {
    const TestComponent = ({ label }: { label: string }) => <div>{label}</div>;
    const variations: VariantsType = ['Variant A', 'Variant B'];

    const Showcase = withComponentShowcase(<TestComponent label="Test" />);

    const { getByText } = render(Showcase('label', variations));

    // Check if both variants are rendered
    // expect(getByText('Test')).toBeTruthy();
    expect(getByText('Variant A')).toBeTruthy();
    expect(getByText('Variant B')).toBeTruthy();
  });
});
