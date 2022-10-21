import React, { useState } from "react";
import styled from "styled-components";

interface PasswordSubmitProps {
  password: string,
  setPassword: React.Dispatch<React.SetStateAction<string>>,
  submitFunc: (e: React.FormEvent<HTMLFormElement>) => void
}

const PasswordForm = styled.form`
  
`;

const PasswordSubmit = ({ password, setPassword, submitFunc }: PasswordSubmitProps) => {
  return (
    <PasswordForm onSubmit={submitFunc}>
      <label>
        Password:
        <input type="password" value={password} onChange={event => setPassword(event.target.value)} />
      </label>
      <input type="submit" value="Submit" />
    </PasswordForm>
  )
}

export default PasswordSubmit;