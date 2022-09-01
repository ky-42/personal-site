import React from "react";
import styled from "styled-components";

import PageTitle from "../styledComponents/PageTitle";
import ReadingList from "../components/ReadingList";

const AboutDiv = styled.div`
  
`;

const PageDiv = styled.div`
  
`;

const AboutMeText = styled.p`
  
`;

const OtherContentDiv = styled.div`
  
`;
const ReadingDiv = styled.div`
  
`;

// TODO Find something else to add like games or something
const SomethingElse = styled.div`
  
`;

const About = () => {
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
        <ReadingDiv>
          <ReadingList ReadingTitle="Finished" BookList={[""]} />
          <ReadingList ReadingTitle="Reading" BookList={[""]} />
          <ReadingList ReadingTitle="To Read" BookList={[""]} />
        </ReadingDiv>
      </OtherContentDiv>
    </PageDiv>
  )
}

export default About;