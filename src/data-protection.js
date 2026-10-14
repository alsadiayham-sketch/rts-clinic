const fs = require('fs/promises');
const path = require('path');
const { randomBytes } = require('crypto');

const KEY_BYTES = 32;

class OsBoundKeyProtector {
  constructor(userDataPath, safeStorage) {
    this.safeStorage = safeStorage;
    this.keyPath = path.join(userDataPath, 'clinic-data-key.bin');
    this.keyPromise = null;
  }

  assertAvailable() {
    if (!this.safeStorage?.isEncryptionAvailable()) {
      throw new Error('Secure operating-system storage is unavailable. Clinic data cannot be opened safely.');
    }
  }

  decodeWrappedKey(wrappedKey) {
    this.assertAvailable();
    let encoded;
    try {
      encoded = this.safeStorage.decryptString(Buffer.from(wrappedKey));
    } catch {
      throw new Error('The clinic encryption key cannot be unlocked for this Windows user.');
    }
    const key = Buffer.from(encoded, 'base64');
    if (key.length !== KEY_BYTES) throw new Error('The clinic encryption key is invalid.');
    return key;
  }

  async loadOrCreateKey() {
    this.assertAvailable();
    try {
      return this.decodeWrappedKey(await fs.readFile(this.keyPath));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }

    const key = randomBytes(KEY_BYTES);
    const wrappedKey = this.safeStorage.encryptString(key.toString('base64'));
    await fs.mkdir(path.dirname(this.keyPath), { recursive: true });
    try {
      await fs.writeFile(this.keyPath, wrappedKey, { flag: 'wx', mode: 0o600 });
      return key;
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      return this.decodeWrappedKey(await fs.readFile(this.keyPath));
    }
  }

  getKey() {
    if (!this.keyPromise) {
      this.keyPromise = this.loadOrCreateKey().catch((error) => {
        this.keyPromise = null;
        throw error;
      });
    }
    return this.keyPromise;
  }

  async exportWrappedKey() {
    await this.getKey();
    return fs.readFile(this.keyPath);
  }

  async unwrapKey(wrappedKey) {
    return this.decodeWrappedKey(wrappedKey);
  }
}

module.exports = { OsBoundKeyProtector };
