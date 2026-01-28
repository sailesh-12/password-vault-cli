import inquirer from 'inquirer';
import chalk from 'chalk';
import { createNote } from '../api/client.js';
import { encrypt } from '../crypto/encrypt.js';
import { isLoggedIn, getSession } from '../utils/config.js';

export async function addCommand(label) {
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

    console.log(chalk.blue(`\n📝 Adding new entry: ${label}\n`));

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'username',
        message: 'Username (optional):',
      },
      {
        type: 'password',
        name: 'password',
        message: 'Password:',
        mask: '*',
        validate: input => input.length > 0 || 'Password cannot be empty'
      },
      {
        type: 'input',
        name: 'notes',
        message: 'Notes (optional):',
      }
    ]);

    // Prepare data to encrypt
    const dataToEncrypt = JSON.stringify({
      username: answers.username,
      password: answers.password,
      notes: answers.notes,
      createdAt: new Date().toISOString()
    });

    // Encrypt data client-side
    const encryptedData = encrypt(dataToEncrypt, session.encryptionKey);

    // Send encrypted blob to backend
    await createNote(label, encryptedData);

    console.log(chalk.green(`\n✓ Entry "${label}" added successfully!\n`));
  } catch (error) {
    console.error(chalk.red('\n✗ Failed to add entry:'), error.response?.data?.message || error.message);
    process.exit(1);
  }
}