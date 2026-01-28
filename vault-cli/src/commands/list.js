import chalk from 'chalk';
import { getUserNotes } from '../api/client.js';
import { isLoggedIn } from '../utils/config.js';

export async function listCommand() {
  try {
    if (!isLoggedIn()) {
      console.error(chalk.red('Please login first: vault login'));
      process.exit(1);
    }

    const response = await getUserNotes();
    const notes = response.notes || [];

    if (notes.length === 0) {
      console.log(chalk.yellow('\nNo entries found. Add one with: vault add <label>\n'));
      return;
    }

    console.log(chalk.blue.bold(`\n📋 Your Vault Entries (${notes.length})\n`));
    
    notes.forEach((note, index) => {
      console.log(chalk.white(`${index + 1}. ${note.title}`));
    });
    
    console.log('');
  } catch (error) {
    console.error(chalk.red('\n✗ Failed to list entries:'), error.response?.data?.message || error.message);
    process.exit(1);
  }
}