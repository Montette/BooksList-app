import React, { Component } from 'react';
import BookList from './components/BookList';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import './App.css';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
})


class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="container">
          <BookList />
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
