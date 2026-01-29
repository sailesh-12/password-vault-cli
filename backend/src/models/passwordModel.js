import mongoose, { Schema } from 'mongoose';

/**
 * Password entry schema for zero-knowledge storage
 * Server stores ONLY encrypted blobs - never decrypts
 */
const passwordSchema = mongoose.Schema({
	// Human-readable label for the entry
	label: {
		type: String,
		required: true
	},
	// AES-256-GCM encrypted data (hex string)
	ciphertext: {
		type: String,
		required: true,
	},
	// Initialization vector (hex string, 12 bytes = 24 chars)
	iv: {
		type: String,
		required: true
	},
	// GCM authentication tag (hex string, 16 bytes = 32 chars)
	authTag: {
		type: String,
		required: true
	},
	// Reference to user who owns this entry
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'auth_infos',
		required: true
	}
}, {
	timestamps: true
});

// Compound index for efficient user lookups
passwordSchema.index({ userId: 1, label: 1 });

const passwordModel = mongoose.model("passwords", passwordSchema);

export default passwordModel;