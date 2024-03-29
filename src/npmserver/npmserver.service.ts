import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class NpmserverService {
  constructor(private readonly prismaService: PrismaService) {}

  async getStreamersDataFeed(live: string[]): Promise<any> {
    return await this.prismaService.user.findMany({
      select: {
        Stream: {
          select: {
            StreamerID: true,
          },
        },
        FirstName: true,
        LastName: true,
        Infix: true,
      },
      where: {
        Stream: {
          StreamerID: {
            in: live,
          },
        },
      },
    });
  }

  async fetchData(): Promise<any> {
    const response = await axios.get('http://127.0.0.1:9997/v2/paths/list');
    console.log(response.data);
    return response.data;
  }

  async getUserByStreamId(): Promise<any> {
    const response = await axios.get('http://localhost:3000/user/:streamid');
    return response.data;
  }
}
