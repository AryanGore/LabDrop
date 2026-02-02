import express from 'express';
import { createFolder, getFolderContents } from '../controllers/folders.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router = express.Router();

//routes:
router.use(verifyJWT);
router.post('/create', createFolder);
router.get('/:folderId', getFolderContents);
router.get('/', getFolderContents);



export default router;