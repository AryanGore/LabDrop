import express from 'express'
import upload from '../middlewares/multer.middleware.js';
import { fileupload } from '../controllers/fileupload.controller.js';


const router = express.Router();

router.post('/upload', upload.array("files", 50), fileupload);

export default router;