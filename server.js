const express = require('express')
const expressGraphQL = require('express-graphql')
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull

} = require('graphql')

const app = express()

const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]

const restaurants = [
	{ id: "1", name: 'Papillon' },
	{ id: "2", name: 'Tottes Restaurang' },
	{ id: "3", name: 'Verona' }
]

const menuItems = [
    { id: "1", name: 'Vesuvio', ingredients: 'Ost, Skinka', owner: "1" },
    { id: "2", name: 'Hawaii', ingredients: 'Ost, Skinka, Annanas', owner: "1" },
    { id: "3", name: 'Kebabtallrik', ingredients: 'Kebab, sallad, pommes', owner: "2" },
]

const restaurantType = new GraphQLObjectType({
    name: "Restaurant",
    description: "Get all restaurants",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLString)},
        name: { type: GraphQLNonNull(GraphQLString)},
        menuItems: {
            type: menuItemType,
            resolve: (restaurant) => {
                return menuItems.find(menuItems => menuItems.owner === restaurant.id)
            }
        }
    })
})

const menuItemType = new GraphQLObjectType({
    name: 'MenuItem',
    description: 'This represents a author of a menu item',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLString) } ,
        name: { type: GraphQLNonNull(GraphQLString) },
        ingredients: { type: GraphQLString },
        owner: { type: GraphQLString}
    })
})


const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'This represents a book',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) } ,
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLString) },
        author: { 
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents a author of a book',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) } ,
        name: { type: GraphQLNonNull(GraphQLString) },
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'query',
    description: 'Root Query',
    fields: () => ({
        books: {
            type: new GraphQLList(BookType),
            description: 'List of all books',
            resolve: () => books
        },
        restaurants: {
            type: new GraphQLList(restaurantType),
            description: 'ress desc',
            resolve: () => restaurants
        }
    })
})


const schema = new GraphQLSchema({
    query: RootQueryType
})


app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))

app.listen(5000, () => {
    console.log("Server running..");
})