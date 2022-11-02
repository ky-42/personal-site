import React, {useEffect, useState} from 'react';
import { BrowserView } from 'react-device-detect';
import styled from 'styled-components';
import ContentSection from '../components/Home/ContentSection';
import {GetContentList} from "../adapters/content";
import {ContentType, FullContent} from "../types/Content";
import ContentItem from "../components/Home/ContentItem";
import {listOrder} from "../types/ViewContent";
import CurrentlyReading from '../components/CurrentlyReading';

const HomeDiv = styled.div`
  margin: clamp(1.3rem,  6vw, 6rem) auto 0;
  display: flex;
  flex-wrap: wrap;
  color: ${props => props.theme.textColour};
  justify-content: space-between;
  margin-bottom: 80px;
  max-width: 1400px;
`;

const HomeLeft = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
  min-width: 500px;
  align-items: start;
  margin-left: clamp(0px, calc(12vw-35px), 225px);
  @media (max-width: 1250px) {
    min-width: 0;
    width: auto;
  }
`;

const PageTitle = styled.h1`
  text-decoration: underline ${props => props.theme.highlight};
  font-size: clamp(1.8rem, 10vw, 3.75rem);
  text-underline-offset: clamp(9px, 2.5vw, 15px);
  margin-top: 0;
`;

const BodyText = styled.p`
  min-width: 200px;
  line-height: 1.5;
`;

const BrowserOnly = styled(BrowserView)`
  margin-left: 4.5rem;
  @media (max-width: 1250px) {
    margin-left: 0;
    align-self: center;
  }
`
const AsteroidsButton = styled.button`
  margin-top: 1.5rem;
  background-color: ${props => props.theme.backgroundColour};
  font-size: 1rem;
  padding: 15px 75px;
  color:  ${props => props.theme.textColour};
  border: ${props => props.theme.borderSize} solid ${props => props.theme.lightTone};
`;

const HomeRight = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  @media (min-width: 1250px) {
    margin-left: clamp(30px, 5vw, 250px);
  }
  @media (min-width: 1600px) {
    margin-left: 250px;
  }
  @media (max-width: 1250px) {
    margin-top: 30px;
    row-gap: 40px;
  }
`;

const Home = () => {

  const [latestProject, setLatestProject] = useState<FullContent>();
  const [latestBlog, setLatestBlog] = useState<FullContent>();

  useEffect(() => {
    GetContentList({
      content_per_page: 1,
      page:0,
      show_order: listOrder.Newest,
      content_type: ContentType.Project
    }).then((value) => setLatestProject(value[0]))

    GetContentList({
      content_per_page: 1,
      page:0,
      show_order: listOrder.Newest,
      content_type: ContentType.Blog
    }).then((value) => setLatestBlog(value[0]))

  }, [])

  return (
    <HomeDiv>
      <HomeLeft>
        <PageTitle>
          Hi! I'm<br />Kyle Denief
        </PageTitle>
        <BodyText>
        I'm a full-stack web developer (Obviously not a designer) with experience in Python, TypeScript, and Rust. I'm mostly self-taught and just really interested in computers and technology. Currently I'm attending school at Memorial University of Newfoundland looking to major in computer science.
        </BodyText>
        <BrowserOnly>
          <AsteroidsButton>
            (Coming Soon)
          </AsteroidsButton>
        </BrowserOnly>
      </HomeLeft>
      <HomeRight>
        <ContentSection updateTitle='Latest Project' updateContent={latestProject !== undefined ? <ContentItem content={latestProject} /> : <></> } />
        <ContentSection updateTitle='Latest Blog' updateContent={latestBlog !== undefined ? <ContentItem content={latestBlog} /> : <></> } />
        <ContentSection updateTitle='Currently Reading' updateContent={<CurrentlyReading />}/>
      </HomeRight>
    </HomeDiv>
  );
}

export default Home;