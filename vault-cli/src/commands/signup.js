import inquirer from 'inquirer';
import chalk from 'chalk';
import { registerUser } from '../api/client.js';

/**
 * Signup command handler
 * 1. Prompt for email and password
 * 2. Send request to backend
 */
export async function signupCommand() {
    try {
        console.log(chalk.blue.bold('\n📝 Create Account\n'));

        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'username',
                message: 'Username:',
                validate: input => input.length >= 2 || 'Username must be at least 2 characters'
            },
            {
                type: 'input',
                name: 'dateOfBirth',
                message: 'Date of Birth (YYYY-MM-DD):',
                validate: input => {
                    const valid = /^\d{4}-\d{2}-\d{2}$/.test(input);
                    if (valid) return true;
                    return 'Please enter a valid date (YYYY-MM-DD)';
                }
            },
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
                validate: input => input.length >= 6 || 'Password must be at least 6 characters'
            },
            {
                type: 'password',
                name: 'confirmPassword',
                message: 'Confirm Password:',
                mask: '*',
                validate: (input, answers) => input === answers.password || 'Passwords do not match'
            }
        ]);

        console.log(chalk.gray('Creating account...'));

        // Send all required fields to backend
        await registerUser({
            username: answers.username,
            date_of_birth: answers.dateOfBirth,
            email: answers.email,
            password: answers.password
        });

        console.log(chalk.green('\n✓ Account created successfully!'));
        console.log(chalk.white('You can now login using: ') + chalk.cyan('vault login\n'));

    } catch (error) {
        const message = error.response?.data?.message || error.message;
        console.error(chalk.red('\n✗ Signup failed:'), message);
        process.exit(1);
    }
}
