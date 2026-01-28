import express from 'express';
import { signup,signin,getUsers,logout } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
const router=express.Router();


router.post("/signup",signup);
router.post("/signin",signin);
router.post("/logout",logout);
router.get("/check",authMiddleware,getUsers);

export default router;