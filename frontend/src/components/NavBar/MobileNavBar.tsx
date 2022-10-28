import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IoIosArrowUp, IoMdClose } from "react-icons/io"
import { useLocation } from "react-router-dom";
import LinkNavBar from "./LinkMobileNavBar";

const NavBarDiv = styled.div`
  
`;

const ExpandButtonDiv = styled.div`
  width: calc(100% - ${props => props.theme.borderSize}*2);
  position: fixed;
  bottom: 0%;
  height: ${props => props.theme.navHeight};
  display: flex;
  background-color: ${props => props.theme.backgroundColour};
  border: ${props => props.theme.borderSize} solid ${props => props.theme.darkTone};
  align-items: center;
  justify-content: center;
  font-size: 32px;
`;
const UpArrow = styled(IoIosArrowUp)`
  color: ${props => props.theme.lightTone};
  font-size: 32px;
`;

const CloseIcon = styled(IoMdClose)`
  color: ${props => props.theme.lightTone};
`;

const LinksDiv = styled.nav`
  height: calc(100vh - calc(40px + ${props => props.theme.borderSize}*2));
  position: fixed;
  width: 100vw;
  display: flex;
  flex-direction: column;
  top: 0;
`;

const MobileNavBar = () => {
  
  const location = useLocation();

  const [expanded, setExpanded] = useState(false);
  
  const BottomIcon = expanded ? <CloseIcon /> :<UpArrow />;
  
  useEffect(() => {
    setExpanded(false);
  }, [location])

  return (
    <NavBarDiv>
      <ExpandButtonDiv onClick={() => setExpanded(!expanded)}>
        {BottomIcon}
      </ExpandButtonDiv>
      { expanded &&
        <LinksDiv>
          <LinkNavBar to="/" title='Kyle Denief' />
          <LinkNavBar to="/about" title='About Me' />
          <LinkNavBar to="/connect" title='Connect' />
          <LinkNavBar to="/projects" title='Projects' />
          <LinkNavBar to="/blogs" title='Blogs' />
        </LinksDiv>
      }
    </NavBarDiv>
  )
};

export default MobileNavBar;