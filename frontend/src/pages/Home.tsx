import React from 'react';
import styled from 'styled-components';

// ------------------
// Overall Containers
// ------------------

const HomeContainer = styled.div`

`;

const SpaceShipSpace = styled.div`
    
`;

const HomeMainContent = styled.div`

`;

// ----------------
// About me section
// ----------------

const AboutMeSection = styled.section`
    
`;

const AboutMeHeader = styled.h2`
    
`;

const AboutMeBody = styled.p`
    
`;

// ---------------
// Content section 
// ---------------

const ContentContainer = styled.div`
    
`;

// Project Section
const ProjectSection = styled.section`
    
`;

const ProjectHeader = styled.h2`
    
`;

// Blog Section
const  BlogSection = styled.section`
    
`;

const BlogHeader = styled.h2`
    
`;

const HomePage = () => {
    return (
        <HomeContainer>
            <SpaceShipSpace />
            <HomeMainContent>
                <AboutMeSection>
                    <AboutMeHeader>
                        About Me             
                    </AboutMeHeader>
                    <AboutMeBody>
                        {/* TODO Write about me body text  */}
                    </AboutMeBody>
                </AboutMeSection>
                <ContentContainer>
                    <ProjectSection>
                        <ProjectHeader>
                            Recent Projects
                        </ProjectHeader>
                        {/* TODO Add content list component here*/}
                    </ProjectSection>
                    <BlogSection>
                        <BlogHeader>
                            Recent Blogs
                        </BlogHeader>
                        {/* TODO Add content list component here*/}
                    </BlogSection>
                </ContentContainer>
            </HomeMainContent>
        </HomeContainer>
    );
}

export default HomePage;