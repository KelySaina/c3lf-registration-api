"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_graphql_1 = require("express-graphql");
const dotenv_1 = __importDefault(require("dotenv"));
const schema_1 = require("./schema");
const path_1 = __importDefault(require("path"));
const secure_1 = require("./schema/secure");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const main = async () => {
    const prisma = new client_1.PrismaClient();
    const checkAdminTokenMiddleware = (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized - Missing token' });
        }
        const secret = process.env.JWT_SECRET_KEY || '';
        try {
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            req.body.userFromToken = decoded;
            next();
        }
        catch (error) {
            return res.status(401).json({ error: 'Unauthorized - Invalid token' });
        }
    };
    let app = (0, express_1.default)();
    const qrCodeDirectory = path_1.default.join(__dirname, 'QR_CODES');
    app.use((0, cors_1.default)());
    dotenv_1.default.config({ path: '.env' });
    const PORT = process.env.PORT || 3000;
    app.use(express_1.default.json({ limit: '50mb' }));
    // Set up storage for multer
    const storage = multer_1.default.memoryStorage();
    const upload = (0, multer_1.default)({ storage });
    const uploadDirectory = path_1.default.join('src', 'uploads');
    if (!fs_1.default.existsSync(uploadDirectory)) {
        fs_1.default.mkdirSync(uploadDirectory);
    }
    app.use('/uploads', express_1.default.static(uploadDirectory));
    app.post('/upload-avatar/:matricule', upload.single('file'), async (req, res) => {
        try {
            const { matricule } = req.params;
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }
            const uniqueFilename = `${(0, uuid_1.v4)()}-${req.file.originalname}`;
            const imageData = req.file.buffer;
            const base64Image = imageData.toString('base64');
            const uploadPath = `/uploads/${uniqueFilename}`;
            const imagePath = path_1.default.join(uploadDirectory, uniqueFilename);
            fs_1.default.writeFileSync(imagePath, base64Image, 'base64');
            await prisma.members.update({
                where: { matricule: matricule },
                data: { imgUrl: `http://localhost:${PORT}${uploadPath}` }
            });
            res.json({ url: imagePath });
        }
        catch (error) {
            console.error('Error uploading avatar:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    app.use('/graphql', (0, express_graphql_1.graphqlHTTP)({ schema: schema_1.schema }));
    app.use('/secure-graphql', checkAdminTokenMiddleware, (0, express_graphql_1.graphqlHTTP)({ schema: secure_1.secureSchema }));
    app.listen(PORT, () => {
        console.log(`[server]: Server is running at http://localhost:${PORT}`);
    });
};
main().catch((err) => {
    console.log(err);
});
