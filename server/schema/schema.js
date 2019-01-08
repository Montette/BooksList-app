const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLID
} = graphql;


const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({ // it must be the function, otherwise it's throwing an error, that AuthorType is not defined, cause code is executed from the top to the bottom (changing order is not the solution, beacuse then, we will receive an error that BookType is not defined). Solution is writing it into the function, because on this stage this is only function declaration, we don't run it now, but later, when all variables are declared
        id: { type: GraphQLID},
        title: { type: GraphQLString},
        author: { 
            type: AuthorType,
            resolve(parent, args) { //this is nested object so parent is the book, where we have info about author id
                // return _.find(authors, {id: parent.authorId})
                return Author.findById(parent.authorId);
            }
        },
        genre: { type: GraphQLString},

    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID},
        name: { type: GraphQLString},
        age: { type: GraphQLInt },
        books: { 
            type: GraphQLList(BookType),
            resolve(parent, args) {
                // return parent.booksId.map(bookId => {
                //     return _.find(books, {id: bookId})
                // });
                return Book.find({authorId: parent.id})
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
            //    return _.find(books, {id: args.id})
                return Book.findById(args.id)
            }
        },
        books: {
            type: GraphQLList(BookType),
            resolve() {
                // return books
                return Book.find({})
            }
        },
        author: {
            type: AuthorType,
            args: {
                id: {type: GraphQLID}
            },
            resolve(parent, args) {
                // return _.find(authors, {id: args.id})
                return Author.findById(args.id)
            }
        },
        authors: {
            type: GraphQLList(AuthorType),
            resolve(parent, args) {
                // return authors
                return Author.find({})
            }
        },

    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString)},
                age: { type: new GraphQLNonNull(GraphQLInt)},
            },
            resolve(parent, args){
                let author = new Author({ //create instance of the data type from model
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString)},
                genre: { type: new GraphQLNonNull(GraphQLString)},
                authorId: { type: new GraphQLNonNull(GraphQLID)},
            },
            resolve(parent, args) {
                let book = new Book({
                    title: args.title,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save()
            }
        },
        deleteBook: {
            type: BookType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
               return Book.findByIdAndDelete(args.id)
            }
        },
        updateBook: {
            type: BookType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID )},
                title: { type: GraphQLString},
                genre: { type: GraphQLString},
            },
            resolve(parent, args) {
                let book;
                function changeValue(k) {
                    book = Book.findByIdAndUpdate(args.id, {[k]: args[k]});
                }
                Object.keys(args).filter(key => key !== 'id' && args[key] !== null).forEach(k => changeValue(k));
                return book;
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})