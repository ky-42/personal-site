import React, { useState } from "react";
import styled from "styled-components";

interface PasswordSubmitProps {
  password: string,
  setPassword: React.Dispatch<React.SetStateAction<string>> 
}

const PasswordForm = styled.fieldset`
  
`;

const PasswordSubmit = ({password, setPassword}: PasswordSubmitProps) => {
  return (
    <PasswordForm>
      <label>
        Password:
        <input type="password" value={password} onChange={event => setPassword(event.target.value)} />
      </label>
      <input type="submit" value="Submit" />
    </PasswordForm>
  )
}

export default PasswordSubmit;