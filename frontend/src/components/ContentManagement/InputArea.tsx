import React from "react";
import styled from "styled-components";

/* -------------------------------------------------------------------------- */

const Input = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 25px 0;
`;

const InputLabel = styled.label`
  text-align: center;
  font-size: 20px;
`;

/* -------------------------------------------------------------------------- */

interface InputAreaProps {
  lableText: string,
  InputElement: JSX.Element
}

// Component that holds and input giving it a header and structure
const InputArea = ({ lableText, InputElement }: InputAreaProps) => {
  return (
    <Input>
      <InputLabel>
        {lableText}
      </InputLabel>
      <br />
      {InputElement}
    </Input>
  )
}

export default InputArea;