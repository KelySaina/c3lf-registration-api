import { GraphQLList, GraphQLString, GraphQLInt } from "graphql";
import { MembersType } from '../Types/MembersType';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET_ALL_MEMBERS = {
    type: new GraphQLList(MembersType),
    async resolve(parent: any, args: any) {
    try{
        return await prisma.members.findMany();
    } catch (error) {
        console.error('Error retrieving Members:', error);
        throw new Error('Internal server error');
    }
    }
}

export const GET_MEMBER_BY_MATRICULE = {
    type: MembersType,
    args:{
        matricule: {type: GraphQLString}
    },
    async resolve(parent: any, args: any) {
    try{
        const {matricule} = args
        return await prisma.members.findUnique({
            where:{
                matricule: matricule
            }
        });
    } catch (error) {
        console.error('Error retrieving Members:', error);
        throw new Error('Internal server error');
    }
    }
}

export const GET_MEMBERS_BY_LEVEL = {
    type: new GraphQLList(MembersType),
    args:{
        level: {type: GraphQLString}
    },
    async resolve(parent: any, args: any) {
    try{
        const {level} = args
        return await prisma.members.findMany({
            where:{
                level: level
            }
        });
    } catch (error) {
        console.error('Error retrieving Members:', error);
        throw new Error('Internal server error');
    }
    }
}
