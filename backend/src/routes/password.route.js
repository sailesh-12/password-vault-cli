import express from 'express';
import { createPost,getAllNotes } from '../controllers/notes.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
const router=express.Router();

router.get("/getallnotes",authMiddleware,getAllNotes);
//router.get("/getnotes/:id",getNote);
router.post("/createnote",authMiddleware,createPost);


export default router;