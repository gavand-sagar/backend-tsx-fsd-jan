"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const mongodb_1 = require("mongodb");
const notes_1 = __importDefault(require("./apis/notes/notes"));
const users_1 = __importDefault(require("./apis/users/users"));
const books_js_1 = __importDefault(require("./apis/books/books.js"));
const posts_js_1 = require("./apis/posts/posts.js");
const middlewares_js_1 = require("./utilities/middlewares.js");
const grid_fs_util_js_1 = require("./utilities/grid-fs.util.js");
// import swaggerJsdoc from 'swagger-jsdoc';
// import swaggerUI from 'swagger-ui-express';
const comments_js_1 = require("./apis/comments/comments.js");
const likes_js_1 = require("./apis/likes/likes.js");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send("Working");
});
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Notes Server',
            version: '1.0.0',
        },
    },
    apis: ['./index.js', './apis/*/*.js'], // files containing annotations as above
};
// const openapiSpecification = swaggerJsdoc(options);
// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(openapiSpecification))
var bucket;
function createGridStream() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            var _a;
            new mongodb_1.MongoClient((_a = process.env.CONNECTION_STRING) !== null && _a !== void 0 ? _a : "")
                .connect().then((client) => {
                const db = client.db(process.env.DEFAULT_DATABASE);
                resolve(new mongodb_1.GridFSBucket(db, { bucketName: 'uploads' }));
            }).catch((e) => {
                reject(e);
            });
        });
    });
}
//to upload a file
app.post('/app-image-upload', grid_fs_util_js_1.upload.single('myFile'), (req, res) => {
    res.json(req.file);
});
/**
 * @openapi
 * /image:
 *   get:
 *     tags:
 *      - Image
 *     description: GetImage
 *     operationId: GetImage
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
app.get('/image/:filename', (req, res) => {
    bucket.find({ filename: req.params.filename }).toArray().then((files) => {
        console.log({ files });
        // Check if files
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            });
        }
        const stream = bucket.openDownloadStreamByName(req.params.filename);
        stream.pipe(res);
    });
});
app.use("/notes", middlewares_js_1.authenticate, notes_1.default);
app.use("/books", middlewares_js_1.authenticate, books_js_1.default);
app.use("/posts", middlewares_js_1.authenticate, posts_js_1.postsRoutes);
app.use("/comments", middlewares_js_1.authenticate, comments_js_1.commentsRouter);
app.use("/likes", middlewares_js_1.authenticate, likes_js_1.likesRouter);
app.use("/", users_1.default);
createGridStream().then(x => {
    bucket = x;
    app.listen(process.env.PORT, () => {
        console.log('Server started...');
    });
});
