import { privateEncrypt, publicDecrypt } from 'crypto';
import * as sha256 from 'crypto-js/sha256';

export function encryptMessage(message: string, privateKey: string) {
  return privateEncrypt(privateKey, Buffer.from(message)).toString('base64');
}

export function decryptMessage(encryptedData: string, publicKey: string) {
  return publicDecrypt(
    publicKey,
    Buffer.from(encryptedData, 'base64'),
  ).toString();
}

export function shaHash(data: string) {
  return sha256(data).toString();
}
