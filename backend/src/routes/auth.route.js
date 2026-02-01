import express from 'express';
import { refreshUserAccessToken, userLogin, userLogout, userSignup } from '../controllers/auth.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/signup', userSignup);
router.post('/login', userLogin);
router.post('/logout', verifyJWT, userLogout);
router.post('/refresh-token', refreshUserAccessToken);


export default router;