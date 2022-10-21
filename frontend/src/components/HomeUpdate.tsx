import React from "react";
import styled from "styled-components";

interface HomeUpdateProps {
  updateTitle: string,
  updateContent: React.ReactNode
}

const UpdateContainer = styled.div`
  display: flex;
  flex: 0 0 1;
  width: 100%;
  max-width: 550px;
  flex-direction: column;
`;

const UpdateHeader = styled.h2`
  text-align: center;
  text-decoration: underline ${props => props.theme.highlightDark} 0.1rem;
  text-underline-offset: 0.5rem;
`;

const HomeUpdate = ({ updateTitle, updateContent }: HomeUpdateProps) => {
  return (
    <UpdateContainer>
      <UpdateHeader>
        {updateTitle}
      </UpdateHeader>
      {updateContent}
    </UpdateContainer>
  )
};

export default HomeUpdate;