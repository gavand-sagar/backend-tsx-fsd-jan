import { Router } from 'express'
import { deleteDocument, getAllDocuments, insertDocument } from '../../utilities/db-utils';
import { body, validationResult } from 'express-validator';
const notesRouter = Router();


notesRouter.get('/', (req, res) => {
    getAllDocuments('notes')
        .then(x => {
            res.send(x)
        })
})


notesRouter.post('/', body('noteText').notEmpty().isString(), (req, res) => {


    const result: any = validationResult(req);
    if (result.errors.length > 0) {
        res.json(result)
        return;
    }
    let body = req.body
    insertDocument('notes', body)
        .then(x => {
            res.send(x)
        })
})


notesRouter.delete('/:id', (req, res) => {
    let id = req.params.id
    deleteDocument('notes', id).then(x => {
        res.send(x)
    })
})

export default notesRouter