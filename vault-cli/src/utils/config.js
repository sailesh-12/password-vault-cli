import Conf from 'conf';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { deriveKey } from '../crypto/deriveKey.js';

/**
 * Secure config storage
 * SECURITY: Only JWT and salt are persisted to disk
 * Encryption key is stored ONLY in global.encryptionKey (memory)
 */
const config = new Conf({
  projectName: 'secure-vault',
  encryptionKey: 'vault-cli-config-encryption-key-v1' // Encrypts config file on disk
});

/**
 * Get the config store instance
 */
export function getConfig() {
  return config;
}

/**
 * Save session data after login
 * SECURITY: encryptionKey is stored in memory only (global.encryptionKey)
 */
export function saveSession(jwt, salt, encryptionKey) {
  config.set('jwt', jwt);
  config.set('salt', salt);
  global.encryptionKey = encryptionKey;
}

/**
 * Get current session
 */
export function getSession() {
  return {
    jwt: config.get('jwt'),
    salt: config.get('salt'),
    encryptionKey: global.encryptionKey || null
  };
}

/**
 * Clear all session data
 */
export function clearConfig() {
  config.clear();
  if (global.encryptionKey) {
    try { global.encryptionKey.fill(0); } catch { }
    global.encryptionKey = null;
  }
}

/**
 * Check if user is logged in (has JWT)
 */
export function isLoggedIn() {
  return !!config.get('jwt');
}

/**
 * Check if vault is unlocked (has encryption key in memory)
 */
export function isVaultUnlocked() {
  return !!global.encryptionKey;
}

/**
 * Ensure vault is unlocked - prompts for master password if needed
 * Call this in commands that need encryption/decryption
 */
export async function ensureUnlocked() {
  if (!isLoggedIn()) {
    console.error(chalk.red('Please login first: vault login'));
    process.exit(1);
  }

  // If already unlocked, return
  if (isVaultUnlocked()) {
    return;
  }

  // Prompt for master password to unlock
  const salt = config.get('salt');
  if (!salt) {
    console.error(chalk.red('Session corrupted. Please login again: vault login'));
    clearConfig();
    process.exit(1);
  }

  console.log(chalk.yellow('🔒 Vault is locked. Enter master password to unlock:\n'));

  const answer = await inquirer.prompt([
    {
      type: 'password',
      name: 'masterPassword',
      message: 'Master Password:',
      mask: '*',
      validate: input => input.length >= 1 || 'Password cannot be empty'
    }
  ]);

  // Derive encryption key
  const encryptionKey = deriveKey(answer.masterPassword, salt);
  global.encryptionKey = encryptionKey;

  console.log(chalk.green('✓ Vault unlocked\n'));
}