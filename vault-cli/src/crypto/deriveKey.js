import crypto from 'crypto';

/**
 * Derives encryption key from master password using PBKDF2
 * @param {string} masterPassword - User's master password
 * @param {string} salt - Salt from backend (hex string)
 * @returns {Buffer} 32-byte encryption key
 */
export function deriveKey(masterPassword, salt) {
  const iterations = 150000; // Security: High iteration count
  const keyLength = 32; // 256 bits for AES-256
  const digest = 'sha256';

  // Convert hex salt to Buffer
  const saltBuffer = Buffer.from(salt, 'hex');

  // Derive key using PBKDF2
  const key = crypto.pbkdf2Sync(
    masterPassword,
    saltBuffer,
    iterations,
    keyLength,
    digest
  );

  return key;
}