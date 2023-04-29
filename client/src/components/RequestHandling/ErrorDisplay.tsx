import styled from 'styled-components';

/* -------------------------------------------------------------------------- */

const ErrorDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-column: 1 / -1;
`;

const ErrorText = styled.p`
  text-align: center;
`;

const RetryButton = styled.button`
  padding: 0.7rem 2.5rem;
  display: block;
  background-color: ${(props) => props.theme.backgroundColour};
  font-size: 1.6rem;
  color: ${(props) => props.theme.textColour};
  border: 0.3rem solid ${(props) => props.theme.lightTone};
  &:hover {
    border: 0.3rem solid ${(props) => props.theme.highlight};
  }
`;

/* -------------------------------------------------------------------------- */

interface ErrorDisplayProps {
  errorString: string;
  retryFunc?: () => void;
}

const ErrorDisplay = ({ errorString, retryFunc }: ErrorDisplayProps) => {
  // What to display when a request returns an error
  return (
    <ErrorDiv>
      <ErrorText>{errorString}</ErrorText>
      {retryFunc !== undefined && <RetryButton onClick={retryFunc}>Retry</RetryButton>}
    </ErrorDiv>
  );
};

export default ErrorDisplay;
