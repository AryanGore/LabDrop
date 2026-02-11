import express from 'express';
import { createFolder, getFolderContents, renameFolder, deleteFolder } from '../controllers/folders.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router = express.Router();

//routes:
router.use(verifyJWT);
router.post('/create', createFolder);
router.get('/:folderId', getFolderContents);
router.get('/', getFolderContents);
router.patch('/rename/:folderId', renameFolder);
router.delete('/:folderId', deleteFolder);




export default router;