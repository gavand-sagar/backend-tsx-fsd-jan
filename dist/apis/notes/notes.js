"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_utils_1 = require("../../utilities/db-utils");
const express_validator_1 = require("express-validator");
const notesRouter = (0, express_1.Router)();
notesRouter.get('/', (req, res) => {
    (0, db_utils_1.getAllDocuments)('notes')
        .then(x => {
        res.send(x);
    });
});
notesRouter.post('/', (0, express_validator_1.body)('noteText').notEmpty().isString(), (req, res) => {
    const result = (0, express_validator_1.validationResult)(req);
    if (result.errors.length > 0) {
        res.json(result);
        return;
    }
    let body = req.body;
    (0, db_utils_1.insertDocument)('notes', body)
        .then(x => {
        res.send(x);
    });
});
notesRouter.delete('/:id', (req, res) => {
    let id = req.params.id;
    (0, db_utils_1.deleteDocument)('notes', id).then(x => {
        res.send(x);
    });
});
exports.default = notesRouter;
