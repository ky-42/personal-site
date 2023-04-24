import styled from 'styled-components';
import CurrentlyReading from '../components/ContentShow/CurrentlyReading';
import PageTitle from '../components/Shared/PageTitle';
import ReadingList from '../components/AboutMe/ReadingList';
import MetaData from '../components/Shared/MetaData';
import jsonConfig from '@config/config.json';

/* -------------------------------------------------------------------------- */

const AboutBody = styled.main``;

/* -------------------------- About section elments ------------------------- */

const AboutSection = styled.section`
  margin: auto;
  max-width: 120rem;
`;

const AboutMeText = styled.p`
  line-height: 150%;
`;

/* ------------------------ Reading section elements ------------------------ */

const ReadingSection = styled.section``;

const ReadingTitle = styled.h2`
  margin-top: 5rem;
  font-size: clamp(2.72rem, 6vw, 3.2rem);
  text-align: center;
`;

const BookListDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap-reverse;
  margin-top: 2.5rem;
  column-gap: 5rem;
  row-gap: 2.5rem;
`;

/* -------------------------------------------------------------------------- */

const About = () => {
  // Lists of books to be displayed
  const FinishedReading = jsonConfig.pages.about.finishedReading.map((v) => {
    return v.name + ', ' + v.author;
  });

  const ToRead = jsonConfig.pages.about.toRead.map((v) => {
    return v.name + ', ' + v.author;
  });

  return (
    <AboutBody>
      <MetaData
        title={`About Me | ${jsonConfig.name}`}
        description={jsonConfig.pages.about.description}
        type='website'
      />

      <AboutSection>
        <PageTitle>About Me</PageTitle>
        <AboutMeText>{jsonConfig.pages.about.mainParagraph}</AboutMeText>
      </AboutSection>

      <ReadingSection>
        <ReadingTitle>What I&apos;m Reading</ReadingTitle>
        <CurrentlyReading />
        <BookListDiv>
          <ReadingList ReadingTitle='Finished' BookList={FinishedReading} />
          <ReadingList ReadingTitle='To Read' BookList={ToRead} />
        </BookListDiv>
      </ReadingSection>
    </AboutBody>
  );
};

export default About;
