import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class NpmserverService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
  ) {}

  async fetchData(): Promise<any> {
    const response = await axios.get('http://127.0.0.1:9997/v2/paths/list');
    return response.data;
  }

  // async getUsers(): Promise<any> {}

  // async login(user: any) {
  //     const payload = { username: user.username, sub: user.userId };
  //     return {
  //       access_token: this.jwtService.sign(payload),
  //     };
  //   }
}
