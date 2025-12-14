import { randomBytes, scrypt as scryptCallback, timingSafeEqual, type ScryptOptions } from "node:crypto";

const BCRYPT_BASE64_ALPHABET = "./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const SALT_LENGTH = 16;
const HASH_LENGTH = 24;
export const HASH_ROUNDS = 10;

const scryptAsync = (password: string, salt: Buffer, keylen: number, options: ScryptOptions) =>
  new Promise<Buffer>((resolve, reject) => {
    scryptCallback(password, salt, keylen, options, (error, derivedKey) => {
      if (error) {
        reject(error);
      } else {
        resolve(derivedKey as Buffer);
      }
    });
  });

const encodeBcryptBase64 = (input: Buffer, length: number) => {
  let off = 0;
  let rs = "";

  while (off < length) {
    const c1 = input[off++] & 0xff;
    rs += BCRYPT_BASE64_ALPHABET[(c1 >> 2) & 0x3f];

    const c2 = off >= length ? 0 : input[off] & 0xff;
    rs += BCRYPT_BASE64_ALPHABET[((c1 & 0x03) << 4) | ((c2 >> 4) & 0x0f)];
    if (off++ >= length) break;

    const c3 = off >= length ? 0 : input[off] & 0xff;
    rs += BCRYPT_BASE64_ALPHABET[((c2 & 0x0f) << 2) | ((c3 >> 6) & 0x03)];
    if (off++ >= length) break;

    rs += BCRYPT_BASE64_ALPHABET[c3 & 0x3f];
  }

  return rs;
};

const decodeBcryptBase64 = (input: string, length: number) => {
  let off = 0;
  let olen = 0;
  const output = Buffer.alloc(length);

  while (off < input.length - 1 && olen < length) {
    const c1 = BCRYPT_BASE64_ALPHABET.indexOf(input[off++]);
    const c2 = BCRYPT_BASE64_ALPHABET.indexOf(input[off++]);
    if (c1 === -1 || c2 === -1) break;

    output[olen++] = (c1 << 2) | ((c2 & 0x30) >> 4);
    if (olen >= length || off >= input.length) break;

    const c3 = BCRYPT_BASE64_ALPHABET.indexOf(input[off++]);
    if (c3 === -1) break;

    output[olen++] = ((c2 & 0x0f) << 4) | ((c3 & 0x3c) >> 2);
    if (olen >= length || off >= input.length) break;

    const c4 = BCRYPT_BASE64_ALPHABET.indexOf(input[off++]);
    output[olen++] = ((c3 & 0x03) << 6) | c4;
  }

  return output.slice(0, olen);
};

const deriveKey = async (password: string, salt: Buffer, rounds: number) => {
  const cost = Math.max(1, Math.min(rounds, 31));
  const N = 1 << cost;
  return scryptAsync(password, salt, HASH_LENGTH, { N, r: 8, p: 1 });
};

export const hashPassword = async (password: string) => {
  const salt = randomBytes(SALT_LENGTH);
  const saltEncoded = encodeBcryptBase64(salt, salt.length);
  const derived = await deriveKey(password, salt, HASH_ROUNDS);
  const hashEncoded = encodeBcryptBase64(derived, derived.length).slice(0, 31);
  return `$2b$${HASH_ROUNDS.toString().padStart(2, "0")}$${saltEncoded}${hashEncoded}`;
};

export const verifyPasswordHash = async (password: string, stored: string) => {
  const match = stored.match(/^\$2[aby]\$(\d{2})\$([^$]{22})([^$]{31})$/);
  if (!match) return false;

  const [, roundsText, saltPart, hashPart] = match;
  const rounds = Number(roundsText);
  const salt = decodeBcryptBase64(saltPart, SALT_LENGTH);
  const derived = await deriveKey(password, salt, rounds);
  const hashEncoded = encodeBcryptBase64(derived, derived.length).slice(0, 31);

  return timingSafeEqual(Buffer.from(hashEncoded), Buffer.from(hashPart));
};
