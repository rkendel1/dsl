/**
 * @file crypto shim for React Native
 * @description Provides a crypto module that uses react-native-get-random-values
 * 
 * This shim avoids the problematic react-native-randombytes dependency
 * that requires native modules. Instead, it uses react-native-get-random-values
 * which works with Expo's crypto implementation.
 */

// Ensure react-native-get-random-values polyfill is loaded
import 'react-native-get-random-values';

// Use crypto-browserify modules but with our polyfilled crypto.getRandomValues
const createHash = require('create-hash');
const createHmac = require('create-hmac');
const pbkdf2 = require('pbkdf2');
const browserifyAes = require('browserify-cipher');
const diffieHellman = require('diffie-hellman');
const browserifySign = require('browserify-sign');
const createEcdh = require('create-ecdh');
const publicEncrypt = require('public-encrypt');

// Use the global crypto.getRandomValues that was set up by react-native-get-random-values
function randomBytes(size) {
  const arr = new Uint8Array(size);
  if (typeof global.crypto !== 'undefined' && typeof global.crypto.getRandomValues === 'function') {
    global.crypto.getRandomValues(arr);
  } else {
    throw new Error('crypto.getRandomValues is not available');
  }
  return Buffer.from(arr);
}

function randomFill(buffer, offset, size, callback) {
  if (typeof offset === 'function') {
    callback = offset;
    offset = 0;
    size = buffer.length;
  } else if (typeof size === 'function') {
    callback = size;
    size = buffer.length - offset;
  }
  
  try {
    const bytes = randomBytes(size);
    bytes.copy(buffer, offset);
    if (callback) {
      process.nextTick(() => callback(null, buffer));
    }
    return buffer;
  } catch (err) {
    if (callback) {
      process.nextTick(() => callback(err));
      return;
    }
    throw err;
  }
}

function randomFillSync(buffer, offset = 0, size) {
  if (size === undefined) {
    size = buffer.length - offset;
  }
  const bytes = randomBytes(size);
  bytes.copy(buffer, offset);
  return buffer;
}

// Export crypto API
module.exports = {
  // Random functions
  randomBytes,
  rng: randomBytes,
  pseudoRandomBytes: randomBytes,
  prng: randomBytes,
  randomFill,
  randomFillSync,
  
  // Hash functions
  createHash,
  Hash: createHash,
  
  // HMAC
  createHmac,
  Hmac: createHmac,
  
  // Hash list
  getHashes: () => ['sha1', 'sha224', 'sha256', 'sha384', 'sha512', 'md5', 'rmd160'],
  
  // PBKDF2
  pbkdf2: pbkdf2.pbkdf2,
  pbkdf2Sync: pbkdf2.pbkdf2Sync,
  
  // Ciphers
  Cipher: browserifyAes.Cipher,
  createCipher: browserifyAes.createCipher,
  Cipheriv: browserifyAes.Cipheriv,
  createCipheriv: browserifyAes.createCipheriv,
  Decipher: browserifyAes.Decipher,
  createDecipher: browserifyAes.createDecipher,
  Decipheriv: browserifyAes.Decipheriv,
  createDecipheriv: browserifyAes.createDecipheriv,
  getCiphers: browserifyAes.getCiphers,
  listCiphers: browserifyAes.listCiphers,
  
  // Diffie-Hellman
  DiffieHellmanGroup: diffieHellman.DiffieHellmanGroup,
  createDiffieHellmanGroup: diffieHellman.createDiffieHellmanGroup,
  getDiffieHellman: diffieHellman.getDiffieHellman,
  createDiffieHellman: diffieHellman.createDiffieHellman,
  DiffieHellman: diffieHellman.DiffieHellman,
  
  // Signing
  createSign: browserifySign.createSign,
  Sign: browserifySign.Sign,
  createVerify: browserifySign.createVerify,
  Verify: browserifySign.Verify,
  
  // ECDH
  createECDH: createEcdh,
  
  // Public encryption
  publicEncrypt: publicEncrypt.publicEncrypt,
  privateEncrypt: publicEncrypt.privateEncrypt,
  publicDecrypt: publicEncrypt.publicDecrypt,
  privateDecrypt: publicEncrypt.privateDecrypt,
};
