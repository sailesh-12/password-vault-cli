# Vault CLI

A secure, zero-knowledge password manager CLI for your terminal.

[![npm version](https://img.shields.io/npm/v/@saileshs/vault-cli.svg)](https://www.npmjs.com/package/@saileshs/vault-cli)

## Installation

```bash
npm install -g @saileshs/vault-cli
```

## Quick Start

```bash
# Create an account
vault signup

# Login to your vault
vault login

# Add a password
vault add "My Gmail"

# Retrieve a password
vault get "My Gmail"
```

## Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `signup` | Create a new account | `vault signup` |
| `login` | Login to your vault | `vault login` |
| `add` | Add a new password | `vault add "My Gmail"` |
| `get` | Get a password | `vault get "My Gmail"` |
| `list` | List all saved passwords | `vault list` |
| `update` | Update an existing password | `vault update "My Gmail"` |
| `delete` | Delete a password | `vault delete "My Gmail"` |
| `logout` | Lock the vault and clear session | `vault logout` |
| `config` | View or change settings | `vault config --list` |

### Copy to Clipboard

Copy a password directly to your clipboard without displaying it:

```bash
vault get "My Gmail" --copy
# or
vault get "My Gmail" -c
```

### Configuration

View current settings:
```bash
vault config --list
```

Set a custom backend URL:
```bash
vault config --url https://your-backend.com
```

## Security

- **Zero-knowledge encryption**: All passwords are encrypted client-side before being sent to the server.
- **Master password never leaves your device**: Your master password is used to derive an encryption key locally.
- **AES-256-GCM encryption**: Industry-standard encryption for your sensitive data.

## License

MIT
