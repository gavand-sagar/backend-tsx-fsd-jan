import express, { Request, Response } from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import { GridFSBucket, MongoClient } from 'mongodb'
import notesRouter from './apis/notes/notes';
import usersRouter from './apis/users/users'
import booksRoutes from './apis/books/books.js';
import { postsRoutes } from './apis/posts/posts.js';
import { authenticate } from './utilities/middlewares.js';
import { upload } from './utilities/grid-fs.util.js';
// import swaggerJsdoc from 'swagger-jsdoc';
// import swaggerUI from 'swagger-ui-express';
import { commentsRouter } from './apis/comments/comments.js';
import { likesRouter } from './apis/likes/likes.js';

config();


const app = express()

app.use(cors())
app.use(express.json())


app.get('/', (req: Request, res: Response) => {
  res.send("Working");
})




const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notes Server',
      version: '1.0.0',
    },
  },
  apis: ['./index.js', './apis/*/*.js'], // files containing annotations as above
};

// const openapiSpecification = swaggerJsdoc(options);
// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(openapiSpecification))



var bucket: any;
async function createGridStream() {
  return new Promise((resolve, reject) => {
    new MongoClient(process.env.CONNECTION_STRING ?? "")
      .connect().then((client: any) => {
        const db = client.db(process.env.DEFAULT_DATABASE);
        resolve(new GridFSBucket(db, { bucketName: 'uploads' }));
      }).catch((e: Error) => {
        reject(e)
      })
  })
}



//to upload a file
app.post('/app-image-upload', upload.single('myFile'), (req: Request, res: Response) => {
  res.json(req.file)

})


/**
 * @openapi
 * /image:
 *   get:
 *     tags: 
 *      - Image 
 *     description: GetImage
 *     operationId: GetImage
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
app.get('/image/:filename', (req: Request, res: Response) => {
  bucket.find({ filename: req.params.filename }).toArray().then((files: any) => {
    console.log({ files })

    // Check if files

    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }
    const stream = bucket.openDownloadStreamByName(req.params.filename)
    stream.pipe(res)
  });
});




app.use("/notes", authenticate, notesRouter)
app.use("/books", authenticate, booksRoutes)
app.use("/posts", authenticate, postsRoutes)
app.use("/comments", authenticate, commentsRouter)
app.use("/likes", authenticate, likesRouter)
app.use("/", usersRouter)




createGridStream().then(x => {
  bucket = x;
  app.listen(process.env.PORT, () => {
    console.log('Server started...')
  })

})
