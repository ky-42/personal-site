import React from "react";
import styled from "styled-components";
import CurrentlyReading from "../components/CurrentlyReading";

import PageTitle from "../components/PageTitle";
import ReadingList from "../components/ReadingList";

const AboutDiv = styled.div`
  max-width: 1200px;
  margin: auto;
`;

const PageDiv = styled.div`

`;

const AboutMeText = styled.p`

`;

const ReadingDiv = styled.div`
  margin-top: 50px;

`;

const ReadingTitle = styled.h2`
  font-size: clamp(1.7rem, 6vw, 2rem);
  text-align: center;
  text-decoration: underline ${props => props.theme.highlightDark} 0.1rem;
  text-underline-offset: 0.5rem;
`;

const BooksDiv = styled.div`
  
`;

const BookListDiv = styled.div`
  margin-top: 25px;
  display: flex;
  column-gap: 50px;
  row-gap: 25px;
  justify-content: space-evenly;
  flex-wrap: wrap-reverse;
`;



const About = () => {
  
  const FinishedReading = [
    "Atomic Habits, James Clear",
    "The Wealthy Barber, David Chilton",
    "What Color is Your Parachute?, Richard Bolles",
    "Everyday Hockey Heroes, Bob McKenzie & Jim Lang",
    "Splinter of the Mind's Eye, Alan Dean Foster",
    "Business Adventures, John Brooks",
    "Nineteen Eighty-Four, George Orwell",
    "The Kite Runner, Khaled Hosseini",
    "Ready Player Two, Ernest Cline",
    "Ready Player One, Ernest Cline",
    "Armada, Ernest Cline",
    "Python Crash Course, Eric Matthes"
  ];

  const ToRead = [
    "The Pragmatic Programmer: Your Journey To Mastery, Andrew Hunt & David Thomas",
    "How Not to Be Wrong, Jordan Ellenberg",
    "Perilous Bounty, Tom Philpott",
    "Red Rising, Pierce Brown",
    "Structures: Or Why Things Don't Fall Down, J. E. Gordon",
    "Blackwater: The Rise of the World's Most Powerful Mercenary Army, Jeremy Scahill",
  ]

  return (
    <PageDiv>
      <AboutDiv>
        <PageTitle>
          About Me
        </PageTitle>
        <AboutMeText>
          I'm a first-year student at Memorial University of Newfoundland and I plan on majoring in computer science. Some of my interests are computers, technology, reading, sports, and fishing. I've been teaching myself about computers for many years now and have always been interested in them. With a combination of school and self-teaching, I have learned Python and JavaScript along with a good many other technologies and languages like SQL, Docker, Git, and Linux. Another interest of mine is reading, and below you can see some of the books I'm planning to read along with some I've already finished. I have also played sports my whole life, including hockey, baseball, basketball, and many others. Lastly, I have also had many academic successes, including winning many high school subject awards and being on the honour roll. I was also a recipient of a scholarship from the James R. Hoffa Memorial Scholarship Fund.
        </AboutMeText>
      </AboutDiv>
      <ReadingDiv>
        <ReadingTitle>
          What I'm Reading
        </ReadingTitle>
        <BooksDiv>
          <CurrentlyReading />
          <BookListDiv>
            <ReadingList ReadingTitle="Finished" BookList={FinishedReading} />
            <ReadingList ReadingTitle="To Read" BookList={ToRead} />
          </BookListDiv>
        </BooksDiv>
      </ReadingDiv>
    </PageDiv>
  )
}

export default About;