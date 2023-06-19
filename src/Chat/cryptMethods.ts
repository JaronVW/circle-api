import { publicDecrypt, verify } from 'crypto';
import { SHA256 } from 'crypto-js';

export function verifySignatureChatRequest(
  messageContent: {
    streamerID: string;
    userID: number;
  },
  signature: string,
  key: string,
) {
  return verify(
    'sha256',
    Buffer.from(JSON.stringify(messageContent)),
    '-----BEGIN PUBLIC KEY-----\n' + key + '\n-----END PUBLIC KEY-----',
    Buffer.from(signature, 'base64'),
  );
}
