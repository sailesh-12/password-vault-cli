import Conf from 'conf';

const config = new Conf({
  projectName: 'secure-vault',
  encryptionKey: 'vault-cli-config-encryption-key-v1' // Encrypts config file
});

export function getConfig() {
  return config;
}

export function saveSession(jwt, salt, encryptionKey) {
  config.set('jwt', jwt);
  config.set('salt', salt);
  // Store encryption key as hex string (encrypted by Conf)
  config.set('encryptionKey', encryptionKey.toString('hex'));
}

export function getSession() {
  return {
    jwt: config.get('jwt'),
    salt: config.get('salt'),
    encryptionKey: config.get('encryptionKey') 
      ? Buffer.from(config.get('encryptionKey'), 'hex')
      : null
  };
}

export function clearConfig() {
  config.clear();
}

export function isLoggedIn() {
  return !!config.get('jwt') && !!config.get('encryptionKey');
}