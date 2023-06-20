import { Controller, Get, Param } from '@nestjs/common';
import { NpmserverService } from './npmserver.service';
import { PrismaService } from 'src/prisma.service';

@Controller('npmserver')
export class NpmserverController {
  constructor(
    private readonly npmserverService: NpmserverService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get('live/streams')
  async getEndpoint(): Promise<any> {
    try {
      const data = await this.npmserverService.fetchData();
      return await this.npmserverService.getStreamersDataFeed(
        data.items.map((item) => item.name),
      );
      // return data;
    } catch (error) {
      console.error('Error fetching data: ', error);
      return { error: 'Failed to fetch data' };
    }
  }

  @Get('/user/:streamid')
  async getUserByStreamID(@Param('streamid') streamerID: string): Promise<any> {
    const resource = await this.prismaService.user.findFirst({
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
          StreamerID: streamerID,
        },
      },
    });
    return resource;
  }
}
