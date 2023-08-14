import { Router, Request, Response } from "express";
import { aggregateDocuments, getAllDocuments, getPagedDocuments } from "../../utilities/db-utils.js";

const booksRoutes = Router();


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
booksRoutes.get('/', (req: Request, res: Response) => {
    
    let page: number = Number((req.query.page ?? "").toString());
    if (page) {
        let itemsPerPage = Number((req.query.itemsPerPage ?? "10").toString());
        getPagedDocuments('books', page, itemsPerPage)
            .then(x => {


                aggregateDocuments('books', [{ $count: "count" }])
                    .then(c => {

                        let totalItems = c[0].count

                        let totalPages = Math.floor(totalItems / itemsPerPage) < (totalItems / itemsPerPage) ? Math.floor(totalItems / itemsPerPage) + 1 : Math.floor(totalItems / itemsPerPage)

                        res.json({
                            page,
                            itemsPerPage,
                            totalPages,
                            totalItems,
                            data: x
                        })
                    })

            })
    } else {
        // read all docs
        getAllDocuments('books')
            .then(x => {
                res.json(x)
            })
    }

})

export default booksRoutes;

