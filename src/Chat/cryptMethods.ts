import { verify } from 'crypto';

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
    key,
    Buffer.from(signature, 'base64'),
  );
}

export function verifySignatureChatMessage(
  messageContent: {
    message: string;
    fullName: string;
    datetime: Date;
  },
  signature: string,
  key: string,
) {
  return verify(
    'sha256',
    Buffer.from(JSON.stringify(messageContent)),
    key,
    Buffer.from(signature, 'base64'),
  );
}
