const graphql = require('graphql');
const _ = require('lodash')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLID
} = graphql;

var books = [
    { title: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1'},
    { title: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
    { title: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
    { title: 'Test Books', genre: 'Sci-Fi', id: '4', authorId: '1' },
    { title: 'Test2 Books', genre: 'Sci-Fi', id: '5', authorId: '3' },
    { title: 'Test3 Books', genre: 'Sci-Fi', id: '6', authorId: '2' },
    { title: 'Test4 Books', genre: 'Sci-Fi', id: '7', authorId: '1' }
];


const authors = [
    { name: 'Patrick Rothfuss', age: 44, id: '1', booksId: ["1", "4", "7"] },
    { name: 'Brandon Sanderson', age: 42, id: '2', booksId: ["2", "6"] },
    { name: 'Terry Pratchett', age: 66, id: '3', booksId: ["3", "5"]  }
];

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({ // it must be the function, otherwise it's throwing an error, that AuthorType is not defined, cause code is executed from the top to the bottom (changing order is not the solution, beacuse then, we will receive an error that BookType is not defined). Solution is writing it into the function, because on this stage this is only function declaration, we don't run it now, but later, when all variables are declared
        id: { type: GraphQLID},
        title: { type: GraphQLString},
        author: { 
            type: AuthorType,
            resolve(parent, args) { //this is nested object so parent is the book, where we have info about author id
                return _.find(authors, {id: parent.authorId})
            }
        },
        genre: { type: GraphQLString},
        description: { type: GraphQLString},

    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID},
        name: { type: GraphQLString},
        surname: { type: GraphQLString},
        books: { 
            type: GraphQLList(BookType),
            resolve(parent, args) {
                return parent.booksId.map(bookId => {
                    return _.find(books, {id: bookId})
                });
            }
        },

    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: {
                id: {type: GraphQLID}
            },
            resolve(parent, args) {
               return _.find(books, {id: args.id})
            }
        },
        books: {
            type: GraphQLList(BookType),
            resolve() {
                return books
            }
        },
        author: {
            type: AuthorType,
            args: {
                id: {type: GraphQLID}
            },
            resolve(parent, args) {
                return _.find(authors, {id: args.id})
            }
        },
        authors: {
            type: GraphQLList(AuthorType),
            resolve(parent, args) {
                return authors
            }
        },

    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})