import React, { useState } from "react";
import styled from "styled-components";
import { IoIosArrowUp, IoMdClose } from "react-icons/io"
import { Link } from "react-router-dom";
import LinkNavBar from "./LinkMobileNavBar";

const NavBarDiv = styled.div`
  
`;

const ExpandButtonDiv = styled.div`
  width: calc(100% - 10px);
  position: fixed;
  bottom: 0%;
  height: 55px;
  display: flex;
  background-color: black;
  border: solid white 5px;
  align-items: center;
  justify-content: center;
`;
const UpArrow = styled(IoIosArrowUp)`
  color: white;
  font-size: 32px;
`;

const CloseIcon = styled(IoMdClose)`
  
`;

const LinksDiv = styled.nav`
  height: calc(100vh - 55px);
  position: fixed;
  width: 100vw;
  display: flex;
  flex-direction: column;
  top: 0;
`;

const MobileNavBar = () => {

  const [expanded, setExpanded] = useState(false);
  
  const BottomIcon = expanded ? <UpArrow /> : <CloseIcon />;

  return (
    <NavBarDiv>
      <ExpandButtonDiv onClick={() => setExpanded(!expanded)}>
        {BottomIcon}
      </ExpandButtonDiv>
      { expanded &&
        <LinksDiv>
          <LinkNavBar to="/" title='Kyle Denief' />
          <LinkNavBar to="/about" title='About Me' />
          <LinkNavBar to="/projects" title='Projects' />
          <LinkNavBar to="/blogs" title='Blogs' />
          <LinkNavBar to="/connect" title='Connect' />
        </LinksDiv>
      }
    </NavBarDiv>
  )
};

export default MobileNavBar;