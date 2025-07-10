import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean,
} from 'graphql';
import AuthorService from '@services/authors.service.js';
import BookService from '@services/books.service.js';
import { BookType } from '@graphql/schema/book.schema.js';
import CreatedByUserType from '@graphql/schema/common.schema.js';

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        biography: { type: GraphQLString },
        born_date: { type: GraphQLString },
        created_by: { type: CreatedByUserType },
        books: {
            type: new GraphQLList(BookType),
            resolve: (parent, args) => BookService.getBooksByAuthor(parent)
        },
    }),
});

const AuthorPageType = new GraphQLObjectType({
    name: 'AuthorPage',
    fields: () => ({
        authors: { type: new GraphQLList(AuthorType) },
        total: { type: GraphQLInt },
    }),
});

const AuthorQueryFields = {
        authors: {
            type: AuthorPageType,
            args: {
                page: { type: GraphQLInt, defaultValue: 1 },
                pageSize: { type: GraphQLInt, defaultValue: 10 },
                name: { type: GraphQLString },
                birthYear: { type: GraphQLInt },
            },
            resolve: (_, args) => AuthorService.getAuthors(args)
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve: (_, args) => AuthorService.getAuthorById(args)
        },
    };


const AuthorMutationFields = {
        createAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                biography: { type: GraphQLString },
                born_date: { type: GraphQLString },
            },
            resolve: (_, args) => AuthorService.createAuthor(args)
        },
        updateAuthor: {
            type: AuthorType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                biography: { type: GraphQLString },
                born_date: { type: GraphQLString },
            },
            resolve: (_, args, context) => AuthorService.updateAuthor(context, args)
        },
        deleteAuthor: {
            type: GraphQLBoolean,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve: (_, args) => AuthorService.deleteAuthor(args)
        },
    };

export { AuthorQueryFields, AuthorMutationFields, AuthorType, AuthorPageType }; 