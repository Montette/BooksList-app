import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { getBookQuery } from '../queries/queries';




const BookDetails = (props) => (
        <Query query={getBookQuery} variables={{id: props.id}}>
            {({ loading, error, data}) => {
                if(loading) return <p>Loading...</p>
                if(error) return <p>Error: {error.message}</p>
                return (
                    <div>
                    <h2>{ data.book.title }</h2>
                    <p>Genre: { data.book.genre }</p>
                    <p>Author: { data.book.author.name }</p>
                    <p>All books by this author:</p>
                    <ul className="other-books">
                        { data.book.author.books.map(item => {
                            return <li key={item.id} onClick={() => props.changeSelectedBook(item.id)}>{ item.title }</li>
                        })}
                    </ul>
                    <button onClick={() => props.removeBook(data.book.id)}>Remove Book</button>
                    <button onClick={() => props.updateBook(data.book.id)}>Update Book</button>
                </div>
                )
            }}
        </Query>
  )

export default BookDetails