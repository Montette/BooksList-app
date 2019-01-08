import { gql } from 'apollo-boost';

const getBooksQuery = gql`
    {
        books {
            title
            id
          }
    }
`;

const getBookQuery = gql`
    query GetBook($id: ID!) {
        book(id: $id) {
            id
            title
            genre
            author {
                name
                books {
                    title
                    id
                }
            }
        }
    }

`;

const removeBookMutation = gql`
    mutation RemoveBook($id: ID!) {
        deleteBook(id: $id) {
            id
        }
    }
`;

const addBookMutation = gql`
    mutation AddBook($title: String!, $genre: String!, $authorId: ID!){
        addBook(title: $title, genre: $genre, authorId: $authorId){
            title
            id
        }
    }
`;

const updateBookMutation = gql`
    mutation UpdateBook($genre: String, $title: String, $id: ID!){
        updateBook(name: $name, genre: $genre, id: $id){
            name
            genre
            id
        }
    }
`;

export { getBooksQuery, getBookQuery, removeBookMutation, addBookMutation, updateBookMutation }