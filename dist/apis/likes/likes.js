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
Object.defineProperty(exports, "__esModule", { value: true });
exports.likesRouter = void 0;
const express_1 = require("express");
const db_utils_js_1 = require("../../utilities/db-utils.js");
const mongodb_1 = require("mongodb");
exports.likesRouter = (0, express_1.Router)();
exports.likesRouter.get('/:postId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let r = yield (0, db_utils_js_1.aggregateDocuments)('likes', [{
            $lookup: {
                from: "users",
                localField: "authorId",
                foreignField: "_id",
                as: "authorsThatMatched"
            }
        },
        {
            $addFields: { author: { $first: "$authorsThatMatched" } }
        },
        {
            $project: { authorsThatMatched: false, "author.password": false }
        }]);
    return res.json(r);
}));
exports.likesRouter.patch('/:postId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let authorId = ((_a = req.headers["authorId"]) !== null && _a !== void 0 ? _a : "").toString();
    let x = yield (0, db_utils_js_1.getFilteredDocuments)('likes', {
        postId: new mongodb_1.ObjectId(req.params.postId),
        authorId: new mongodb_1.ObjectId(authorId)
    });
    if (x && x.length > 0) {
        //need to remove "like" entry
        let likeId = x[0]._id.toString();
        let newLikesCollection = yield (0, db_utils_js_1.deleteDocument)('likes', likeId);
        let postObject = (yield (0, db_utils_js_1.getFilteredDocuments)('posts', { _id: new mongodb_1.ObjectId(req.params.postId) }))[0];
        console.log(postObject);
        let newLikes = isNaN(postObject === null || postObject === void 0 ? void 0 : postObject.likes) ? 0 : Number(postObject === null || postObject === void 0 ? void 0 : postObject.likes) - 1;
        if (newLikes < 0) {
            newLikes = 0;
        }
        yield (0, db_utils_js_1.updateDocumentWithId)('posts', req.params.postId, { likes: newLikes });
        res.json({
            success: true,
            newLikes,
            newLikesCollection
        });
    }
    else {
        // create "like" entry
        let newLikesCollection = yield (0, db_utils_js_1.insertDocument)('likes', {
            postId: new mongodb_1.ObjectId(req.params.postId),
            authorId: new mongodb_1.ObjectId(authorId)
        });
        let postObject = (yield (0, db_utils_js_1.getFilteredDocuments)('posts', { _id: new mongodb_1.ObjectId(req.params.postId) }))[0];
        console.log(postObject);
        let newLikes = isNaN(postObject === null || postObject === void 0 ? void 0 : postObject.likes) ? 1 : Number(postObject === null || postObject === void 0 ? void 0 : postObject.likes) + 1;
        yield (0, db_utils_js_1.updateDocumentWithId)('posts', req.params.postId, { likes: newLikes });
        res.json({
            success: true,
            newLikes,
            newLikesCollection
        });
    }
}));
