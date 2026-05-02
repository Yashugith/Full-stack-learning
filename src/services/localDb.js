/**
 * localDb.js — CargoMind Browser Database
 *
 * Uses IndexedDB (built into every browser) to persist:
 *   - users     → { id, name, email, mobile, passwordHash, createdAt, verified }
 *   - sessions  → { token, userId, expiresAt }
 *   - otpStore  → { key, otp, expiresAt, attempts }
 *
 * Passwords hashed with SHA-256 via Web Crypto API (zero deps, browser-native).
 */

const DB_NAME = 'cargomind_db';
const DB_VERSION = 1;

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('users')) {
        const users = db.createObjectStore('users', { keyPath: 'id' });
        users.createIndex('email', 'email', { unique: true });
        users.createIndex('mobile', 'mobile', { unique: true });
      }
      if (!db.objectStoreNames.contains('sessions')) {
        const sessions = db.createObjectStore('sessions', { keyPath: 'token' });
        sessions.createIndex('userId', 'userId', { unique: false });
      }
      if (!db.objectStoreNames.contains('otpStore')) {
        db.createObjectStore('otpStore', { keyPath: 'key' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbGet(store, key) {
  const db = await openDb();
  return new Promise((res, rej) => {
    const req = db.transaction(store, 'readonly').objectStore(store).get(key);
    req.onsuccess = () => res(req.result || null);
    req.onerror = () => rej(req.error);
  });
}

async function dbGetByIndex(store, idx, val) {
  const db = await openDb();
  return new Promise((res, rej) => {
    const req = db.transaction(store, 'readonly').objectStore(store).index(idx).get(val);
    req.onsuccess = () => res(req.result || null);
    req.onerror = () => rej(req.error);
  });
}

async function dbPut(store, record) {
  const db = await openDb();
  return new Promise((res, rej) => {
    const req = db.transaction(store, 'readwrite').objectStore(store).put(record);
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}

async function dbDelete(store, key) {
  const db = await openDb();
  return new Promise((res, rej) => {
    const req = db.transaction(store, 'readwrite').objectStore(store).delete(key);
    req.onsuccess = () => res();
    req.onerror = () => rej(req.error);
  });
}

// ── SHA-256 via Web Crypto API (browser built-in) ──────────────────────────
export async function hashPassword(password) {
  const salt = 'cargomind_v1_salt';
  const data = new TextEncoder().encode(password + salt);
  const buf = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateToken() {
  const arr = new Uint8Array(32);
  window.crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateOtp() {
  const arr = new Uint8Array(3);
  window.crypto.getRandomValues(arr);
  return (((arr[0] << 16) | (arr[1] << 8) | arr[2]) % 900000 + 100000).toString();
}

// ── USER OPS ────────────────────────────────────────────────────────────────
export async function registerUser({ name, email, mobile, password }) {
  const existingEmail = await dbGetByIndex('users', 'email', email.toLowerCase());
  if (existingEmail) throw new Error('EMAIL_EXISTS');
  const existingMobile = await dbGetByIndex('users', 'mobile', mobile.replace(/\D/g, ''));
  if (existingMobile) throw new Error('MOBILE_EXISTS');

  const passwordHash = await hashPassword(password);
  const user = {
    id: generateToken(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    mobile: mobile.replace(/\D/g, ''),
    passwordHash,
    createdAt: new Date().toISOString(),
    verified: false,
    role: 'Freight Manager',
    company: 'CargoMind',
  };
  await dbPut('users', user);
  return user;
}

export async function getUserByEmail(email) {
  return dbGetByIndex('users', 'email', email.toLowerCase().trim());
}

export async function markUserVerified(userId) {
  const user = await dbGet('users', userId);
  if (!user) throw new Error('USER_NOT_FOUND');
  await dbPut('users', { ...user, verified: true });
}

export async function verifyPassword(email, password) {
  const user = await getUserByEmail(email);
  if (!user) return null;
  const hash = await hashPassword(password);
  if (hash !== user.passwordHash) return null;
  return user;
}

// ── OTP OPS ─────────────────────────────────────────────────────────────────
export async function storeOtp(identifier) {
  const otp = generateOtp();
  await dbPut('otpStore', {
    key: identifier,
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000,
    attempts: 0,
  });
  return otp;
}

export async function verifyOtpCode(identifier, entered) {
  const rec = await dbGet('otpStore', identifier);
  if (!rec) return { valid: false, reason: 'OTP_NOT_FOUND' };
  if (Date.now() > rec.expiresAt) { await dbDelete('otpStore', identifier); return { valid: false, reason: 'OTP_EXPIRED' }; }
  if (rec.attempts >= 5) return { valid: false, reason: 'TOO_MANY_ATTEMPTS' };
  await dbPut('otpStore', { ...rec, attempts: rec.attempts + 1 });
  if (entered.trim() !== rec.otp) return { valid: false, reason: 'WRONG_OTP' };
  await dbDelete('otpStore', identifier);
  return { valid: true };
}

// ── SESSION OPS ─────────────────────────────────────────────────────────────
export async function createSession(userId) {
  const token = generateToken();
  await dbPut('sessions', { token, userId, createdAt: new Date().toISOString(), expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 });
  localStorage.setItem('cargomind_session', token);
  return token;
}

export async function getSessionUser() {
  const token = localStorage.getItem('cargomind_session');
  if (!token) return null;
  const session = await dbGet('sessions', token);
  if (!session || Date.now() > session.expiresAt) { await destroySession(); return null; }
  return dbGet('users', session.userId);
}

export async function destroySession() {
  const token = localStorage.getItem('cargomind_session');
  if (token) await dbDelete('sessions', token).catch(() => {});
  localStorage.removeItem('cargomind_session');
}
