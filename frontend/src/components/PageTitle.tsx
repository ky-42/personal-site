import React from "react";
import styled from "styled-components";

/* -------------------------------------------------------------------------- */

const PageTitleHeader = styled.header`
  margin-top: clamp(1.3rem,  6vw, 3.75rem);
`;

const PageTitleText = styled.h1`
  font-size: clamp(1.8rem, 10vw, 3.75rem);
  text-align: center;
  margin-top: 0;
`;

/* -------------------------------------------------------------------------- */

interface PageTitleProps {
  children: string,
  icon?: React.ReactNode
}

const PageTitle = ({ children, icon }: PageTitleProps) => {
  return(
    <PageTitleHeader>
      {icon}
      <PageTitleText>
        {children}
      </PageTitleText>
    </PageTitleHeader>
  )
}

export default PageTitle;