import React from "react";
import styled from "styled-components";

interface ReadingListProps {
  ReadingTitle: string,
  BookList: Array<string>
}

const ReadingListContainer = styled.div`
`;

const ReadingListTitle = styled.h3`
  
`;

const UnorderedReading = styled.ul`
  width: 400px;
  height: 400px;
  overflow: hidden;
  overflow-y: scroll;
  padding: 0px;
  text-align: center;
  border: 5px solid white;
`;

const Book = styled.li`
  list-style-type: none;
  margin-top: 20px;
  margin-bottom: 20px;
  width: 300px;
  height: 75px;
  border: 5px solid white;
  display: inline-block;
`;

const ReadingList = ({ ReadingTitle, BookList }: ReadingListProps) => {
  return(
    <ReadingListContainer>
      <ReadingListTitle>
        {ReadingTitle}
      </ReadingListTitle>
      <UnorderedReading>
        {
          BookList.map((BookTitle) => 
            <Book>
              {BookTitle}
            </Book>
          )
        }
      </UnorderedReading>
    </ReadingListContainer>
  )
}

export default ReadingList;