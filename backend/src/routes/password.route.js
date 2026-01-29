import express from 'express';
import {
    createNote,
    getUserNotes,
    getNoteById,
    updateNote,
    updateNoteByLabel,
    deleteNote,
    getAllNotes
} from '../controllers/notes.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// IMPORTANT: Specific routes MUST come before parameterized routes

// Get all notes (admin)
router.get("/all", getAllNotes);

// Get all entries for authenticated user
router.get("/user", getUserNotes);

// Create new entry
router.post("/create", createNote);

// Update entry
router.put("/update/:id", updateNote);

// Update entry by label
router.put("/update/label/:label", updateNoteByLabel);

// Delete entry
router.delete("/delete/:id", deleteNote);

// Get single entry by ID - MUST be last (catches all)
router.get("/:id", getNoteById);

export default router;