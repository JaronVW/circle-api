import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { NpmserverService } from './npmserver.service';
import { PrismaService } from 'src/prisma.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('npmserver')
export class NpmserverController {
  constructor(
    private readonly npmserverService: NpmserverService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get('live/streams')
  @UseGuards(JwtAuthGuard)
  async getEndpoint(): Promise<any> {
    try {
      const data = await this.npmserverService.fetchData();
      const res = await this.npmserverService.getStreamersDataFeed(
        data.items.map((item) => item.name),
      );
      return await this.npmserverService.getStreamersDataFeed(
        data.items.map((item) => item.name),
      );
    } catch (error) {
      console.error('Error fetching data: ', error);
      return { error: 'Failed to fetch data' };
    }
  }

  @Get('/user/:streamid')
  @UseGuards(JwtAuthGuard)
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
      where: { StreamerID: streamerID }
    });
    return resource;
  }
}
