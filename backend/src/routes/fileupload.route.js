import express from 'express';
import upload from '../middlewares/multer.middleware.js';
import { fileupload } from '../controllers/fileupload.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(verifyJWT);

router.post('/upload', upload.array("files", 50), fileupload);

export default router;
