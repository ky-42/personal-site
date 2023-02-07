import React from "react";
import styled from "styled-components";
import { ErrorTextStyling } from "./InputElements";

/* -------------------------------------------------------------------------- */

const Input = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2.5rem 0;
`;

const InputLabel = styled.label<{error: boolean}>`
  text-align: center;
  font-size: 2.0rem;
  ${props => props.error ? ErrorTextStyling : null};
`;

const ErrorText = styled.label`
  margin: 0.5rem;
  text-align: center;
  font-size: 1.0rem;
  text-decoration: underline;
  ${ErrorTextStyling}
`;

/* -------------------------------------------------------------------------- */

interface InputAreaProps {
  lableText: string,
  error?: string,
  InputElement: JSX.Element
}

// Component that holds and input giving it a header and structure
const InputArea = ({ lableText, error, InputElement }: InputAreaProps) => {
  return (
    <Input>
      <InputLabel error={error !== undefined}>
        {lableText}
      </InputLabel>
      { error !== undefined &&
        <ErrorText>
          {error}
        </ErrorText> 
      }
      <br />
      {InputElement}
    </Input>
  )
}

export default InputArea;