import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const GET_BOOKS = gql`
 {
    books {
        title
        id
      }
 }
`

class BookList extends Component {
  render() {
    return (

        <Query query={GET_BOOKS}>
            {({ loading, error, data}) => {
                if (loading) return "Loading...";
                if (error) return `Error! ${error.message}`;
                const books = data.books.map(book => (
                    <li key={book.id}>{book.title}</li>
                ));

                return (
                    <div className="">
                        <ul id='book-list'>
                        
                            {books}
                        </ul>
                    </div>
                )
            }}
         

        </Query>
    );
  }
}

export default BookList