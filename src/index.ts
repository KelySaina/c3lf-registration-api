import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import dotenv from 'dotenv';
import { schema } from './schema';
import path from 'path';
import { secureSchema } from './schema/secure';
import jwt, { Secret } from 'jsonwebtoken';
import multer from 'multer'; 
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const main = async () => {
  const prisma = new PrismaClient()
  const checkAdminTokenMiddleware = (
    req: Request,
    res: Response,
    next: () => void
  ) => {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - Missing token' });
    }

    const secret: Secret = process.env.JWT_SECRET_KEY || '';
    try {
      const decoded = jwt.verify(token, secret);

      req.body.userFromToken = decoded;

      next();
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
  };

  let app = express();
  const qrCodeDirectory = path.join(__dirname, 'QR_CODES');

  app.use(cors());

  dotenv.config({ path: '.env' });

  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: '50mb' }));

  // Set up storage for multer
  const storage = multer.memoryStorage();
  const upload = multer({ storage });

  const uploadDirectory = path.join('src', 'uploads');
  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
  }

  app.use('/uploads', express.static(uploadDirectory));

  app.post('/upload-avatar/:matricule', upload.single('file'), async (req, res) => {
    try {
      const {matricule} = req.params
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const uniqueFilename = `${uuidv4()}-${req.file.originalname}`;

      const imageData = req.file.buffer;
      const base64Image = imageData.toString('base64');

      const uploadPath = `/uploads/${uniqueFilename}`;
      const imagePath = path.join(uploadDirectory, uniqueFilename);
    
      fs.writeFileSync(imagePath, base64Image, 'base64');

      await prisma.members.update({
        where: { matricule: matricule },
        data: { imgUrl: `${process.env.BASE_URL}${uploadPath}` }
      });

      res.json({url: imagePath})

    } catch (error) {
      console.error('Error uploading avatar:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.use('/graphql', graphqlHTTP({ schema: schema }));

  app.use(
    '/secure-graphql',
    checkAdminTokenMiddleware,
    graphqlHTTP({ schema: secureSchema })
  );

  app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
  });
};

main().catch((err) => {
  console.log(err);
});
