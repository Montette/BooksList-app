import * as React from 'react';
import gql from 'graphql-tag';
import { addBookMutation, updateBookMutation, getBooksQuery, getAuthorsQuery, addAuthorMutation, getBookQuery  } from '../queries/queries'
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

    setAuthorValue= (event) => {
        console.log(event.target.value);
        const newAuthor = {...this.state.newAuthor};
        newAuthor[event.target.name] = event.target.value
        this.setState({
            ...this.state,
            newAuthor
        });
    }

    setBookValue = (event) => {

        let addingAuthor = false;

        
        if(event.target.name === 'bookAuthor') {
            addingAuthor= event.target.value === 'New author' ? true : false;
        }


        const newBook = {...this.state.newBook};
        newBook[event.target.name] = event.target.value;
        this.setState({
            ...this.state,
            newBook,
            addingAuthor      
        });

        // if(event.target.name === 'bookAuthor') {
        //     let addingAuthor= event.target.value === 'New author' ? true : false;
        //     this.setState({
        //         newBook: {
        //             ...this.state.newBook
        //         },
        //         addingAuthor
        //     })
        // }
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

    addNewAuthor = () => {

       return this.props.addAuthorMutation({
            variables: {
                name: this.state.newAuthor.authorName
            },
            refetchQueries: [{ query: getAuthorsQuery }]
        })
    }

    addNewBook = (newAuthorId) => {
        this.props.addBookMutation({
            variables: {
                title: this.state.newBook.bookTitle,
                genre: this.state.newBook.bookGenre,
                authorId: newAuthorId ? newAuthorId : this.state.newBook.bookAuthor
            },
            refetchQueries: [{ query: getBooksQuery }]
        })
        .then(() => this.resetState())
    }

    updateBook = (newAuthorId) => {
        this.props.updateBookMutation({
            variables: {
                id: this.props.bookId,
                title: this.state.newBook.bookTitle,
                genre: this.state.newBook.bookGenre,
                authorId: newAuthorId ? newAuthorId : this.state.newBook.bookAuthor
            },
            refetchQueries: [{ query: getBookQuery, variables: ({id: this.props.bookId}) }]
        })
        .then(() => {
            this.resetState();
            this.props.updateBook()
        })
    }

    submitBook = (event) => {
        event.preventDefault();


        if(this.props.isUpdating) {

            if(this.state.addingAuthor) {
                this.addNewAuthor()
                .then((resp) => {
                    this.updateBook(resp.data.addAuthor.id)
                })
            } else {
                this.updateBook()
            }
            
        } else {

            if(this.state.addingAuthor) {
                this.addNewAuthor()
                    .then((resp) => {
                        this.addNewBook(resp.data.addAuthor.id)
                    })
            } else {
                this.addNewBook()
            }
            
        }



    //     if(this.state.addingAuthor) {
            
    //         this.props.addAuthorMutation({
    //             variables: {
    //                 name: this.state.newAuthor.authorName
    //             },
    //             refetchQueries: [{ query: getAuthorsQuery }]
    //         })
    //         .then((resp, error) => {
    //             this.props.addBookMutation({
    //                 variables: {
    //                     title: this.state.newBook.bookTitle,
    //                     genre: this.state.newBook.bookGenre,
    //                     authorId: resp.data.addAuthor.id
    //                 },
    //                 refetchQueries: [{ query: getBooksQuery }]
    //     });

    //         })
    //         .then(() => this.resetState());
    
    //     } else {

    //         if(this.props.isUpdating) {

    //             this.props.updateBookMutation({
    //                 variables: {
    //                     id: this.props.bookId,
    //                     title: this.state.newBook.bookTitle,
    //                     genre: this.state.newBook.bookGenre,
    //                 }
    //             })
    //             .then(() => this.resetState())
    //         } else {


    //             this.props.addBookMutation({
    //                 variables: {
    //                     title: this.state.newBook.bookTitle,
    //                     genre: this.state.newBook.bookGenre,
    //                     authorId: this.state.newBook.bookAuthor
    //                 },
    //                 refetchQueries: [{ query: getBooksQuery }]
    //             })
    //             .then(() => this.resetState());
    //         }
    // };

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
                {this.state.addingAuthor && <input type="text" name="authorName" onChange={this.setAuthorValue}></input>}
                <input name="bookGenre" onChange={this.setBookValue} placeholder="book genre" value={this.state.newBook.bookGenre}></input>
                <button type="submit">{this.props.isUpdating ? 'Update Book' : 'Add new Book'}</button>
            </form>
        )
    }
}

export default compose(
    graphql(getAuthorsQuery, { name: "getAuthorsQuery" }),
    graphql(addBookMutation, { name: "addBookMutation" }),
    graphql(addAuthorMutation, { name: "addAuthorMutation" }),
    graphql(updateBookMutation, { name: "updateBookMutation" })
)(BookForm);