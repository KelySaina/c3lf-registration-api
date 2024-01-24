"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const graphql_1 = require("graphql");
const MemebersQuery_1 = require("./Members/Query/MemebersQuery");
const MemebersMutation_1 = require("./Members/Mutations/MemebersMutation");
const RootQuery = new graphql_1.GraphQLObjectType({
    name: "RootQuery",
    fields: {
        getMemberByMatricule: MemebersQuery_1.GET_MEMBER_BY_MATRICULE
    },
});
const Mutation = new graphql_1.GraphQLObjectType({
    name: "Mutation",
    fields: {
        registerMember: MemebersMutation_1.REGISTER_MEMBER,
        loginMember: MemebersMutation_1.LOGIN_MEMBER
    },
});
exports.schema = new graphql_1.GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});
