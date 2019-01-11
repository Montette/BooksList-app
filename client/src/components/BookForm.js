import * as React from 'react';
import gql from 'graphql-tag';
import { addBookMutation, updateBookMutation, getBooksQuery, getAuthorsQuery, addAuthorMutation  } from '../queries/queries'
import { graphql, compose } from 'react-apollo';
import { Mutation } from 'react-apollo';




class BookForm extends React.Component {
    state = {
       newBook: {
        bookTitle: '',
        bookAuthor: '',
        bookGenre: ''
       },
       newAuthor: {
           authorName: ''
       },
       addingAuthor: false
    }

    addNewAuthor = (event) => {
        const newAuthor = {...this.state.newAuthor};
        newAuthor[event.target.name] = event.target.value
        this.setState({
            ...this.state,
            newAuthor
        });
    }

    setBookValue = (event) => {
        const newBook = {...this.state.newBook};
        newBook[event.target.name] = event.target.value;
        this.setState({
            ...this.state,
            newBook      
        });

        if(event.target.name === 'bookAuthor') {
            let addingAuthor= event.target.value === 'New author' ? true : false;
            this.setState({
                ...this.state,
                addingAuthor
            })
        }
    }

    resetState = () => {
        const initialState = {
            newBook: {
                bookTitle: '',
                bookAuthor: '',
                bookGenre: ''
               },
               newAuthor: {
                   authorName: ''
               },
               addingAuthor: false
        };
        this.setState(initialState);
    }

    submitBook = (event) => {
        event.preventDefault();

        if(this.state.addingAuthor) {
            
            this.props.addAuthorMutation({
                variables: {
                    name: this.state.newAuthor.authorName
                },
                refetchQueries: [{ query: getAuthorsQuery }]
            })
            .then((resp, error) => {
                this.props.addBookMutation({
                    variables: {
                        title: this.state.newBook.bookTitle,
                        genre: this.state.newBook.bookGenre,
                        authorId: resp.data.addAuthor.id
                    },
                    refetchQueries: [{ query: getBooksQuery }]
        });

            })
            .then(() => this.resetState());
    
        } else {
        this.props.addBookMutation({
            variables: {
                title: this.state.newBook.bookTitle,
                genre: this.state.newBook.bookGenre,
                authorId: this.state.newBook.bookAuthor
            },
            refetchQueries: [{ query: getBooksQuery }]
        })
        .then(() => this.resetState());
    };

    }

    displayAuthors() {
        const data = this.props.getAuthorsQuery;
        if(data.loading) {
            return (<option disabled>Loading authors...</option>)
        } else {
            return data.authors.map(author => {
                return( <option key = {author.id} value={author.id}>{author.name}</option>)
            })
        }
    }
    render() {
        return (
            <form onSubmit={this.submitBook}>
                <input name="bookTitle" onChange={this.setBookValue} placeholder="book name" value={this.state.newBook.bookTitle}></input>
                <select name="bookAuthor" onChange={this.setBookValue}>
                    <option>Select author</option>
                    {this.displayAuthors()}
                    <option>New author</option>
                </select>
                {this.state.addingAuthor && <input type="text" name="authorName" onChange={this.addNewAuthor}></input>}
                <input name="bookGenre" onChange={this.setBookValue} placeholder="book genre" value={this.state.newBook.bookGenre}></input>
                <button type="submit">Add book</button>
            </form>
        )
    }
}

export default compose(
    graphql(getAuthorsQuery, { name: "getAuthorsQuery" }),
    graphql(addBookMutation, { name: "addBookMutation" }),
    graphql(addAuthorMutation, { name: "addAuthorMutation" })
)(BookForm);