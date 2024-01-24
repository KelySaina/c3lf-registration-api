import { GraphQLNonNull, GraphQLBoolean, GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";

export const MembersType: GraphQLObjectType = new GraphQLObjectType({
  name: "Members",
  fields: () => ({
    id: { type: GraphQLInt },
    username: {type: GraphQLString},
    matricule: {type: new GraphQLNonNull(GraphQLString)},
    level: {type: GraphQLString},
    paid: {type: GraphQLBoolean},
    year: {type: GraphQLString},
    imgUrl: {type: GraphQLString},
    age: {type: GraphQLInt},
    token : {type: GraphQLString},
    member: {type : MembersType}
  }),
});

