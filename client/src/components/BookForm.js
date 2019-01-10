import * as React from 'react';
import gql from 'graphql-tag';
import { addBookMutation, updateBookMutation, getBooksQuery, getAuthorsQuery, addAuthorMutation  } from '../queries/queries'
import { graphql, compose } from 'react-apollo';
import { Mutation } from 'react-apollo';



// const BookForm = (props) => {
//     let nameInput;
//     let genreInput;
//     let mutationName = props.mut === 'update'? updateBookMutation : addBookMutation;
//     // let queryName = props.mut === 'update'? addBook : addBookMutation;
//     return (
//             <Mutation
//             mutation={mutationName}>
//             {(addBook, { data }) => (
//                 <div>
//                     <form onSubmit={e => {
//                         e.preventDefault();
//                         addBook({variables: { title: nameInput.value, genre: genreInput.value, authorId: '5c325ed457ba82d72090d9c0'}, refetchQueries: [{ query: getBooksQuery }]});
//                         nameInput.value = '';
//                         genreInput.value = ''
//                     }}>
//                     <input placeholder="book name"
//                     ref={node => {
//                         nameInput = node;
//                     }}>
//                     </input>
//                     <input placeholder="book genre"
//                     ref={node => {
//                         genreInput = node;
//                     }}>
//                     </input>
//                     <button type="submit">Add book</button>

//                     </form>
//                 </div>
//             )

//             }
//             </Mutation>
       
//     )
// };

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

        // this.props.addAuthorMutation({
        //     variables: {
        //         name: event.target.value
        //     },
        //     refetchQueries: [{ query: getAuthorsQuery }]
        // });


    }

    setBookValue = (event) => {

        const newBook = {...this.state.newBook};

        // const newBook = {
        //     [event.target.name]: event.target.value
        // }

        newBook[event.target.name] = event.target.value;

        let isNewAuthor;
        if(event.target.value === 'New author') {
            isNewAuthor = true;
        } else if (event.target.name === 'bookAuthor' && event.target.value !== 'New author') {
            isNewAuthor = false
        };

    
        this.setState({
            ...this.state,
            newBook,
            addingAuthor: isNewAuthor
            
        });



        // let isNewAuthor;
        // if(event.target.value === 'New author') {
        //     isNewAuthor = true;
        // } else {
        //     isNewAuthor = false
        // };

        // this.setState({
        //     ...this.state,
        //     newAuthor: {
        //         addNewAuthor: isNewAuthor
        //     }
        // })
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
                // update: (proxy, data) => {
                //     console.log(proxy);
                //     console.log(data)
                // }
            })
            .then((resp, error) => {
                console.log(resp);
                console.log(error);

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
            console.log('else');
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
                {/* <input  name="bookAuthor" onChange={this.setBookValue} placeholder="book author"></input> */}
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