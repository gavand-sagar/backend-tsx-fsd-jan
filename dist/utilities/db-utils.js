"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagedDocuments = exports.aggregateDocuments = exports.updateDocumentWithId = exports.deleteDocument = exports.insertDocument = exports.getFilteredDocuments = exports.getAllDocuments = void 0;
const mongodb_1 = require("mongodb");
function getClient() {
    var _a;
    return new mongodb_1.MongoClient((_a = process.env.CONNECTION_STRING) !== null && _a !== void 0 ? _a : "");
}
function getAllDocuments(collectionName) {
    return getClient().connect().then(connection => {
        const db = connection.db(process.env.DEFAULT_DATABASE);
        return db.collection(collectionName)
            .find()
            .toArray();
    });
}
exports.getAllDocuments = getAllDocuments;
function getFilteredDocuments(collectionName, query) {
    return getClient().connect().then(connection => {
        const db = connection.db(process.env.DEFAULT_DATABASE);
        return db.collection(collectionName)
            .find(query)
            .toArray();
    });
}
exports.getFilteredDocuments = getFilteredDocuments;
function insertDocument(collectionName, document) {
    return getClient().connect().then(connection => {
        const db = connection.db(process.env.DEFAULT_DATABASE);
        return db.collection(collectionName)
            .insertOne(document)
            .then(x => {
            return db.collection(collectionName)
                .find()
                .toArray();
        });
    });
}
exports.insertDocument = insertDocument;
function deleteDocument(collectionName, id) {
    return getClient().connect().then(connection => {
        const db = connection.db(process.env.DEFAULT_DATABASE);
        return db.collection(collectionName)
            .deleteOne({ "_id": new mongodb_1.ObjectId(id) })
            .then(x => {
            return db.collection(collectionName)
                .find()
                .toArray();
        });
    });
}
exports.deleteDocument = deleteDocument;
function updateDocumentWithId(collectionName, id, newValues) {
    return getClient().connect().then(connection => {
        const db = connection.db(process.env.DEFAULT_DATABASE);
        return db.collection(collectionName)
            .updateOne({ "_id": new mongodb_1.ObjectId(id) }, { $set: newValues });
    });
}
exports.updateDocumentWithId = updateDocumentWithId;
function aggregateDocuments(collectionName, pipeline) {
    return getClient().connect().then(connection => {
        const db = connection.db(process.env.DEFAULT_DATABASE);
        return db.collection(collectionName)
            .aggregate(pipeline)
            .toArray();
    });
}
exports.aggregateDocuments = aggregateDocuments;
function getPagedDocuments(collectionName, page, itemsPerPage) {
    let skipCount = (page - 1) * itemsPerPage;
    return aggregateDocuments(collectionName, [{
            $skip: skipCount
        }, {
            $limit: Number(itemsPerPage)
        }]);
}
exports.getPagedDocuments = getPagedDocuments;
// module.exports = { getAllDocuments, insertDocument, deleteDocument, getFilteredDocuments }
