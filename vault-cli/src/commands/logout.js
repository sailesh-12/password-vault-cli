import chalk from 'chalk';
import { clearConfig } from '../utils/config.js';

/**
 * Logout and lock vault
 * Clears JWT from disk and encryption key from memory
 */
export async function logoutCommand() {
  try {
    // Clear all session data (JWT, salt from disk + key from memory)
    clearConfig();

    console.log(chalk.green('\n✓ Logged out successfully. Vault locked.\n'));

  } catch (error) {
    console.error(chalk.red('\n✗ Logout failed:'), error.message);
    process.exit(1);
  }
}