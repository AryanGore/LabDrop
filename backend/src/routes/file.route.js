import express from 'express';
import { renameFile, deleteFile } from '../controllers/files.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(verifyJWT);

router.patch('/rename/:fileId', renameFile);
router.delete('/:fileId', deleteFile);

export default router;
