import inquirer from 'inquirer';
import chalk from 'chalk';
import { loginUser } from '../api/client.js';
import { saveSession } from '../utils/config.js';
import { deriveKey } from '../crypto/deriveKey.js';
import crypto from 'crypto';

export async function loginCommand() {
  try {
    console.log(chalk.blue.bold('\n🔐 Vault Login\n'));

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'email',
        message: 'Email:',
        validate: input => input.includes('@') || 'Invalid email'
      },
      {
        type: 'password',
        name: 'password',
        message: 'Password:',
        mask: '*'
      }
    ]);

    // Login to backend
    const response = await loginUser(answers.email, answers.password);
    
    // Debug: Log the full response structure
    console.log(chalk.gray('Response structure:'), JSON.stringify(response, null, 2));
    
    // Extract token from response
    const token = response.token || response.data?.token || response.accessToken || response.jwt;
    
    if (!token) {
      console.error(chalk.red('No token found in response!'));
      console.log('Response keys:', Object.keys(response));
      process.exit(1);
    }
    
    console.log(chalk.gray(`Token received: ${token.substring(0, 20)}...`));
    
    // Generate salt for this user
    const salt = crypto.randomBytes(32).toString('hex');

    // Prompt for master password
    const masterAnswer = await inquirer.prompt([
      {
        type: 'password',
        name: 'masterPassword',
        message: 'Master Password (for encryption):',
        mask: '*'
      }
    ]);

    // Derive encryption key
    const encryptionKey = deriveKey(masterAnswer.masterPassword, salt);

    // Save JWT, salt, and encryption key
    saveSession(token, salt, encryptionKey);

    console.log(chalk.green('\n✓ Login successful! Vault unlocked.\n'));
  } catch (error) {
    console.error(chalk.red('\n✗ Login failed:'), error.response?.data?.message || error.message);
    process.exit(1);
  }
}