"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const generateAdminToken = async () => {
    dotenv_1.default.config({ path: '.env' });
    try {
        const admin = "KelySaina";
        const token = jsonwebtoken_1.default.sign({ admin }, process.env.JWT_SECRET_KEY || '');
        const seed = await prisma.admin.create({
            data: {
                AdminToken: token,
            },
        });
        console.log(token);
        return seed;
    }
    catch (error) {
        console.error('Error generating admin token:', error);
        return null;
    }
    finally {
        await prisma.$disconnect();
    }
};
generateAdminToken();
