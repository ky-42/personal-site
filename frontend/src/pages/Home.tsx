import React from 'react';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import HomeLink from '../components/HomeLink';

const NameHeader = styled.h1`
  color: ${props => props.theme.textColour};
`;

const AsteroidsButton = styled.button`
  width: 20vw;
  height: 20vh;
  position: fixed;
  top: calc(50% - 10vh);
  left: calc(50% - 10vw);
  background-color: ${props => props.theme.backgroundColour};
  border: 10px solid ${props => props.theme.textColour};
`;

const HomeDiv = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LinkContainer = styled.nav`
  /* TODO change gaps if device is mobile */
  height: calc(100% - 80px);
  width: calc(100% - 80px);
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  row-gap: 50px;
  column-gap: 50px;
`;

const Home = () => {
  return (
    <HomeDiv>
      <AsteroidsButton>
        <NameHeader>
          Kyle Denief  
        </NameHeader>
      </AsteroidsButton>
      <LinkContainer>
        <HomeLink LinkAddress="/about" LinkName="About Me" />
        <HomeLink LinkAddress="/connect" LinkName="Connect" />
        <HomeLink LinkAddress="/projects" LinkName="Projects" />
        <HomeLink LinkAddress="/blogs" LinkName="Blogs" />
      </LinkContainer>
    </HomeDiv>
  );
}

export default Home;