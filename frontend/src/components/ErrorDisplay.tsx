import React from "react";
import styled from "styled-components";

/* -------------------------------------------------------------------------- */

const ErrorText = styled.p`
  text-align: center;
`;

/* -------------------------------------------------------------------------- */

interface ErrorDisplayProps {
  errorString: String
}

const ErrorDisplay = ({errorString}: ErrorDisplayProps) => {
  // What to display when a request returns an error
  return(
    <ErrorText>
      {errorString}
    </ErrorText>
  )
}

export default ErrorDisplay;