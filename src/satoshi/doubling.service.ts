import { Injectable } from '@nestjs/common';

@Injectable()
export class DoublingService {
  doubleNumberNTimes(number: number, times: number): number {
    let result = number;
    for (let i = 0; i < times; i++) {
      result *= 2;
    }
    return result;
  }
}