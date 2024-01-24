import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const generateAdminToken = async () => {
  dotenv.config({ path: '.env' });

  try {
    const admin = "KelySaina";
    const token = jwt.sign(
      { admin },
      process.env.JWT_SECRET_KEY || '',
    );

    const seed = await prisma.admin.create({
      data: {
        AdminToken: token,
      },
    });
    console.log(token)
    return seed;
  } catch (error) {
    console.error('Error generating admin token:', error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

generateAdminToken();
