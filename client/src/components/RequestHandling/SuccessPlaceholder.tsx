import styled from 'styled-components';

/* -------------------------------------------------------------------------- */

const SuccessText = styled.p`
  text-align: center;
`;

/* -------------------------------------------------------------------------- */

const SuccessPlaceholder = () => {
  // Placeholder to use when request completed successfully
  return <SuccessText>SuccessText</SuccessText>;
};

export default SuccessPlaceholder;
