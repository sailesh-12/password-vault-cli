import inquirer from 'inquirer';
import chalk from 'chalk';
import { updateEntryByLabel } from '../api/client.js';
import { encrypt } from '../crypto/encrypt.js';
import { ensureUnlocked } from '../utils/config.js';

/**
 * Update an existing password entry
 * Overwrites existing entry with new data
 */
export async function updateCommand(label) {
    try {
        // Ensure vault is unlocked
        await ensureUnlocked();

        // Validate label
        if (!label || label.trim().length === 0) {
            console.error(chalk.red('Label cannot be empty'));
            process.exit(1);
        }

        console.log(chalk.blue(`\n📝 Updating entry: ${label}\n`));
        console.log(chalk.yellow('Note: This will overwrite the existing entry.\n'));

        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'username',
                message: 'New Username (b to leave blank):',
            },
            {
                type: 'password',
                name: 'password',
                message: 'New Password:',
                mask: '*',
                validate: input => input.length > 0 || 'Password cannot be empty'
            },
            {
                type: 'input',
                name: 'url',
                message: 'New URL (optional):',
            },
            {
                type: 'input',
                name: 'notes',
                message: 'New Notes (optional):',
            }
        ]);

        // Prepare data to encrypt
        const dataToEncrypt = JSON.stringify({
            username: answers.username === 'b' ? '' : answers.username,
            password: answers.password,
            url: answers.url || '',
            notes: answers.notes || '',
            updatedAt: new Date().toISOString()
        });

        // Encrypt data client-side using in-memory key
        const encryptedData = encrypt(dataToEncrypt, global.encryptionKey);

        // Send encrypted blob to backend
        console.log(chalk.gray('Updating entry...'));
        await updateEntryByLabel(label, encryptedData);

        console.log(chalk.green(`\n✓ Entry "${label}" updated successfully!\n`));

    } catch (error) {
        const message = error.response?.data?.message || error.message;
        console.error(chalk.red('\n✗ Failed to update entry:'), message);
        process.exit(1);
    }
}
