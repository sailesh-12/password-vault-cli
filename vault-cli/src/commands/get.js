import chalk from 'chalk';
import clipboardy from 'clipboardy';
import { getUserNotes } from '../api/client.js';
import { decrypt } from '../crypto/decrypt.js';
import { isLoggedIn, getSession } from '../utils/config.js';

export async function getCommand(label, options) {
  try {
    if (!isLoggedIn()) {
      console.error(chalk.red('Please login first: vault login'));
      process.exit(1);
    }

    const session = getSession();
    if (!session.encryptionKey) {
      console.error(chalk.red('Vault is locked. Please login again.'));
      process.exit(1);
    }

    // Fetch all notes
    const response = await getUserNotes();
    const notes = response.notes || [];

    // Find note by label
    const note = notes.find(n => n.title === label);

    if (!note) {
      console.error(chalk.red(`\n✗ Entry "${label}" not found\n`));
      process.exit(1);
    }

    // Decrypt content
    const encryptedData = JSON.parse(note.content);
    const decryptedData = decrypt(encryptedData, session.encryptionKey);
    const data = JSON.parse(decryptedData);

    // Display or copy
    if (options.copy) {
      await clipboardy.write(data.password);
      console.log(chalk.green(`\n✓ Password copied to clipboard!\n`));
    } else {
      console.log(chalk.blue(`\n🔑 Entry: ${label}\n`));
      console.log(chalk.white(`Username: ${data.username || 'N/A'}`));
      console.log(chalk.white(`Password: ${data.password}`));
      console.log(chalk.white(`Notes: ${data.notes || 'N/A'}`));
      console.log(chalk.gray(`Created: ${data.createdAt}\n`));
    }
  } catch (error) {
    console.error(chalk.red('\n✗ Failed to retrieve entry:'), error.message);
    process.exit(1);
  }
}