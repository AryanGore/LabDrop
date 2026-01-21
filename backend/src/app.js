import express from 'express';
import testRouter from './routes/test.route.js';
import { errorHandler } from './middlewares/errorHandler.js';
import uploadRouter from './routes/fileupload.route.js'

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb"}));

//routes

app.use('/health', testRouter);
app.use('/drop', uploadRouter);




//gloval error handler.
app.use(errorHandler);



export default app;