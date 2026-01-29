import jsonwebtoken from 'jsonwebtoken';
import authModel from '../models/authModel.js';

/**
 * Authentication middleware
 * Supports both cookie-based (web) and Bearer token (CLI) authentication
 */
export const authMiddleware = async (req, res, next) => {
	try {
		// Try to get token from cookie first (web), then Authorization header (CLI)
		let token = req.cookies?.token;

		// If no cookie, check Authorization header (Bearer token)
		if (!token) {
			const authHeader = req.headers.authorization;
			if (authHeader && authHeader.startsWith('Bearer ')) {
				token = authHeader.substring(7);
			}
		}

		if (!token) {
			return res.status(401).json({
				message: "No authentication token provided"
			});
		}

		// Verify token
		const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);

		// Find user
		const user = await authModel.findById(decoded.id).select("-password");

		if (!user) {
			return res.status(401).json({ message: "Invalid token - user not found" });
		}

		req.user = user;
		next();

	} catch (err) {
		if (err.name === 'TokenExpiredError') {
			return res.status(401).json({ message: "Token expired" });
		}
		if (err.name === 'JsonWebTokenError') {
			return res.status(401).json({ message: "Invalid token" });
		}
		console.error("Auth middleware error:", err.name, err.message);
		return res.status(500).json({ message: "Authentication error: " + err.message });
	}
};