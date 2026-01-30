import express from 'express';
import cookieParser from 'cookie-parser';
import testRouter from './routes/test.route.js';
import { errorHandler } from './middlewares/errorHandler.js';
import uploadRouter from './routes/fileupload.route.js';
import downloadRouter from './routes/filedownload.route.js';
import userRouter from './routes/user.route.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// routes
app.use('/health', testRouter);
app.use('/drop', uploadRouter);
app.use('/download', downloadRouter);
app.use('/user', userRouter);

// global error handler
app.use(errorHandler);

export default app;
