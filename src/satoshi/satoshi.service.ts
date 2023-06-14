import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SatoshiService {
    constructor(private service: PrismaService, private readonly httpService: HttpService) {}

    async createAddMoney(data: any): Promise<any> {
        return this.service.satoshi.create({ data });
    }

    async getAmountMoney(): Promise<Response[]> {
        const response = await axios.get('http://localhost:3000/satoshi/amount');
        return response.data;
    }
}
