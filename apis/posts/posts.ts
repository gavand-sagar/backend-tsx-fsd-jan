import { Router } from 'express'
import { aggregateDocuments, getAllDocuments, insertDocument } from '../../utilities/db-utils.js';
import { ObjectId } from 'mongodb';

export const postsRoutes = Router();



postsRoutes.post('/', (req, res) => {
    let authorId: string = (req.headers?.authorId ?? "").toString()
    console.log('authorId', authorId)
    let { content } = req.body;  // { content:"Heyy", authorId:"12jkjdksl3kedjkljsfk" }
    let post = {
        content: content,
        author: new ObjectId(authorId)
    }
    insertDocument('posts', post)
        .then(x => {
            res.json({ status: true, message: "Post Created" })
        })
        .catch(err => {
            res.json({ status: false, message: err })
        })
})


postsRoutes.get('/', (req, res) => {

    aggregateDocuments('posts', [{
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
            res.json(data)
        })



})
