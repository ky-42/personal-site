import React from "react";
import styled from "styled-components";

import CurrentlyReading from "../components/ContentShow/CurrentlyReading";
import PageTitle from "../components/Shared/PageTitle";
import ReadingList from "../components/AboutMe/ReadingList";
import MetaData from "../components/Shared/MetaData";

/* -------------------------------------------------------------------------- */

const AboutBody = styled.main``;

/* -------------------------- About section elments ------------------------- */

const AboutSection = styled.section`
  margin: auto;
  max-width: 120.0rem;
`;

const AboutMeText = styled.p`
  line-height: 150%;
`;

/* ------------------------ Reading section elements ------------------------ */

const ReadingSection = styled.section``;

const ReadingTitle = styled.h2`
  margin-top: 5.0rem;
  font-size: clamp(2.72rem, 6vw, 3.2rem);
  text-align: center;
`;

const BookListDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap-reverse;
  margin-top: 2.5rem;
  column-gap: 5.0rem;
  row-gap: 2.5rem;
`;

/* -------------------------------------------------------------------------- */

const About = () => {
  
  // Lists of books to be displayed
  const FinishedReading = [
    "Jim Henson: The Biography, Brian Jones",
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
        description="Hi I'm Kyle Denief I'm a university student at Memorial University of Newfoundland and I'm a programmer!"
        type="website"
      />

      <AboutSection>
        <PageTitle>
          About Me
        </PageTitle>
        <AboutMeText>
          As a first-year computer science student at Memorial University of Newfoundland, I am highly motivated to learn and excel in the field of technology. In addition to my coursework, I have self-taught myself a range of programming languages and technologies, including Python, TypeScript, SQL, Docker, Git, Rust, and Linux. I have also gained experience with popular web development frameworks such as React, Flask, and Actix Web. My passion for computers and technology has driven me to continually improve my skills and knowledge. I am proud to have had numerous academic achievements, including winning high school subject awards, being on the honor roll, and receiving a scholarship from the James R. Hoffa Memorial Scholarship Fund. Outside of my studies, I enjoy reading, sports, and fishing. I have played a variety of sports throughout my life, including hockey, baseball, and basketball. I am excited to see where my studies and self-learning will take me in the future.
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