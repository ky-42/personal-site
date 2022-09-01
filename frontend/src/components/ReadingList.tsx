import React from "react";
import styled from "styled-components";

interface ReadingListProps {
  ReadingTitle: string,
  BookList: Array<string>
}

const ReadingListTitle = styled.h3`
  
`;

const UnorderedReading = styled.ul`
  
`;

const Book = styled.li`
  
`;

const ReadingList = ({ ReadingTitle, BookList }: ReadingListProps) => {
  return(
    <>
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
    </>
  )
}

export default ReadingList;