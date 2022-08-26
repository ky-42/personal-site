import React from 'react';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import HomeLink from '../components/HomeLink';

const HomeDiv = styled.div`
  
`;

const AsteroidsDiv = styled.div`

`;

const LinksDiv = styled.nav`
  
`;

const Home = () => {
  return (
    <HomeDiv>
      {
        isMobile &&
        <AsteroidsDiv />
      }
      <LinksDiv>
        <HomeLink LinkAddress="/about-me" LinkName="About Me" />
        <HomeLink LinkAddress="/contact" LinkName="Contact" />
        <HomeLink LinkAddress="/projects" LinkName="Projects" />
        <HomeLink LinkAddress="/blogs" LinkName="Blogs" />
      </LinksDiv>
    </HomeDiv>
  );
}

export default Home;