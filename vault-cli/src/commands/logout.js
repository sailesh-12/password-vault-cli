import chalk from 'chalk';
import { clearConfig } from '../utils/config.js';

export async function logoutCommand() {
  try {
    clearConfig();
    console.log(chalk.green('\n✓ Logged out successfully. Vault locked.\n'));
  } catch (error) {
    console.error(chalk.red('\n✗ Logout failed:'), error.message);
    process.exit(1);
  }
}