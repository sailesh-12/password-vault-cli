import inquirer from 'inquirer';
import chalk from 'chalk';
import { createEntry } from '../api/client.js';
import { encrypt } from '../crypto/encrypt.js';
import { ensureUnlocked } from '../utils/config.js';

/**
 * Add a new password entry
 * Encrypts data client-side before sending to server
 */
export async function addCommand(label) {
  try {
    // Ensure vault is unlocked (prompts for master password if needed)
    await ensureUnlocked();

    // Validate label
    if (!label || label.trim().length === 0) {
      console.error(chalk.red('Label cannot be empty'));
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
        name: 'url',
        message: 'URL (optional):',
      },
      {
        type: 'input',
        name: 'notes',
        message: 'Notes (optional):',
      }
    ]);

    // Prepare data to encrypt
    const dataToEncrypt = JSON.stringify({
      username: answers.username || '',
      password: answers.password,
      url: answers.url || '',
      notes: answers.notes || '',
      createdAt: new Date().toISOString()
    });

    // Encrypt data client-side using in-memory key
    const encryptedData = encrypt(dataToEncrypt, global.encryptionKey);

    // Send encrypted blob to backend
    console.log(chalk.gray('Saving entry...'));
    await createEntry(label, encryptedData);

    console.log(chalk.green(`\n✓ Entry "${label}" added successfully!\n`));

  } catch (error) {
    const message = error.response?.data?.message || error.message;
    console.error(chalk.red('\n✗ Failed to add entry:'), message);
    process.exit(1);
  }
}