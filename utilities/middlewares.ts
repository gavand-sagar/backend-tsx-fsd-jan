
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'

export function authenticate(req: Request, res: Response, next: any) {
    // it will decide if you are authentic user or not
    let token: string = (req.headers?.token ?? "").toString();
    try {
        let decoded: any = jwt.verify(token, process.env.SECRET_KEY ?? "")
        req.headers["authorId"] = decoded._id
        next()
    } catch (e) {

        res.json({
            status: false,
            message: 'Unauthorized',
            err: e
        })
    }

}