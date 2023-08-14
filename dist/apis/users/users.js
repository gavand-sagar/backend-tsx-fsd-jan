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
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_utils_js_1 = require("../../utilities/db-utils.js");
const express_validator_1 = require("express-validator");
const middlewares_js_1 = require("../../utilities/middlewares.js");
const mongodb_1 = require("mongodb");
const usersRouter = (0, express_1.Router)();
usersRouter.get('/login', (0, express_validator_1.header)('username').notEmpty(), (0, express_validator_1.header)('password').notEmpty(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let username = req.headers.username;
    let password = req.headers.password;
    (0, db_utils_js_1.getFilteredDocuments)('users', { username, password })
        .then(users => {
        var _a;
        console.log("testes", { username, password, users });
        if (users.length > 0) {
            let token = jsonwebtoken_1.default.sign({
                username,
                _id: users[0]._id,
                avatar: users[0].avatar
            }, (_a = process.env.SECRET_KEY) !== null && _a !== void 0 ? _a : "", { expiresIn: process.env.TOKEN_EXPIRE });
            console.log(token);
            res.json({
                status: true,
                token
            });
        }
        else {
            res.json({
                status: false,
                token: ''
            });
        }
    });
    // let users = await 
}));
usersRouter.post("/signup", (req, res) => {
    let { username, password, avatar } = req.body;
    (0, db_utils_js_1.insertDocument)('users', { username, password, avatar }).then(x => {
        res.send({
            success: true
        });
    });
});
usersRouter.get('/profile', middlewares_js_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let userId = ((_a = req.headers.authorId) !== null && _a !== void 0 ? _a : "").toString();
    let items = yield (0, db_utils_js_1.getFilteredDocuments)('users', {
        _id: new mongodb_1.ObjectId(userId)
    });
    if (items.length > 0) {
        return res.json(items[0]);
    }
    else {
        return res.json({
            success: false
        });
    }
}));
usersRouter.patch('/profile', middlewares_js_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    let userId = ((_b = req.headers.authorId) !== null && _b !== void 0 ? _b : "").toString();
    let { username, password, avatar } = req.body;
    (0, db_utils_js_1.updateDocumentWithId)('users', userId, { username, password, avatar })
        .then(x => {
        return res.json({
            success: x.acknowledged
        });
    });
}));
exports.default = usersRouter;
