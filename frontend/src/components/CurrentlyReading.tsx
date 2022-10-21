import React from "react";
import styled from "styled-components";

const CurrentlyReadingDiv = styled.div`
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
  font-size: 12px;
  text-align: center;
  margin: 0;
  margin-top: 10px;
`;

const CurrentlyReading = () => {
  return(
    <CurrentlyReadingDiv>
      <BookTitle>
      Jim Henson: The Biography,
      <br />
      Brian Jones
      </BookTitle>
      <StartedDate>
        Started: Aug. 25th, 2022  
      </StartedDate>
    </CurrentlyReadingDiv>
  )
};

export default CurrentlyReading;