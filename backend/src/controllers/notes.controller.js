import passwordModel from "../models/passwordModel.js";

/**
 * Create a new password entry
 * Server stores ONLY the encrypted blob - never decrypts
 */
export const createNote = async (req, res) => {
    try {
        const { label, ciphertext, iv, authTag } = req.body;

        // Validate required fields
        if (!label || !ciphertext || !iv || !authTag) {
            return res.status(400).json({
                message: "Missing required fields: label, ciphertext, iv, authTag"
            });
        }

        const user = req.user;
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        // Check for duplicate label
        const existing = await passwordModel.findOne({
            userId: user._id,
            label
        });
        if (existing) {
            return res.status(409).json({
                message: `Entry with label "${label}" already exists`
            });
        }

        // Store encrypted blob - server never decrypts
        const entry = await passwordModel.create({
            label,
            ciphertext,
            iv,
            authTag,
            userId: user._id
        });

        return res.status(201).json({
            message: "Entry created successfully",
            entry: {
                id: entry._id,
                label: entry.label,
                createdAt: entry.createdAt
            }
        });
    } catch (err) {
        console.error("createNote error:", err.message);
        return res.status(500).json({
            message: "Internal Server error"
        });
    }
};

/**
 * Get all entries for the authenticated user
 * Returns encrypted blobs - client decrypts
 */
export const getUserNotes = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const entries = await passwordModel.find({ userId: user._id })
            .select('label ciphertext iv authTag createdAt updatedAt')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Entries retrieved successfully",
            entries
        });
    } catch (err) {
        console.error("getUserNotes error:", err.message);
        return res.status(500).json({
            message: "Internal Server error"
        });
    }
};

/**
 * Get a single entry by ID
 */
export const getNoteById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const entry = await passwordModel.findOne({
            _id: id,
            userId: user._id
        });

        if (!entry) {
            return res.status(404).json({
                message: "Entry not found"
            });
        }

        return res.status(200).json({
            message: "Entry retrieved successfully",
            entry
        });
    } catch (err) {
        console.error("getNoteById error:", err.message);
        return res.status(500).json({
            message: "Internal Server error"
        });
    }
};

/**
 * Update an existing entry
 */
export const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { label, ciphertext, iv, authTag } = req.body;
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        // Build update object with only provided fields
        const updateData = {};
        if (label) updateData.label = label;
        if (ciphertext) updateData.ciphertext = ciphertext;
        if (iv) updateData.iv = iv;
        if (authTag) updateData.authTag = authTag;

        const updatedEntry = await passwordModel.findOneAndUpdate(
            { _id: id, userId: user._id },
            updateData,
            { new: true }
        );

        if (!updatedEntry) {
            return res.status(404).json({
                message: "Entry not found"
            });
        }

        return res.status(200).json({
            message: "Entry updated successfully",
            entry: updatedEntry
        });
    } catch (err) {
        console.error("updateNote error:", err.message);
        return res.status(500).json({
            message: "Internal Server error"
        });
    }
};

/**
 * Update an existing entry by Label
 */
export const updateNoteByLabel = async (req, res) => {
    try {
        const { label } = req.params;
        const { ciphertext, iv, authTag } = req.body;
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        // Build update object with only provided fields
        const updateData = {};
        if (ciphertext) updateData.ciphertext = ciphertext;
        if (iv) updateData.iv = iv;
        if (authTag) updateData.authTag = authTag;

        const updatedEntry = await passwordModel.findOneAndUpdate(
            { label: label, userId: user._id },
            updateData,
            { new: true }
        );

        if (!updatedEntry) {
            return res.status(404).json({
                message: "Entry not found"
            });
        }

        return res.status(200).json({
            message: "Entry updated successfully",
            entry: updatedEntry
        });
    } catch (err) {
        console.error("updateNoteByLabel error:", err.message);
        return res.status(500).json({
            message: "Internal Server error"
        });
    }
};

/**
 * Delete an entry
 */
export const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const deletedEntry = await passwordModel.findOneAndDelete({
            _id: id,
            userId: user._id
        });

        if (!deletedEntry) {
            return res.status(404).json({
                message: "Entry not found"
            });
        }

        return res.status(200).json({
            message: "Entry deleted successfully"
        });
    } catch (err) {
        console.error("deleteNote error:", err.message);
        return res.status(500).json({
            message: "Internal Server error"
        });
    }
};

/**
 * Get all notes (admin use only - returns only labels)
 */
export const getAllNotes = async (req, res) => {
    try {
        const entries = await passwordModel.find()
            .select('label userId createdAt');

        return res.status(200).json({
            message: "All entries retrieved",
            entries
        });
    } catch (err) {
        console.error("getAllNotes error:", err.message);
        return res.status(500).json({
            message: "Internal Server error"
        });
    }
};