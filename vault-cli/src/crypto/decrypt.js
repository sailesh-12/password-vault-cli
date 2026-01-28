import crypto from 'crypto';

/**
 * Decrypts data using AES-256-GCM
 * @param {Object} encryptedData - { ciphertext, iv, authTag } in hex format
 * @param {Buffer} key - 32-byte encryption key
 * @returns {string} Decrypted plaintext
 */
export function decrypt(encryptedData, key) {
  const { ciphertext, iv, authTag } = encryptedData;
  
  // Convert hex strings to Buffers
  const ivBuffer = Buffer.from(iv, 'hex');
  const authTagBuffer = Buffer.from(authTag, 'hex');
  
  // Create decipher
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, ivBuffer);
  decipher.setAuthTag(authTagBuffer);
  
  // Decrypt data
  let plaintext = decipher.update(ciphertext, 'hex', 'utf8');
  plaintext += decipher.final('utf8');
  
  return plaintext;
}