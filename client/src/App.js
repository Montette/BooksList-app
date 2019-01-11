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
    isSelectedBookRemoving: false,
    isSelectedBookUpdating: false
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

  updateHandler = (id) => {
    this.setState({
      ...this.state,
      isSelectedBookUpdating: !this.state.isSelectedBookUpdating
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
            updateBook={this.updateHandler}
            />   
            : 
            <p>No book selected</p>}
            <BookForm updateBook={this.updateHandler} isUpdating={this.state.isSelectedBookUpdating} bookId={this.state.selectedBookId}/>
        </div>  
    );
  }
}

export default graphql(removeBookMutation, {name: "removeBookMutation"})(App)

