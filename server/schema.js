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

const books = [
    { title: 'Name of the Wind', genre: 'Fantasy', id: '1' },
    { title: 'The Final Empire', genre: 'Fantasy', id: '2' },
    { title: 'The Long Earth', genre: 'Sci-Fi', id: '3' },
];

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID},
        title: { type: GraphQLString},
        author: { type: GraphQLString},
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
        books: { type: GraphQLList(BookType)},

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
                //get data from db/other source
            }
        },
        authors: {
            type: GraphQLList(AuthorType),
            resolve(parent, args) {
                //get data from db/other source
            }
        },

    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})