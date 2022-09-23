import React, { useReducer, useState } from "react";
import styled from "styled-components";
import { actionTypes } from "../types/ManageContent";
import PageTitle from "../components/PageTitle";
import ActionButtons from "../components/ActionButtons";
import ContentForm from "../components/ContentForm";
import DeleteForm from "../components/DeleteForm";


const MakeContentDiv = styled.div`
  
`;

const ManageContent = () => {
 
  const [currentAction, setCurrentAction] = useState(actionTypes.Create);
  
  const ActionElement = {
    [actionTypes.Create]: <ContentForm action={currentAction} />,
    [actionTypes.Update]: <ContentForm action={currentAction} />,
    [actionTypes.Delete]: <DeleteForm />,
  };

  return (
    <MakeContentDiv>
      <PageTitle>Manage Content</PageTitle>
      <ActionButtons currentAction={currentAction} setCurrent={setCurrentAction} />
      {ActionElement[currentAction]}
    </MakeContentDiv>
  )
}

export default ManageContent;