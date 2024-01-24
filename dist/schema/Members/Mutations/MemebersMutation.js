"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOGIN_MEMBER = exports.DELETE_MEMBER_BY_MATRICULE = exports.UPDATE_MEMBER_BY_MATRICULE = exports.REGISTER_MEMBER = void 0;
const graphql_1 = require("graphql");
const MembersType_1 = require("../Types/MembersType");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
exports.REGISTER_MEMBER = {
    type: MembersType_1.MembersType,
    args: {
        username: { type: graphql_1.GraphQLString },
        matricule: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        level: { type: graphql_1.GraphQLString },
        age: { type: graphql_1.GraphQLInt }
    },
    async resolve(parent, args, res) {
        try {
            const { username, matricule, level, age } = args;
            // Check if the matricule is already registered
            const existingMember = await prisma.members.findUnique({
                where: { matricule },
            });
            if (existingMember) {
                throw new Error("Matricule already a member");
            }
            // If not registered, proceed with creating the new member
            const paid = false;
            const year = new Date().getFullYear().toString();
            const imgUrl = '';
            const member = await prisma.members.create({
                data: {
                    username,
                    matricule,
                    level,
                    age,
                    paid,
                    year,
                    imgUrl,
                },
            });
            const token = jsonwebtoken_1.default.sign({ matricule }, process.env.JWT_SECRET_KEY || '');
            return { member, token: token };
        }
        catch (error) {
            throw new Error(error.message || 'Error creating member');
        }
    },
};
exports.UPDATE_MEMBER_BY_MATRICULE = {
    type: MembersType_1.MembersType,
    args: {
        matricule: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        username: { type: graphql_1.GraphQLString },
        level: { type: graphql_1.GraphQLString },
        age: { type: graphql_1.GraphQLInt },
        paid: { type: graphql_1.GraphQLBoolean },
        year: { type: graphql_1.GraphQLString }
    },
    async resolve(parent, args) {
        try {
            const { matricule, ...updateFields } = args;
            const existingMember = await prisma.members.findUnique({
                where: { matricule },
            });
            if (!existingMember) {
                throw new Error(`Member with matricule not found`);
            }
            const updatedMember = await prisma.members.update({
                where: { matricule },
                data: {
                    ...updateFields,
                },
            });
            return updatedMember;
        }
        catch (error) {
            console.error('Error updating Member:', error);
            throw new Error('Internal server error');
        }
    }
};
exports.DELETE_MEMBER_BY_MATRICULE = {
    type: MembersType_1.MembersType,
    args: {
        matricule: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
    },
    async resolve(parent, args) {
        try {
            const { matricule } = args;
            const existingMember = await prisma.members.findUnique({
                where: { matricule },
            });
            if (!existingMember) {
                throw new Error(`Member with matricule ${matricule} not found`);
            }
            const deletedMember = await prisma.members.delete({
                where: { matricule },
            });
            return deletedMember;
        }
        catch (error) {
            console.error('Error deleting Member:', error);
            throw new Error('Internal server error');
        }
    }
};
exports.LOGIN_MEMBER = {
    type: MembersType_1.MembersType,
    args: {
        token: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
    },
    async resolve(parent, args) {
        try {
            const { token } = args;
            // Decode the token
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY || '');
            const matricule = decodedToken.matricule;
            // Check if the matricule exists
            const existingMember = await prisma.members.findUnique({
                where: { matricule: matricule },
            });
            if (!existingMember) {
                return null;
            }
            return existingMember;
        }
        catch (error) {
            console.error('Error decoding token:', error);
            throw new Error('Internal server error');
        }
    },
};
