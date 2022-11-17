import React from "react";
import styled from "styled-components";

/* -------------------------------------------------------------------------- */

const LoadingText = styled.p`
  text-align: center;
`;

/* -------------------------------------------------------------------------- */

const LoadingPlaceholder = () => {
  // Placeholder to use when waiting for a fetch requset to finish
  return (
    <LoadingText>Loading...</LoadingText>
  )
}

export default LoadingPlaceholder;