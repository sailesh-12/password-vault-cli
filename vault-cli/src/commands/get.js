import chalk from 'chalk';
import clipboardy from 'clipboardy';
import { getUserEntries } from '../api/client.js';
import { decrypt } from '../crypto/decrypt.js';
import { ensureUnlocked } from '../utils/config.js';

/**
 * Get and decrypt a password entry
 * Decrypts data client-side using in-memory key
 */
export async function getCommand(label, options) {
  try {
    // Ensure vault is unlocked (prompts for master password if needed)
    await ensureUnlocked();

    // Validate label
    if (!label || label.trim().length === 0) {
      console.error(chalk.red('Label cannot be empty'));
      process.exit(1);
    }

    // Fetch all entries
    const response = await getUserEntries();
    const entries = response.entries || [];

    // Find entry by label
    const entry = entries.find(e => e.label === label);

    if (!entry) {
      console.error(chalk.red(`\n✗ Entry "${label}" not found\n`));
      process.exit(1);
    }

    // Decrypt content using in-memory key
    const encryptedData = {
      ciphertext: entry.ciphertext,
      iv: entry.iv,
      authTag: entry.authTag
    };

    const decryptedData = decrypt(encryptedData, global.encryptionKey);
    const data = JSON.parse(decryptedData);

    // Copy to clipboard or display
    if (options.copy) {
      await clipboardy.write(data.password);
      console.log(chalk.green(`\n✓ Password for "${label}" copied to clipboard!\n`));

      // Auto-clear clipboard after 30 seconds
      setTimeout(async () => {
        try {
          const current = await clipboardy.read();
          if (current === data.password) {
            await clipboardy.write('');
          }
        } catch { }
      }, 30000);

    } else {
      console.log(chalk.blue(`\n🔑 Entry: ${label}\n`));
      console.log(chalk.white(`   Username: ${data.username || 'N/A'}`));
      console.log(chalk.white(`   Password: ${data.password}`));
      if (data.url) {
        console.log(chalk.white(`   URL:      ${data.url}`));
      }
      if (data.notes) {
        console.log(chalk.white(`   Notes:    ${data.notes}`));
      }
      console.log(chalk.gray(`   Created:  ${data.createdAt}`));
      console.log('');
    }

  } catch (error) {
    // Handle decryption errors (wrong master password)
    if (error.message && error.message.includes('Unsupported state')) {
      console.error(chalk.red('\n✗ Decryption failed. Wrong master password?'));
      process.exit(1);
    }

    const message = error.response?.data?.message || error.message;
    console.error(chalk.red('\n✗ Failed to retrieve entry:'), message);
    process.exit(1);
  }
}