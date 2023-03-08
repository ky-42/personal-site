import React from "react";
import styled from "styled-components";

/* -------------------------------------------------------------------------- */

const PageTitleHeader = styled.header`
  margin-top: clamp(2.08rem,  6vw, 6.0rem);
`;

const PageTitleText = styled.h1`
  font-size: clamp(2.88rem, 10vw, 6.0rem);
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