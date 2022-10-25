import React from "react";
import styled from "styled-components";
import PageTitle from "../components/PageTitle";

const NotFoundDiv = styled.div`
`;

const BodyText = styled.p`
  text-align: center;
`;

const NotFound = () => {
  return (
    <NotFoundDiv>
      <PageTitle>
        404
      </PageTitle>
      <BodyText>
        I don't know what you were looking for but we both know the answer is 42 right?
      </BodyText>
    </NotFoundDiv>
  )
};

export default NotFound;