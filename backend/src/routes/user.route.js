import express from 'express';
import { createUser } from '../controllers/user.controller.js';

const router = express.Router();


// routes
router.post('/create', createUser);

export default router;