import { Controller, Get, Post, Body } from '@nestjs/common';
import { NpmserverService } from './npmserver.service';

@Controller('npmserver')
export class NpmserverController {
  constructor(private readonly npmserverService: NpmserverService) {}

  @Get('live/streams')
  async getEndpoint(): Promise<any> {
    try {
      const data = await this.npmserverService.fetchData();
    } catch (error) {
      console.error('Error fetching data: ', error);
      return { errpr: 'Failed to fetch data' }
    }
  }
}
