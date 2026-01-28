import inquirer from 'inquirer';
import chalk from 'chalk';
import { getUserNotes, deleteNote } from '../api/client.js';
import { isLoggedIn } from '../utils/config.js';

export async function deleteCommand(label) {
  try {
    if (!isLoggedIn()) {
      console.error(chalk.red('Please login first: vault login'));
      process.exit(1);
    }

    // Fetch all notes to find ID
    const response = await getUserNotes();
    const notes = response.notes || [];
    const note = notes.find(n => n.title === label);

    if (!note) {
      console.error(chalk.red(`\n✗ Entry "${label}" not found\n`));
      process.exit(1);
    }

    // Confirm deletion
    const answer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Are you sure you want to delete "${label}"?`,
        default: false
      }
    ]);

    if (!answer.confirm) {
      console.log(chalk.yellow('\nDeletion cancelled.\n'));
      return;
    }

    await deleteNote(note._id);
    console.log(chalk.green(`\n✓ Entry "${label}" deleted successfully!\n`));
  } catch (error) {
    console.error(chalk.red('\n✗ Failed to delete entry:'), error.response?.data?.message || error.message);
    process.exit(1);
  }
}