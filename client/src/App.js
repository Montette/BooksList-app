import React, { Component } from 'react';
import BookList from './components/BookList';
import BookDetails from './components/BookDetails';
import { getBooksQuery, removeBookMutation } from './queries/queries';
import { graphql } from 'react-apollo';
import BookForm from './components/BookForm'

import './App.css';


class App extends Component {

  state = {
    selectedBookId: null,
    isSelectedBookRemoving: false
  }

  selectBookHandler = (id) => {
    this.setState({
      ...this.state,
      isSelectedBookRemoving: false,
      selectedBookId: id
    })
  }

  removeHandler = (id) => {
    this.props.removeBookMutation({
      variables: {
        id
      },
      refetchQueries: [{ query: getBooksQuery }]
    });
    this.setState({
      ...this.state,
      isSelectedBookRemoving: true
    })
  }
  render() {
    return (
        <div className="container">
          <BookList selectBook={this.selectBookHandler}/>
        
          {this.state.selectedBookId && this.state.isSelectedBookRemoving === false? 
          <BookDetails 
            id ={this.state.selectedBookId} 
            changeSelectedBook = {this.selectBookHandler} 
            removeBook={this.removeHandler}
            />   
            : 
            <p>No book selected</p>}
            <BookForm mut='updagggte'/>
        </div>  
    );
  }
}

export default graphql(removeBookMutation, {name: "removeBookMutation"})(App)

