const graphql = require('graphql')
const _ = require('lodash')
const { 
    GraphQLObjectType,
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql

const bookModel = require('../models/book')
const authorModel = require('../models/author')

var _books = [
    { name: '1984', genre: 'novel', id: '1', authorId: '1'},
    { name: 'Kafka on the Shore', genre: 'novel', id: '2', authorId: '2'},
    { name: 'Zero to One', genre: 'Non-fiction', id: '3', authorId: '3'},
    { name: 'Rework', genre: 'Non-fiction', id: '4', authorId: '4'},
    { name: 'Animal Farm', genre: 'Novella', id: '5', authorId: '1'}
]

var _authors = [
    { name: 'George Orwell', age: 44, id: '1'},
    { name: 'Haruki Murakami', age: 55, id: '2'},
    { name: 'Peter Thiel', age: 33, id: '3'},
    { name: 'Heinemeier Hansson', age: 54, id: '4'},
    { name: 'Jason Fried', age: 65, id: '5'}
]

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { 
            type: GraphQLID
        },
        name: { 
            type: GraphQLString
        },
        genre: { 
            type: GraphQLString
        },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return authorModel.getAuthor(parent.authorId)
            }
        }
    })
})


const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { 
            type: GraphQLID
        },
        name: { 
            type: GraphQLString
        },
        age: { 
            type: GraphQLInt
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                console.log(parent)
                return bookModel.getBooksByAuthor(parent.id)
            }
        }
    })
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) },
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                return createNewBook({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId,
                    id: args.id
                })
            }
        },
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                return createNewAuthor({
                    name: args.name,
                    age: args.age,
                    id: args.id
                })
            }
        }
    }
})


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: {
                id: { 
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                // code to get data from DB
                return bookModel.getBook(args.id)
            }
        },
        author: {
            type: AuthorType,
            args: {
                id: { 
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                // code to get data from DB
                return authorModel.getAuthor(parent.authorId)
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // code to get data from DB
                return bookModel.getBooks()
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                // code to get data from DB
                return authorModel.getAuthors()
            }
        }
    }
})

async function createNewBook(props) {
  const node = await bookModel.createBook(props);

//   const nodes = await neo4jModel.getNodesByLabel('Person');
//   console.log('Nodes with label "Person":', nodes);

  return node
}

async function createNewAuthor(props) {
    const node = await authorModel.createAuthor(props);
  
  //   const nodes = await neo4jModel.getNodesByLabel('Person');
  //   console.log('Nodes with label "Person":', nodes);

    return node
}


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})

