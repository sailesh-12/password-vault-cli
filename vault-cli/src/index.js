#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { loginCommand } from './commands/login.js';
import { addCommand } from './commands/add.js';
import { getCommand } from './commands/get.js';
import { listCommand } from './commands/list.js';
import { deleteCommand } from './commands/delete.js';
import { logoutCommand } from './commands/logout.js';

const program = new Command();

program
  .name('vault')
  .description('Zero-knowledge password manager CLI')
  .version('1.0.0');

program
  .command('login')
  .description('Login to your vault')
  .action(loginCommand);

program
  .command('add <label>')
  .description('Add a new password entry')
  .action(addCommand);

program
  .command('get <label>')
  .description('Retrieve a password entry')
  .option('-c, --copy', 'Copy password to clipboard')
  .action(getCommand);

program
  .command('list')
  .description('List all password labels')
  .action(listCommand);

program
  .command('delete <label>')
  .description('Delete a password entry')
  .action(deleteCommand);

program
  .command('logout')
  .description('Logout and clear session')
  .action(logoutCommand);

// Handle process exit to clear encryption key
process.on('exit', () => {
  if (global.encryptionKey) {
    global.encryptionKey = null;
  }
});

process.on('SIGINT', () => {
  console.log(chalk.yellow('\n\nVault locked. Session cleared.'));
  process.exit(0);
});

program.parse(process.argv);