import { privateEncrypt, publicDecrypt } from 'crypto';
import { AES, SHA256 } from 'crypto-js';
import { MD5 } from 'crypto-js';

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
  return SHA256(data).toString();
}

export function generateSymmetricSignature(
  messageContent: {
    message: string;
    fullName: string;
    datetime: Date;
  },
  key: string,
) {
  return AES.encrypt(MD5(JSON.stringify(messageContent)), key).toString();
}

export function verifySignature(
  messageContent: {
    message: string;
    fullName: string;
  },
  signature: string,
  key: string,
) {
  return (
    AES.encrypt(signature, key).toString() ==
    MD5(JSON.stringify(messageContent)).toString()
  );
}
