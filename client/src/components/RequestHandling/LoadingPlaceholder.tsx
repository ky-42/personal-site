import styled from 'styled-components';

/* -------------------------------------------------------------------------- */

const LoadingText = styled.p`
  text-align: center;
  grid-column: 1 / -1;
`;

/* -------------------------------------------------------------------------- */

const LoadingPlaceholder = () => {
  // Placeholder to use when waiting for a fetch requset to finish
  return <LoadingText>Loading...</LoadingText>;
};

export default LoadingPlaceholder;
