"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRouter = void 0;
const express_1 = require("express");
const db_utils_js_1 = require("../../utilities/db-utils.js");
const mongodb_1 = require("mongodb");
exports.commentsRouter = (0, express_1.Router)();
exports.commentsRouter.get('/:postId', (req, res) => {
    let postId = req.params.postId;
    (0, db_utils_js_1.aggregateDocuments)('comments', [
        {
            $match: { postId: new mongodb_1.ObjectId(postId) }
        },
        {
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
        }
    ])
        .then(data => {
        res.json(data);
    });
});
exports.commentsRouter.post('/:postId', (req, res) => {
    var _a;
    let body = req.body;
    body['postId'] = new mongodb_1.ObjectId(req.params.postId);
    body['authorId'] = new mongodb_1.ObjectId(((_a = req.headers.authorId) !== null && _a !== void 0 ? _a : "").toString());
    if (body === null || body === void 0 ? void 0 : body.replyTo) {
        body['replyTo'] = new mongodb_1.ObjectId(body.replyTo);
    }
    (0, db_utils_js_1.insertDocument)('comments', body).then(x => {
        return res.json({
            message: "Created",
            data: x
        });
    });
});
