import React from "react";
import styled from "styled-components";
import { AiFillGithub, AiOutlineMail, AiFillTwitterCircle, AiFillLinkedin } from "react-icons/ai";

import PageTitle from "../styledComponents/PageTitle";
import ConnectLink from "../components/ConnectLink";

const ConnectDiv = styled.div`
  
`;

const LinksDiv = styled.div`
  
`;

const Connect = () => {
  return (
    <ConnectDiv>
      <PageTitle>
        Connect With Me        
      </PageTitle>
      <LinksDiv>
        <ConnectLink LinkTo="" Icon={<AiFillGithub />} />
        <ConnectLink LinkTo="" Icon={<AiOutlineMail />} />
        <ConnectLink LinkTo="" Icon={<AiFillTwitterCircle />} />
        <ConnectLink LinkTo="" Icon={<AiFillLinkedin />} />
      </LinksDiv>
    </ConnectDiv>
  )
}

export default Connect;