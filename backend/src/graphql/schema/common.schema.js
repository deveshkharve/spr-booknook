import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
} from 'graphql';

const CreatedByUserType = new GraphQLObjectType({
    name: "CreatedByUser",
    fields: {
        id: { type: GraphQLID },
        username: { type: GraphQLString }
    }
});

export default CreatedByUserType;