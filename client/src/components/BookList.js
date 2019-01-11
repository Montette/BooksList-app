import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { getBooksQuery } from '../queries/queries';




const BookList = (props) => (
        <Query query={getBooksQuery}>
            {({ loading, error, data}) => {
                if (loading) return "Loading...";
                if (error) return `Error! ${error.message}`;
                const books = data.books.map(book => (
                    <li key={book.id} onClick={()=> props.selectBook(book.id)}>{book.title}</li>
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
)

export default BookList