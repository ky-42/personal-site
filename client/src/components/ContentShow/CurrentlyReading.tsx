import styled from 'styled-components';
import jsonConfig from '@config/config.json';

/* -------------------------------------------------------------------------- */

const CurrentlyReadingBody = styled.article`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const BookTitle = styled.p`
  font-size: clamp(2rem, 4vw, 2.4rem);
  text-align: center;
  margin: 0;
`;

const StartedDate = styled.p`
  color: ${(props) => props.theme.lightTone};
  font-size: clamp(1.12rem, 1.875vw, 1.2rem);
  text-align: center;
  margin: 0;
  margin-top: 1rem;
`;

/* -------------------------------------------------------------------------- */

const CurrentlyReading = () => {
  // Shows a hardcoded book title and start date
  return (
    <CurrentlyReadingBody>
      <BookTitle>
        {jsonConfig.currentlyReading.name},
        <br />
        {jsonConfig.currentlyReading.author}
      </BookTitle>
      <StartedDate>Started: {jsonConfig.currentlyReading.dateStarted}</StartedDate>
    </CurrentlyReadingBody>
  );
};

export default CurrentlyReading;
