import { MongoClient, ObjectId } from 'mongodb'

function getClient(): MongoClient {
    return new MongoClient(process.env.CONNECTION_STRING ?? "");
}

export function getAllDocuments(collectionName: string) {
    return getClient().connect().then(connection => {
        const db = connection.db(process.env.DEFAULT_DATABASE);
        return db.collection(collectionName)
            .find()
            .toArray()
    })
}


export function getFilteredDocuments(collectionName: string, query:any) {
    return getClient().connect().then(connection => {
        const db = connection.db(process.env.DEFAULT_DATABASE);
        return db.collection(collectionName)
            .find(query)
            .toArray()
    })
}


export function insertDocument(collectionName: string, document:any) {
    return getClient().connect().then(connection => {
        const db = connection.db(process.env.DEFAULT_DATABASE)
        return db.collection(collectionName)
            .insertOne(document)
            .then(x => {
                return db.collection(collectionName)
                    .find()
                    .toArray()
            })
    })
}


export function deleteDocument(collectionName: string, id: string) {
    return getClient().connect().then(connection => {
        const db = connection.db(process.env.DEFAULT_DATABASE)
        return db.collection(collectionName)
            .deleteOne({ "_id": new ObjectId(id) })
            .then(x => {
                return db.collection(collectionName)
                    .find()
                    .toArray()

            })
    })
}

export function updateDocumentWithId(collectionName: string, id: string, newValues: any) {
    return getClient().connect().then(connection => {
        const db = connection.db(process.env.DEFAULT_DATABASE)
        return db.collection(collectionName)
            .updateOne({ "_id": new ObjectId(id) }, { $set: newValues })
    })
}


export function aggregateDocuments(collectionName: string, pipeline: any[]) {
    return getClient().connect().then(connection => {
        const db = connection.db(process.env.DEFAULT_DATABASE)
        return db.collection(collectionName)
            .aggregate(pipeline)
            .toArray()
    })
}


export function getPagedDocuments(collectionName: string, page: number, itemsPerPage: number) {
    let skipCount = (page - 1) * itemsPerPage;
    return aggregateDocuments(collectionName, [{
        $skip: skipCount
    }, {
        $limit: Number(itemsPerPage)
    }])
}


// module.exports = { getAllDocuments, insertDocument, deleteDocument, getFilteredDocuments }
