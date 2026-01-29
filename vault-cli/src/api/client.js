import axios from 'axios';
import { getConfig, clearConfig, getSession } from '../utils/config.js';
import chalk from 'chalk';

const getApiUrl = () => {
  const config = getConfig();
  return config.get('apiUrl') || process.env.VAULT_API_URL || 'https://password-vault-cli.onrender.com';
};


/**
 * Creates axios instance with JWT Bearer token
 * Uses Authorization header (not cookies) for CLI
 */
function createClient() {
  const session = getSession();
  const token = session.jwt;

  const client = axios.create({
    baseURL: getApiUrl(),

    headers: {
      'Content-Type': 'application/json',
      // Use Bearer token for CLI authentication
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  });

  // Add response interceptor for 401 handling
  client.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        console.error(chalk.red('\n✗ Session expired or invalid. Please login again.'));
        clearConfig();
        process.exit(1);
      }
      return Promise.reject(error);
    }
  );

  return client;
}

/**
 * Login user - returns JWT and vaultSalt
 */
export async function loginUser(email, password) {
  const client = axios.create({
    baseURL: getApiUrl(),

    headers: { 'Content-Type': 'application/json' }
  });
  const response = await client.post('/auth/signin', { email, password });
  return response.data;
}

/**
 * Register new user
 */
export async function registerUser(userData) {
  const client = axios.create({
    baseURL: getApiUrl(),

    headers: { 'Content-Type': 'application/json' }
  });
  const response = await client.post('/auth/signup', userData);
  return response.data;
}

/**
 * Create a new password entry
 * @param {string} label - Entry label
 * @param {Object} encryptedData - { ciphertext, iv, authTag }
 */
export async function createEntry(label, encryptedData) {
  const client = createClient();
  const response = await client.post('/notes/create', {
    label,
    ciphertext: encryptedData.ciphertext,
    iv: encryptedData.iv,
    authTag: encryptedData.authTag
  });
  return response.data;
}

/**
 * Get all entries for current user
 */
export async function getUserEntries() {
  const client = createClient();
  const response = await client.get('/notes/user');
  return response.data;
}

/**
 * Get entry by ID
 */
export async function getEntryById(id) {
  const client = createClient();
  const response = await client.get(`/notes/${id}`);
  return response.data;
}

/**
 * Update an entry
 */
export async function updateEntry(id, label, encryptedData) {
  const client = createClient();
  const response = await client.put(`/notes/update/${id}`, {
    label,
    ciphertext: encryptedData.ciphertext,
    iv: encryptedData.iv,
    authTag: encryptedData.authTag
  });
  return response.data;
}

/**
 * Update an entry by label
 */
export async function updateEntryByLabel(label, encryptedData) {
  const client = createClient();
  const response = await client.put(`/notes/update/label/${label}`, {
    ciphertext: encryptedData.ciphertext,
    iv: encryptedData.iv,
    authTag: encryptedData.authTag
  });
  return response.data;
}

/**
 * Delete an entry
 */
export async function deleteEntry(id) {
  const client = createClient();
  const response = await client.delete(`/notes/delete/${id}`);
  return response.data;
}