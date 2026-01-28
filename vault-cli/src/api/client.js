import axios from 'axios';
import { getConfig, clearConfig } from '../utils/config.js';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

const API_URL = process.env.VAULT_API_URL || 'http://localhost:3000';

// Create a cookie jar to persist cookies
const jar = new CookieJar();

/**
 * Creates axios instance with cookie support
 */
function createClient() {
  const config = getConfig();
  const token = config.get('jwt');
  
  const client = wrapper(axios.create({
    baseURL: API_URL,
    withCredentials: true,
    jar,
    headers: {
      'Content-Type': 'application/json'
    }
  }));

  // If we have a token, set it as a cookie manually
  if (token) {
    const cookie = `token=${token}; Path=/; HttpOnly`;
    jar.setCookieSync(cookie, API_URL);
  }

  return client;
}

export async function loginUser(email, password) {
  const client = createClient();
  const response = await client.post('/auth/signin', { email, password });
  return response.data;
}

export async function registerUser(email, password) {
  const client = createClient();
  const response = await client.post('/auth/signup', { email, password });
  return response.data;
}

export async function createNote(title, encryptedData) {
  const client = createClient();
  const response = await client.post('/notes/createnote', {
    title,
    content: JSON.stringify(encryptedData),
    password: 'encrypted' // Backend requires this field
  });
  return response.data;
}

export async function getUserNotes() {
  const client = createClient();
  const response = await client.get('/notes/user');
  return response.data;
}

export async function getNoteById(id) {
  const client = createClient();
  const response = await client.get(`/notes/${id}`);
  return response.data;
}

export async function updateNote(id, title, encryptedData) {
  const client = createClient();
  const response = await client.put(`/notes/update/${id}`, {
    title,
    content: JSON.stringify(encryptedData),
    password: 'encrypted'
  });
  return response.data;
}

export async function deleteNote(id) {
  const client = createClient();
  const response = await client.delete(`/notes/delete/${id}`);
  return response.data;
}

export async function decryptPassword(id) {
  const client = createClient();
  const response = await client.get(`/notes/decrypt/${id}`);
  return response.data;
}

export async function getAllNotes() {
  const client = createClient();
  const response = await client.get('/notes');
  return response.data;
}

// Axios interceptor for 401 handling
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.error('Session expired. Please login again.');
      clearConfig();
      process.exit(1);
    }
    return Promise.reject(error);
  }
);