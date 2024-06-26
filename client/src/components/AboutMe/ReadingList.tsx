import styled from 'styled-components';

/* -------------------------- General CSS elements -------------------------- */

const ListContainer = styled.div`
  width: 48rem;
  text-align: center;
`;

const ListTitle = styled.h3``;

const UnorderedReading = styled.ul`
  padding: 0;
  margin: 0;
`;

/* ------------------------ In reading list elements ------------------------ */

const Book = styled.li`
  margin: 1rem 0;
  list-style-type: none;
  // Used to respect top and bottom margin/padding
  display: inline-block;
`;

const ListSeparator = styled.hr``;

/* -------------------------------------------------------------------------- */

interface ReadingListProps {
  ReadingTitle: string;
  BookList: Array<string>;
}

const ReadingList = ({ ReadingTitle, BookList }: ReadingListProps) => {
  // Creates a list of book elements from a list of titles
  const BookListElements = BookList.map((BookTitle, index) => <Book key={index}>{BookTitle}</Book>);

  // Adds list separators between all list elements
  BookListElements.forEach((_, index) => {
    BookListElements.splice(index * 2 + 1, 0, <ListSeparator key={10000 - index} />);
  });

  // Removes the extra list separator at the end of the list of elements
  BookListElements.pop();

  return (
    <ListContainer>
      <ListTitle>{ReadingTitle}</ListTitle>
      <UnorderedReading>
        {/* Unpacks list with book elements and hr's */}
        {BookListElements}
      </UnorderedReading>
    </ListContainer>
  );
};

export default ReadingList;
