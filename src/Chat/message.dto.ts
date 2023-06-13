import { IsOptional } from 'class-validator';

export class MessageDto {
  message: string;
  fullName: string;

  datetime = new Date();
}
