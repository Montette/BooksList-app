import * as React from 'react';
import gql from 'graphql-tag';
import { addBookMutation, updateBookMutation, getBooksQuery  } from '../queries/queries'
import { graphql } from 'react-apollo';
import { Mutation } from 'react-apollo';



const BookForm = (props) => {
    let nameInput;
    let genreInput;
    let mutationName = props.mut === 'update'? updateBookMutation : addBookMutation;
    // let queryName = props.mut === 'update'? addBook : addBookMutation;
    return (
            <Mutation
            mutation={mutationName}>
            {(addBook, { data }) => (
                <div>
                    <form onSubmit={e => {
                        e.preventDefault();
                        addBook({variables: { title: nameInput.value, genre: genreInput.value, authorId: '5c325ed457ba82d72090d9c0'}, refetchQueries: [{ query: getBooksQuery }]});
                        nameInput.value = '';
                        genreInput.value = ''
                    }}>
                    <input placeholder="book name"
                    ref={node => {
                        nameInput = node;
                    }}>
                    </input>
                    <input placeholder="book genre"
                    ref={node => {
                        genreInput = node;
                    }}>
                    </input>
                    <button type="submit">Add book</button>

                    </form>
                </div>
            )

            }
            </Mutation>
       
    )
};

export default BookForm