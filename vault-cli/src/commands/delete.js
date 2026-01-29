import inquirer from 'inquirer';
import chalk from 'chalk';
import { getUserEntries, deleteEntry } from '../api/client.js';
import { isLoggedIn } from '../utils/config.js';

/**
 * Delete a password entry
 * Confirms before deleting
 */
export async function deleteCommand(label) {
  try {
    // Check authentication
    if (!isLoggedIn()) {
      console.error(chalk.red('Please login first: vault login'));
      process.exit(1);
    }

    // Validate label
    if (!label || label.trim().length === 0) {
      console.error(chalk.red('Label cannot be empty'));
      process.exit(1);
    }

    // Fetch all entries to find ID
    const response = await getUserEntries();
    const entries = response.entries || [];
    const entry = entries.find(e => e.label === label);

    if (!entry) {
      console.error(chalk.red(`\n✗ Entry "${label}" not found\n`));
      process.exit(1);
    }

    // Confirm deletion
    const answer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: chalk.yellow(`Are you sure you want to delete "${label}"? This cannot be undone.`),
        default: false
      }
    ]);

    if (!answer.confirm) {
      console.log(chalk.gray('\nDeletion cancelled.\n'));
      return;
    }

    // Delete entry
    await deleteEntry(entry._id);
    console.log(chalk.green(`\n✓ Entry "${label}" deleted successfully!\n`));

  } catch (error) {
    const message = error.response?.data?.message || error.message;
    console.error(chalk.red('\n✗ Failed to delete entry:'), message);
    process.exit(1);
  }
}