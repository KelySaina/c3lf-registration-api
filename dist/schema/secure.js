"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secureSchema = void 0;
const graphql_1 = require("graphql");
const MemebersQuery_1 = require("./Members/Query/MemebersQuery");
const MemebersMutation_1 = require("./Members/Mutations/MemebersMutation");
const RootQuery = new graphql_1.GraphQLObjectType({
    name: "RootQuery",
    fields: {
        getAllMembers: MemebersQuery_1.GET_ALL_MEMBERS,
        getMembersByLevel: MemebersQuery_1.GET_MEMBERS_BY_LEVEL,
        getMemberByMatricule: MemebersQuery_1.GET_MEMBER_BY_MATRICULE
    },
});
const Mutation = new graphql_1.GraphQLObjectType({
    name: "Mutation",
    fields: {
        updateMemberByMatricule: MemebersMutation_1.UPDATE_MEMBER_BY_MATRICULE,
        deleteMemberByMAtricule: MemebersMutation_1.DELETE_MEMBER_BY_MATRICULE,
    },
});
exports.secureSchema = new graphql_1.GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});
