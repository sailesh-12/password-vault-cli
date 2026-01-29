# Vault CLI

A secure, zero-knowledge password manager CLI for your terminal.

## Installation

```bash
npm install -g @saileshs/vault-cli
```

## Setup

First, point the CLI to the backend server:

```bash
vault config --url https://password-vault-cli.onrender.com
```

Then create an account or login:

```bash
vault signup
# OR
vault login
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

### Copy to Clipboard directly
You can copy a password directly to your clipboard without displaying it:

```bash
vault get "My Gmail" --copy
# or
vault get "My Gmail" -c
```
