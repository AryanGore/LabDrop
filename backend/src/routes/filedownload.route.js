import express from 'express';
import { downloadFile } from '../controllers/filedownload.controller.js';

const router = express.Router();

router.get('/:filename', downloadFile);

export default router;
