"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_utils_js_1 = require("../../utilities/db-utils.js");
const booksRoutes = (0, express_1.Router)();
/**
 * @openapi
 * /books:
 *   get:
 *     tags:
 *      - Book
 *     description: Get all books
 *     operationId: GetAllBooks
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *             page:
 *              type: number
 *             itemsPerPage:
 *              type: number
 *
 */
booksRoutes.get('/', (req, res) => {
    var _a, _b;
    let page = Number(((_a = req.query.page) !== null && _a !== void 0 ? _a : "").toString());
    if (page) {
        let itemsPerPage = Number(((_b = req.query.itemsPerPage) !== null && _b !== void 0 ? _b : "10").toString());
        (0, db_utils_js_1.getPagedDocuments)('books', page, itemsPerPage)
            .then(x => {
            (0, db_utils_js_1.aggregateDocuments)('books', [{ $count: "count" }])
                .then(c => {
                let totalItems = c[0].count;
                let totalPages = Math.floor(totalItems / itemsPerPage) < (totalItems / itemsPerPage) ? Math.floor(totalItems / itemsPerPage) + 1 : Math.floor(totalItems / itemsPerPage);
                res.json({
                    page,
                    itemsPerPage,
                    totalPages,
                    totalItems,
                    data: x
                });
            });
        });
    }
    else {
        // read all docs
        (0, db_utils_js_1.getAllDocuments)('books')
            .then(x => {
            res.json(x);
        });
    }
});
exports.default = booksRoutes;
