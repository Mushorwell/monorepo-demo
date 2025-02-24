import { render } from '@testing-library/react';

import { BaseBtn } from './baseBtn';

describe('BaseBtn', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BaseBtn />);
    expect(baseElement).toBeTruthy();
  });
});
