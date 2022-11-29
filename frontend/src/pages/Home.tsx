import React, { useEffect, useState } from 'react';
import { BrowserView } from 'react-device-detect';
import styled from 'styled-components';

import ContentContainer from '../components/Home/ContentSection';
import { GetContentList } from "../adapters/content";
import { ContentType, FullContent } from "../types/Content";
import ContentItem from "../components/Home/ContentItem";
import { RequestState, listOrder, RequestStatus } from "../types/RequestContent";
import CurrentlyReading from '../components/CurrentlyReading';
import LoadErrorHandle from '../components/LoadingErrorHandler';
import MetaData from '../components/MetaData';

/* -------------------------------------------------------------------------- */

const HomeBody = styled.main`
  margin: clamp(1.3rem,  6vw, 6rem) auto 0;
  display: flex;
  flex-wrap: wrap;
  color: ${props => props.theme.textColour};
  justify-content: space-between;
  max-width: 1400px;
`;

/* ------------------- Elements on left side of home page ------------------- */

const LeftPageColumn = styled.section`
  display: flex;
  flex: 0 0 1;
  flex-direction: column;
  justify-content: center;
  width: 500px;
  @media (max-width: 1250px) {
    // Lets left column take whole screen width when screen is to small for 2 columns
    min-width: 0;
    width: auto;
  }
`;

const PageTitle = styled.h1`
  margin: 0 0 50px;
  font-size: clamp(1.8rem, 10vw, 3.75rem);
`;

const IntroText = styled.p`
  margin: 0 0 45px;
  line-height: 1.5;
`;

// Wraper for asteroid button (below)
const BrowserOnly = styled(BrowserView)`
  margin-left: 4.5rem;
  @media (max-width: 1250px) {
    margin-left: 0;
    align-self: center;
  }
`;

// Currently does nothing cause game is not implmented
const AsteroidsButton = styled.button`
  background-color: ${props => props.theme.backgroundColour};
  font-size: 1rem;
  padding: 15px 75px;
  color:  ${props => props.theme.textColour};
  border: ${props => props.theme.borderSize} solid ${props => props.theme.lightTone};
`;

/* ------------------- Elements on right side of home page ------------------- */

const HomeRight = styled.div`
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  @media (min-width: 1250px) {
    // Keeps right column from staying to close to the left and looking weird on wider screens
    // I need something better tho
    margin-left: clamp(30px, 6vw, 300px);
  }
  @media (max-width: 1250px) {
    // For when the page uses one column instead of two
    margin-top: 30px;
    row-gap: 40px;
  }
`;

/* -------------------------------------------------------------------------- */

const Home = () => {

  // Data for latest content links
  const [latestProjectList, setLatestProjectList] = useState<RequestState<FullContent[]>>({requestStatus: RequestStatus.Loading});
  const [latestBlogList, setLatestBlogList] = useState<RequestState<FullContent[]>>({requestStatus: RequestStatus.Loading});

  useEffect(() => {
    // Gets latest project
    GetContentList({
      content_per_page: 1,
      page:0,
      show_order: listOrder.Newest,
      content_type: ContentType.Project
    }).then((contentList: RequestState<FullContent[]>) => {
      setLatestProjectList(contentList);
    })

    // Gets latest blog
    GetContentList({
      content_per_page: 1,
      page:0,
      show_order: listOrder.Newest,
      content_type: ContentType.Blog
    }).then((contentList: RequestState<FullContent[]>) => {
      setLatestBlogList(contentList);
    })
  }, [])
  
  // Element to display when latest blog or project is successfully fetched
  const contentFetchSuccess = (data: FullContent[]): JSX.Element => {
    if (data.length > 0){
      return <ContentItem content={data[0]} />
    }
    return <p>No new content</p>
  }

  return (
    <HomeBody>

      <MetaData
        title="Kyle Denief"
        description="Hi I'm Kyle Denief a university student and self taught programmer. Check out my latest project or blog if that interests you and have a good day!"
        type="website"
      />

      <LeftPageColumn>
        <PageTitle>
          Hi! I'm<br />Kyle Denief
        </PageTitle>
        <IntroText>
          I'm a full-stack web developer (Obviously not a designer) with experience in Python, TypeScript, and Rust. I'm mostly self-taught and just really interested in computers and technology. Currently I'm attending school at Memorial University of Newfoundland looking to major in computer science.
        </IntroText>

        {/* Button to start asteroids game (only works on desktop) */}
        <BrowserOnly>
          <AsteroidsButton>
            (Coming Soon)
          </AsteroidsButton>
        </BrowserOnly>
      </LeftPageColumn>

      <HomeRight>
        <ContentContainer containerTitle='Latest Project' housedElement={
          <LoadErrorHandle requestInfo={latestProjectList} successCallback={contentFetchSuccess} />
        } />
        <ContentContainer containerTitle='Latest Blog' housedElement={
          <LoadErrorHandle requestInfo={latestBlogList} successCallback={contentFetchSuccess} />
        } />
        <ContentContainer containerTitle='Currently Reading' housedElement={<CurrentlyReading />}/>
      </HomeRight>

    </HomeBody>
  );
}

export default Home;