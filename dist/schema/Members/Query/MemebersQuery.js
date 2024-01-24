"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_MEMBERS_BY_LEVEL = exports.GET_MEMBER_BY_MATRICULE = exports.GET_ALL_MEMBERS = void 0;
const graphql_1 = require("graphql");
const MembersType_1 = require("../Types/MembersType");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.GET_ALL_MEMBERS = {
    type: new graphql_1.GraphQLList(MembersType_1.MembersType),
    async resolve(parent, args) {
        try {
            return await prisma.members.findMany();
        }
        catch (error) {
            console.error('Error retrieving Members:', error);
            throw new Error('Internal server error');
        }
    }
};
exports.GET_MEMBER_BY_MATRICULE = {
    type: MembersType_1.MembersType,
    args: {
        matricule: { type: graphql_1.GraphQLString }
    },
    async resolve(parent, args) {
        try {
            const { matricule } = args;
            return await prisma.members.findUnique({
                where: {
                    matricule: matricule
                }
            });
        }
        catch (error) {
            console.error('Error retrieving Members:', error);
            throw new Error('Internal server error');
        }
    }
};
exports.GET_MEMBERS_BY_LEVEL = {
    type: new graphql_1.GraphQLList(MembersType_1.MembersType),
    args: {
        level: { type: graphql_1.GraphQLString }
    },
    async resolve(parent, args) {
        try {
            const { level } = args;
            return await prisma.members.findMany({
                where: {
                    level: level
                }
            });
        }
        catch (error) {
            console.error('Error retrieving Members:', error);
            throw new Error('Internal server error');
        }
    }
};
