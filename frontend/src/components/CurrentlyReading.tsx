import React from "react";
import styled from "styled-components";

/* -------------------------------------------------------------------------- */

const CurrentlyReadingBody = styled.article`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const BookTitle = styled.p`
  font-size: clamp(1.25rem, 4vw, 1.5rem);
  text-align: center;
  margin: 0;
`

const StartedDate = styled.p`
  color: ${props => props.theme.lightTone};
  font-size: clamp(0.7rem, 1.875vw, 0.75rem);
  text-align: center;
  margin: 0;
  margin-top: 10px;
`;

/* -------------------------------------------------------------------------- */

const CurrentlyReading = () => {
  // Shows a hardcoded book title and start date
  return(
    <CurrentlyReadingBody>
      <BookTitle>
      Jim Henson: The Biography,
      <br />
      Brian Jones
      </BookTitle>
      <StartedDate>
        Started: Aug. 25th, 2022  
      </StartedDate>
    </CurrentlyReadingBody>
  )
};

export default CurrentlyReading;