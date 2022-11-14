import React from "react";
import styled from "styled-components";

import CurrentlyReading from "../components/CurrentlyReading";
import PageTitle from "../components/PageTitle";
import ReadingList from "../components/AboutMe/ReadingList";
import MetaData from "../components/MetaData";

/* -------------------------------------------------------------------------- */

const AboutBody = styled.main``;

/* -------------------------- About section elments ------------------------- */

const AboutSection = styled.section`
  margin: auto;
  max-width: 1200px;
`;

const AboutMeText = styled.p``;

/* ------------------------ Reading section elements ------------------------ */

const ReadingSection = styled.section``;

const ReadingTitle = styled.h2`
  margin-top: 50px;
  font-size: clamp(1.7rem, 6vw, 2rem);
  text-align: center;
`;

const BookListDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap-reverse;
  margin-top: 25px;
  column-gap: 50px;
  row-gap: 25px;
`;

/* -------------------------------------------------------------------------- */

const About = () => {
  
  // Lists of books to be displayed
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
    <AboutBody>
      <MetaData
        title="About Me | Kyle Denief"
        description="A bit about what I'm interested in, where I'm going to school, what I'm reading and what I know!"
        type="website"
      />

      <AboutSection>
        <PageTitle>
          About Me
        </PageTitle>
        <AboutMeText>
          I'm a first-year student at Memorial University of Newfoundland and I plan on majoring in computer science. Some of my interests are computers, technology, reading, sports, and fishing. I've been teaching myself about computers for many years now and have always been interested in them. With a combination of school and self-teaching, I have learned Python and JavaScript along with a good many other technologies and languages like SQL, Docker, Git, and Linux. Another interest of mine is reading, and below you can see some of the books I'm planning to read along with some I've already finished. I have also played sports my whole life, including hockey, baseball, basketball, and many others. Lastly, I have also had many academic successes, including winning many high school subject awards and being on the honour roll. I was also a recipient of a scholarship from the James R. Hoffa Memorial Scholarship Fund.
        </AboutMeText>
      </AboutSection>

      <ReadingSection>
        <ReadingTitle>
          What I'm Reading
        </ReadingTitle>
        <CurrentlyReading />
        <BookListDiv>
          <ReadingList ReadingTitle="Finished" BookList={FinishedReading} />
          <ReadingList ReadingTitle="To Read" BookList={ToRead} />
        </BookListDiv>
      </ReadingSection>
    </AboutBody>
  )
}

export default About;