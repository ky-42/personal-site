import { useEffect, useState } from 'react';
import { BrowserView } from 'react-device-detect';
import styled from 'styled-components';
import ContentContainer from '../components/Home/ContentSection';
import { ContentOperations } from '../adapters/content';
import { ContentType } from '../types/Content';
import ContentItem from '../components/Home/ContentItem';
import {
  RequestState,
  listOrder,
  RequestStatus,
  PageInfo,
  ContentFilter,
  FullContentList,
} from '../types/RequestContent';
import CurrentlyReading from '../components/ContentShow/CurrentlyReading';
import LoadErrorHandle from '../components/RequestHandling/LoadingErrorHandler';
import MetaData from '../components/Shared/MetaData';
import jsonConfig from '@config/config.json';

/* -------------------------------------------------------------------------- */

const HomeBody = styled.main`
  margin: clamp(2.08rem, 6vw, 9.6rem) auto 0;
  display: flex;
  flex-wrap: wrap;
  color: ${(props) => props.theme.textColour};
  justify-content: space-between;
  max-width: 140rem;
`;

/* ------------------- Elements on left side of home page ------------------- */

const LeftPageColumn = styled.section`
  display: flex;
  flex: 0 0 1;
  flex-direction: column;
  justify-content: center;
  width: 50rem;
  @media (max-width: 1250px) {
    // Lets left column take whole screen width when screen is to small for 2 columns
    min-width: 0;
    width: auto;
  }
`;

const PageTitle = styled.h1`
  margin: 0 0 5rem;
  font-size: clamp(2.88rem, 10vw, 6rem);
`;

const IntroText = styled.p`
  margin: 0 0 4.5rem;
  line-height: 1.5;
`;

// Wraper for asteroid button (below)
const BrowserOnly = styled(BrowserView)`
  margin-left: 7.2rem;
  @media (max-width: 1250px) {
    margin-left: 0;
    align-self: center;
  }
`;

// Currently does nothing cause game is not implmented
const AsteroidsButton = styled.button`
  background-color: ${(props) => props.theme.backgroundColour};
  font-size: 1.6rem;
  padding: 1.5rem 7.5rem;
  color: ${(props) => props.theme.textColour};
  border: ${(props) => props.theme.borderSize} solid ${(props) => props.theme.lightTone};
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
    margin-left: clamp(3rem, 6vw, 30rem);
  }
  @media (max-width: 1250px) {
    // For when the page uses one column instead of two
    margin-top: 3rem;
    row-gap: 4rem;
  }
`;

/* ---------------- Objects to pass to latest content request --------------- */

const latestContentPageInfo: PageInfo = {
  content_per_page: 1,
  page: 0,
  show_order: listOrder.Newest,
};

const projectFilter: ContentFilter = {
  content_type: ContentType.Project,
};

const blogFilter: ContentFilter = {
  content_type: ContentType.Blog,
};

/* -------------------------------------------------------------------------- */

const Home = () => {
  // Data for latest content links
  const [latestProjectList, setLatestProjectList] = useState<RequestState<FullContentList>>({
    requestStatus: RequestStatus.Loading,
  });
  const [latestBlogList, setLatestBlogList] = useState<RequestState<FullContentList>>({
    requestStatus: RequestStatus.Loading,
  });

  useEffect(() => {
    // Gets latest project
    ContentOperations.get_content_list({
      page_info: latestContentPageInfo,
      content_filters: projectFilter,
    }).then((contentList: RequestState<FullContentList>) => {
      setLatestProjectList(contentList);
    });

    // Gets latest blog
    ContentOperations.get_content_list({
      page_info: latestContentPageInfo,
      content_filters: blogFilter,
    }).then((contentList: RequestState<FullContentList>) => {
      setLatestBlogList(contentList);
    });
  }, []);

  // Element to display when latest blog or project is successfully fetched
  const contentFetchSuccess = ({ data }: { data: FullContentList }): JSX.Element => {
    if (data.content_count > 0) {
      return <ContentItem content={data.full_content_list[0]} />;
    }
    return <p>No Content</p>;
  };

  return (
    <HomeBody>
      <MetaData
        title={jsonConfig.name}
        description={jsonConfig.pages.home.description}
        type='website'
      />

      <LeftPageColumn>
        <PageTitle>
          Hi! I&apos;m
          <br />
          {jsonConfig.name}
        </PageTitle>
        <IntroText>{jsonConfig.pages.home.mainParagraph}</IntroText>

        {/* Button to start asteroids game (only works on desktop) */}
        <BrowserOnly>
          <AsteroidsButton>(Coming Soon)</AsteroidsButton>
        </BrowserOnly>
      </LeftPageColumn>

      <HomeRight>
        <ContentContainer
          containerTitle='Latest Project'
          housedElement={
            <LoadErrorHandle requestInfo={latestProjectList} successElement={contentFetchSuccess} />
          }
        />
        <ContentContainer
          containerTitle='Latest Blog'
          housedElement={
            <LoadErrorHandle requestInfo={latestBlogList} successElement={contentFetchSuccess} />
          }
        />
        <ContentContainer containerTitle='Currently Reading' housedElement={<CurrentlyReading />} />
      </HomeRight>
    </HomeBody>
  );
};

export default Home;
