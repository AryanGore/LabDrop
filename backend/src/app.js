import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import testRouter from './routes/test.route.js';
import { errorHandler } from './middlewares/errorHandler.js';
import uploadRouter from './routes/fileupload.route.js';
import downloadRouter from './routes/filedownload.route.js';
// import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import folderRouter from './routes/folder.route.js';
import fileManagementRouter from './routes/file.route.js';

const app = express();

// CORS configuration - allow frontend to communicate with backend
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, postman)
        if (!origin) return callback(null, true);

        // Allow any localhost origin for development
        if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
            return callback(null, true);
        }

        callback(new Error('Not allowed by CORS'));
    },
    credentials: true, // Allow cookies to be sent
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// routes
app.use('/health', testRouter);
app.use('/drop', uploadRouter);
app.use('/download', downloadRouter);
// app.use('/user', userRouter);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/folder', folderRouter);
app.use('/api/v1/file', fileManagementRouter);

// global error handler
app.use(errorHandler);

export default app;
