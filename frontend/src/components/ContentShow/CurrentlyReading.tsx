import React from "react";
import styled from "styled-components";

/* -------------------------------------------------------------------------- */

const CurrentlyReadingBody = styled.article`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const BookTitle = styled.p`
  font-size: clamp(2.0rem, 4vw, 2.4rem);
  text-align: center;
  margin: 0;
`

const StartedDate = styled.p`
  color: ${props => props.theme.lightTone};
  font-size: clamp(1.12rem, 1.875vw, 1.2rem);
  text-align: center;
  margin: 0;
  margin-top: 1.0rem;
`;

/* -------------------------------------------------------------------------- */

const CurrentlyReading = () => {
  // Shows a hardcoded book title and start date
  return(
    <CurrentlyReadingBody>
      <BookTitle>
      The Pragmatic Programmer,
      <br />
      David Thomas & Andrew Hunt
      </BookTitle>
      <StartedDate>
        Started: Dec. 11, 2022  
      </StartedDate>
    </CurrentlyReadingBody>
  )
};

export default CurrentlyReading;