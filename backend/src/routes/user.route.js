import express from 'express';
import { createUser } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();


// routes
router.post('/create', verifyJWT, createUser);

export default router;