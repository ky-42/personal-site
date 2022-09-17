import React from "react";
import styled from "styled-components";
import { AiFillGithub, AiOutlineMail, AiFillTwitterCircle, AiFillLinkedin } from "react-icons/ai";

import PageTitle from "../components/PageTitle";
import ConnectLink from "../components/ConnectLink";

const ConnectDiv = styled.div`
`;

const LinksDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const LinkRow = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
`;

const Connect = () => {
  return (
    <ConnectDiv>
      <PageTitle>
        Connect With Me        
      </PageTitle>
      <LinksDiv>
        {/* TODO make Link rows automatically */}
        <LinkRow>
          <ConnectLink LinkTo="" Icon={<AiFillGithub />} />
          <ConnectLink LinkTo="" Icon={<AiOutlineMail />} />
        </LinkRow>  
        <LinkRow>
          <ConnectLink LinkTo="" Icon={<AiFillTwitterCircle />} />
          <ConnectLink LinkTo="" Icon={<AiFillLinkedin />} />
        </LinkRow>
      </LinksDiv>
    </ConnectDiv>
  )
}

export default Connect;