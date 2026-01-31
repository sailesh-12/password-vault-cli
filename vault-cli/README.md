# Vault CLI

A secure, zero-knowledge password manager for your terminal.

[![npm version](https://img.shields.io/npm/v/@saileshs/vault-cli.svg)](https://www.npmjs.com/package/@saileshs/vault-cli)

## Installation

```bash
npm install -g @saileshs/vault-cli
```

## Quick Start

```bash
vault signup     # Create account
vault login      # Login
vault add gmail  # Save a password
vault get gmail  # Retrieve it
vault list       # See all entries
```

## Commands

| Command | Description |
|---------|-------------|
| `signup` | Create a new account |
| `login` | Login to your vault |
| `add <label>` | Add a new password |
| `get <label>` | Retrieve a password |
| `list` | List all entries |
| `update <label>` | Update a password |
| `delete <label>` | Delete an entry |
| `logout` | Lock vault |

### Options

```bash
vault get gmail --copy  # Copy to clipboard
vault config --list     # View settings
```

## Security

- **Zero-knowledge architecture**: Your master password is **never sent to the server**
- **Client-side encryption**: All passwords are encrypted locally before upload
- **AES-256-GCM**: Industry-standard encryption
- **Server only stores encrypted data**: Even we can't read your passwords

## License

MIT
