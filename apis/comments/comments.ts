import { Router } from "express";
import { aggregateDocuments, getFilteredDocuments, insertDocument } from "../../utilities/db-utils.js";
import { ObjectId } from "mongodb";

export const commentsRouter = Router();

commentsRouter.get('/:postId', (req, res) => {


    let postId = req.params.postId;


    aggregateDocuments('comments', [
        {
            $match: { postId: new ObjectId(postId) }
        }
        ,
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
        }])
        .then(data => {
            res.json(data)
        })

})


commentsRouter.post('/:postId', (req, res) => {
    let body = req.body;
    body['postId'] = new ObjectId(req.params.postId)
    body['authorId'] = new ObjectId((req.headers.authorId ?? "").toString());
    if (body?.replyTo) {
        body['replyTo'] = new ObjectId(body.replyTo)
    }
    insertDocument('comments', body).then(x => {

        return res.json({
            message: "Created",
            data: x
        })
    })

})
