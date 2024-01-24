"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembersType = void 0;
const graphql_1 = require("graphql");
exports.MembersType = new graphql_1.GraphQLObjectType({
    name: "Members",
    fields: () => ({
        id: { type: graphql_1.GraphQLInt },
        username: { type: graphql_1.GraphQLString },
        matricule: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        level: { type: graphql_1.GraphQLString },
        paid: { type: graphql_1.GraphQLBoolean },
        year: { type: graphql_1.GraphQLString },
        imgUrl: { type: graphql_1.GraphQLString },
        age: { type: graphql_1.GraphQLInt },
        token: { type: graphql_1.GraphQLString },
        member: { type: exports.MembersType }
    }),
});
