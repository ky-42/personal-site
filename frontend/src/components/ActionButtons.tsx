import React from "react";
import styled from "styled-components";

import { actionTypes } from "../types/ManageContent";

const ActionButtonDiv = styled.div`
  
`;

const ActionButton = styled.button<{ active: boolean }>`
  
`;

interface ActionButtonProps {
  currentAction: actionTypes,
  setCurrent: React.Dispatch<React.SetStateAction<actionTypes>>
}

const ActionButtons = ({currentAction, setCurrent}: ActionButtonProps) => {
  return(
    <ActionButtonDiv>
      <ActionButton active={currentAction===actionTypes.Create} onClick={() => setCurrent(actionTypes.Create)}>Create</ActionButton>
      <ActionButton active={currentAction===actionTypes.Update} onClick={() => setCurrent(actionTypes.Update)}>Update</ActionButton>
      <ActionButton active={currentAction===actionTypes.Delete} onClick={() => setCurrent(actionTypes.Delete)}>Delete</ActionButton>
    </ActionButtonDiv>
  )
}

export default ActionButtons;