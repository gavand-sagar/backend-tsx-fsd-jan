import { Router } from "express";
import jwt from 'jsonwebtoken'
import { getFilteredDocuments, insertDocument, updateDocumentWithId } from "../../utilities/db-utils.js";
import { header } from "express-validator";
import { authenticate } from "../../utilities/middlewares.js";
import { ObjectId } from "mongodb";

const usersRouter = Router();


usersRouter.get('/login', header('username').notEmpty(),
    header('password').notEmpty(), async (req, res) => {
        let username = req.headers.username;
        let password = req.headers.password;

        getFilteredDocuments('users', { username, password })
            .then(users => {
                console.log("testes", { username, password, users })
                if (users.length > 0) {
                    let token = jwt.sign({
                        username,
                        _id: users[0]._id,
                        avatar: users[0].avatar
                    },
                        process.env.SECRET_KEY ?? "",
                        { expiresIn: process.env.TOKEN_EXPIRE })

                    console.log(token)
                    res.json({
                        status: true,
                        token
                    })
                } else {
                    res.json({
                        status: false,
                        token: ''
                    })
                }
            })
        // let users = await 



    })


usersRouter.post("/signup", (req, res) => {
    let { username, password, avatar } = req.body;

    insertDocument('users', { username, password, avatar }).then(x => {
        res.send({
            success: true
        })
    })
})


usersRouter.get('/profile', authenticate, async (req, res) => {
    let userId = (req.headers.authorId ?? "").toString();
    let items = await getFilteredDocuments('users', {
        _id: new ObjectId(userId)
    });
    if (items.length > 0) {
        return res.json(items[0])
    } else {
        return res.json({
            success: false
        })
    }
})




usersRouter.patch('/profile', authenticate, async (req, res) => {
    let userId = (req.headers.authorId ?? "").toString();
    let { username, password, avatar } = req.body;
    updateDocumentWithId('users', userId, { username, password, avatar })
        .then(x => {
            return res.json({
                success: x.acknowledged
            })
        })
})




export default usersRouter;