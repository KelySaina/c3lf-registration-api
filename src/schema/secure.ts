import { GraphQLObjectType, GraphQLSchema } from "graphql"
import { GET_ALL_MEMBERS, GET_MEMBERS_BY_LEVEL, GET_MEMBER_BY_MATRICULE } from "./Members/Query/MemebersQuery";
import { REGISTER_MEMBER, UPDATE_MEMBER_BY_MATRICULE, DELETE_MEMBER_BY_MATRICULE, LOGIN_MEMBER } from "./Members/Mutations/MemebersMutation";

const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    fields:{
        getAllMembers : GET_ALL_MEMBERS,
        getMembersByLevel: GET_MEMBERS_BY_LEVEL,
        getMemberByMatricule: GET_MEMBER_BY_MATRICULE
    },
})

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        updateMemberByMatricule: UPDATE_MEMBER_BY_MATRICULE,
        deleteMemberByMAtricule: DELETE_MEMBER_BY_MATRICULE,
    },
})


export const secureSchema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});