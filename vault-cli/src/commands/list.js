import chalk from 'chalk';
import { getUserEntries } from '../api/client.js';
import { isLoggedIn } from '../utils/config.js';

/**
 * List all password entry labels
 * Shows only labels - no secrets exposed
 */
export async function listCommand() {
  try {
    // Check authentication
    if (!isLoggedIn()) {
      console.error(chalk.red('Please login first: vault login'));
      process.exit(1);
    }

    // Fetch all entries
    const response = await getUserEntries();
    const entries = response.entries || [];

    if (entries.length === 0) {
      console.log(chalk.yellow('\nNo entries found. Add one with: vault add <label>\n'));
      return;
    }

    console.log(chalk.blue.bold(`\n📋 Your Vault Entries (${entries.length})\n`));

    entries.forEach((entry, index) => {
      const date = new Date(entry.createdAt).toLocaleDateString();
      console.log(chalk.white(`  ${index + 1}. ${entry.label}`) + chalk.gray(` (${date})`));
    });

    console.log('');
    console.log(chalk.gray('Use: vault get <label> to decrypt an entry'));
    console.log('');

  } catch (error) {
    const message = error.response?.data?.message || error.message;
    console.error(chalk.red('\n✗ Failed to list entries:'), message);
    process.exit(1);
  }
}