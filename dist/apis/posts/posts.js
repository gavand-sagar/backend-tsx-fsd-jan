"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRoutes = void 0;
const express_1 = require("express");
const db_utils_js_1 = require("../../utilities/db-utils.js");
const mongodb_1 = require("mongodb");
exports.postsRoutes = (0, express_1.Router)();
exports.postsRoutes.post('/', (req, res) => {
    var _a, _b;
    let authorId = ((_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorId) !== null && _b !== void 0 ? _b : "").toString();
    console.log('authorId', authorId);
    let { content } = req.body; // { content:"Heyy", authorId:"12jkjdksl3kedjkljsfk" }
    let post = {
        content: content,
        author: new mongodb_1.ObjectId(authorId)
    };
    (0, db_utils_js_1.insertDocument)('posts', post)
        .then(x => {
        res.json({ status: true, message: "Post Created" });
    })
        .catch(err => {
        res.json({ status: false, message: err });
    });
});
exports.postsRoutes.get('/', (req, res) => {
    (0, db_utils_js_1.aggregateDocuments)('posts', [{
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "authorsThatMatched"
            }
        },
        {
            $addFields: { author: { $first: "$authorsThatMatched" } }
        },
        {
            $project: { authorsThatMatched: false, "author.password": false }
        }])
        .then(data => {
        res.json(data);
    });
});
