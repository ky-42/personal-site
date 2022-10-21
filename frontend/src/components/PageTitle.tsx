import React from "react";
import styled from "styled-components";

interface PageTitleProps {
  children: string,
  icon?: React.ReactNode
}

const PageTitleDiv = styled.div`
  margin-top: clamp(1.3rem,  6vw, 3.75rem);
  width: 100%;
`;

const PageTitleText = styled.h1`
  text-align: center;
  text-decoration: underline ${props => props.theme.highlight};
  text-underline-offset: clamp(9px, 2.5vw, 15px);
  font-size: clamp(1.8rem, 10vw, 3.75rem);
  margin-top: 0;
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