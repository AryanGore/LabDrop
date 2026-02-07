import express from 'express';
import { downloadFile } from '../controllers/filedownload.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/:fileId', verifyJWT, downloadFile);

export default router;
