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
  const message = MD5(JSON.stringify(messageContent));
  console.log(message);
  return AES.encrypt(message, key).toString();
}
