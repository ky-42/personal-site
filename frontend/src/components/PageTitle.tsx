import React from "react";
import styled from "styled-components";

interface PageTitleProps {
  children: string,
  icon?: React.ReactNode
}

const PageTitleDiv = styled.div`
  
`;

const PageTitleText = styled.h1`
  text-align: center;
`;

const PageTitle = ({ children, icon }: PageTitleProps) => {
  return(
    <PageTitleDiv>
      {icon}
      <PageTitleText>
        {children}
      </PageTitleText>
    </PageTitleDiv>
  )
}

export default PageTitle;