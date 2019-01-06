const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema.js');
const mongoose = require('mongoose');

mongoose.connect('mongodb://Monika:test123@ds149914.mlab.com:49914/book-list');
mongoose.connection.once('open', () => {
    console.log('connected to database');
})

const app = express();

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('server is running on port 4000')
})
