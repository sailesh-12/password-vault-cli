# How to Publish Your Vault CLI to NPM

"name": "@secure-vault/cli"
**Important**:
- If you own the organization `secure-vault` on NPM, this is fine.
- If **not**,/you must rename it to something you own, like `@<your-username>/vault-cli` or just `my-vault-cli`.
- Open `package.json` and change the `"name"` field if needed.

## Step 2: Login to NPM

Run this in your terminal:
```bash
npm login
```
Follow the prompts to authenticate.

## Step 3: Publish

### If using a scoped name (starts with `@`)
Scoped packages are private by default. To publish publicly:
```bash
npm publish --access public
```

### If using a normal name (no `@`)
```bash
npm publish
```

## Step 4: Installation for Users

Once published, users can install and use it:

```bash
# Install globally
npm install -g @your-username/vault-cli

# Configure the backend URL (if they self-host or if you have a public server)
vault config --url https://your-backend-api.com
vault login
```

## Local Testing (Before Publishing)
To test it on your machine as if it were installed globally:
```bash
# In the vault-cli directory
npm link

# Now you can run 'vault' anywhere
vault --help
```
