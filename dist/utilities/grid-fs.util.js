"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.storage = void 0;
const multer_gridfs_storage_1 = require("multer-gridfs-storage");
const crypto_1 = __importDefault(require("crypto"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
exports.storage = new multer_gridfs_storage_1.GridFsStorage({
    url: process.env.CONNECTION_STRING + '/' + process.env.DEFAULT_DATABASE,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto_1.default.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path_1.default.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
exports.upload = (0, multer_1.default)({ storage: exports.storage });
