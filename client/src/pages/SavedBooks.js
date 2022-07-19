import React from 'react';
import { useQuery, useMutation } from '@apollo/client';

import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import { REMOVE_BOOK } from '../utils/mutations';
import { ME } from '../utils/queries';

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const { loading: userLoading, data: userData } = useQuery(ME);

  const [removeBook] = useMutation(REMOVE_BOOK);

  const token = Auth.loggedIn() ? Auth.getToken() : null;
  if (!token) return false;

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    try {
      removeBook({ variables: { bookId: bookId } });

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (userLoading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>{userData.me.bookCount ? `Viewing ${userData.me.bookCount} saved ${userData.me.bookCount === 1 ? 'book' : 'books'}:` : 'You have no saved books!'}</h2>
        <CardColumns>
          {userData.me.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border="dark">
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant="top" /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className="btn-block btn-danger" onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
