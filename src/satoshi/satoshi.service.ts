import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SatoshiService {
  constructor(
    private service: PrismaService
  ) {}

  async createAddMoney(data: any): Promise<any> {
    return this.service.satoshi.create({ data });
  }
  
  async getAmountMoney(): Promise<any> {
    const response = await axios.get('http://localhost:3000/satoshi/:id');
    return response.data;
  }

  async getSatoshiIdByStreamId(): Promise<any> {
    const response = await axios.get('http://localhost:3000/satoshi/stream/:streamid');
    return response.data;
  }
}
