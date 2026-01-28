import crypto from 'crypto';

/**
 * Encrypts data using AES-256-GCM
 * @param {string} plaintext - Data to encrypt
 * @param {Buffer} key - 32-byte encryption key
 * @returns {Object} { ciphertext, iv, authTag } in hex format
 */
export function encrypt(plaintext, key) {
  // Generate random IV (12 bytes recommended for GCM)
  const iv = crypto.randomBytes(12);
  
  // Create cipher
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
  // Encrypt data
  let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
  ciphertext += cipher.final('hex');
  
  // Get authentication tag
  const authTag = cipher.getAuthTag();
  
  return {
    ciphertext,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
}