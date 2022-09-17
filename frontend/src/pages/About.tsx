import React from "react";
import styled from "styled-components";

import PageTitle from "../components/PageTitle";
import ReadingList from "../components/ReadingList";

const AboutDiv = styled.div`
  
`;

const PageDiv = styled.div`
  text-align: center;
`;

const AboutMeText = styled.p`
  
`;

const OtherContentDiv = styled.div`
  
`;

const ReadingDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
`;

// TODO Find something else to add like games or something
const SomethingElse = styled.div`
  
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

  const CurrentlyReading = [
    "The Ultimate Hitchhiker's Guide to the Galaxy, Douglas Adams",
    "Jim Henson: The Biography, Brian Jones"
  ]
  
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
          Hi, I'm Kyle. I'm a first year student at Memorial University of Newfoundland and I plan on majoring in computer science. Some of my interests are computers, technology, reading, sports, and fishing. I've been teaching myself about computers for many years now and have always been interested in them. With a combination of school and self teaching I have learned python, and javascript along with a good many other technologies and languages like rust, sql, docker, git and linux. Another interest of mine is reading and below you can see some of the books I'm reading and planning to read. I have also played sports my whole life including hockey, baseball, basketball, and many others. Lastly I have also had many academic successes including winning many high school subject awards and honor roll. I was also a recipient of a scholarship from the James R. Hoffa Memorial Scholarship Fund.
        </AboutMeText>
      </AboutDiv>
      <OtherContentDiv>
        <h1>My Readings</h1>
        <ReadingDiv>
          <ReadingList ReadingTitle="Finished" BookList={FinishedReading} />
          <ReadingList ReadingTitle="Reading" BookList={CurrentlyReading} />
          <ReadingList ReadingTitle="To Read" BookList={ToRead} />
        </ReadingDiv>
      </OtherContentDiv>
    </PageDiv>
  )
}

export default About;