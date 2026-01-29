#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { loginCommand } from './commands/login.js';
import { signupCommand } from './commands/signup.js';
import { addCommand } from './commands/add.js';
import { getCommand } from './commands/get.js';
import { listCommand } from './commands/list.js';
import { deleteCommand } from './commands/delete.js';
import { logoutCommand } from './commands/logout.js';
import { updateCommand } from './commands/update.js';

import { configCommand } from './commands/config.js';

const program = new Command();

program
  .command('config')
  .description('Configure CLI settings')
  .option('--url <url>', 'Set the API URL')
  .option('--list', 'List current configuration')
  .action(configCommand);


program
  .name('vault')
  .description('Zero-knowledge password manager CLI')
  .version('1.0.0');

program
  .command('login')
  .alias('signin')
  .description('Login to your vault and unlock with master password')
  .action(loginCommand);

program
  .command('signup')
  .alias('register')
  .description('Create a new account')
  .action(signupCommand);

program
  .command('add <label>')
  .description('Add a new password entry')
  .action(addCommand);

program
  .command('get <label>')
  .description('Retrieve and decrypt a password entry')
  .option('-c, --copy', 'Copy password to clipboard instead of displaying')
  .action(getCommand);

program
  .command('list')
  .description('List all password entry labels')
  .action(listCommand);

program
  .command('delete <label>')
  .description('Delete a password entry')
  .action(deleteCommand);

program
  .command('logout')
  .description('Logout and lock vault')
  .action(logoutCommand);

program
  .command('update <label>')
  .description('Update a password entry')
  .action(updateCommand);

/**
 * SECURITY: Clear encryption key from memory on process exit
 * This ensures the key is never left in memory after the CLI exits
 */
function clearEncryptionKey() {
  if (global.encryptionKey) {
    // Zero out the buffer before releasing
    try {
      global.encryptionKey.fill(0);
    } catch { }
    global.encryptionKey = null;
  }
}

// Handle normal exit
process.on('exit', clearEncryptionKey);

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n\n🔒 Vault locked. Session cleared.'));
  clearEncryptionKey();
  process.exit(0);
});

// Handle termination
process.on('SIGTERM', () => {
  clearEncryptionKey();
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(chalk.red('\n✗ Unexpected error:'), err.message);
  clearEncryptionKey();
  process.exit(1);
});

program.parse(process.argv);