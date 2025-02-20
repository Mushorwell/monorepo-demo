import { makeFetchCall } from '@monorepo-demo/utilities';
import styled from 'styled-components';

const StyledDesignSystem = styled.div`
  color: pink;
`;
export function DesignSystem() {
  return (
    <StyledDesignSystem>
      <h1>Welcome to DesignSystem!</h1>
    </StyledDesignSystem>
  );
}

export default DesignSystem;
