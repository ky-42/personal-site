import React from "react";
import styled from "styled-components";

interface ReadingListProps {
  ReadingTitle: string,
  BookList: Array<string>
}

const ReadingListContainer = styled.div`
  width: 480px;
  max-width: 480px;
  flex-shrink: 0;
  @media (max-width: 700px) {
    flex-shrink: 1;
    min-width: 0;
    width: auto;
  }
`;

const ReadingListTitle = styled.h3`
  text-align: center;
  text-decoration: underline ${props => props.theme.highlightDark} 0.1rem;
  text-underline-offset: 0.3rem;
`;

const UnorderedReading = styled.ul`
  text-align: center;
  padding: 0;
`;

const Book = styled.li`
  list-style-type: none;
  margin-top: 10px;
  margin-bottom: 10px;
  display: inline-block;
`;

const ListSeparator = styled.hr`
  
`;

const ReadingList = ({ ReadingTitle, BookList }: ReadingListProps) => {
  let BookListElements = BookList.map((BookTitle, index) => 
    <Book key={index}>
      {BookTitle}
    </Book>
  );

  // Adds hrs between all list elements
  BookListElements.forEach((_, index) => {
    BookListElements.splice((index*2)+1, 0, <ListSeparator key={10000-index}/>)
  });

  // Removes the extra hr at the end
  BookListElements.pop();
  
  return(
    <ReadingListContainer>
      <ReadingListTitle>
        {ReadingTitle}
      </ReadingListTitle>
      <UnorderedReading>
        {
          BookListElements
        }
      </UnorderedReading>
    </ReadingListContainer>
  )
}

export default ReadingList;