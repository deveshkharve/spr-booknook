import {
    GraphQLObjectType,
    GraphQLSchema,
} from 'graphql';
import { AuthorQueryFields, AuthorMutationFields } from '@graphql/schema/author.schema.js';
import { BookMutationFields, BookQueryFields } from '@graphql/schema/book.schema.js';


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        ...AuthorQueryFields,
        ...BookQueryFields,
    },
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        ...AuthorMutationFields,
        ...BookMutationFields,
    },
});

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});

export default schema; 