import chalk from 'chalk';
import { getConfig } from '../utils/config.js';

export async function configCommand(cmd) {
    const config = getConfig();

    // If setting a URL
    if (cmd.url) {
        config.set('apiUrl', cmd.url);
        console.log(chalk.green(`\n✓ API URL set to: ${cmd.url}`));
        return;
    }

    // If getting current config
    if (cmd.list) {
        const currentUrl = config.get('apiUrl') || process.env.VAULT_API_URL || 'http://localhost:3000';
        console.log(chalk.blue.bold('\nCurrent Configuration:'));
        console.log(chalk.gray('API URL:'), currentUrl);
        console.log('');
        return;
    }

    // Help if no options
    console.log(chalk.yellow('Usage: vault config --url <url>'));
}
