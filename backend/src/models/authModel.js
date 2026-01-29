import mongoose from "mongoose";
const { Schema } = mongoose;

const authSchema = new Schema({
	username: {
		type: String,
		minLength: 6,
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true,
		minLength: 8,
	},

	date_of_birth: {
		type: Date,
		required: true
	},
	// Vault salt for client-side key derivation (64-char hex = 32 bytes)
	vaultSalt: {
		type: String,
		required: true
	}

});

const authModel = mongoose.model("auth_infos", authSchema);

export default authModel

