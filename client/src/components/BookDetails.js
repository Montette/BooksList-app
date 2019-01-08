import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { getBookQuery } from '../queries/queries';




// const BookDetails = (props) => {
//     return (
//         <Query query={getBookQuery} variables={{id: props.id}}>
//             {({ loading, error, data}) => {
//                 if(loading) return <p>Loading...</p>
//                 if(error) return <p>Error: {error.message}</p>
//                 // const bookDetails =
//                 //     <div>
//                 //     <h2>{ bookItem.title }</h2>
//                 //     <p>{ bookItem.genre }</p>
//                 //     <p>{ bookItem.author.name }</p>
//                 //     <p>All books by this author:</p>
//                 //     <ul className="other-books">
//                 //         { bookItem.author.books.map(item => {
//                 //             return <li key={item.id}>{ item.name }</li>
//                 //         })}
//                 //     </ul>
//                 // </div>
           

//                 return (
//                     <div>
//                     <h2>{ data.book.title }</h2>
//                     <p>{ data.book.genre }</p>
//                     <p>{ data.book.author.name }</p>
//                     <p>All books by this author:</p>
//                     <ul className="other-books">
//                         { data.book.author.books.map(item => {
//                             return <li key={item.id}>{ item.title }</li>
//                         })}
//                     </ul>
//                 </div>
//                 )
//             }}

//         </Query>
//     )
// };


class BookDetails extends React.Component {
    // state = {
    //     currentBookId: this.props.id
    // }


    // static getDerivedStateFromProps(props, state) {
    //     state.currentBookId= props.id; 
    //     return state
    //   }

    
    render () {
    return (
        <Query query={getBookQuery} variables={{id: this.props.id}}>
            {({ loading, error, data}) => {
                if(loading) return <p>Loading...</p>
                if(error) return <p>Error: {error.message}</p>
                return (
                    <div>
                    <h2>{ data.book.title }</h2>
                    <p>{ data.book.genre }</p>
                    <p>{ data.book.author.name }</p>
                    <p>All books by this author:</p>
                    <ul className="other-books">
                        { data.book.author.books.map(item => {
                            return <li key={item.id} onClick={() => this.props.changeSelectedBook(item.id)}>{ item.title }</li>
                        })}
                    </ul>
                    <button onClick={() => this.props.removeBook(data.book.id)}>Remove Book</button>
                </div>
                )
            }}
        </Query>
    )
    }
};

export default BookDetails