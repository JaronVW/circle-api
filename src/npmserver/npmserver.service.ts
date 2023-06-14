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

<<<<<<< HEAD
    async fetchData(): Promise<Response[]> {
        const response = await axios.get('http://127.0.0.1:9997/v2/paths/list');
        return response.data;
    }
=======
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
    return response.data;
  }
>>>>>>> 1a9a0d6a166ac2b639fe5a4a29579c077e181c70
}
