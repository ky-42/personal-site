import styled from 'styled-components';
import { ErrorTextStyling } from './InputElements';

/* -------------------------------------------------------------------------- */

const Input = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2.5rem 0;
`;

const InputLabel = styled.label<{ error: boolean }>`
  text-align: center;
  font-size: 2rem;
  ${(props) => (props.error ? ErrorTextStyling : null)};
  margin-bottom: 0.8rem;
`;

const ErrorText = styled.label`
  margin: 0.5rem;
  text-align: center;
  font-size: 1rem;
  text-decoration: underline;
  ${ErrorTextStyling}
`;

/* -------------------------------------------------------------------------- */

interface InputAreaProps {
  labelText: string;
  error?: string;
  InputElement: JSX.Element;
}

// Component that holds and input giving it a header and structure
const InputArea = ({ labelText: labelText, error, InputElement }: InputAreaProps) => {
  return (
    <Input>
      <InputLabel error={error !== undefined}>{labelText}</InputLabel>
      {error !== undefined && <ErrorText>{error}</ErrorText>}
      <br />
      {InputElement}
    </Input>
  );
};

export default InputArea;
