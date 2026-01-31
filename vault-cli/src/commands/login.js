import inquirer from 'inquirer';
import chalk from 'chalk';
import { loginUser } from '../api/client.js';
import { saveSession, getSession, isLoggedIn, isVaultUnlocked, createMasterPasswordHash, verifyMasterPassword } from '../utils/config.js';
import { deriveKey } from '../crypto/deriveKey.js';

/**
 * Login command handler
 * 1. Authenticate with backend
 * 2. Receive JWT + vaultSalt
 * 3. Prompt for master password
 * 4. Derive encryption key (stored in memory ONLY)
 */
export async function loginCommand() {
  try {
    console.log(chalk.blue.bold('\n🔐 Vault Login\n'));

    // If already have JWT but need to unlock vault
    if (isLoggedIn() && !isVaultUnlocked()) {
      const session = getSession();
      console.log(chalk.yellow('Session found. Enter master password to unlock vault.\n'));

      const masterAnswer = await inquirer.prompt([
        {
          type: 'password',
          name: 'masterPassword',
          message: 'Master Password:',
          mask: '*',
          validate: input => input.length >= 1 || 'Password cannot be empty'
        }
      ]);

      // Verify master password before deriving key
      if (!verifyMasterPassword(masterAnswer.masterPassword, session.salt)) {
        console.error(chalk.red('\n✗ Incorrect master password. Please try again.\n'));
        process.exit(1);
      }

      // Derive encryption key using stored salt
      const encryptionKey = deriveKey(masterAnswer.masterPassword, session.salt);

      // Store in memory only
      global.encryptionKey = encryptionKey;

      console.log(chalk.green('\n✓ Vault unlocked!\n'));
      return;
    }

    // Full login flow
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'email',
        message: 'Email:',
        validate: input => input.includes('@') || 'Please enter a valid email'
      },
      {
        type: 'password',
        name: 'password',
        message: 'Password:',
        mask: '*',
        validate: input => input.length >= 1 || 'Password cannot be empty'
      }
    ]);

    // Login to backend
    console.log(chalk.gray('Authenticating...'));
    const response = await loginUser(answers.email, answers.password);

    // Extract token and vaultSalt from response
    const token = response.token;
    const vaultSalt = response.vaultSalt;

    if (!token) {
      console.error(chalk.red('Login failed: No token received'));
      process.exit(1);
    }

    if (!vaultSalt) {
      console.error(chalk.red('Login failed: No vault salt received. Please create a new account.'));
      process.exit(1);
    }

    // Prompt for master password
    const masterAnswer = await inquirer.prompt([
      {
        type: 'password',
        name: 'masterPassword',
        message: 'Master Password (for encryption):',
        mask: '*',
        validate: input => input.length >= 1 || 'Password cannot be empty'
      }
    ]);

    // Derive encryption key using PBKDF2
    console.log(chalk.gray('Deriving encryption key...'));
    const encryptionKey = deriveKey(masterAnswer.masterPassword, vaultSalt);

    // Create master password hash for verification on future unlocks
    const masterPasswordHash = createMasterPasswordHash(masterAnswer.masterPassword, vaultSalt);

    // Save session - key goes to memory only, not disk
    // Master password hash is stored for verification
    saveSession(token, vaultSalt, encryptionKey, masterPasswordHash);

    console.log(chalk.green('\n✓ Login successful! Vault unlocked.\n'));

  } catch (error) {
    const message = error.response?.data?.message || error.message;
    console.error(chalk.red('\n✗ Login failed:'), message);
    process.exit(1);
  }
}