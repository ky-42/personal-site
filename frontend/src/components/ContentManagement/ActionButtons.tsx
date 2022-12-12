import React from "react";
import styled from "styled-components";

import { ActionTypes } from "../../types/ManageContent";

const ActionButtonDiv = styled.div`
  
`;

const ActionButton = styled.button<{ active: boolean }>`
  
`;

interface ActionButtonProps {
  currentAction: ActionTypes,
  setCurrent: React.Dispatch<React.SetStateAction<ActionTypes>>
}

const ActionButtons = ({currentAction, setCurrent}: ActionButtonProps) => {
  return(
    <ActionButtonDiv>
      <ActionButton active={currentAction===ActionTypes.Create} onClick={() => setCurrent(ActionTypes.Create)}>Create</ActionButton>
      <ActionButton active={currentAction===ActionTypes.Update} onClick={() => setCurrent(ActionTypes.Update)}>Update</ActionButton>
      <ActionButton active={currentAction===ActionTypes.Delete} onClick={() => setCurrent(ActionTypes.Delete)}>Delete</ActionButton>
    </ActionButtonDiv>
  )
}

export default ActionButtons;