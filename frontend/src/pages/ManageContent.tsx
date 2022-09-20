import React, { useReducer, useState } from "react";
import styled from "styled-components";
import { actionTypes } from "../types/ManageContent";
import PageTitle from "../components/PageTitle";
import { NewFullContent, FullContent } from "../types/Content";
import ActionButtons from "../components/ActionButtons";
import ContentForm from "../components/ContentForm";

const PasswordForm = styled.form`
  
`;

const MakeContentDiv = styled.div`
  
`;

type formStateType = {action: actionTypes.Create, data: NewFullContent} | {action: actionTypes.Update, data: FullContent} | {action: actionTypes.Delete, slug: string};

interface formAction {
  name: string,
  value: string
  main_content?: boolean,
}

const reducer = (state: formStateType, action: formAction) => {
  switch (state.action) {
    case actionTypes.Create:
      return
    case actionTypes.Update:
      return
    case actionTypes.Delete:
      return
  }
}

const ManageContent = () => {
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }
  

  const [currentAction, setCurrentAction] = useState(actionTypes.Create);
  
  const ActionElement = {
    [actionTypes.Create]: <ContentForm action={currentAction} />,
    [actionTypes.Update]: <ContentForm action={currentAction} />,
    [actionTypes.Delete]: <ContentForm action={currentAction} />,
  };
  // const [formState, setFormState] = useReducer

  return (
    <MakeContentDiv>
      <PageTitle>Manage Content</PageTitle>
      <ActionButtons currentAction={currentAction} setCurrent={setCurrentAction} />
      {ActionElement[currentAction]}
      <PasswordForm>
        <label>
          Password:
          <input type="password" name="password" />
        </label>
        <input type="submit" value="Submit" />
      </PasswordForm>
    </MakeContentDiv>
  )
}

export default ManageContent;