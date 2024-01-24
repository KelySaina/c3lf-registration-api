import { GraphQLNonNull, GraphQLString, GraphQLBoolean, GraphQLInt } from "graphql";
import { MembersType } from '../Types/MembersType';
import { PrismaClient } from "@prisma/client";
import  jwt  from "jsonwebtoken";
import { JwtPayload } from 'jsonwebtoken';

interface CustomJwtPayload extends JwtPayload {
  matricule: string;
}

const prisma = new PrismaClient();


export const REGISTER_MEMBER = {
  type: MembersType,
  args: {
    username: { type: GraphQLString },
    matricule: { type: new GraphQLNonNull(GraphQLString) },
    level: { type: GraphQLString },
    age: {type: GraphQLInt}
  },
  async resolve(parent: any, args: any, res : Response) {
    try {
      const { username, matricule, level, age } = args;

      // Check if the matricule is already registered
      const existingMember = await prisma.members.findUnique({
        where: { matricule },
      });

      if (existingMember) {
        throw new Error("Matricule already a member")
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

      const token = jwt.sign(
        { matricule },
        process.env.JWT_SECRET_KEY || ''
      );

      return { member, token: token };

    } catch (error: any) {
      throw new Error((error as any).message || 'Error creating member');
    }
  },
};


export const UPDATE_MEMBER_BY_MATRICULE = {
    type: MembersType,
    args: {
        matricule: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: GraphQLString },
        level: { type: GraphQLString },
        age: {type: GraphQLInt},
        paid: { type:GraphQLBoolean },
        year: { type: GraphQLString }
    },
    async resolve(parent: any, args: any) {
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

        } catch (error : any) {
            console.error('Error updating Member:', error);
            throw new Error('Internal server error');
        }
    }
};

export const DELETE_MEMBER_BY_MATRICULE = {
    type: MembersType,
    args: {
        matricule: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(parent: any, args: any) {
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

        } catch (error) {
            console.error('Error deleting Member:', error);
            throw new Error('Internal server error');
        }
    }
};

export const LOGIN_MEMBER = {
  type: MembersType,
  args: {
    token: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent: any, args: any) {
    try {
      const { token } = args;

      // Decode the token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY || '') as CustomJwtPayload;

      const matricule = decodedToken.matricule 

      // Check if the matricule exists
     const existingMember = await prisma.members.findUnique({
        where: { matricule: matricule },
      });

      if (!existingMember) {
        return null;
      }
      
      return existingMember;

    } catch (error : any) {
      console.error('Error decoding token:', error);
      throw new Error('Internal server error');
    }
  },
};
